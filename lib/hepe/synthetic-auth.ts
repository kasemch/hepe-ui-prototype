import type { Provider } from "@supabase/supabase-js";

const ENABLED_VALUE = "true";
const ALLOWED_PROVIDERS = new Set<Provider>(["github", "google"]);

export const HEPE_SYNTHETIC_MARKER_KEY = "hepe_synthetic_test";
export const HEPE_SYNTHETIC_GATE = "HEPE-IAM-08B.2";
export const HEPE_SYNTHETIC_COOKIE = "hepe_iam_08b2_synthetic";

export function getSyntheticAuthConfig():
  | { enabled: true; provider: Provider }
  | { enabled: false; reason: "DISABLED" | "PROVIDER_NOT_CONFIGURED" } {
  if (process.env.HEPE_IAM_08B2_SYNTHETIC_AUTH_ENABLED !== ENABLED_VALUE) {
    return { enabled: false, reason: "DISABLED" };
  }

  const rawProvider = process.env.HEPE_IAM_08B2_SYNTHETIC_PROVIDER?.trim().toLowerCase();
  if (!rawProvider || !ALLOWED_PROVIDERS.has(rawProvider as Provider)) {
    return { enabled: false, reason: "PROVIDER_NOT_CONFIGURED" };
  }

  return { enabled: true, provider: rawProvider as Provider };
}

export function isSyntheticMarkedUser(userMetadata: Record<string, unknown> | null | undefined): boolean {
  return Boolean(
    userMetadata?.[HEPE_SYNTHETIC_MARKER_KEY] === true &&
      userMetadata?.hepe_gate === HEPE_SYNTHETIC_GATE
  );
}
