import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type EvidenceRow = {
  programme_id: string;
  evidence_object_id: string;
  evidence_code: string;
  title: string | null;
  evidence_type_code: string | null;
  status_code: string | null;
  evidence_version_id: string | null;
  version_no: number | null;
  is_current: boolean | null;
  effective_from: string | null;
  effective_to: string | null;
  verification_result: string | null;
  sufficiency_result: string | null;
  is_stale: boolean | null;
  health_state: string | null;
};

async function loadEvidence() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { state: "RUNTIME_NOT_CONFIGURED", rows: [] as EvidenceRow[] };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only server surface */ },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { state: "AUTH_REQUIRED", rows: [] as EvidenceRow[] };

  const { data, error } = await supabase
    .from("v_hepe_evidence_projection_v1")
    .select("programme_id,evidence_object_id,evidence_code,title,evidence_type_code,status_code,evidence_version_id,version_no,is_current,effective_from,effective_to,verification_result,sufficiency_result,is_stale,health_state")
    .order("evidence_code", { ascending: true });

  if (error) return { state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}`, rows: [] as EvidenceRow[] };
  return { state: "VERIFIED_READ", rows: (data ?? []) as EvidenceRow[] };
}

function show(v: string | number | boolean | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export default async function EvidenceExplorerPage() {
  const { state, rows } = await loadEvidence();
  const current = rows.filter((r) => r.is_current).length;
  const stale = rows.filter((r) => r.is_stale).length;
  const unverified = rows.filter((r) => (r.health_state ?? "").toUpperCase() === "UNVERIFIED" || (r.verification_result ?? "").toUpperCase().includes("UNVERIFIED")).length;

  return (
    <main style={{ maxWidth: 1160, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#475569", fontWeight: 700 }}>HEPE · EVIDENCE EXPLORER · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Evidence Explorer</h1>
            <p style={{ margin: 0, maxWidth: 860, color: "#475569" }}>
              Authority-aware read-only projection of evidence objects already present in HEPE. Visibility or presence in this explorer does not admit an item to the Audit Evidence Set.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Visible rows:</strong> {rows.length}
        </div>

        {state === "AUTH_REQUIRED" && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            Authentication is required. Anonymous evidence access remains fail-closed.
          </div>
        )}

        {state.startsWith("READ_BLOCKED") && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            This identity has no permitted evidence scope, or the read-model binding is unavailable. No broader authority is inferred.
          </div>
        )}

        {state === "VERIFIED_READ" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginTop: 18 }}>
              {[["Visible evidence", rows.length], ["Current versions", current], ["Stale", stale], ["Unverified health", unverified]].map(([label, value]) => (
                <div key={String(label)} style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div><strong style={{ fontSize: 25 }}>{value}</strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: 15, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <strong>Evidence governance:</strong> UNVERIFIED, DRAFT, candidate, or visible evidence is not Audit Evidence by default. Admission requires provenance, authority, relevant assertion, verification status, and explicit evidence-governance admission.
            </div>
          </>
        )}

        {rows.map((row) => (
          <article key={`${row.evidence_object_id}:${row.evidence_version_id ?? "none"}`} style={{ marginTop: 18, padding: 18, border: "1px solid #e2e8f0", borderRadius: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div><div style={{ color: "#64748b", fontSize: 12 }}>{row.evidence_code}</div><h2 style={{ margin: "5px 0", fontSize: 20 }}>{row.title ?? "Untitled evidence object"}</h2></div>
              <div style={{ alignSelf: "flex-start", border: "1px solid #cbd5e1", borderRadius: 999, padding: "6px 10px", background: "#f8fafc", fontSize: 12 }}>Health: <strong>{show(row.health_state)}</strong></div>
            </div>
            <dl style={{ display: "grid", gridTemplateColumns: "minmax(180px,0.7fr) minmax(0,1.3fr)", gap: "8px 16px", marginTop: 14 }}>
              <dt style={{ color: "#64748b" }}>Evidence type</dt><dd style={{ margin: 0 }}>{show(row.evidence_type_code)}</dd>
              <dt style={{ color: "#64748b" }}>Object status</dt><dd style={{ margin: 0 }}>{show(row.status_code)}</dd>
              <dt style={{ color: "#64748b" }}>Version</dt><dd style={{ margin: 0 }}>{show(row.version_no)}</dd>
              <dt style={{ color: "#64748b" }}>Current flag</dt><dd style={{ margin: 0 }}>{show(row.is_current)}</dd>
              <dt style={{ color: "#64748b" }}>Effective period</dt><dd style={{ margin: 0 }}>{show(row.effective_from)} → {show(row.effective_to)}</dd>
              <dt style={{ color: "#64748b" }}>Verification</dt><dd style={{ margin: 0 }}>{show(row.verification_result)}</dd>
              <dt style={{ color: "#64748b" }}>Sufficiency</dt><dd style={{ margin: 0 }}>{show(row.sufficiency_result)}</dd>
              <dt style={{ color: "#64748b" }}>Stale</dt><dd style={{ margin: 0 }}>{show(row.is_stale)}</dd>
            </dl>
          </article>
        ))}

        {state === "VERIFIED_READ" && rows.length === 0 && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#f8fafc", border: "1px dashed #cbd5e1" }}>No evidence objects are visible to this authority scope.</div>
        )}

        <div style={{ marginTop: 22, padding: 16, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: 13 }}>
          Governance boundary: this explorer is descriptive and read-only. It creates no system authority, does not verify an item by display, and does not change Evidence Admission status.
        </div>
      </section>
    </main>
  );
}
