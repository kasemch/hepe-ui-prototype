import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type Finding = {
  document_preview_validation_finding_id: string;
  severity: "INFO" | "WARNING" | "ERROR";
  finding_code: string;
  field_path: string | null;
  message: string;
  is_blocking: boolean;
  resolved: boolean;
};

function badge(text: string, tone: "neutral" | "ok" | "warn" | "danger" = "neutral") {
  const palette = {
    neutral: { bg: "#eef2f7", fg: "#334155" },
    ok: { bg: "#dcfce7", fg: "#166534" },
    warn: { bg: "#fef3c7", fg: "#92400e" },
    danger: { bg: "#fee2e2", fg: "#991b1b" },
  }[tone];
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: 999,
      background: palette.bg,
      color: palette.fg,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0.2,
    }}>{text}</span>
  );
}

export default async function Tqf3ReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return <main style={{ padding: 32 }}>Runtime not configured.</main>;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie mutation can be unavailable in a Server Component.
          // The auth callback route remains the authoritative session writer.
        }
      },
    },
  });

  const { data: session, error: sessionError } = await supabase
    .from("document_preview_sessions")
    .select("document_preview_session_id,programme_id,course_offering_id,document_type,target_format,preview_status,bundle_snapshot,required_watermark,authoritative_export_allowed,created_at,updated_at")
    .eq("document_preview_session_id", sessionId)
    .single();

  const { data: findings } = await supabase
    .from("document_preview_validation_findings")
    .select("document_preview_validation_finding_id,severity,finding_code,field_path,message,is_blocking,resolved")
    .eq("document_preview_session_id", sessionId)
    .order("is_blocking", { ascending: false })
    .order("severity", { ascending: false });

  if (sessionError || !session) {
    return (
      <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
        <h1>TQF3 Review Workspace</h1>
        <p>ไม่พบ review session นี้ หรือบัญชีปัจจุบันไม่มีสิทธิ์อ่านข้อมูล</p>
        <code>{sessionId}</code>
      </main>
    );
  }

  const bundle = (session.bundle_snapshot ?? {}) as any;
  const content = bundle?.content ?? {};
  const sections = content?.form_sections ?? {};
  const clos = Array.isArray(sections.clos) ? sections.clos : [];
  const assessments = Array.isArray(sections.assessment_items) ? sections.assessment_items : [];
  const weeks = Array.isArray(sections.weekly_plan) ? sections.weekly_plan : [];
  const blockingFindings = ((findings ?? []) as Finding[]).filter((f) => f.is_blocking && !f.resolved);
  const exportLocked = !session.authoritative_export_allowed || blockingFindings.length > 0;

  return (
    <main style={{ maxWidth: 1180, margin: "28px auto", padding: "0 20px 48px", fontFamily: "system-ui, sans-serif", color: "#0f172a" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>HEPE · TQF3 Human Review Workspace</div>
          <h1 style={{ margin: 0, fontSize: 30 }}>HED2503 · เพศวิถีศึกษา</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {badge(`Session ${session.document_preview_session_id.slice(0, 8)}…`)}
            {badge(session.preview_status, "warn")}
            {badge(content?.auto_generation?.status ?? "DESIGN_CANDIDATE", "neutral")}
            {badge(session.required_watermark ?? "DRAFT", "warn")}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13, color: "#64748b" }}>
          <div>Version {bundle?.version_no ?? "—"}</div>
          <div>{session.target_format}</div>
        </div>
      </header>

      <section style={{ padding: 18, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 14, marginBottom: 20 }}>
        <strong>Release Gate</strong>
        <p style={{ marginBottom: 8 }}>
          {exportLocked
            ? `ยังไม่อนุญาต controlled/authoritative export เพราะมี blocker ${blockingFindings.length} รายการ`
            : "ไม่พบ blocker ที่เปิดอยู่"}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {blockingFindings.map((f) => <span key={f.finding_code}>{badge(f.finding_code, "danger")}</span>)}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          ["CLO", clos.length],
          ["Assessment", assessments.length],
          ["Teaching weeks", weeks.length],
          ["Blocking findings", blockingFindings.length],
        ].map(([label, value]) => (
          <div key={String(label)} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, background: "white" }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>CLO Candidate</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {clos.map((clo: any) => (
            <article key={clo.code} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{clo.code}</strong>
                {badge(clo.status ?? "PROVISIONAL", "warn")}
              </div>
              <p style={{ marginBottom: 6, lineHeight: 1.6 }}>{clo.description}</p>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Working outcome: {clo.working_outcome_code ?? "—"} · PLO: {clo.plo || "PENDING OFFICIAL SOURCE"}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>CLO–Assessment Alignment</h2>
        <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 14, background: "white" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Assessment","Method","CLO","Weight","Evidence","Status"].map(h => <th key={h} style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {assessments.map((a: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.item}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.method}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.clos}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.weight}%</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.evidence}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{badge(a.status ?? "PROVISIONAL", "warn")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>15-week Teaching Plan</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {weeks.map((w: any) => (
            <details key={w.week} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px", background: "white" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>สัปดาห์ {w.week}: {w.topic}</summary>
              <div style={{ paddingTop: 10, lineHeight: 1.6, fontSize: 14 }}>
                <div><strong>CLO:</strong> {w.clo} · <strong>PLO:</strong> {w.plo || "PENDING"}</div>
                <div><strong>กิจกรรม:</strong> {w.activities}</div>
                <div><strong>ประเมิน:</strong> {w.assessment}</div>
                <div><strong>ชั่วโมง:</strong> บรรยาย {w.lecture_hours} · ปฏิบัติ {w.practice_hours} · ศึกษาด้วยตนเอง {w.self_hours}</div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Validation & Evidence Gaps</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {((findings ?? []) as Finding[]).map((f) => (
            <article key={f.document_preview_validation_finding_id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <strong>{f.finding_code}</strong>
                {badge(f.is_blocking ? "BLOCKING" : f.severity, f.is_blocking ? "danger" : "ok")}
              </div>
              <div style={{ lineHeight: 1.5 }}>{f.message}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>{f.field_path ?? ""}</div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: 22 }}>
        <h2>Human Review Actions</h2>
        <p style={{ color: "#64748b" }}>ปุ่มชุดนี้เป็น Human Gate; การตัดสินใจต้องทำโดย authenticated reviewer ที่มี authority จริง</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Accept", "Edit", "Reject", "Request Evidence"].map((label) => (
            <button key={label} disabled style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#64748b" }}>
              {label}
            </button>
          ))}
          <button disabled={exportLocked} style={{ padding: "10px 14px", borderRadius: 10, border: 0, background: exportLocked ? "#cbd5e1" : "#0f172a", color: "white", fontWeight: 700 }}>
            Export DOCX / PDF {exportLocked ? "· LOCKED" : ""}
          </button>
        </div>
      </section>

      <footer style={{ marginTop: 32, color: "#64748b", fontSize: 12 }}>
        TQF3-REVIEW-06 / TQF3-UI-07 · structural validation only · academic authority remains human-controlled
      </footer>
    </main>
  );
}
