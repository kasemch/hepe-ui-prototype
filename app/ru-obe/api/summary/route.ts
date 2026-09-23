import { NextResponse } from "next/server";
import { getRuObeDashboardSummary } from "../../pilot-adapter";

export async function GET() {
  const summary = await getRuObeDashboardSummary();

  return NextResponse.json(
    {
      module: "RU-OBE-COPILOT-V2",
      environment: summary.environment,
      dataClass: summary.dataClass,
      source: summary.source,
      evidenceStatus: summary.evidenceStatus,
      productionAuthorized: summary.productionAuthorized,
      summary: {
        programmeCount: summary.programmeCount,
        courseCount: summary.courseCount,
        outcomeCount: summary.outcomeCount,
        assessmentCount: summary.assessmentCount,
        openFindingCount: summary.openFindingCount,
        openContradictionCount: summary.openContradictionCount,
        tqfReadyForReviewCount: summary.tqfReadyForReviewCount,
        humanGateCount: summary.humanGateCount,
      },
      restrictions: [
        "synthetic-only",
        "read-only",
        "no real student/person-level data",
        "no academic verification claim",
        "no production authorization"
      ]
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-RUOBE-Data-Class": "SYNTHETIC",
        "X-RUOBE-Environment": "NON_PRODUCTION"
      }
    }
  );
}
