import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type ResponsibilityRow = {
  responsibility_id: string;
  programme_id: string;
  course_code: string | null;
  person_name_th: string | null;
  responsibility_type: string;
  academic_year: string | null;
  term_code: string | null;
  temporal_status: string;
  team_state: string | null;
  source_person_label: string | null;
  verification_status: string;
};

async function loadResponsibilities() {
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
        // Server Component is read-only. Session mutation remains in auth routes.
      },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { rows: [] as ResponsibilityRow[], state: "AUTH_REQUIRED" };
  }

  const { data, error } = await supabase
    .from("v_course_academic_responsibility_current")
    .select(
      "responsibility_id,programme_id,course_code,person_name_th,responsibility_type,academic_year,term_code,temporal_status,team_state,source_person_label,verification_status"
    )
    .order("course_code", { ascending: true, nullsFirst: false })
    .order("responsibility_type", { ascending: true })
    .limit(100);

  if (error) {
    return { rows: [] as ResponsibilityRow[], state: `READ_BLOCKED:${error.code ?? "UNKNOWN"}` };
  }

  return { rows: (data ?? []) as ResponsibilityRow[], state: "VERIFIED_READ" };
}

export default async function AcademicResponsibilityPage() {
  const { rows, state } = await loadResponsibilities();

  return (
    <main style={{ maxWidth: 1180, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>HEPE · PEOPLE-01E · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Academic Responsibility</h1>
            <p style={{ margin: 0, color: "#475569" }}>
              Authority-aware, read-only view of current academic responsibility. Academic responsibility does not create system authority.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong>Read state:</strong> {state} · <strong>Visible rows:</strong> {rows.length}
        </div>

        {state === "AUTH_REQUIRED" && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            Authentication is required. The database remains fail-closed for anonymous access.
          </div>
        )}

        {state.startsWith("READ_BLOCKED") && (
          <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            The signed-in identity does not currently have a permitted responsibility-read scope, or the runtime binding is incomplete.
          </div>
        )}

        {rows.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: 10 }}>Course</th>
                  <th style={{ padding: 10 }}>Person</th>
                  <th style={{ padding: 10 }}>Responsibility</th>
                  <th style={{ padding: 10 }}>Period</th>
                  <th style={{ padding: 10 }}>Team</th>
                  <th style={{ padding: 10 }}>Verification</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.responsibility_id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: 10, fontWeight: 700 }}>{row.course_code ?? "Programme"}</td>
                    <td style={{ padding: 10 }}>{row.person_name_th ?? row.source_person_label ?? "Pending roster"}</td>
                    <td style={{ padding: 10 }}>{row.responsibility_type}</td>
                    <td style={{ padding: 10 }}>{[row.academic_year, row.term_code].filter(Boolean).join(" / ") || row.temporal_status}</td>
                    <td style={{ padding: 10 }}>{row.team_state ?? "—"}</td>
                    <td style={{ padding: 10 }}>{row.verification_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
