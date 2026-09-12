const modules = [
  ['tqf3','มคอ.3 Course Workspace'],['tqf5','มคอ.5 Course Report'],['verification','Learning Outcome Verification'],['tqf7','มคอ.7 Programme Evaluation'],['course-review','Course Review & Improvement'],['approval','Human Approval Workflow'],['programme','Programme Overview'],['curriculum','Curriculum Structure'],['study-plan','Study Plan'],['traceability','PLO / Course Traceability'],['mapping','PLO × Course / I-R-M'],['evidence','Evidence Explorer'],['qa','QA / CPRR'],['reviews','Review Queue'],['calendar','Academic Tasks'],['audit','Provenance'],['ai','AI Advisory'],['governance','Settings / Governance']
];

const verified = [
  ['Programme','25510071103503'],['Curriculum','2567-SOURCEB-VALIDATION'],['Credits','151'],['Courses','92'],['Course Groups','16'],['Study Plan','54'],['PLO','7'],['I-R-M Pairs','99']
];

export default function Home(){
 return <main className="shell">
  <aside className="sidebar">
   <div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic<br/>Command Center</div><div className="env">NON-PRODUCTION</div>
   <nav className="nav sans" aria-label="HEPE modules"><a className="active" href="/">Command Center</a><a href="/tqf3">มคอ.3 Workspace</a><a href="/tqf5">มคอ.5</a><a href="/verification">ทวนสอบ</a><a href="/tqf7">มคอ.7</a><a href="/approval">Human Approval</a><a href="/pilot">Controlled Pilot</a>{modules.filter(([s])=>!['tqf3','tqf5','verification','tqf7','approval'].includes(s)).map(([s,l])=><a key={s} href={`/${s}`}>{l}</a>)}</nav>
  </aside>
  <section className="workspace">
   <header className="topline"><div><div className="eyebrow">Curriculum Governance & Development</div><h1 className="page-title">Academic Command Center</h1></div><div className="contexts"><span className="chip">Programme · BED-HEPE</span><span className="chip">Curriculum · 2567</span><span className="chip">Controlled Pilot</span></div></header>
   <div className="notice">NON-PRODUCTION · CONTROLLED VALIDATION · NOT ACTIVE · NOT PUBLISHED. Verified system/read-model values only; conversation and AI output are not Audit Evidence.</div>
   <article className="card" style={{marginBottom:14}}><div className="label">Academic workflow</div><h2 className="section-title" style={{marginTop:8}}>มคอ.3 → Assessment → มคอ.5 → ทวนสอบ → QA/CPRR → มคอ.7 → Improvement → Human Approval</h2><p className="note">Track B workspace chain. Missing evidence remains NOT VERIFIED / SYNTHETIC / DEMO; no canonical database write is exposed.</p><div className="grid g4" style={{marginTop:12}}><a className="module-link" href="/tqf3">มคอ.3 →</a><a className="module-link" href="/tqf5">มคอ.5 →</a><a className="module-link" href="/verification">ทวนสอบ →</a><a className="module-link" href="/tqf7">มคอ.7 →</a></div></article>
   <div className="grid g4">{verified.map(([a,b])=><article className="card" key={a}><div className="label">{a}</div><div className="value">{b}</div><div className="note">Source-B validation state</div></article>)}</div>
   <div className="grid g2" style={{marginTop:14}}><article className="card"><h2 className="section-title">Programme Health</h2>{[['Curriculum state','DRAFT / VALIDATION_ONLY'],['Canonical activation','NOT ATTEMPTED'],['Publication','NOT ATTEMPTED'],['Audit Evidence admission','NOT ATTEMPTED'],['Production','NOT TOUCHED']].map(([a,b])=><div className="row" key={a}><span>{a}</span><span className="status">{b}</span></div>)}</article><article className="card"><h2 className="section-title">Pilot Readiness</h2>{[['Ingestion foundation','PASS'],['Authenticated read / RLS','PASS'],['Curriculum Import Studio','PASS'],['Cross-programme denial','PASS'],['Track B academic workflow','IN PROGRESS']].map(([a,b])=><div className="row" key={a}><span>{a}</span><span className="status">{b}</span></div>)}</article></div>
   <div className="grid g3" style={{marginTop:14}}>{[['PLO / I-R-M','99 pairs · I9 / R72 / M18','mapping'],['Mapped Courses','78 of 92','traceability'],['QA Readiness','INSUFFICIENT VERIFIED EVIDENCE','qa'],['Evidence Admission','Human decision required','evidence'],['AI Advisory','Analyze / Explain / Compare only','ai'],['Gate Status','HEPE-PILOT-03 in progress','governance']].map(([a,b,s])=><article className="card" key={a}><div className="label">{a}</div><div className="value" style={{fontSize:17}}>{b}</div><a className="note" href={`/${s}`}>Open workspace →</a></article>)}</div>
   <article className="card" style={{marginTop:14}}><h2 className="section-title">Academic Workspaces</h2><div className="grid g4">{modules.map(([s,l])=><a className="module-link" key={s} href={`/${s}`}>{l}</a>)}</div></article>
   <footer className="footer-note">HEPE Curriculum Governance & Development · Evidence-first · Human academic authority preserved · NON-PRODUCTION.</footer>
  </section>
 </main>
}
