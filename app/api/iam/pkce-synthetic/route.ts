import { NextResponse } from "next/server";
import { createSyntheticPkceFixture } from "../../../../lib/hepe/pkce";

export const dynamic = "force-dynamic";

export async function GET() {
  const fixture = createSyntheticPkceFixture();

  return NextResponse.json(
    {
      ok: fixture.pass,
      code: fixture.pass ? "HEPE_SYNTHETIC_PKCE_SELF_TEST_PASS" : "HEPE_SYNTHETIC_PKCE_SELF_TEST_FAIL",
      environment: "NON-PRODUCTION",
      networkCallPerformed: false,
      realUserUsed: false,
      emailSent: false,
      authorityGrant: false,
      method: fixture.method,
      verifierLength: fixture.verifierLength,
      challengeLength: fixture.challengeLength,
      verifierValid: fixture.verifierValid,
      challengeValid: fixture.challengeValid,
      deterministicMatch: fixture.deterministicMatch,
    },
    {
      status: fixture.pass ? 200 : 500,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
