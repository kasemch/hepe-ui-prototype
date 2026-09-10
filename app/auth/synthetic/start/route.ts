import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getRuntimeCredentials } from "../../../../lib/hepe/runtime-binding";
import {
  getSyntheticAuthConfig,
  HEPE_SYNTHETIC_COOKIE,
} from "../../../../lib/hepe/synthetic-auth";

export const dynamic = "force-dynamic";

type PendingCookie = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function GET(request: NextRequest) {
  const runtime = getRuntimeCredentials();
  if (!runtime) {
    return NextResponse.json(
      { ok: false, code: "HEPE_SYNTHETIC_AUTH_RUNTIME_NOT_CONFIGURED" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const config = getSyntheticAuthConfig();
  if (!config.enabled) {
    return NextResponse.json(
      { ok: false, code: `HEPE_SYNTHETIC_AUTH_${config.reason}` },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  const pendingCookies: PendingCookie[] = [];
  const supabase = createServerClient(runtime.url, runtime.publishableKey, {
    auth: { flowType: "pkce" },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies.push(...cookiesToSet);
      },
    },
  });

  const callback = new URL("/auth/callback", request.nextUrl.origin);
  callback.searchParams.set("hepe_synthetic", "1");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: config.provider,
    options: {
      redirectTo: callback.toString(),
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { ok: false, code: "HEPE_SYNTHETIC_AUTH_START_FAILED" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  const response = NextResponse.redirect(data.url);
  response.headers.set("Cache-Control", "private, no-store");
  for (const cookie of pendingCookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
  response.cookies.set(HEPE_SYNTHETIC_COOKIE, "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}
