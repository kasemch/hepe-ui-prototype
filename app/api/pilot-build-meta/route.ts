import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      environment: 'NON-PRODUCTION',
      gate: 'HEPE-USABLE-APP-CLOSURE',
      closureRevision: 'FINAL-SYNCHRONIZED-CLOSURE-2026-09-13',
      applicationSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      production: false,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
