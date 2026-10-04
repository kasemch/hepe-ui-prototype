import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const USERNAME_RE = /^[a-z][a-z0-9._-]{3,31}$/;

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publishable || !secret) return null;
  return { url, publishable, secret };
}

export async function POST(request: NextRequest) {
  const cfg = config();
  if (!cfg) {
    return NextResponse.json(
      { ok: false, message: "ระบบตั้งค่าบัญชียังไม่พร้อมใช้งาน" },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "ข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const username = String(body?.username ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { ok: false, message: "Username ต้องมี 4–32 ตัว เริ่มด้วย a-z และใช้ได้เฉพาะ a-z, 0-9, จุด, ขีดกลาง และขีดล่าง" },
      { status: 400 }
    );
  }
  if (password.length < 12) {
    return NextResponse.json(
      { ok: false, message: "Password ต้องมีอย่างน้อย 12 ตัวอักษร" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ ok: true });
  const auth = createServerClient(cfg.url, cfg.publishable, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: authData, error: authError } = await auth.auth.getUser();
  const user = authData?.user;
  if (authError || !user) {
    return NextResponse.json(
      { ok: false, message: "กรุณาเข้าสู่ระบบอีกครั้ง" },
      { status: 401 }
    );
  }

  const admin = createClient(cfg.url, cfg.secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: account, error: accountError } = await admin
    .from("hepe_login_accounts")
    .select("user_id,academic_person_id,account_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (accountError || !account || account.account_status !== "SETUP_REQUIRED") {
    return NextResponse.json(
      { ok: false, message: "บัญชีนี้ไม่อยู่ในขั้นตอนตั้งค่าครั้งแรก" },
      { status: 403 }
    );
  }

  const { data: actor } = await admin
    .from("actors")
    .select("actor_id")
    .eq("external_identity_subject", user.id)
    .maybeSingle();

  if (!actor?.actor_id) {
    return NextResponse.json(
      { ok: false, message: "ยังไม่พบการผูกตัวตนที่ยืนยันแล้ว" },
      { status: 403 }
    );
  }

  const { data: binding } = await admin
    .from("academic_person_actor_bindings")
    .select("academic_person_id,binding_status")
    .eq("actor_id", actor.actor_id)
    .eq("academic_person_id", account.academic_person_id)
    .eq("binding_status", "VERIFIED")
    .maybeSingle();

  if (!binding) {
    return NextResponse.json(
      { ok: false, message: "ยังไม่พบการผูกตัวตนที่ยืนยันแล้ว" },
      { status: 403 }
    );
  }

  const { data: conflict } = await admin
    .from("hepe_login_accounts")
    .select("user_id")
    .eq("username", username)
    .neq("user_id", user.id)
    .maybeSingle();

  if (conflict) {
    return NextResponse.json(
      { ok: false, message: "Username นี้ถูกใช้งานแล้ว" },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const { error: reserveError } = await admin
    .from("hepe_login_accounts")
    .update({ username, updated_at: now })
    .eq("user_id", user.id)
    .eq("account_status", "SETUP_REQUIRED");

  if (reserveError) {
    return NextResponse.json(
      { ok: false, message: "ไม่สามารถจอง Username ได้" },
      { status: reserveError.code === "23505" ? 409 : 500 }
    );
  }

  const { error: passwordError } = await admin.auth.admin.updateUserById(
    user.id,
    { password }
  );

  if (passwordError) {
    return NextResponse.json(
      { ok: false, message: "ไม่สามารถเปลี่ยน Password ได้ กรุณาลองอีกครั้ง" },
      { status: 400 }
    );
  }

  const { error: finishError } = await admin
    .from("hepe_login_accounts")
    .update({
      account_status: "ACTIVE",
      setup_completed_at: now,
      updated_at: now,
    })
    .eq("user_id", user.id)
    .eq("account_status", "SETUP_REQUIRED");

  if (finishError) {
    return NextResponse.json(
      { ok: false, message: "เปลี่ยน Password แล้ว แต่ยังปิดขั้นตอนตั้งค่าบัญชีไม่ได้ กรุณาเข้าสู่ระบบและลองอีกครั้ง" },
      { status: 500 }
    );
  }

  return response;
}
