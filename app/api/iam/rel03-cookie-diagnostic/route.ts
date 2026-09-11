import { NextRequest, NextResponse } from "next/server";
import { getHepeServerSupabase } from "../../../../lib/hepe/server-supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (request.headers.get("x-hepe-rel03-diagnostic") !== "1") {
    return NextResponse.json({ ok: false, code: "DIAGNOSTIC_NOT_REQUESTED" }, { status: 404 });
  }

  const names = request.cookies.getAll().map(({ name }) => name);
  const binding = await getHepeServerSupabase();
  if (!binding.ok) {
    return NextResponse.json({
      ok: false,
      code: "RUNTIME_NOT_CONFIGURED",
      cookieCount: names.length,
      cookieNames: names,
      secretDisclosure: false,
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const { data, error } = await binding.supabase.auth.getUser();
  return NextResponse.json({
    ok: Boolean(data.user && !error),
    code: data.user && !error ? "AUTHENTICATED" : "AUTH_REQUIRED",
    cookieCount: names.length,
    cookieNames: names,
    authErrorCode: error && "code" in error ? String(error.code) : error ? "AUTH_ERROR" : null,
    userPresent: Boolean(data.user),
    secretDisclosure: false,
  }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
