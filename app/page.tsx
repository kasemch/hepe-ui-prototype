import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type CoverageRow = {
  offered_in_period: boolean;
  coverage_state: string;
  has_course_owner_record: boolean;
  has_course_coordinator_record: boolean;
};

type ReconciliationRow = {
  reconciliation_code: string;
  category: string;
  blocking_status: string;
};

async function loadProgrammeSnapshot() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return {
      state: "RUNTIME_NOT_CONFIGURED",
      authenticated: false,
      coverage: [] as CoverageRow[],
      reconciliation: [] as ReconciliationRow[],
    };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only command center */ },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return {
      state: "AUTH_REQUIRED",
      authenticated: false,
      coverage: [] as CoverageRow[],
      reconciliation: [] as ReconciliationRow[],
    };
  }

  const [coverageResult, reconciliationResult] = await Promise.all([
    supabase.rpc("hepe_get_people_responsibility_coverage", {
      p_academic_year: "2569",
      p_term_code: "1",
    }),
    supabase
      .from("v_hepe_people_reconciliation_queue_v1")
      .select("reconciliation_code,category,blocking_status")
      .limit(100),
  ]);

  const readBlocked = Boolean(coverageResult.error || reconciliationResult.error);
  return {
    state: readBlocked ? "PARTIAL_OR_BLOCKED" : "VERIFIED_READ",
    authenticated: true,
    coverage: (coverageResult.data ?? []) as CoverageRow[],
    reconciliation: (reconciliationResult.data ?? []) as ReconciliationRow[],
  };
}

function cardStyle(border: string, background: string) {
  return {
    padding: 18,
    border: `1px solid ${border}`,
    borderRadius: 14,
    textDecoration: "none",
    color: "inherit",
    background,
  } as const;
}

export default async function Home() {
  const snapshot = await loadProgrammeSnapshot();
  const sourceBCourses = snapshot.coverage.length;
  const offered = snapshot.coverage.filter((r) => r.offered_in_period).length;
  const recorded = snapshot.coverage.filter((r) => r.coverage_state === "VERIFIED_RESPONSIBILITY_RECORDED").length;
  const noCurrent = snapshot.coverage.filter((r) => r.coverage_state === "NO_CURRENT_RESPONSIBILITY_RECORD").length;
  const periodMismatch = snapshot.coverage.filter((r) => r.coverage_state === "TEACHING_STATE_WITHOUT_EXACT_OFFERING").length;
  const ownerRecords = snapshot.coverage.filter((r) => r.has_course_owner_record).length;
  const coordinatorRecords = snapshot.coverage.filter((r) => r.has_course_coordinator_record).length;
  const openReconciliation = snapshot.reconciliation.length;
  const blockingReconciliation = snapshot.reconciliation.filter((r) => r.blocking_status?.includes("BLOCKS_")).length;

  return (
    <main style={{ maxWidth: 1120, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", borderRadius: 18, padding: 26, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>HEPE · PEOPLE-01J · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Academic Command Center</h1>
            <p style={{ margin: 0, maxWidth: 820, color: "#475569" }}>
              Programme-level people, responsibility, coverage, reconciliation, and IAM navigation. Academic responsibility remains separate from system authority. Reconciliation/data-quality states are not Formal Findings or automatically admitted Audit Evidence.
            </p>
          </div>
          <div style={{ alignSelf: "flex-start", padding: "8px 11px", borderRadius: 999, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 12 }}>
            Read state: <strong>{snapshot.state}</strong>
          </div>
        </div>

        {!snapshot.authenticated && (
          <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            Authentication is required before programme-scoped indicators can be shown. Anonymous access remains fail-closed.
          </div>
        )}

        {snapshot.authenticated && snapshot.state === "PARTIAL_OR_BLOCKED" && (
          <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            Some programme-scoped read models are unavailable to this identity. No broader authority is inferred or granted.
          </div>
        )}

        {snapshot.state === "VERIFIED_READ" && (
          <>
            <h2 style={{ fontSize: 18, margin: "24px 0 10px" }}>Programme snapshot · 2569-T1</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
              {[
                ["Source-B courses", sourceBCourses],
                ["Offered", offered],
                ["Responsibility recorded", recorded],
                ["No current record", noCurrent],
                ["Period mismatch", periodMismatch],
                ["Open reconciliation", openReconciliation],
                ["Blocking conditions", blockingReconciliation],
              ].map(([label, value]) => (
                <div key={String(label)} style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
                  <strong style={{ fontSize: 26 }}>{value}</strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, padding: 13, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13, color: "#475569" }}>
              Owner records: <strong>{ownerRecords}</strong> · Coordinator records: <strong>{coordinatorRecords}</strong>. “No current record” is a recording-coverage state only and does not prove that no instructor or responsible person exists in reality.
            </div>
          </>
        )}

        <h2 style={{ fontSize: 18, margin: "26px 0 10px" }}>Governance & access surfaces</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          <a href="/login" style={cardStyle("#e2e8f0", "#f8fafc")}><strong>Login</strong><div style={{ marginTop: 6, color: "#64748b" }}>Controlled authentication entry</div></a>
          <a href="/user-access" style={cardStyle("#e2e8f0", "#f8fafc")}><strong>User & Access Center</strong><div style={{ marginTop: 6, color: "#64748b" }}>Role · Scope · Authority preview</div></a>
          <a href="/user-access/activate" style={cardStyle("#e2e8f0", "#f8fafc")}><strong>Programme-Chair Activation</strong><div style={{ marginTop: 6, color: "#64748b" }}>Controlled IAM activation surface</div></a>
          <a href="/user-access/effective-access" style={cardStyle("#e2e8f0", "#f8fafc")}><strong>Effective Access</strong><div style={{ marginTop: 6, color: "#64748b" }}>Permission-resolution preview</div></a>
          <a href="/governance/course-equivalence" style={cardStyle("#bfdbfe", "#eff6ff")}><strong>Course Equivalence</strong><div style={{ marginTop: 6, color: "#475569" }}>Controlled equivalence reconciliation</div></a>
          <a href="/governance/responsibilities" style={cardStyle("#bbf7d0", "#f0fdf4")}><strong>Academic Responsibility</strong><div style={{ marginTop: 6, color: "#475569" }}>Current · Timeline · provenance</div></a>
          <a href="/governance/responsibility-coverage" style={cardStyle("#c4b5fd", "#f5f3ff")}><strong>Responsibility Coverage</strong><div style={{ marginTop: 6, color: "#475569" }}>Period-aware recording coverage</div></a>
          <a href="/governance/reconciliation" style={cardStyle("#fed7aa", "#fff7ed")}><strong>Reconciliation Queue</strong><div style={{ marginTop: 6, color: "#475569" }}>Verified system conditions requiring reconciliation</div></a>
        </div>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid #e2e8f0", fontSize: 12, color: "#64748b" }}>
          NON-PRODUCTION only · No production authorization · No automatic Audit Evidence Admission · Human authority preserved.
        </div>
      </section>
    </main>
  );
}
