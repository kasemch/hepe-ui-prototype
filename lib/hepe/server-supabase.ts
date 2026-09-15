import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getRuntimeCredentials } from './runtime-binding';

export async function createHepeServerClient() {
  const runtime = getRuntimeCredentials();
  if (!runtime) return null;
  const cookieStore = await cookies();
  return createServerClient(runtime.url, runtime.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components may be unable to set cookies. Middleware/callback owns refresh writes.
        }
      },
    },
  });
}
