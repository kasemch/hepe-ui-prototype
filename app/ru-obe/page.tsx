export default function RuObePilotPage() {
  const cards = [
    ["Programmes", "1 synthetic", "Working"],
    ["Courses", "1 synthetic", "Working"],
    ["Outcomes", "2 synthetic", "CANDIDATE"],
    ["Assessments", "1 synthetic", "CANDIDATE"],
  ];

  const gates = [
    "Activate real student/person-level data",
    "Production/public release",
  ];

  return (
    <main style={{fontFamily:"system-ui, sans-serif",maxWidth:1180,margin:"0 auto",padding:"32px 20px",color:"#172033"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:1.4,color:"#8A2D3C"}}>NON-PRODUCTION · CONTROLLED PILOT</div>
          <h1 style={{fontSize:34,margin:"8px 0"}}>RU OBE Copilot Module v2</h1>
          <p style={{margin:0,color:"#586174"}}>Academic Decision Workspace for OBE, assessment alignment, achievement, evidence and TQF preparation.</p>
        </div>
        <div style={{border:"1px solid #D8DEE8",borderRadius:12,padding:"12px 16px",minWidth:220}}>
          <div style={{fontSize:12,color:"#667085"}}>Production</div>
          <strong>LOCKED</strong>
          <div style={{fontSize:12,color:"#667085",marginTop:4}}>Real-data activation requires A5 Human Gate</div>
        </div>
      </div>

      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:28}}>
        {cards.map(([label,value,status]) => (
          <article key={label} style={{border:"1px solid #E3E7EE",borderRadius:14,padding:18}}>
            <div style={{fontSize:13,color:"#667085"}}>{label}</div>
            <div style={{fontSize:24,fontWeight:700,margin:"6px 0"}}>{value}</div>
            <div style={{fontSize:12}}>{status}</div>
          </article>
        ))}
      </section>

      <section style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <article style={{border:"1px solid #E3E7EE",borderRadius:14,padding:20}}>
          <h2 style={{marginTop:0}}>Synthetic acceptance</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><b>Structural findings</b><br/>0</div>
            <div><b>Achievement result</b><br/>80%</div>
            <div><b>Criterion</b><br/>MET</div>
            <div><b>Evidence status</b><br/>CANDIDATE</div>
          </div>
          <p style={{fontSize:13,color:"#667085",marginBottom:0}}>Synthetic fixture only. No real student data and no academic verification claim.</p>
        </article>

        <article style={{border:"1px solid #E3E7EE",borderRadius:14,padding:20}}>
          <h2 style={{marginTop:0}}>Human gates</h2>
          <ul style={{paddingLeft:20,marginBottom:0}}>
            {gates.map(g => <li key={g} style={{marginBottom:8}}>{g}</li>)}
          </ul>
        </article>
      </section>

      <section style={{marginTop:20,border:"1px solid #E3E7EE",borderRadius:14,padding:20}}>
        <h2 style={{marginTop:0}}>Workspace modules</h2>
        <p style={{marginBottom:0}}>Programme · Course · Outcome Mapping · Assessment Alignment · Achievement · Evidence · Verification · Improvement · TQF · Human Review · Decision Ledger · Audit · AI Copilot</p>
      </section>
    </main>
  );
}
