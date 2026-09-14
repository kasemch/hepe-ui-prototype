const sectionStyle = {
  padding: 18,
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  background: "#ffffff",
} as const;

const termStyle = {
  fontWeight: 700,
  color: "#0f172a",
} as const;

export default function HelpCenterPage() {
  return (
    <main style={{ maxWidth: 1040, margin: "32px auto", padding: 24 }}>
      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#475569", fontWeight: 700 }}>HEPE · HELP CENTER · NON-PRODUCTION</div>
            <h1 style={{ margin: "6px 0" }}>Help Center</h1>
            <p style={{ margin: 0, color: "#475569", maxWidth: 820 }}>
              Guidance for the verified HEPE runtime surfaces on this controlled Preview baseline. This page explains what the system currently shows and what key governance labels mean; it does not create authority, approve curriculum data, or admit Audit Evidence.
            </p>
          </div>
          <a href="/" style={{ alignSelf: "flex-start", color: "#1d4ed8" }}>← Command Center</a>
        </div>

        <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa", color: "#7c2d12" }}>
          <strong>NON-PRODUCTION:</strong> information shown here belongs to the controlled pilot environment. It is not Production Authorization and is not automatically Audit Evidence.
        </div>

        <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>1. What is the Command Center?</h2>
            <p>The Command Center is the entry point to runtime surfaces that have been verified on the current HEPE baseline. Cards marked <span style={termStyle}>AVAILABLE</span> have a bound route. <span style={termStyle}>AUTHORITY GATED</span> means the route exists but actions or data depend on the authenticated authority scope. <span style={termStyle}>READ MODEL NOT AVAILABLE</span> means the integrated surface has not yet been verified and is intentionally not simulated.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>2. Current vs Historical responsibility</h2>
            <p><span style={termStyle}>Current</span> shows responsibility records that the temporal read model treats as currently effective. <span style={termStyle}>Timeline / Historical</span> preserves prior append-only records and provenance. Historical data is not overwritten merely because a newer state exists.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>3. What does ROSTER_PENDING mean?</h2>
            <p><span style={termStyle}>ROSTER_PENDING</span> means the system has verified that a remaining teaching-team roster is not yet resolved in the controlled data. It does not authorize the system to guess, infer, or create additional instructors.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>4. What does “No current record” mean?</h2>
            <p>This is a recording-coverage state. It means no verified current academic-responsibility record is present in the system for the selected period. It does <strong>not</strong> prove that no instructor or responsible person exists in reality.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>5. What is a Reconciliation condition?</h2>
            <p>A reconciliation condition is a verified system condition that requires controlled follow-up because records do not fully align or a source is incomplete. It is not automatically a Formal Finding, approval request, or Audit Evidence item.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>6. Academic Responsibility vs System Authority</h2>
            <p><span style={termStyle}>Academic Responsibility</span> describes teaching or programme responsibility supported by controlled records. <span style={termStyle}>System Authority</span> controls what an authenticated actor may read or change. Academic responsibility never creates system authority automatically.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>7. Evidence Candidate / NOT_ADMITTED</h2>
            <p>An <span style={termStyle}>Evidence Candidate</span> is a record prepared for possible evidence governance. <span style={termStyle}>NOT_ADMITTED</span> means it has not entered the Audit Evidence Set. Conversation, draft UI content, AI summaries, and ordinary development output are not Audit Evidence by themselves.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>8. Where to find responsibility information</h2>
            <p>Use <a href="/governance/responsibilities">Academic Responsibility</a> for current/timeline/provenance, <a href="/governance/responsibility-coverage">Responsibility Coverage</a> for period-aware recording coverage, and <a href="/governance/reconciliation">Reconciliation Queue</a> for verified conditions that still require reconciliation.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>9. Why can two users see different data?</h2>
            <p>Protected HEPE reads are authority-aware. The authenticated identity, actor binding, authority level, programme/course scope, and route contract determine visible information. A zero-row result for an unauthorized identity is expected fail-closed behavior and does not imply that the underlying dataset is empty.</p>
          </article>

          <article style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>10. Known controlled-pilot limitations</h2>
            <ul style={{ marginBottom: 0, paddingLeft: 22 }}>
              <li>Some modules remain marked READ MODEL NOT AVAILABLE until a verified integrated surface is bound.</li>
              <li>Open reconciliation conditions remain unresolved until controlled source or verified system evidence supports resolution.</li>
              <li>The current environment is NON-PRODUCTION and must not be treated as a production release.</li>
            </ul>
          </article>
        </div>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid #e2e8f0", color: "#64748b", fontSize: 12 }}>
          HEPE Curriculum Governance & Development · Controlled NON-PRODUCTION Help Center · Evidence-first / fail-closed.
        </div>
      </section>
    </main>
  );
}
