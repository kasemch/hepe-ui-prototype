import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    const target = new URL("/auth/callback/status", requestUrl.origin);
    target.searchParams.set("status", "error");
    target.searchParams.set("reason", error);
    if (errorDescription) target.searchParams.set("detail", errorDescription);
    return NextResponse.redirect(target);
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, code: "HEPE_AUTH_CALLBACK_CODE_MISSING" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, code: "HEPE_AUTH_CALLBACK_RUNTIME_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const response = NextResponse.redirect(new URL("/auth/callback/status?status=verified", requestUrl.origin));

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
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
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const target = new URL("/auth/callback/status", requestUrl.origin);
    target.searchParams.set("status", "hold");
    target.searchParams.set("reason", "SESSION_EXCHANGE_FAILED");
    return NextResponse.redirect(target);
  }

  return response;
}
