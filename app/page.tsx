const modules = [
  ['curriculum','Curriculum Overview'],['traceability','PLO / CLO Traceability'],['mapping','Curriculum Mapping / I-R-M'],['reviews','Review Queue'],['decisions','Approval / Decision Workspace'],['evidence','Evidence Explorer'],['findings','Findings & Improvement'],['qa','QA Readiness'],['calendar','Academic Calendar / Tasks'],['audit','Provenance / Audit Trail'],['runtime','Runtime / Connector Health'],['outbox','Outbox Queue'],['reconciliation','Reconciliation Workspace'],['governance','System Governance / Gate Status']
];

export default function Home(){
 return <main className="shell">
  <aside className="sidebar">
   <div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic<br/>Command Center</div><div className="env">NON-PRODUCTION</div>
   <nav className="nav sans" aria-label="HEPE modules"><a className="active" href="/">Command Center</a>{modules.map(([s,l])=><a key={s} href={`/${s}`}>{l}</a>)}</nav>
  </aside>
  <section className="workspace">
   <header className="topline"><div><div className="eyebrow">Curriculum Governance & Development</div><h1 className="page-title">Programme Command Center</h1></div><div className="contexts"><span className="chip">Academic Year · 2569</span><span className="chip">Programme · BED-HEPE</span><span className="chip">Curriculum · 2567</span></div></header>
   <div className="notice">Evidence-first preview — controlled baseline and verified system status only. Operational values without verified provenance remain explicitly marked as “Not yet verified”.</div>
   <div className="grid g4">{[['Governance Foundation','CONTROLLED','Foundation / REL-01 / REL-02'],['Persistence & RLS','VERIFIED','REL-02A closed'],['Application Runtime','PENDING','REL-03 not yet verified'],['Preview Website','ACTIVE','WEB-01 protected preview']].map(([a,b,c])=><article className="card" key={a}><div className="label">{a}</div><div className="value">{b}</div><div className="note">{c}</div></article>)}</div>
   <div className="grid g2" style={{marginTop:14}}><article className="card"><h2 className="section-title">Programme Readiness</h2>{[['Curriculum baseline','Controlled'],['Evidence governance','Controlled'],['Authority / RLS','Verified'],['Durable outbox persistence','Verified foundation'],['Application runtime binding','Not yet verified']].map(([a,b])=><div className="row" key={a}><span>{a}</span><span className="status">{b}</span></div>)}</article><article className="card"><h2 className="section-title">Governance Gate Register</h2>{[['REL-01','PASS'],['REL-02','PASS'],['REL-02A','PASS + documented repair'],['REL-03','PENDING'],['WEB-01','ACTIVE']].map(([a,b])=><div className="row" key={a}><span>{a}</span><span className="status">{b}</span></div>)}</article></div>
   <div className="grid g3" style={{marginTop:14}}>{[['Pending Reviews','Not yet verified','reviews'],['Evidence Completeness','Not yet verified','evidence'],['QA Readiness','Not yet verified','qa'],['Connector Health','Foundation ready','runtime'],['Outbox Queue','Runtime binding pending','outbox'],['Findings / Improvement','Not yet verified','findings']].map(([a,b,s])=><article className="card" key={a}><div className="label">{a}</div><div className="value" style={{fontSize:17}}>{b}</div><a className="note" href={`/${s}`}>Open workspace →</a></article>)}</div>
   <article className="card" style={{marginTop:14}}><h2 className="section-title">Academic Workspaces</h2><div className="grid g4">{modules.map(([s,l])=><a className="module-link" key={s} href={`/${s}`}>{l}</a>)}</div></article>
   <footer className="footer-note">HEPE Curriculum Governance & Development · Evidence-first academic workspace · NON-PRODUCTION · Production authorization not granted.</footer>
  </section>
 </main>
}
