const modules = [
  ['curriculum','Curriculum Overview'],['traceability','PLO / CLO Traceability'],['mapping','Curriculum Mapping / I-R-M'],['reviews','Review Queue'],['decisions','Approval / Decision Workspace'],['evidence','Evidence Explorer'],['findings','Findings & Improvement'],['qa','QA Readiness'],['calendar','Academic Calendar / Tasks'],['audit','Provenance / Audit Trail'],['runtime','Runtime / Connector Health'],['outbox','Outbox Queue'],['reconciliation','Reconciliation Workspace'],['governance','System Governance / Gate Status']
];

const cardStyle = {background:'#ffffff',border:'1px solid #e5e7eb',borderRadius:16,padding:18,boxShadow:'0 8px 24px rgba(15,23,42,.04)'} as const;

export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#f4f7fb',color:'#172033'}}>
      <div style={{display:'grid',gridTemplateColumns:'260px minmax(0,1fr)',minHeight:'100vh'}}>
        <aside style={{background:'#0f2747',color:'white',padding:24,position:'sticky',top:0,height:'100vh',boxSizing:'border-box'}}>
          <div style={{fontSize:13,opacity:.75,letterSpacing:1}}>HEPE · BED-HEPE</div>
          <h1 style={{fontSize:22,margin:'8px 0 4px'}}>Academic Command Center</h1>
          <div style={{fontSize:12,background:'#163b69',display:'inline-block',padding:'6px 10px',borderRadius:999,marginBottom:24}}>NON-PRODUCTION</div>
          <nav style={{display:'grid',gap:8}}>
            <a href="/" style={{color:'white',textDecoration:'none',padding:'10px 12px',background:'#214f82',borderRadius:10}}>Command Center</a>
            {modules.map(([slug,label]) => <a key={slug} href={`/${slug}`} style={{color:'#dbe8f7',textDecoration:'none',padding:'8px 12px',fontSize:14}}>{label}</a>)}
          </nav>
        </aside>

        <section style={{padding:'24px 30px 40px'}}>
          <header style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',marginBottom:22}}>
            <div>
              <div style={{fontSize:13,color:'#64748b'}}>Curriculum Governance & Development</div>
              <h2 style={{fontSize:30,margin:'4px 0 0'}}>Programme Command Center</h2>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'flex-end'}}>
              {['Academic Year: 2569','Programme: BED-HEPE','Curriculum: 2567'].map(x => <span key={x} style={{background:'white',border:'1px solid #dbe2ea',borderRadius:10,padding:'9px 12px',fontSize:13}}>{x}</span>)}
            </div>
          </header>

          <div style={{background:'#fff7e6',border:'1px solid #f5d48a',borderRadius:12,padding:'12px 14px',marginBottom:18,fontSize:14}}>
            Preview uses controlled baseline and verified system status only. Unverified operational metrics are shown as “Not yet verified”.
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:14,marginBottom:18}}>
            {[
              ['Governance Foundation','CONTROLLED','Foundation / REL-01 / REL-02'],
              ['Persistence & RLS','VERIFIED','REL-02A closed'],
              ['Application Runtime','PENDING','REL-03 not yet verified'],
              ['Preview Website','IN PROGRESS','HEPE-WEB-01']
            ].map(([title,status,note]) => <div key={title} style={cardStyle}><div style={{fontSize:13,color:'#64748b'}}>{title}</div><div style={{fontSize:20,fontWeight:700,margin:'8px 0'}}>{status}</div><div style={{fontSize:12,color:'#64748b'}}>{note}</div></div>)}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:18,marginBottom:18}}>
            <div style={cardStyle}>
              <h3 style={{marginTop:0}}>Programme Readiness</h3>
              {[['Curriculum baseline','Controlled'],['Evidence governance','Controlled'],['Authority / RLS','Verified'],['Durable outbox persistence','Verified foundation'],['Application runtime binding','Not yet verified']].map(([k,v]) => <div key={k} style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #eef2f7',padding:'12px 0',fontSize:14}}><span>{k}</span><strong>{v}</strong></div>)}
            </div>
            <div style={cardStyle}>
              <h3 style={{marginTop:0}}>Gate Status</h3>
              {[['REL-01','PASS'],['REL-02','PASS'],['REL-02A','PASS + documented repair'],['REL-03','PENDING'],['WEB-01','ACTIVE']].map(([k,v]) => <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',fontSize:14}}><span>{k}</span><strong>{v}</strong></div>)}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:14,marginBottom:18}}>
            {[
              ['Pending Reviews','Not yet verified','Open Review Queue'],
              ['Evidence Completeness','Not yet verified','Open Evidence Explorer'],
              ['QA Readiness','Not yet verified','Open QA Readiness'],
              ['Connector Health','Foundation ready','Open Runtime Health'],
              ['Outbox Queue','Runtime binding pending','Open Outbox Queue'],
              ['Findings / Improvement','Not yet verified','Open Findings']
            ].map(([a,b,c]) => <div key={a} style={cardStyle}><div style={{fontWeight:700}}>{a}</div><div style={{fontSize:14,color:'#64748b',margin:'10px 0 14px'}}>{b}</div><div style={{fontSize:12,color:'#2b5d93'}}>{c} →</div></div>)}
          </div>

          <div style={cardStyle}>
            <h3 style={{marginTop:0}}>Core HEPE Modules</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10}}>
              {modules.map(([slug,label]) => <a key={slug} href={`/${slug}`} style={{border:'1px solid #e5e7eb',borderRadius:12,padding:14,textDecoration:'none',color:'#183b63',background:'#f9fbfd'}}>{label}</a>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
