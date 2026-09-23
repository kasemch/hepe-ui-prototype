import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ReviewActions from "./ReviewActions";
import MappingReviewActions from "./MappingReviewActions";

function badge(text, tone = "neutral") {
  const palette = {
    neutral: { bg: "#eef2f7", fg: "#334155" },
    ok: { bg: "#dcfce7", fg: "#166534" },
    warn: { bg: "#fef3c7", fg: "#92400e" },
    danger: { bg: "#fee2e2", fg: "#991b1b" },
  }[tone] || { bg: "#eef2f7", fg: "#334155" };

  return (
    <span style={{
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: 999,
      background: palette.bg,
      color: palette.fg,
      fontSize: 12,
      fontWeight: 700,
    }}>{text}</span>
  );
}

export default async function Tqf3ReviewPage({ params }) {
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
          // Session cookie writes are handled by the auth callback when required.
        }
      },
    },
  });

  const { data: session } = await supabase
    .from("document_preview_sessions")
    .select("document_preview_session_id,preview_status,bundle_snapshot,required_watermark,authoritative_export_allowed,target_format")
    .eq("document_preview_session_id", sessionId)
    .single();

  const { data: findings } = await supabase
    .from("document_preview_validation_findings")
    .select("document_preview_validation_finding_id,severity,finding_code,field_path,message,is_blocking,resolved")
    .eq("document_preview_session_id", sessionId)
    .order("is_blocking", { ascending: false });

  const { data: improvementItems } = await supabase
    .from("improvement_items")
    .select("improvement_item_id,category_code,provenance_status,issue_text,recommendation_text,action_plan_text,priority_code,item_status")
    .in("improvement_item_id", [
      "5b32721f-bf08-4c1d-8035-7a0f9137e635",
      "0348070a-1f92-4d56-a923-c858fd39503d",
    ]);

  const { data: mappingRows } = await supabase
    .from("working_mapping_proposals")
    .select("working_mapping_proposal_id,irm_level,rationale,governance_status,source_working_outcome_id,target_outcome_id")
    .eq("curriculum_course_id", "cce2ca98-d2c3-4e21-94fb-01a1fc88c4e4")
    .eq("mapping_kind", "CLO_TO_PLO")
    .neq("governance_status", "REJECTED");

  if (!session) {
    return (
      <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
        <h1>TQF3 Review Workspace</h1>
        <p>ไม่พบ review session นี้ หรือบัญชีปัจจุบันไม่มีสิทธิ์อ่านข้อมูล</p>
        <code>{sessionId}</code>
      </main>
    );
  }

  const bundle = session.bundle_snapshot || {};
  const content = bundle.content || {};
  const sections = content.form_sections || {};
  const clos = Array.isArray(sections.clos) ? sections.clos : [];
  const assessments = Array.isArray(sections.assessment_items) ? sections.assessment_items : [];
  const weeks = Array.isArray(sections.weekly_plan) ? sections.weekly_plan : [];
  const allFindings = Array.isArray(findings) ? findings : [];
  const blockingFindings = allFindings.filter((f) => f.is_blocking && !f.resolved);
  const improvements = Array.isArray(improvementItems) ? improvementItems : [];
  const mappings = Array.isArray(mappingRows) ? mappingRows : [];
  const mappingLabels = {
    "dae566ba-9332-48d7-bc6f-959ba7464eea": ["HED2503-CLO-P01", "PLO2"],
    "05a4af7e-c0fa-487c-8eec-2d5016691f12": ["HED2503-CLO-P01", "PLO3"],
    "9445898e-d2e9-4ed2-8daf-382ba02cc1d3": ["HED2503-CLO-P02", "PLO3"],
    "3409cd73-dc06-4d7a-a3be-b8d0a834ed39": ["HED2503-CLO-P03", "PLO2"],
    "577c2291-82f3-4f6b-8f00-ab0febe11195": ["HED2503-CLO-P03", "PLO5"],
    "8dd3c5d5-9b04-464b-8d07-f72134d7f51b": ["HED2503-CLO-P04", "PLO4"],
  };

  return (
    <main style={{ maxWidth: 1180, margin: "28px auto", padding: "0 20px 48px", fontFamily: "system-ui, sans-serif", color: "#0f172a" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>HEPE · TQF3 Human Review Workspace</div>
          <h1 style={{ margin: 0, fontSize: 30 }}>HED2503 · เพศวิถีศึกษา</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {badge(`Session ${session.document_preview_session_id.slice(0, 8)}…`)}
            {badge(session.preview_status, "warn")}
            {badge(content?.auto_generation?.status || "DESIGN_CANDIDATE")}
            {badge(session.required_watermark || "DRAFT", "warn")}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13, color: "#64748b" }}>
          <div>Version {bundle.version_no || "—"}</div>
          <div>{session.target_format}</div>
        </div>
      </header>

      <section style={{ padding: 18, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 14, marginBottom: 20 }}>
        <strong>Release Gate</strong>
        <p style={{ marginBottom: 8 }}>
          {blockingFindings.length > 0
            ? `ยังไม่สามารถ Submit for Review ได้ เพราะมี blocker ${blockingFindings.length} รายการ`
            : "ไม่พบ blocking validation finding"}
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
          <div key={label} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, background: "white" }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>CLO Candidate</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {clos.map((clo) => (
            <article key={clo.code} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{clo.code}</strong>
                {badge(clo.status || "PROVISIONAL", "warn")}
              </div>
              <p style={{ marginBottom: 6, lineHeight: 1.6 }}>{clo.description}</p>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Working outcome: {clo.working_outcome_code || "—"} · PLO: {clo.plo || "PENDING OFFICIAL SOURCE"}
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
                {["Assessment","Method","CLO","Weight","Evidence","Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, i) => (
                <tr key={i}>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.item}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.method}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.clos}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.weight}%</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{a.evidence}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{badge(a.status || "PROVISIONAL", "warn")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>15-week Teaching Plan</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {weeks.map((w) => (
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
          {allFindings.map((f) => (
            <article key={f.document_preview_validation_finding_id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <strong>{f.finding_code}</strong>
                {badge(f.is_blocking ? "BLOCKING" : f.severity, f.is_blocking ? "danger" : "ok")}
              </div>
              <div style={{ lineHeight: 1.5 }}>{f.message}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>{f.field_path || ""}</div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>CLO–PLO / I-R-M Human Review Gate</h2>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          Mapping ทุกแถวเป็น candidate จาก TQF3-MAPPING-11. Course-level review เปลี่ยนสถานะเป็น WORKING; Programme Review ต้องใช้สิทธิ์ A3 และจะเปลี่ยนเป็น PROGRAMME_REVIEWED. ไม่มี action ใดเลื่อนเป็น APPROVED_OPERATIONAL_USE อัตโนมัติ
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {mappings.map((m) => {
            const labels = mappingLabels[m.working_mapping_proposal_id] || ["CLO", "PLO"];
            return (
              <article key={m.working_mapping_proposal_id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, background: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <strong>{labels[0]} → {labels[1]} · {m.irm_level}</strong>
                  {badge(m.governance_status, m.governance_status === "PROGRAMME_REVIEWED" ? "ok" : "warn")}
                </div>
                <p style={{ lineHeight: 1.6 }}>{m.rationale}</p>
                <MappingReviewActions
                  mappingId={m.working_mapping_proposal_id}
                  status={m.governance_status}
                  irmLevel={m.irm_level}
                  rationale={m.rationale}
                />
              </article>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Blocker Resolution Workspace</h2>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          ส่วนนี้ใช้สำหรับเตรียมหลักฐานและการตัดสินใจของมนุษย์เท่านั้น ระบบจะไม่ทำเครื่องหมาย blocker ว่า resolved และจะไม่แก้ canonical curriculum data อัตโนมัติ
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          <article style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 16, background: "#f0fdf4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>OFFICIAL_PLO_SOURCE_MISSING</strong>
              {badge("RESOLVED", "ok")}
            </div>
            <p style={{ lineHeight: 1.6 }}>
              พบ PLO1–PLO7 ทางการแล้วในหมวดที่ 4 ของเอกสารหลักสูตร ศษ.บ. สุขศึกษาและพลศึกษา (ปรับปรุง พ.ศ. 2567)
            </p>
          </article>

          <article style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 16, background: "#f0fdf4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>CREDIT_PATTERN_CONFLICT</strong>
              {badge("RESOLVED", "ok")}
            </div>
            <p style={{ lineHeight: 1.6 }}>
              เอกสารหลักสูตรระบุ HED2503 = 3 (3-0-6) โดยตรง ส่วน 3 (2-2-5) เป็นของ HED2504 จึงปิด conflict นี้ได้
            </p>
          </article>

          <article style={{ border: "1px solid #fecaca", borderRadius: 14, padding: 16, background: "#fffafa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>CLO_PLO_IRM_MAPPING_AWAITING_HUMAN_REVIEW</strong>
              {badge("BLOCKING", "danger")}
            </div>
            <p style={{ lineHeight: 1.6 }}>
              มี mapping candidate แล้ว 6 ความสัมพันธ์ในสถานะ PROPOSED แต่ยังไม่ได้ผ่าน Human Academic Review/Programme Review
            </p>
            <div style={{ fontSize: 13, color: "#475569" }}>
              Next gate: authorized human review of mapping rationale and I-R-M level before Submit for Review
            </div>
          </article>
        </div>

        <h3 style={{ marginTop: 24 }}>Curriculum Improvement Register</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {improvements.map((item) => (
            <article key={item.improvement_item_id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <strong>{item.category_code}</strong>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {badge(item.item_status || "OPEN", "warn")}
                  {badge(item.provenance_status || "UNVERIFIED", "neutral")}
                  {badge(item.priority_code || "—", "neutral")}
                </div>
              </div>
              <p style={{ lineHeight: 1.6 }}>{item.issue_text}</p>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#475569" }}>
                <strong>Recommendation:</strong> {item.recommendation_text}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#475569", marginTop: 6 }}>
                <strong>Action plan:</strong> {item.action_plan_text}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
                Improvement item: {item.improvement_item_id}
              </div>
            </article>
          ))}
        </div>
      </section>

      <ReviewActions
        sessionId={session.document_preview_session_id}
        previewStatus={session.preview_status}
        blockerCount={blockingFindings.length}
        authoritativeExportAllowed={session.authoritative_export_allowed}
      />

      <footer style={{ marginTop: 32, color: "#64748b", fontSize: 12 }}>
        TQF3-MAPPING-12A · authority-aware Human Review Gate · Git integration reconnected · academic authority remains human-controlled
      </footer>
    </main>
  );
}
