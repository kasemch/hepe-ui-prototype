export default function Home() {
  return (
    <main style={{maxWidth:820,margin:"40px auto",padding:24}}>
      <section style={{background:"white",borderRadius:18,padding:26,border:"1px solid #e2e8f0"}}>
        <h1 style={{marginBottom:6}}>HEPE · BED-HEPE</h1>
        <p><strong>Prototype · controlled non-production data · NON-PRODUCTION</strong></p>
        <h2>Academic Command Center</h2>
        <p>This controlled source package provides governance, IAM-preparation, course-equivalence, and authority-aware academic responsibility read surfaces.</p>
        <p>Academic responsibility remains separate from system authority. No production authorization is contained in this package.</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:24}}>
          <a href="/login" style={{padding:18,border:"1px solid #e2e8f0",borderRadius:14,textDecoration:"none",color:"inherit",background:"#f8fafc"}}>
            <strong>Login Preparation</strong><div style={{marginTop:6,color:"#64748b"}}>Controlled authentication preparation</div>
          </a>
          <a href="/user-access" style={{padding:18,border:"1px solid #e2e8f0",borderRadius:14,textDecoration:"none",color:"inherit",background:"#f8fafc"}}>
            <strong>User & Access Center</strong><div style={{marginTop:6,color:"#64748b"}}>Role · Scope · Authority preview</div>
          </a>
          <a href="/user-access/effective-access" style={{padding:18,border:"1px solid #e2e8f0",borderRadius:14,textDecoration:"none",color:"inherit",background:"#f8fafc"}}>
            <strong>Effective Access Preview</strong><div style={{marginTop:6,color:"#64748b"}}>Permission-resolution preview</div>
          </a>
          <a href="/governance/course-equivalence" style={{padding:18,border:"1px solid #bfdbfe",borderRadius:14,textDecoration:"none",color:"inherit",background:"#eff6ff"}}>
            <strong>Course Equivalence Decision</strong><div style={{marginTop:6,color:"#475569"}}>Controlled equivalence reconciliation</div>
          </a>
          <a href="/governance/responsibilities" style={{padding:18,border:"1px solid #bbf7d0",borderRadius:14,textDecoration:"none",color:"inherit",background:"#f0fdf4"}}>
            <strong>Academic Responsibility</strong><div style={{marginTop:6,color:"#475569"}}>01E · authority-aware current responsibility read surface</div>
          </a>
        </div>
      </section>
    </main>
  );
}
