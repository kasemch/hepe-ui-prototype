import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type ReconciliationRow = {
  reconciliation_code: string;
  category: string;
  programme_code: string;
  course_code: string | null;
  academic_year: string | null;
  term_code: string | null;
  object_type: string;
  object_code: string;
  title: string;
  condition_summary: string;
  verification_status: string;
  reconciliation_status: string;
  blocking_status: string;
  recommended_action: string;
  source_reference: string;
};

async function loadQueue() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return { rows: [] as ReconciliationRow[], state: "RUNTIME_NOT_CONFIGURED" };

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only server surface */ },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { rows: [] as ReconciliationRow[], state: "AUTH_REQUIRED" };

  const { data, error } = await supabase
    .from("v_hepe_people_reconciliation_queue_v1")
    .select("reconciliation_code,category,programme_code,course_code,academic_year,term_code,object_type,object_code,title,condition_summary,verification_status,reconciliation_status,blocking_status,recommended_action,source_reference")
    .order("category", { ascending: true })
    .order("object_code", { ascending: true })
    .limit(100);

  if (error) return { rows: [] as ReconciliationRow[], state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}` };
  return { rows: (data ?? []) as ReconciliationRow[], state: "VERIFIED_READ" };
}

export default async function ReconciliationQueuePage() {
  const { rows, state } = await loadQueue();
  const curriculumCount = rows.filter((r) => r.category === "CURRICULUM_BASELINE_STATUS").length;
  const offeringCount = rows.filter((r) => r.category === "TEACHING_OFFERING_PERIOD").length;

  return (
    <main style={{ maxWidth: 1180, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>HEPE · PEOPLE-01H · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Reconciliation Queue</h1>
            <p style={{ margin: 0, color: "#475569", maxWidth: 820 }}>
              Verified system conditions that require reconciliation. These rows are not Formal Findings and are not automatically admitted as Audit Evidence.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Visible reconciliation items:</strong> {rows.length}
        </div>

        {state === "AUTH_REQUIRED" && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            Authentication is required. Anonymous access remains fail-closed.
          </div>
        )}

        {state.startsWith("READ_BLOCKED") && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            The signed-in identity has no authority scope for these reconciliation conditions, or the runtime binding is incomplete.
          </div>
        )}

        {state === "VERIFIED_READ" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginTop: 18 }}>
            <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ fontSize: 12, color: "#64748b" }}>Open items</div><strong style={{ fontSize: 26 }}>{rows.length}</strong></div>
            <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ fontSize: 12, color: "#64748b" }}>Curriculum baseline</div><strong style={{ fontSize: 26 }}>{curriculumCount}</strong></div>
            <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12 }}><div style={{ fontSize: 12, color: "#64748b" }}>Teaching/offering period</div><strong style={{ fontSize: 26 }}>{offeringCount}</strong></div>
          </div>
        )}

        {rows.length > 0 && (
          <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
            {rows.map((row) => (
              <article key={row.reconciliation_code} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{row.category} · {row.object_code}</div>
                    <h2 style={{ fontSize: 18, margin: "5px 0 0" }}>{row.title}</h2>
                  </div>
                  <span style={{ alignSelf: "flex-start", padding: "4px 9px", borderRadius: 999, background: "#fff7ed", border: "1px solid #fed7aa", fontSize: 12 }}>{row.reconciliation_status}</span>
                </div>

                <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 10 }}>
                  <strong>System condition:</strong> {row.condition_summary}
                </div>

                <dl style={{ display: "grid", gridTemplateColumns: "minmax(160px,220px) 1fr", gap: "8px 14px", marginTop: 14, fontSize: 13 }}>
                  <dt style={{ color: "#64748b" }}>Programme / Course</dt><dd style={{ margin: 0 }}>{row.programme_code}{row.course_code ? ` · ${row.course_code}` : ""}</dd>
                  <dt style={{ color: "#64748b" }}>Academic period</dt><dd style={{ margin: 0 }}>{[row.academic_year, row.term_code && `T${row.term_code}`].filter(Boolean).join(" · ") || "—"}</dd>
                  <dt style={{ color: "#64748b" }}>Verification</dt><dd style={{ margin: 0 }}>{row.verification_status}</dd>
                  <dt style={{ color: "#64748b" }}>Blocking status</dt><dd style={{ margin: 0 }}>{row.blocking_status}</dd>
                  <dt style={{ color: "#64748b" }}>Source reference</dt><dd style={{ margin: 0 }}>{row.source_reference}</dd>
                  <dt style={{ color: "#64748b" }}>Recommended action</dt><dd style={{ margin: 0 }}>{row.recommended_action}</dd>
                </dl>
              </article>
            ))}
          </div>
        )}

        {state === "VERIFIED_READ" && rows.length === 0 && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
            No reconciliation condition is currently visible within this identity's authority scope.
          </div>
        )}
      </section>
    </main>
  );
}
