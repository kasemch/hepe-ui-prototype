import { NextResponse } from "next/server";

// HEPE-WORKFLOW-04 exact-SHA Preview recovery source trigger; no runtime authority effect.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      environment: "NON-PRODUCTION",
      gate: "HEPE-PILOT-03R-03S-03Q",
      applicationSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      production: false,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
