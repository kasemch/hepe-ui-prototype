export default function Home() {
  return (
    <main style={{maxWidth:820,margin:"40px auto",padding:24,background:"white",borderRadius:16}}>
      <h1>HEPE · BED-HEPE</h1>
      <p><strong>Prototype · synthetic data · NON-PRODUCTION</strong></p>
      <h2>Academic Command Center</h2>
      <p>This canonicalized source package preserves the HEPE prototype identity while adding a controlled authentication callback route.</p>
      <p>No real-user provisioning, email delivery, or production authorization is contained in this package.</p>

      <section style={{marginTop:28,padding:18,border:"1px solid #e2e8f0",borderRadius:14}}>
        <h3 style={{marginTop:0}}>TQF3 Human Review Pilot</h3>
        <p>HED2503 · มคอ.3 v8 · DRAFT / DESIGN_CANDIDATE</p>
        <a
          href="/tqf3-review/8c29c180-7b42-4da7-ae32-663287866dc2"
          style={{display:"inline-block",padding:"10px 14px",background:"#0f172a",color:"white",borderRadius:10,textDecoration:"none",fontWeight:700}}
        >
          Open TQF3 Review Workspace
        </a>
        <p style={{color:"#64748b",fontSize:13}}>
          Human review actions are authority-gated. Controlled export remains locked while blocking findings are unresolved.
        </p>
      </section>
    </main>
  );
}
