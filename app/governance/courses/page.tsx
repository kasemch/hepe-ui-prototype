import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PROGRAMME_ID = "69e3361e-b342-43e1-b386-ac73b191b9a4";

type CourseRow = {
  programme_id: string;
  programme_code: string;
  curriculum_version_id: string;
  curriculum_version_code: string;
  course_id: string;
  course_code: string;
  title_th: string | null;
  title_en: string | null;
  credit_value: number | null;
  course_status_code: string | null;
  course_role: string | null;
  recommended_year: number | null;
  recommended_term: number | null;
  display_order: number | null;
  is_active: boolean | null;
};

async function loadCourses() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { state: "RUNTIME_NOT_CONFIGURED", rows: [] as CourseRow[] };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only server surface */ },
    },
  });
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { state: "AUTH_REQUIRED", rows: [] as CourseRow[] };

  const { data, error } = await supabase
    .from("v_hepe_course_registry_v1")
    .select("programme_id,programme_code,curriculum_version_id,curriculum_version_code,course_id,course_code,title_th,title_en,credit_value,course_status_code,course_role,recommended_year,recommended_term,display_order,is_active")
    .eq("programme_id", PROGRAMME_ID)
    .order("display_order", { ascending: true })
    .order("course_code", { ascending: true });
  if (error) return { state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}`, rows: [] as CourseRow[] };
  return { state: "VERIFIED_READ", rows: (data ?? []) as CourseRow[] };
}

function show(v: string | number | boolean | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export default async function CourseRegistryPage() {
  const { state, rows } = await loadCourses();
  const active = rows.filter((r) => r.is_active).length;
  const credits = rows.reduce((sum, row) => sum + (Number(row.credit_value) || 0), 0);

  return (
    <main style={{ maxWidth: 1240, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#475569", fontWeight: 700 }}>HEPE · COURSE REGISTRY · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Course Registry</h1>
            <p style={{ margin: 0, maxWidth: 880, color: "#475569" }}>
              Authority-aware read-only course registry scoped to the controlled BED-HEPE programme. This page displays registered course context and does not activate a curriculum, infer teaching responsibility, or modify course records.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Visible courses:</strong> {rows.length}
        </div>

        {state === "AUTH_REQUIRED" && <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>Authentication is required. Anonymous course-registry access remains fail-closed.</div>}
        {state.startsWith("READ_BLOCKED") && <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>This identity has no permitted programme scope, or the controlled course read model is unavailable. No broader authority is inferred.</div>}

        {state === "VERIFIED_READ" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginTop: 18 }}>
              {[["Registered courses", rows.length], ["Active flags", active], ["Displayed credit total", credits]].map(([label, value]) => (
                <div key={String(label)} style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ fontSize: 12, color: "#64748b" }}>{label}</div><strong style={{ fontSize: 25 }}>{value}</strong></div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <strong>Controlled-baseline note:</strong> registry visibility does not change the curriculum version status. The Source-B validation curriculum remains governed by its own DRAFT/current/effective-date metadata. Synthetic pilot programmes are separate scopes and are not included in this BED-HEPE registry view.
            </div>
          </>
        )}

        {rows.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ textAlign: "left", borderBottom: "2px solid #cbd5e1" }}><th style={{ padding: 10 }}>Course</th><th style={{ padding: 10 }}>Credits</th><th style={{ padding: 10 }}>Role</th><th style={{ padding: 10 }}>Recommended period</th><th style={{ padding: 10 }}>Status</th><th style={{ padding: 10 }}>Active flag</th></tr></thead>
              <tbody>{rows.map((row) => (
                <tr key={row.course_id} style={{ borderBottom: "1px solid #e2e8f0", verticalAlign: "top" }}>
                  <td style={{ padding: 10 }}><strong>{row.course_code}</strong><div style={{ marginTop: 3 }}>{row.title_th ?? row.title_en ?? "—"}</div><div style={{ color: "#64748b", marginTop: 3 }}>{row.title_en ?? ""}</div></td>
                  <td style={{ padding: 10 }}>{show(row.credit_value)}</td>
                  <td style={{ padding: 10 }}>{show(row.course_role)}</td>
                  <td style={{ padding: 10 }}>Year {show(row.recommended_year)} · Term {show(row.recommended_term)}</td>
                  <td style={{ padding: 10 }}>{show(row.course_status_code)}</td>
                  <td style={{ padding: 10 }}>{show(row.is_active)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {state === "VERIFIED_READ" && rows.length === 0 && <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#f8fafc", border: "1px dashed #cbd5e1" }}>No course rows are visible to this authenticated authority scope.</div>}

        <div style={{ marginTop: 22, padding: 16, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: 13 }}>
          Governance boundary: Course Registry is descriptive and read-only. It does not establish course ownership, course coordination, teaching responsibility, curriculum approval, or Production Authorization.
        </div>
      </section>
    </main>
  );
}
