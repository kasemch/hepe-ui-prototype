import { createHash, randomBytes } from "node:crypto";

function base64Url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createSyntheticPkceFixture() {
  // Synthetic local-only fixture: no user, no email, no Supabase Auth request.
  const verifier = base64Url(randomBytes(48));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  const recomputed = base64Url(createHash("sha256").update(verifier).digest());

  const verifierValid = verifier.length >= 43 && verifier.length <= 128 && /^[A-Za-z0-9._~-]+$/.test(verifier);
  const challengeValid = challenge.length === 43 && /^[A-Za-z0-9_-]+$/.test(challenge);

  return {
    method: "S256" as const,
    verifierLength: verifier.length,
    challengeLength: challenge.length,
    verifierValid,
    challengeValid,
    deterministicMatch: challenge === recomputed,
    pass: verifierValid && challengeValid && challenge === recomputed,
  };
}
