const EXPECTED_PROJECT_REF = "lztxpjsuzqvtgyasfnyj";
const EXPECTED_ORIGIN = `https://${EXPECTED_PROJECT_REF}.supabase.co`;

export type RuntimeBindingCheck = {
  configured: boolean;
  projectRefMatch: boolean;
  urlOriginMatch: boolean;
  keyPresent: boolean;
  keyKind: "publishable" | "legacy-anon-jwt" | "unknown" | "missing";
};

function classifyPublishableKey(value: string | undefined): RuntimeBindingCheck["keyKind"] {
  if (!value) return "missing";
  if (value.startsWith("sb_publishable_")) return "publishable";
  if (value.split(".").length === 3) return "legacy-anon-jwt";
  return "unknown";
}

export function verifyRuntimeBinding(): RuntimeBindingCheck {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let urlOriginMatch = false;
  let projectRefMatch = false;

  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      urlOriginMatch = parsed.origin === EXPECTED_ORIGIN;
      projectRefMatch = parsed.hostname === `${EXPECTED_PROJECT_REF}.supabase.co`;
    } catch {
      urlOriginMatch = false;
      projectRefMatch = false;
    }
  }

  const keyPresent = Boolean(key);
  const keyKind = classifyPublishableKey(key);
  const configured = Boolean(rawUrl && key && urlOriginMatch && projectRefMatch && keyKind !== "unknown");

  return {
    configured,
    projectRefMatch,
    urlOriginMatch,
    keyPresent,
    keyKind,
  };
}

export function getRuntimeCredentials() {
  const check = verifyRuntimeBinding();
  if (!check.configured) return null;

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
  };
}

export const HEPE_RUNTIME_PROJECT_REF = EXPECTED_PROJECT_REF;
