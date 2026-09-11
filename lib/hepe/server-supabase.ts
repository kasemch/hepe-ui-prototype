import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getRuntimeCredentials } from './runtime-binding';

export type HepeServerBinding =
  | { ok: true; supabase: ReturnType<typeof createServerClient> }
  | { ok: false; reason: 'RUNTIME_NOT_CONFIGURED' };

export async function getHepeServerSupabase(): Promise<HepeServerBinding> {
  const runtime = getRuntimeCredentials();
  if (!runtime) return { ok: false, reason: 'RUNTIME_NOT_CONFIGURED' };

  const cookieStore = await cookies();
  const supabase = createServerClient(runtime.url, runtime.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Server Components are read-only for auth cookies. Session refresh is handled
        // by the controlled auth callback/runtime flow; REL-03 does not mutate auth.
      },
    },
  });

  return { ok: true, supabase };
}
