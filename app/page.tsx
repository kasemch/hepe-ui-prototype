const summaryCards = [
  { label: "Programme", value: "1", detail: "BED-HEPE pilot scope" },
  { label: "PLOs", value: "7", detail: "Local presentation summary" },
  { label: "Governance", value: "Controlled", detail: "Human production gate preserved" },
  { label: "Evidence", value: "Read-only", detail: "No evidence mutation in this pilot" },
];

const pendingItems = [
  "Confirm Google AI Studio ↔ GitHub binding for this branch",
  "Verify required GitHub branch protection before production readiness",
  "Run preview regression after UI deployment completes",
];

const sectionStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 22,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
};

export default function Home() {
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 20px 56px" }}>
      <header style={{ ...sectionStyle, padding: 28, background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
        <div style={{ display: "flex", gap: 18, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: ".08em", color: "#475569" }}>
              HEPE · CURRICULUM GOVERNANCE & DEVELOPMENT
            </p>
            <h1 style={{ margin: "8px 0 6px", fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.08 }}>
              Academic Command Center
            </h1>
            <p style={{ margin: 0, maxWidth: 760, color: "#475569", lineHeight: 1.7 }}>
              Controlled read-only pilot for programme visibility, curriculum traceability, governance status,
              evidence awareness, and next-action clarity.
            </p>
          </div>
          <div role="status" aria-label="Environment status" style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: 999, background: "#fef3c7", color: "#92400e", fontWeight: 700, fontSize: 13 }}>
            NON-PRODUCTION · READ-ONLY PILOT
          </div>
        </div>
      </header>

      <section aria-labelledby="overview-heading" style={{ marginTop: 22 }}>
        <h2 id="overview-heading" style={{ fontSize: 20, margin: "0 0 12px" }}>Programme overview</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
          {summaryCards.map((card) => (
            <article key={card.label} style={{ ...sectionStyle, minHeight: 132 }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: 13, fontWeight: 700 }}>{card.label}</p>
              <p style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 800 }}>{card.value}</p>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.55 }}>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <article style={sectionStyle} aria-labelledby="programme-heading">
          <h2 id="programme-heading" style={{ marginTop: 0, fontSize: 20 }}>Programme status</h2>
          <div style={{ padding: 16, borderRadius: 14, background: "#f8fafc" }}>
            <p style={{ margin: 0, fontWeight: 800 }}>BED-HEPE-2567</p>
            <p style={{ margin: "6px 0", lineHeight: 1.55 }}>ศึกษาศาสตรบัณฑิต สาขาวิชาสุขศึกษาและพลศึกษา</p>
            <p style={{ margin: "8px 0", color: "#0f766e", fontWeight: 700 }}>Active · NON-PRODUCTION VIEW</p>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.55 }}>Pilot programme context only — this page does not grant or alter academic authority.</p>
          </div>
        </article>

        <article style={sectionStyle} aria-labelledby="traceability-heading">
          <h2 id="traceability-heading" style={{ marginTop: 0, fontSize: 20 }}>Curriculum traceability</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {["PLO ↔ Courses", "Course ↔ CLO", "CLO ↔ PLO", "I-R-M progression"].map((label) => (
              <div key={label} style={{ display: "flex", gap: 16, justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, background: "#f8fafc" }}>
                <strong>{label}</strong>
                <span style={{ color: "#64748b", textAlign: "right" }}>Prepared for read-only view</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <article style={sectionStyle} aria-labelledby="evidence-heading">
          <h2 id="evidence-heading" style={{ marginTop: 0, fontSize: 20 }}>Evidence & governance</h2>
          <p style={{ color: "#475569", lineHeight: 1.65 }}>No production evidence is created, edited, approved, or signed from this pilot. Existing GitHub, Vercel, Supabase, and human authority boundaries remain unchanged.</p>
          <div style={{ padding: 14, borderRadius: 12, background: "#ecfdf5", color: "#166534", fontWeight: 700 }}>Read-only boundary preserved</div>
        </article>

        <article style={sectionStyle} aria-labelledby="actions-heading">
          <h2 id="actions-heading" style={{ marginTop: 0, fontSize: 20 }}>Pending actions</h2>
          <ol style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.75 }}>
            {pendingItems.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </article>
      </section>

      <footer style={{ marginTop: 22, color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
        HEPE controlled prototype · synthetic/local presentation only · no real-user provisioning, email delivery, production authorization, database migration, or RLS modification.
      </footer>
    </main>
  );
}
