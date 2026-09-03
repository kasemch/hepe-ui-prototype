import { NextResponse } from "next/server";
import { HEPE_RUNTIME_PROJECT_REF, verifyRuntimeBinding } from "../../../../lib/hepe/runtime-binding";

export const dynamic = "force-dynamic";

export async function GET() {
  const check = verifyRuntimeBinding();

  return NextResponse.json(
    {
      ok: check.configured,
      code: check.configured
        ? "HEPE_RUNTIME_BINDING_VERIFIED"
        : "HEPE_RUNTIME_BINDING_NOT_CONFIGURED",
      environment: "NON-PRODUCTION",
      expectedProjectRef: HEPE_RUNTIME_PROJECT_REF,
      checks: check,
      secretDisclosure: false,
      authorityGrant: false,
    },
    {
      status: check.configured ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
