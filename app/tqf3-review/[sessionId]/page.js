export default async function Tqf3ReviewPage({ params }) {
  const { sessionId } = await params;

  return (
    <main style={{ maxWidth: 960, margin: "32px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontSize: 13, color: "#64748b" }}>HEPE · TQF3 Human Review Workspace</div>
      <h1>HED2503 · เพศวิถีศึกษา</h1>
      <p><strong>DRAFT / UNDER HUMAN REVIEW</strong></p>
      <p>Diagnostic preview shell for review session <code>{sessionId}</code>.</p>

      <section style={{ padding: 16, border: "1px solid #fecaca", borderRadius: 12, background: "#fff7f7" }}>
        <strong>Release Gate</strong>
        <p>Controlled export remains locked while official PLO source and credit-pattern conflict are unresolved.</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Human Review Actions</h2>
        <button disabled>Accept</button>{" "}
        <button disabled>Edit</button>{" "}
        <button disabled>Reject</button>{" "}
        <button disabled>Request Evidence</button>{" "}
        <button disabled>Export DOCX / PDF · LOCKED</button>
      </section>

      <footer style={{ marginTop: 32, color: "#64748b", fontSize: 12 }}>
        TQF3-UI-08B diagnostic shell · no authority mutation
      </footer>
    </main>
  );
}
