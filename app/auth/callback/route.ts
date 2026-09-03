import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getRuntimeCredentials } from "../../../lib/hepe/runtime-binding";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    const target = new URL("/auth/callback/status", requestUrl.origin);
    target.searchParams.set("status", "error");
    target.searchParams.set("reason", error);
    if (errorDescription) target.searchParams.set("detail", errorDescription.slice(0, 200));
    return NextResponse.redirect(target);
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, code: "HEPE_AUTH_CALLBACK_CODE_MISSING" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const runtime = getRuntimeCredentials();
  if (!runtime) {
    return NextResponse.json(
      { ok: false, code: "HEPE_AUTH_CALLBACK_RUNTIME_NOT_CONFIGURED" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const response = NextResponse.redirect(
    new URL("/auth/callback/status?status=verified", requestUrl.origin)
  );
  response.headers.set("Cache-Control", "no-store");

  const supabase = createServerClient(runtime.url, runtime.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const target = new URL("/auth/callback/status", requestUrl.origin);
    target.searchParams.set("status", "hold");
    target.searchParams.set("reason", "SESSION_EXCHANGE_FAILED");
    return NextResponse.redirect(target);
  }

  return response;
}
