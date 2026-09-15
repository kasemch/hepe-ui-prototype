const accessRows = [
  ["BED-HEPE-2567","Programme","View","ALLOW"],
  ["HED2503","Course","View · Edit · Submit","ALLOW"],
  ["Curriculum Baseline","Controlled baseline","View only","ALLOW"],
  ["Approval Queue","Academic approval","Approve","DENY"],
  ["User Administration","IAM","Manage users","DENY"],
];

export default function EffectiveAccessPreview() {
  return (
    <main style={{maxWidth:900,margin:"40px auto",padding:24}}>
      <section style={{background:"white",border:"1px solid #e2e8f0",borderRadius:18,padding:24}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:".08em",color:"#475569"}}>HEPE · IAM-09E</div>
        <h1 style={{marginBottom:8}}>Effective Access Preview</h1>
        <p style={{marginTop:0,color:"#64748b"}}>Synthetic persona: Instructor · No runtime authority granted</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,margin:"22px 0"}}>
          {[['Role','Instructor'],['Scope','BED-HEPE-2567 / HED2503'],['Identity','SYNTHETIC'],['Status','PREVIEW ONLY']].map(([k,v])=>(
            <div key={k} style={{background:"#f8fafc",borderRadius:12,padding:14}}><div style={{fontSize:12,color:"#64748b"}}>{k}</div><strong>{v}</strong></div>
          ))}
        </div>

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:650}}>
            <thead><tr style={{background:"#f8fafc",textAlign:"left"}}>{['Object','Scope Type','Requested Capability','Effective Result'].map(h=><th key={h} style={{padding:12,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
            <tbody>{accessRows.map(([obj,type,cap,result])=><tr key={obj}>
              <td style={{padding:12,borderBottom:"1px solid #f1f5f9",fontWeight:700}}>{obj}</td>
              <td style={{padding:12,borderBottom:"1px solid #f1f5f9"}}>{type}</td>
              <td style={{padding:12,borderBottom:"1px solid #f1f5f9"}}>{cap}</td>
              <td style={{padding:12,borderBottom:"1px solid #f1f5f9",fontWeight:700}}>{result}</td>
            </tr>)}</tbody>
          </table>
        </div>

        <div style={{marginTop:20,padding:16,borderRadius:12,background:"#f8fafc",color:"#475569"}}>
          Effective Access ต้องคำนวณจาก Identity + Role + Scope + Authority + Status/Validity และยืนยันซ้ำที่ RLS ก่อนอนุญาตการเข้าถึงข้อมูลจริง.
        </div>
      </section>
    </main>
  );
}
