import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const USERNAME_RE = /^[a-z][a-z0-9._-]{3,31}$/;
const WINDOW_MINUTES = 15;
const USER_FAILURE_LIMIT = 5;
const IP_FAILURE_LIMIT = 20;

function normalizeUsername(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hmacSecret = process.env.HEPE_LOGIN_IP_HMAC_SECRET;
  if (!url || !publishable || !secret || !hmacSecret) return null;
  return { url, publishable, secret, hmacSecret };
}

export async function POST(request: NextRequest) {
  const cfg = config();
  if (!cfg) {
    return NextResponse.json(
      { ok: false, message: "ระบบเข้าสู่ระบบยังไม่พร้อมใช้งาน" },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const username = normalizeUsername(body?.username);
  const password = String(body?.password ?? "");
  const safeUsername = USERNAME_RE.test(username) ? username : "invalid.user";
  const ipFingerprint = createHmac("sha256", cfg.hmacSecret)
    .update(getClientIp(request))
    .digest("hex");

  const admin = createClient(cfg.url, cfg.secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const since = new Date(
    Date.now() - WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const [userFailures, ipFailures] = await Promise.all([
    admin
      .from("hepe_login_attempts")
      .select("attempt_id", { count: "exact", head: true })
      .eq("username", safeUsername)
      .eq("outcome_code", "INVALID")
      .gte("attempted_at", since),
    admin
      .from("hepe_login_attempts")
      .select("attempt_id", { count: "exact", head: true })
      .eq("ip_fingerprint", ipFingerprint)
      .eq("outcome_code", "INVALID")
      .gte("attempted_at", since),
  ]);

  if (userFailures.error || ipFailures.error) {
    return NextResponse.json(
      { ok: false, message: "ระบบเข้าสู่ระบบยังไม่พร้อมใช้งาน" },
      { status: 503 }
    );
  }

  if (
    (userFailures.count ?? 0) >= USER_FAILURE_LIMIT ||
    (ipFailures.count ?? 0) >= IP_FAILURE_LIMIT
  ) {
    await admin.from("hepe_login_attempts").insert({
      username: safeUsername,
      ip_fingerprint: ipFingerprint,
      outcome_code: "RATE_LIMITED",
    });
    return NextResponse.json(
      { ok: false, message: "มีการลองเข้าสู่ระบบหลายครั้ง กรุณาลองใหม่ภายหลัง" },
      { status: 429 }
    );
  }

  if (!USERNAME_RE.test(username) || password.length === 0) {
    await admin.from("hepe_login_attempts").insert({
      username: safeUsername,
      ip_fingerprint: ipFingerprint,
      outcome_code: "INVALID",
    });
    return NextResponse.json(
      { ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const { data: account, error: accountError } = await admin
    .from("hepe_login_accounts")
    .select("user_id,account_status,setup_completed_at")
    .eq("username", username)
    .maybeSingle();

  if (
    accountError ||
    !account ||
    !["SETUP_REQUIRED", "ACTIVE"].includes(account.account_status)
  ) {
    await admin.from("hepe_login_attempts").insert({
      username,
      ip_fingerprint: ipFingerprint,
      outcome_code: "INVALID",
    });
    return NextResponse.json(
      { ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const { data: userResult, error: userError } =
    await admin.auth.admin.getUserById(account.user_id);

  const email = userResult?.user?.email;
  if (userError || !email || !userResult.user.email_confirmed_at) {
    await admin.from("hepe_login_attempts").insert({
      username,
      ip_fingerprint: ipFingerprint,
      outcome_code: "INVALID",
    });
    return NextResponse.json(
      { ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const next =
    account.account_status === "SETUP_REQUIRED"
      ? "/account/setup"
      : "/department-dashboard";
  const response = NextResponse.json({ ok: true, next });

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

  const { error: signInError } = await auth.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    await admin.from("hepe_login_attempts").insert({
      username,
      ip_fingerprint: ipFingerprint,
      outcome_code: "INVALID",
    });
    return NextResponse.json(
      { ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  await admin.from("hepe_login_attempts").insert({
    username,
    ip_fingerprint: ipFingerprint,
    outcome_code: "SUCCESS",
  });

  return response;
}
