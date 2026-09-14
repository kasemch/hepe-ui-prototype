import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type CurriculumContextRow = {
  programme_id: string;
  programme_code: string;
  canonical_identifier: string | null;
  title_th: string | null;
  title_en: string | null;
  programme_status_code: string | null;
  curriculum_version_id: string | null;
  version_code: string | null;
  version_label: string | null;
  curriculum_status_code: string | null;
  effective_from: string | null;
  effective_to: string | null;
  is_current: boolean | null;
  approved_at: string | null;
  activated_at: string | null;
};

async function loadContext() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { state: "RUNTIME_NOT_CONFIGURED", rows: [] as CurriculumContextRow[] };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only server surface */ },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { state: "AUTH_REQUIRED", rows: [] as CurriculumContextRow[] };

  const { data, error } = await supabase
    .from("v_hepe_curriculum_context_v1")
    .select("programme_id,programme_code,canonical_identifier,title_th,title_en,programme_status_code,curriculum_version_id,version_code,version_label,curriculum_status_code,effective_from,effective_to,is_current,approved_at,activated_at")
    .order("programme_code", { ascending: true });

  if (error) return { state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}`, rows: [] as CurriculumContextRow[] };
  return { state: "VERIFIED_READ", rows: (data ?? []) as CurriculumContextRow[] };
}

function value(v: string | number | boolean | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export default async function ProgrammeCurriculumPage() {
  const { state, rows } = await loadContext();

  return (
    <main style={{ maxWidth: 1120, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#475569", fontWeight: 700 }}>HEPE · PROGRAMME & CURRICULUM · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Programme & Curriculum</h1>
            <p style={{ margin: 0, maxWidth: 860, color: "#475569" }}>
              Authority-aware read-only view of the controlled curriculum context already present in HEPE. Status values are displayed exactly as read from the system; this surface does not approve, activate, or make a curriculum current.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Visible programmes:</strong> {rows.length}
        </div>

        {state === "AUTH_REQUIRED" && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            Authentication is required. Anonymous programme/curriculum access remains fail-closed.
          </div>
        )}

        {state.startsWith("READ_BLOCKED") && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            This identity does not have a permitted programme scope, or the runtime read binding is incomplete. No broader authority is inferred.
          </div>
        )}

        {state === "VERIFIED_READ" && rows.length === 0 && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
            No programme/curriculum rows are visible to this authenticated authority scope.
          </div>
        )}

        {rows.map((row) => (
          <article key={`${row.programme_id}:${row.curriculum_version_id ?? "none"}`} style={{ marginTop: 20, padding: 20, border: "1px solid #e2e8f0", borderRadius: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#64748b", fontSize: 12 }}>Programme code {row.programme_code}</div>
                <h2 style={{ margin: "5px 0 2px", fontSize: 21 }}>{row.title_th ?? "Untitled programme"}</h2>
                <div style={{ color: "#475569" }}>{row.title_en ?? "—"}</div>
              </div>
              <div style={{ alignSelf: "flex-start", border: "1px solid #cbd5e1", borderRadius: 999, padding: "6px 10px", background: "#f8fafc", fontSize: 12 }}>
                Programme: <strong>{value(row.programme_status_code)}</strong>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <strong>Controlled status:</strong> curriculum status = {value(row.curriculum_status_code)} · is_current = {value(row.is_current)} · effective_from = {value(row.effective_from)}. These fields are displayed, not changed, by this page.
            </div>

            <dl style={{ display: "grid", gridTemplateColumns: "minmax(180px,0.7fr) minmax(0,1.3fr)", gap: "9px 16px", marginTop: 18 }}>
              <dt style={{ color: "#64748b" }}>Canonical identifier</dt><dd style={{ margin: 0 }}>{value(row.canonical_identifier)}</dd>
              <dt style={{ color: "#64748b" }}>Curriculum version</dt><dd style={{ margin: 0 }}>{value(row.version_code)}</dd>
              <dt style={{ color: "#64748b" }}>Version label</dt><dd style={{ margin: 0 }}>{value(row.version_label)}</dd>
              <dt style={{ color: "#64748b" }}>Curriculum status</dt><dd style={{ margin: 0 }}>{value(row.curriculum_status_code)}</dd>
              <dt style={{ color: "#64748b" }}>Effective period</dt><dd style={{ margin: 0 }}>{value(row.effective_from)} → {value(row.effective_to)}</dd>
              <dt style={{ color: "#64748b" }}>Current flag</dt><dd style={{ margin: 0 }}>{value(row.is_current)}</dd>
              <dt style={{ color: "#64748b" }}>Approved at</dt><dd style={{ margin: 0 }}>{value(row.approved_at)}</dd>
              <dt style={{ color: "#64748b" }}>Activated at</dt><dd style={{ margin: 0 }}>{value(row.activated_at)}</dd>
            </dl>
          </article>
        ))}

        <div style={{ marginTop: 22, padding: 16, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: 13 }}>
          Governance boundary: this is a read-only controlled context surface. A DRAFT record is not an approved/current baseline merely because it is visible. No Production Authorization or automatic Audit Evidence Admission is implied.
        </div>
      </section>
    </main>
  );
}
