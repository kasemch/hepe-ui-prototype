import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const USERNAME_RE = /^[a-z][a-z0-9._-]{3,31}$/;
const WINDOW_MINUTES = 15;
const USER_FAILURE_LIMIT = 5;
const IP_FAILURE_LIMIT = 20;
const ALLOWED_ORIGINS = new Set([
  "https://kasemch.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function readKey(jsonName: string, legacyName: string) {
  const raw = Deno.env.get(jsonName);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.default) return parsed.default as string;
      const first = Object.values(parsed ?? {})[0];
      if (typeof first === "string") return first;
    } catch {}
  }
  return Deno.env.get(legacyName) ?? "";
}

function cors(origin: string | null) {
  const allowed = !origin || ALLOWED_ORIGINS.has(origin);
  return {
    allowed,
    headers: {
      "Access-Control-Allow-Origin": origin && allowed ? origin : "https://kasemch.github.io",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
      "Content-Type": "application/json",
    },
  };
}

async function fingerprintIp(ip: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const c = cors(origin);
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: c.allowed ? 200 : 403, headers: c.headers });
  }
  if (!c.allowed) {
    return new Response(JSON.stringify({ ok: false, message: "Origin not allowed" }), {
      status: 403, headers: c.headers,
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false }), { status: 405, headers: c.headers });
  }

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = readKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
  const publishableKey = readKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  if (!url || !serviceKey || !publishableKey) {
    return new Response(JSON.stringify({ ok: false, message: "Login runtime unavailable" }), {
      status: 503, headers: c.headers,
    });
  }

  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  const username = String(body?.username ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const safeUsername = USERNAME_RE.test(username) ? username : "invalid.user";

  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("cf-connecting-ip") || "unknown";
  const ipFingerprint = await fingerprintIp(ip, serviceKey);

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const [uCount, ipCount] = await Promise.all([
    admin.from("hepe_login_attempts")
      .select("attempt_id", { count: "exact", head: true })
      .eq("username", safeUsername)
      .eq("outcome_code", "INVALID")
      .gte("attempted_at", since),
    admin.from("hepe_login_attempts")
      .select("attempt_id", { count: "exact", head: true })
      .eq("ip_fingerprint", ipFingerprint)
      .eq("outcome_code", "INVALID")
      .gte("attempted_at", since),
  ]);

  if (uCount.error || ipCount.error) {
    return new Response(JSON.stringify({ ok: false, message: "Login runtime unavailable" }), {
      status: 503, headers: c.headers,
    });
  }

  if ((uCount.count ?? 0) >= USER_FAILURE_LIMIT || (ipCount.count ?? 0) >= IP_FAILURE_LIMIT) {
    await admin.from("hepe_login_attempts").insert({
      username: safeUsername, ip_fingerprint: ipFingerprint, outcome_code: "RATE_LIMITED",
    });
    return new Response(JSON.stringify({
      ok: false, message: "มีการลองเข้าสู่ระบบหลายครั้ง กรุณาลองใหม่ภายหลัง",
    }), { status: 429, headers: c.headers });
  }

  async function invalid() {
    await admin.from("hepe_login_attempts").insert({
      username: safeUsername, ip_fingerprint: ipFingerprint, outcome_code: "INVALID",
    });
    return new Response(JSON.stringify({
      ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
    }), { status: 401, headers: c.headers });
  }

  if (!USERNAME_RE.test(username) || !password) return await invalid();

  const { data: account, error: accountError } = await admin
    .from("hepe_login_accounts")
    .select("user_id,account_status")
    .eq("username", username)
    .maybeSingle();

  if (accountError || !account || !["SETUP_REQUIRED", "ACTIVE"].includes(account.account_status)) {
    return await invalid();
  }

  const { data: userResult, error: userError } = await admin.auth.admin.getUserById(account.user_id);
  const email = userResult?.user?.email;
  if (userError || !email || !userResult.user.email_confirmed_at) return await invalid();

  const publicClient = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signIn, error: signInError } = await publicClient.auth.signInWithPassword({
    email, password,
  });
  if (signInError || !signIn.session) return await invalid();

  await admin.from("hepe_login_attempts").insert({
    username, ip_fingerprint: ipFingerprint, outcome_code: "SUCCESS",
  });

  return new Response(JSON.stringify({
    ok: true,
    next: account.account_status === "SETUP_REQUIRED" ? "/account/setup" : "/department-dashboard",
    session: {
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
      expires_in: signIn.session.expires_in,
    },
  }), { status: 200, headers: c.headers });
});
