import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type CoverageRow = {
  programme_code: string;
  course_code: string;
  title_th: string | null;
  title_en: string | null;
  credit_value: number | null;
  academic_year: string;
  term_code: string;
  offered_in_period: boolean;
  current_teaching_responsibility_count: number;
  has_lead_instructor: boolean;
  has_course_owner_record: boolean;
  has_course_coordinator_record: boolean;
  has_roster_pending: boolean;
  coverage_state: string;
};

function first(v: string | string[] | undefined, fallback: string) {
  return Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;
}

async function loadCoverage(year: string, term: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { rows: [] as CoverageRow[], state: "RUNTIME_NOT_CONFIGURED" };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only server surface */ },
    },
  });
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { rows: [] as CoverageRow[], state: "AUTH_REQUIRED" };

  const { data, error } = await supabase.rpc("hepe_get_people_responsibility_coverage", {
    p_academic_year: year,
    p_term_code: term,
  });
  if (error) return { rows: [] as CoverageRow[], state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}` };
  return { rows: (data ?? []) as CoverageRow[], state: "VERIFIED_READ" };
}

function stateLabel(state: string) {
  if (state === "VERIFIED_RESPONSIBILITY_RECORDED") return "Recorded";
  if (state === "NO_CURRENT_RESPONSIBILITY_RECORD") return "No current record";
  if (state === "TEACHING_STATE_WITHOUT_EXACT_OFFERING") return "Teaching state / no exact offering";
  return "Not offered in selected period";
}

function stateStyle(state: string) {
  if (state === "VERIFIED_RESPONSIBILITY_RECORDED") return { background: "#ecfdf5", border: "#a7f3d0" };
  if (state === "NO_CURRENT_RESPONSIBILITY_RECORD") return { background: "#fff7ed", border: "#fed7aa" };
  if (state === "TEACHING_STATE_WITHOUT_EXACT_OFFERING") return { background: "#fef2f2", border: "#fecaca" };
  return { background: "#f8fafc", border: "#e2e8f0" };
}

export default async function ResponsibilityCoveragePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const year = first(params.year, "2569");
  const term = first(params.term, "1");
  const filter = first(params.state, "");
  const { rows, state } = await loadCoverage(year, term);
  const visible = filter ? rows.filter((r) => r.coverage_state === filter) : rows;

  const offered = rows.filter((r) => r.offered_in_period).length;
  const recorded = rows.filter((r) => r.coverage_state === "VERIFIED_RESPONSIBILITY_RECORDED").length;
  const noCurrent = rows.filter((r) => r.coverage_state === "NO_CURRENT_RESPONSIBILITY_RECORD").length;
  const periodMismatch = rows.filter((r) => r.coverage_state === "TEACHING_STATE_WITHOUT_EXACT_OFFERING").length;
  const ownerRecords = rows.filter((r) => r.has_course_owner_record).length;
  const coordinatorRecords = rows.filter((r) => r.has_course_coordinator_record).length;

  return (
    <main style={{ maxWidth: 1320, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>HEPE · PEOPLE-01I · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Responsibility Coverage</h1>
            <p style={{ margin: 0, color: "#475569", maxWidth: 850 }}>
              Period-aware recording coverage for Source-B curriculum courses. “No current record” means no verified responsibility record is present in this system for the selected period; it does not by itself prove that no instructor exists in reality.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Period:</strong> {year}-T{term} · <strong>Visible:</strong> {visible.length}/{rows.length}
        </div>

        {state === "AUTH_REQUIRED" && <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>Authentication is required. Anonymous access remains fail-closed.</div>}
        {state.startsWith("READ_BLOCKED") && <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>This identity has no permitted programme scope, or runtime binding is incomplete.</div>}

        {state === "VERIFIED_READ" && (
          <>
            <form method="get" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, alignItems: "end" }}>
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>Academic year<input name="year" defaultValue={year} style={{ padding: 9, borderRadius: 9, border: "1px solid #cbd5e1", width: 100 }} /></label>
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>Term<input name="term" defaultValue={term} style={{ padding: 9, borderRadius: 9, border: "1px solid #cbd5e1", width: 70 }} /></label>
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>Coverage state
                <select name="state" defaultValue={filter} style={{ padding: 9, borderRadius: 9, border: "1px solid #cbd5e1" }}>
                  <option value="">All</option>
                  <option value="VERIFIED_RESPONSIBILITY_RECORDED">Recorded</option>
                  <option value="NO_CURRENT_RESPONSIBILITY_RECORD">No current record</option>
                  <option value="TEACHING_STATE_WITHOUT_EXACT_OFFERING">Teaching state / no exact offering</option>
                  <option value="NOT_OFFERED_IN_SELECTED_PERIOD">Not offered</option>
                </select>
              </label>
              <button type="submit" style={{ padding: "10px 14px", borderRadius: 9, border: "1px solid #1d4ed8", background: "#1d4ed8", color: "white", fontWeight: 700 }}>Apply</button>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginTop: 18 }}>
              {[
                ["Source-B courses", rows.length],
                ["Offered", offered],
                ["Recorded", recorded],
                ["No current record", noCurrent],
                ["Period mismatch", periodMismatch],
                ["Owner records", ownerRecords],
                ["Coordinator records", coordinatorRecords],
              ].map(([label, value]) => (
                <div key={String(label)} style={{ padding: 13, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ fontSize: 12, color: "#64748b" }}>{label}</div><strong style={{ fontSize: 24 }}>{value}</strong></div>
              ))}
            </div>
          </>
        )}

        {visible.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ textAlign: "left", borderBottom: "2px solid #cbd5e1" }}><th style={{ padding: 10 }}>Course</th><th style={{ padding: 10 }}>Offering</th><th style={{ padding: 10 }}>Teaching records</th><th style={{ padding: 10 }}>Lead / Roster</th><th style={{ padding: 10 }}>Owner / Coordinator record</th><th style={{ padding: 10 }}>Coverage state</th></tr></thead>
              <tbody>
                {visible.map((row) => {
                  const style = stateStyle(row.coverage_state);
                  return (
                    <tr key={row.course_code} style={{ borderBottom: "1px solid #e2e8f0", verticalAlign: "top" }}>
                      <td style={{ padding: 10 }}><strong>{row.course_code}</strong><div style={{ marginTop: 4 }}>{row.title_th ?? row.title_en ?? "—"}</div><div style={{ marginTop: 3, color: "#64748b" }}>{row.credit_value ?? "—"} credits</div></td>
                      <td style={{ padding: 10 }}>{row.offered_in_period ? "Offered" : "Not recorded as offered"}</td>
                      <td style={{ padding: 10 }}>{row.current_teaching_responsibility_count}</td>
                      <td style={{ padding: 10 }}>{row.has_lead_instructor ? "Lead recorded" : "No lead record"}{row.has_roster_pending ? " · Roster pending" : ""}</td>
                      <td style={{ padding: 10 }}>Owner: {row.has_course_owner_record ? "Recorded" : "Not recorded"}<br />Coordinator: {row.has_course_coordinator_record ? "Recorded" : "Not recorded"}</td>
                      <td style={{ padding: 10 }}><span style={{ display: "inline-block", padding: "4px 8px", borderRadius: 999, background: style.background, border: `1px solid ${style.border}` }}>{stateLabel(row.coverage_state)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {state === "VERIFIED_READ" && visible.length === 0 && <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#f8fafc", border: "1px dashed #cbd5e1" }}>No rows match this authority scope and filter.</div>}
      </section>
    </main>
  );
}
