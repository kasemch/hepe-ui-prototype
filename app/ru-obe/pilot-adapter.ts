export type RuObeDashboardSummary = {
  programmeCount: number;
  courseCount: number;
  outcomeCount: number;
  assessmentCount: number;
  openFindingCount: number;
  openContradictionCount: number;
  tqfReadyForReviewCount: number;
  humanGateCount: number;
  productionAuthorized: boolean;
  environment: "NON_PRODUCTION";
  evidenceStatus: "CANDIDATE";
  dataClass: "SYNTHETIC";
  source: "SYNTHETIC_FIXTURE";
};

export async function getRuObeDashboardSummary(): Promise<RuObeDashboardSummary> {
  // Controlled-pilot baseline:
  // This adapter deliberately does NOT use a service-role credential.
  // It mirrors ru_obe.v_dashboard_summary while returning synthetic-only data.
  return {
    programmeCount: 1,
    courseCount: 1,
    outcomeCount: 2,
    assessmentCount: 1,
    openFindingCount: 0,
    openContradictionCount: 0,
    tqfReadyForReviewCount: 0,
    humanGateCount: 2,
    productionAuthorized: false,
    environment: "NON_PRODUCTION",
    evidenceStatus: "CANDIDATE",
    dataClass: "SYNTHETIC",
    source: "SYNTHETIC_FIXTURE",
  };
}
