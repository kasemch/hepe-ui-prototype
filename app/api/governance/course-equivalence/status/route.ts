import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PROGRAMME_ID = "69e3361e-b342-43e1-b386-ac73b191b9a4";
const REVIEW_CODE = "HEPE-PEOPLE-01B2H-EQUIVALENCE";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, code: "HEPE_01B2H_RUNTIME_NOT_CONFIGURED" }, { status: 503 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only status endpoint. No cookie mutation required.
      },
    },
  });

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return NextResponse.json({ ok: false, code: "HEPE_01B2H_AUTH_REQUIRED" }, { status: 401 });
  }

  const { data: reviews, error: reviewError } = await supabase
    .from("reviews")
    .select("review_id,status_code,row_version,programme_id,review_code")
    .eq("programme_id", PROGRAMME_ID)
    .eq("review_code", REVIEW_CODE)
    .limit(1);

  if (reviewError) {
    return NextResponse.json({ ok: false, code: "HEPE_01B2H_REVIEW_READ_DENIED" }, { status: 403 });
  }

  const review = reviews?.[0];
  if (!review) {
    return NextResponse.json({
      ok: true,
      gate: "HEPE-PEOPLE-01B.2H",
      state: "NO_CONTROLLED_REVIEW",
      locked: false,
      auditEvidenceAdmission: "NOT_ADMITTED",
      production: false,
    });
  }

  const { data: decisions, error: decisionError } = await supabase
    .from("decisions")
    .select("decision_id,decision_type_code,decision_text,decided_at,decided_by_actor_id")
    .eq("review_id", review.review_id)
    .order("decided_at", { ascending: false })
    .limit(1);

  if (decisionError) {
    return NextResponse.json({ ok: false, code: "HEPE_01B2H_DECISION_READ_DENIED" }, { status: 403 });
  }

  const decision = decisions?.[0];
  let packet: unknown = null;
  if (decision?.decision_text) {
    try {
      packet = JSON.parse(decision.decision_text);
    } catch {
      packet = null;
    }
  }

  return NextResponse.json({
    ok: true,
    gate: "HEPE-PEOPLE-01B.2H",
    state: decision ? "HUMAN_DECISION_RECORDED" : review.status_code,
    locked: Boolean(decision),
    review: {
      reviewId: review.review_id,
      statusCode: review.status_code,
      rowVersion: review.row_version,
    },
    decision: decision
      ? {
          decisionId: decision.decision_id,
          decisionTypeCode: decision.decision_type_code,
          decidedAt: decision.decided_at,
          decidedByActorId: decision.decided_by_actor_id,
          packet,
        }
      : null,
    auditEvidenceAdmission: "NOT_ADMITTED",
    production: false,
  });
}
