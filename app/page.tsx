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

type ModuleState = "AVAILABLE" | "AUTHORITY_GATED" | "READ_MODEL_NOT_AVAILABLE";

type ModuleCard = {
  title: string;
  description: string;
  state: ModuleState;
  href?: string;
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

function stateBadge(state: ModuleState) {
  const styles = state === "AVAILABLE"
    ? { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" }
    : state === "AUTHORITY_GATED"
      ? { border: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8" }
      : { border: "#cbd5e1", background: "#f8fafc", color: "#475569" };

  return (
    <span style={{ border: `1px solid ${styles.border}`, background: styles.background, color: styles.color, borderRadius: 999, padding: "4px 8px", fontSize: 11, fontWeight: 700 }}>
      {state.replaceAll("_", " ")}
    </span>
  );
}

function moduleCardStyle(state: ModuleState) {
  const muted = state === "READ_MODEL_NOT_AVAILABLE";
  return {
    padding: 18,
    border: `1px solid ${muted ? "#cbd5e1" : "#e2e8f0"}`,
    borderRadius: 14,
    textDecoration: "none",
    color: "inherit",
    background: muted ? "#f8fafc" : "#ffffff",
    opacity: muted ? 0.86 : 1,
    minHeight: 138,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    gap: 12,
  };
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

  const modules: ModuleCard[] = [
    { title: "Login", description: "Controlled authentication entry.", state: "AVAILABLE", href: "/login" },
    { title: "User & Access Center", description: "Role, scope, and authority preview. Authority is never inferred from academic responsibility.", state: "AVAILABLE", href: "/user-access" },
    { title: "Programme-Chair Activation", description: "Controlled IAM activation surface. Write behavior is authority-gated and NON-PRODUCTION only.", state: "AUTHORITY_GATED", href: "/user-access/activate" },
    { title: "Effective Access", description: "Resolved permission preview for the authenticated identity.", state: "AVAILABLE", href: "/user-access/effective-access" },
    { title: "Course Equivalence", description: "Controlled legacy/current equivalence reconciliation.", state: "AUTHORITY_GATED", href: "/governance/course-equivalence" },
    { title: "Academic Responsibility", description: "Current responsibility, timeline, and provenance.", state: "AVAILABLE", href: "/governance/responsibilities" },
    { title: "Responsibility Coverage", description: "Period-aware recording coverage without inventing missing ownership or offering records.", state: "AVAILABLE", href: "/governance/responsibility-coverage" },
    { title: "Reconciliation Queue", description: "Verified system conditions requiring reconciliation. Queue items are not Formal Findings by default.", state: "AVAILABLE", href: "/governance/reconciliation" },
    { title: "Programme & Curriculum", description: "No verified integrated app read surface is bound on this baseline yet.", state: "READ_MODEL_NOT_AVAILABLE" },
    { title: "PLO / CLO Mapping", description: "No verified integrated app read surface is bound on this baseline yet.", state: "READ_MODEL_NOT_AVAILABLE" },
    { title: "Evidence Explorer", description: "Evidence candidates exist in governed storage, but no verified integrated UI surface is bound here yet.", state: "READ_MODEL_NOT_AVAILABLE" },
    { title: "Traceability Explorer", description: "No verified integrated traceability UI surface is bound on this baseline yet.", state: "READ_MODEL_NOT_AVAILABLE" },
    { title: "Approval Queue", description: "No verified cross-module approval runtime surface is bound on this baseline yet.", state: "READ_MODEL_NOT_AVAILABLE" },
    { title: "Help Center", description: "User guidance content exists in other workstreams, but no verified Help Center route is bound on this baseline yet.", state: "READ_MODEL_NOT_AVAILABLE" },
  ];

  return (
    <main style={{ maxWidth: 1180, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", borderRadius: 18, padding: 26, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#475569", fontWeight: 700 }}>HEPE · GLOBAL APP INTEGRATION 01 · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>HEPE Curriculum Command Center</h1>
            <p style={{ margin: 0, maxWidth: 860, color: "#475569" }}>
              Single application shell for verified HEPE runtime surfaces. Module availability is evidence-first: a module is linked only when a route and runtime surface exist on this baseline. Missing modules remain explicitly unavailable rather than being simulated or inferred.
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
            <h2 style={{ fontSize: 18, margin: "24px 0 10px" }}>Verified programme snapshot · 2569-T1</h2>
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginTop: 28 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Module registry</h2>
            <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 13 }}>Verified navigation only. Unavailable cards are intentionally non-clickable.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {stateBadge("AVAILABLE")}{stateBadge("AUTHORITY_GATED")}{stateBadge("READ_MODEL_NOT_AVAILABLE")}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14, marginTop: 12 }}>
          {modules.map((module) => {
            const body = (
              <>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <strong>{module.title}</strong>
                    {stateBadge(module.state)}
                  </div>
                  <div style={{ marginTop: 8, color: "#475569", fontSize: 13 }}>{module.description}</div>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {module.href ? `Route: ${module.href}` : "READ MODEL NOT AVAILABLE / COMING SOON"}
                </div>
              </>
            );

            return module.href ? (
              <a key={module.title} href={module.href} style={moduleCardStyle(module.state)}>{body}</a>
            ) : (
              <div key={module.title} aria-disabled="true" style={moduleCardStyle(module.state)}>{body}</div>
            );
          })}
        </div>

        <div style={{ marginTop: 22, padding: 16, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13, color: "#475569" }}>
          Governance boundary: Conversation, draft UI text, and unavailable-module placeholders are not Audit Evidence. Production authorization is not implied. Existing reconciliation items remain open until resolved by controlled source or verified system evidence.
        </div>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid #e2e8f0", fontSize: 12, color: "#64748b" }}>
          NON-PRODUCTION only · No production authorization · No automatic Audit Evidence Admission · Human authority preserved.
        </div>
      </section>
    </main>
  );
}
