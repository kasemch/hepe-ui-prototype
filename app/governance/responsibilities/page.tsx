import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type ResponsibilityRow = {
  responsibility_id: string;
  programme_code: string | null;
  course_code: string | null;
  person_name_th: string | null;
  academic_position_th: string | null;
  responsibility_scope: string;
  responsibility_type: string;
  academic_year: string | null;
  term_code: string | null;
  temporal_status: string;
  team_state: string | null;
  source_person_label: string | null;
  source_document_id: string;
  source_locator: string | null;
  source_authority: string;
  source_version_date: string | null;
  verification_status: string;
  resolution_status: string;
  has_successor: boolean;
  creates_system_authority: boolean;
};

type ExplorerMode = "current" | "timeline";

type Filters = {
  mode: ExplorerMode;
  q: string;
  type: string;
  year: string;
  term: string;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizedFilters(params: Record<string, string | string[] | undefined>): Filters {
  const mode = first(params.mode) === "timeline" ? "timeline" : "current";
  return {
    mode,
    q: first(params.q).trim(),
    type: first(params.type).trim(),
    year: first(params.year).trim(),
    term: first(params.term).trim(),
  };
}

async function loadResponsibilities(mode: ExplorerMode) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return { rows: [] as ResponsibilityRow[], state: "RUNTIME_NOT_CONFIGURED" };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only Server Component. Session mutation remains in auth routes.
      },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { rows: [] as ResponsibilityRow[], state: "AUTH_REQUIRED" };
  }

  const relation =
    mode === "timeline"
      ? "v_course_academic_responsibility_timeline"
      : "v_course_academic_responsibility_current";

  const { data, error } = await supabase
    .from(relation)
    .select(
      "responsibility_id,programme_code,course_code,person_name_th,academic_position_th,responsibility_scope,responsibility_type,academic_year,term_code,temporal_status,team_state,source_person_label,source_document_id,source_locator,source_authority,source_version_date,verification_status,resolution_status,has_successor,creates_system_authority"
    )
    .order("course_code", { ascending: true, nullsFirst: false })
    .order("responsibility_type", { ascending: true })
    .limit(500);

  if (error) {
    return { rows: [] as ResponsibilityRow[], state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}` };
  }

  return { rows: (data ?? []) as ResponsibilityRow[], state: "VERIFIED_READ" };
}

function filterRows(rows: ResponsibilityRow[], filters: Filters) {
  const needle = filters.q.toLocaleLowerCase("th-TH");
  return rows.filter((row) => {
    const searchable = [
      row.course_code,
      row.person_name_th,
      row.source_person_label,
      row.responsibility_type,
      row.source_document_id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("th-TH");

    return (
      (!needle || searchable.includes(needle)) &&
      (!filters.type || row.responsibility_type === filters.type) &&
      (!filters.year || row.academic_year === filters.year) &&
      (!filters.term || row.term_code === filters.term)
    );
  });
}

function unique(values: Array<string | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort();
}

function badge(text: string, tone: "neutral" | "good" | "warn" = "neutral") {
  const background = tone === "good" ? "#ecfdf5" : tone === "warn" ? "#fff7ed" : "#f1f5f9";
  const border = tone === "good" ? "#a7f3d0" : tone === "warn" ? "#fed7aa" : "#cbd5e1";
  return (
    <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 999, background, border: `1px solid ${border}`, fontSize: 12 }}>
      {text}
    </span>
  );
}

export default async function AcademicResponsibilityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = normalizedFilters(await searchParams);
  const { rows, state } = await loadResponsibilities(filters.mode);
  const filtered = filterRows(rows, filters);

  const types = unique(rows.map((row) => row.responsibility_type));
  const years = unique(rows.map((row) => row.academic_year));
  const terms = unique(rows.map((row) => row.term_code));
  const pendingCount = filtered.filter((row) => row.team_state === "ROSTER_PENDING" || row.responsibility_type === "ROSTER_PENDING").length;
  const verifiedCount = filtered.filter((row) => row.verification_status.startsWith("VERIFIED") || row.verification_status.includes("AUTHORITY") || row.verification_status === "EXACT_CONTROLLED_ALIAS").length;
  const authorityLeakCount = filtered.filter((row) => row.creates_system_authority).length;

  return (
    <main style={{ maxWidth: 1320, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>HEPE · PEOPLE-01G · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Academic Responsibility Explorer</h1>
            <p style={{ margin: 0, color: "#475569", maxWidth: 820 }}>
              Authority-aware, read-only explorer for current responsibility, temporal history, team state and source provenance. Academic responsibility never grants system authority.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          <a href="/governance/responsibilities?mode=current" style={{ padding: "8px 12px", borderRadius: 10, textDecoration: "none", color: "#0f172a", background: filters.mode === "current" ? "#dbeafe" : "#f8fafc", border: "1px solid #cbd5e1" }}>Current</a>
          <a href="/governance/responsibilities?mode=timeline" style={{ padding: "8px 12px", borderRadius: 10, textDecoration: "none", color: "#0f172a", background: filters.mode === "timeline" ? "#dbeafe" : "#f8fafc", border: "1px solid #cbd5e1" }}>Timeline</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Visible:</strong> {filtered.length}/{rows.length} · <strong>Mode:</strong> {filters.mode.toUpperCase()}
        </div>

        {state === "AUTH_REQUIRED" && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            Authentication is required. Anonymous access remains fail-closed at the database layer.
          </div>
        )}

        {state.startsWith("READ_BLOCKED") && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            This signed-in identity has no permitted responsibility-read scope, or the runtime binding is incomplete.
          </div>
        )}

        {state === "VERIFIED_READ" && (
          <>
            <form method="get" style={{ display: "grid", gridTemplateColumns: "2fr repeat(3,minmax(140px,1fr)) auto", gap: 10, marginTop: 18, alignItems: "end" }}>
              <input type="hidden" name="mode" value={filters.mode} />
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>
                Search
                <input name="q" defaultValue={filters.q} placeholder="Course, person, source…" style={{ padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }} />
              </label>
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>
                Responsibility
                <select name="type" defaultValue={filters.type} style={{ padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }}>
                  <option value="">All</option>
                  {types.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>
                Academic year
                <select name="year" defaultValue={filters.year} style={{ padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }}>
                  <option value="">All</option>
                  {years.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 5, fontSize: 13 }}>
                Term
                <select name="term" defaultValue={filters.term} style={{ padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }}>
                  <option value="">All</option>
                  {terms.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <button type="submit" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #1d4ed8", background: "#1d4ed8", color: "white", fontWeight: 700 }}>Filter</button>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginTop: 16 }}>
              <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ color: "#64748b", fontSize: 12 }}>Visible records</div><strong style={{ fontSize: 24 }}>{filtered.length}</strong></div>
              <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ color: "#64748b", fontSize: 12 }}>Verified/resolved</div><strong style={{ fontSize: 24 }}>{verifiedCount}</strong></div>
              <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ color: "#64748b", fontSize: 12 }}>Roster pending</div><strong style={{ fontSize: 24 }}>{pendingCount}</strong></div>
              <div style={{ padding: 14, border: authorityLeakCount === 0 ? "1px solid #a7f3d0" : "1px solid #fecaca", borderRadius: 12, background: authorityLeakCount === 0 ? "#ecfdf5" : "#fef2f2" }}><div style={{ color: "#64748b", fontSize: 12 }}>Authority leakage</div><strong style={{ fontSize: 24 }}>{authorityLeakCount}</strong></div>
            </div>
          </>
        )}

        {filtered.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: 10 }}>Course / Person</th>
                  <th style={{ padding: 10 }}>Responsibility</th>
                  <th style={{ padding: 10 }}>Period / State</th>
                  <th style={{ padding: 10 }}>Team</th>
                  <th style={{ padding: 10 }}>Verification</th>
                  <th style={{ padding: 10, minWidth: 260 }}>Provenance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.responsibility_id} style={{ borderBottom: "1px solid #e2e8f0", verticalAlign: "top" }}>
                    <td style={{ padding: 10 }}>
                      <div style={{ fontWeight: 800 }}>{row.course_code ?? row.programme_code ?? "Programme"}</div>
                      <div style={{ marginTop: 4 }}>{row.academic_position_th ? `${row.academic_position_th} ` : ""}{row.person_name_th ?? row.source_person_label ?? "Pending roster"}</div>
                      {row.source_person_label && row.person_name_th && <div style={{ marginTop: 3, color: "#64748b", fontSize: 12 }}>source label: {row.source_person_label}</div>}
                    </td>
                    <td style={{ padding: 10 }}>
                      <div>{badge(row.responsibility_type, row.responsibility_type === "ROSTER_PENDING" ? "warn" : "neutral")}</div>
                      <div style={{ marginTop: 5, color: "#64748b" }}>{row.responsibility_scope}</div>
                    </td>
                    <td style={{ padding: 10 }}>
                      <div>{[row.academic_year, row.term_code && `T${row.term_code}`].filter(Boolean).join(" · ") || "—"}</div>
                      <div style={{ marginTop: 5 }}>{badge(row.temporal_status, row.temporal_status === "CURRENT" ? "good" : row.temporal_status === "SUPERSEDED" ? "warn" : "neutral")}</div>
                      {row.has_successor && <div style={{ marginTop: 5, color: "#9a3412" }}>Superseded by later record</div>}
                    </td>
                    <td style={{ padding: 10 }}>{row.team_state ? badge(row.team_state, row.team_state === "ROSTER_PENDING" ? "warn" : "neutral") : "—"}</td>
                    <td style={{ padding: 10 }}>
                      <div>{row.verification_status}</div>
                      <div style={{ marginTop: 5, color: "#64748b" }}>{row.resolution_status}</div>
                    </td>
                    <td style={{ padding: 10 }}>
                      <div style={{ fontWeight: 700 }}>{row.source_document_id}</div>
                      {row.source_locator && <div style={{ marginTop: 4 }}>{row.source_locator}</div>}
                      <div style={{ marginTop: 4, color: "#64748b" }}>{row.source_authority}</div>
                      {row.source_version_date && <div style={{ marginTop: 4, color: "#64748b" }}>version/date: {row.source_version_date}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {state === "VERIFIED_READ" && filtered.length === 0 && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
            No records match the current authority scope and filters.
          </div>
        )}
      </section>
    </main>
  );
}
