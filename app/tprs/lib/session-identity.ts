import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export type TprsSessionIdentity = {
  authSubject: string;
};

/**
 * Resolves the authenticated Supabase user on the server without exposing
 * access tokens to TPRS application code. Returns null when auth runtime is
 * not configured or when no authenticated user exists.
 */
export async function readTprsSessionIdentity(): Promise<TprsSessionIdentity | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Session refresh writes are handled by the auth boundary/middleware.
        // This reader intentionally has no mutation authority.
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) return null;
  return { authSubject: data.user.id };
}
