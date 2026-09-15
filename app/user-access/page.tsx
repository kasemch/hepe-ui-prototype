const roles = [
  {name:"Instructor",scope:"Assigned courses",authority:"View · Edit · Submit"},
  {name:"Programme Chair",scope:"Assigned programme",authority:"Review · Scoped Approval"},
  {name:"Department Head",scope:"Department governance",authority:"Review · Governance Actions"},
  {name:"QA / Auditor",scope:"Assigned review scope",authority:"Read · Review · Finding"},
  {name:"System Admin",scope:"Identity / technical administration",authority:"IAM/System only; no academic authority by default"},
];

export default function UserAccessCenter() {
  return (
    <main style={{maxWidth:1100,margin:"36px auto",padding:24}}>
      <header style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,letterSpacing:".08em",color:"#475569"}}>HEPE · IAM-09B/09C</div>
          <h1 style={{margin:"6px 0"}}>User & Access Center</h1>
          <p style={{margin:0,color:"#64748b"}}>NON-PRODUCTION · SYNTHETIC-ONLY PREPARATION</p>
        </div>
        <div style={{padding:"9px 12px",borderRadius:999,background:"#eef2ff",fontWeight:700,color:"#3730a3"}}>No real users</div>
      </header>

      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginBottom:24}}>
        {[
          ["Users","Synthetic directory only"],["Pending Invitations","Disabled"],["Role & Scope","Contract preview"],
          ["Effective Permissions","Preview required"],["Access Review","Not executed"],["Audit History","Design-only"]
        ].map(([title,detail]) => (
          <article key={title} style={{background:"white",padding:18,borderRadius:16,border:"1px solid #e2e8f0"}}>
            <strong>{title}</strong><div style={{marginTop:6,color:"#64748b",fontSize:14}}>{detail}</div>
          </article>
        ))}
      </section>

      <section style={{background:"white",borderRadius:18,border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{padding:18,borderBottom:"1px solid #e2e8f0"}}><h2 style={{margin:0}}>Role / Scope / Authority Contract Preview</h2></div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
            <thead><tr style={{background:"#f8fafc",textAlign:"left"}}>
              {['Role','Default Scope','Default Authority'].map(h=><th key={h} style={{padding:14,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}
            </tr></thead>
            <tbody>{roles.map(r=><tr key={r.name}>
              <td style={{padding:14,borderBottom:"1px solid #f1f5f9",fontWeight:700}}>{r.name}</td>
              <td style={{padding:14,borderBottom:"1px solid #f1f5f9"}}>{r.scope}</td>
              <td style={{padding:14,borderBottom:"1px solid #f1f5f9"}}>{r.authority}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <section style={{marginTop:24,background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:16,padding:18}}>
        <strong>Critical governance rules</strong>
        <p style={{marginBottom:0,lineHeight:1.7}}>Authenticated ≠ Authorized · System Admin ≠ Academic Authority · Least Privilege · Scope-bound Access · RLS is the enforcement layer.</p>
      </section>
    </main>
  );
}
