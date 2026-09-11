import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getHepeServerSupabase } from "../../../../lib/hepe/server-supabase";
import { getRuntimeCredentials } from "../../../../lib/hepe/runtime-binding";

export const dynamic = "force-dynamic";

const EXPECTED_PUBLISHABLE_SHA256 = "73ed5710f2f15a1c76dedcd35be270effc1f9c30d867922bc0912b1693b17a63";

export async function GET(request: NextRequest) {
  if (request.headers.get("x-hepe-rel03-diagnostic") !== "1") {
    return NextResponse.json({ ok: false, code: "DIAGNOSTIC_NOT_REQUESTED" }, { status: 404 });
  }

  const names = request.cookies.getAll().map(({ name }) => name);
  const runtime = getRuntimeCredentials();
  const binding = await getHepeServerSupabase();
  if (!binding.ok || !runtime) {
    return NextResponse.json({
      ok: false,
      code: "RUNTIME_NOT_CONFIGURED",
      cookieCount: names.length,
      cookieNames: names,
      secretDisclosure: false,
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const keyFingerprintMatch = createHash("sha256").update(runtime.publishableKey).digest("hex") === EXPECTED_PUBLISHABLE_SHA256;
  const { data: sessionData, error: sessionError } = await binding.supabase.auth.getSession();
  const { data: userData, error: userError } = await binding.supabase.auth.getUser();
  return NextResponse.json({
    ok: Boolean(userData.user && !userError),
    code: userData.user && !userError ? "AUTHENTICATED" : "AUTH_REQUIRED",
    cookieCount: names.length,
    cookieNames: names,
    sessionPresent: Boolean(sessionData.session),
    sessionUserPresent: Boolean(sessionData.session?.user),
    sessionErrorPresent: Boolean(sessionError),
    authErrorPresent: Boolean(userError),
    authErrorCode: userError && "code" in userError ? String(userError.code) : userError ? "AUTH_ERROR" : null,
    userPresent: Boolean(userData.user),
    keyFingerprintMatch,
    secretDisclosure: false,
  }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
