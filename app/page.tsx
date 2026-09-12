const teacherModules = [
  ['pilot-entry','Quick Entry'],['teaching','Learning & Teaching'],['assessment','Assessment'],['plan-actual','Plan vs Actual'],['evidence','Evidence'],['tasks','Academic Tasks']
];

const governanceModules = [
  ['programme','Programme Overview'],['curriculum','Curriculum Overview'],['traceability','PLO / CLO Traceability'],['mapping','Curriculum Mapping / I-R-M'],['reviews','Review Queue'],['decisions','Approval / Decision Workspace'],['findings','Findings & Improvement'],['qa','QA / CPRR Readiness'],['ai','AI Advisory / Academic Intelligence'],['analytics','Analytics & Insights'],['calendar','Academic Calendar'],['audit','Provenance / Audit Trail'],['runtime','Runtime / Connector Health'],['outbox','Outbox Queue'],['reconciliation','Reconciliation Workspace'],['governance','System Governance / Gate Status'],['welcome','Welcome / Authentication Entry']
];

export default function Home(){
 return <main className="shell">
  <aside className="sidebar">
   <div className="brand-kicker">HEPE · TEACHER WORKSPACE</div><div className="brand">My Academic Workspace</div>
   <p className="brand-sub">งานสอนก่อน ระบบกำกับและหลักฐานทำงานอยู่ด้านหลัง</p><div className="env">● NON-PRODUCTION</div>
   <nav className="nav" aria-label="HEPE teacher navigation"><a className="active" href="/">My Workspace</a><div className="nav-group">งานประจำวัน</div>{teacherModules.map(([s,l])=><a key={s} href={`/${s}`}>{l}</a>)}<div className="nav-group">Programme & Governance</div>{governanceModules.slice(0,8).map(([s,l])=><a key={s} href={`/${s}`}>{l}</a>)}</nav>
  </aside>
  <section className="workspace">
   <header className="topline"><div><div className="eyebrow">HEPE Curriculum Governance & Development</div><h1 className="page-title">My Academic Workspace</h1><p className="page-subtitle">เปิดงานที่ต้องทำ บันทึกการสอน เพิ่มหลักฐาน และติดตามความก้าวหน้ารายวิชา โดยไม่ต้องเริ่มจากเมนู Governance</p></div><div className="contexts"><span className="chip">Academic Year · 2569</span><span className="chip">Environment · Synthetic Pilot</span></div></header>

   <section className="hero-modern" aria-labelledby="today-title"><div className="brand-kicker">WORK-FIRST · ONE ENTRY → MANY OUTPUTS</div><h2 id="today-title">วันนี้เริ่มงานจากตรงนี้</h2><p>ใช้ Quick Entry เพื่อบันทึกงานหลังสอน แล้วระบบนำข้อมูลเดียวกันไปใช้กับ Teaching Record, Evidence และ Plan vs Actual โดยคง Human Authority และ RLS เดิม</p><div className="hero-actions"><a className="button" href="/pilot-entry">บันทึกหลังสอน / Quick Entry</a><a className="button secondary" href="/teaching">เปิด Teaching Record</a><a className="button secondary" href="/plan-actual">ดู Plan vs Actual</a><a className="button secondary" href="/assessment">เปิด Assessment</a></div></section>

   <div className="notice">NON-PRODUCTION · SYNTHETIC TEST DATA ONLY · ข้อมูลที่ระบบมีแล้วไม่ควรถามผู้ใช้ซ้ำ · Production authorization not granted.</div>

   <section aria-label="Daily academic workflow" className="grid g4">{[
    ['Quick Entry','READY','บันทึกการสอนและหลักฐานจากงานประจำวัน'],
    ['Teaching Record','CONNECTED','อ่านกิจกรรม แผน และ delivery ภายใต้ RLS'],
    ['Assessment','CONNECTED','อ่าน assessment และ outcome links'],
    ['Plan vs Actual','CONNECTED','เปรียบเทียบแผนกับหลักฐานการสอนจริง']
   ].map(([a,b,c])=><article className="card interactive" key={a}><div className="label">{a}</div><div className="value">{b}</div><div className="note">{c}</div></article>)}</section>

   <div className="grid g2" style={{marginTop:14}}>
    <article className="card"><div className="eyebrow">60-Second After-Class Record</div><h2 className="section-title" style={{marginTop:6}}>บันทึกหลังสอนให้สั้นที่สุด</h2><p className="note">เลือกกิจกรรม → ระบุภาค/วันที่ → บันทึก ระบบบังคับ synthetic scope และ authority ที่ฐานข้อมูล ไม่สร้างช่อง bypass ใหม่</p><a className="button" href="/pilot-entry" style={{display:'inline-block',marginTop:12}}>เริ่มบันทึก</a></article>
    <article className="card"><div className="eyebrow">Course Continuity</div><h2 className="section-title" style={{marginTop:6}}>จาก Plan ไป Actual</h2><p className="note">Teaching Record และ Plan vs Actual ใช้ข้อมูลจากแหล่งเดียวกัน เพื่อเตรียมเส้นทางต่อไปสู่ Course Record, Verification และ มคอ.5 โดยไม่กรอกซ้ำ</p><a className="button secondary" href="/plan-actual" style={{display:'inline-block',marginTop:12}}>ตรวจความก้าวหน้า</a></article>
   </div>

   <section style={{marginTop:14}} aria-labelledby="workspaces-title"><div className="eyebrow">My workspaces</div><h2 className="section-title" id="workspaces-title" style={{marginTop:6}}>งานที่ใช้บ่อย</h2><div className="grid g3">{[
    ['Quick Entry','บันทึกการสอนจริงและหลักฐานการประเมินจากหน้าสั้น ๆ','pilot-entry'],
    ['Learning & Teaching','ดูแผน กิจกรรม CLO links และ delivery records','teaching'],
    ['Assessment','ดู assessment versions และ outcome alignment','assessment'],
    ['Plan vs Actual','ดูสิ่งที่วางแผนเทียบกับสิ่งที่มีหลักฐานการสอนจริง','plan-actual'],
    ['Evidence','ดู provenance และหลักฐานที่ระบบเชื่อมจากงานประจำ','evidence'],
    ['Academic Tasks','รวมงานที่ต้องทำหรือรอการดำเนินการ','tasks']
   ].map(([a,b,s])=><article className="card interactive" key={a}><span className="screen-tag">Teacher workspace</span><div className="value" style={{fontSize:17}}>{a}</div><p className="note">{b}</p><a className="note" href={`/${s}`} style={{display:'inline-block',marginTop:10,fontWeight:750,color:'var(--brand)'}}>Open →</a></article>)}</div></section>

   <article className="card" style={{marginTop:14}}><div className="eyebrow">Governance behind the scenes</div><h2 className="section-title" style={{marginTop:6}}>Programme / QA / Governance</h2><p className="note">เมนูด้านล่างยังคงอยู่สำหรับ Programme Chair, Reviewer และ QA แต่ไม่ควรเป็นจุดเริ่มต้นของผู้สอนในงานประจำวัน</p><div className="grid g4" style={{marginTop:12}}>{governanceModules.map(([s,l])=><a className="module-link" key={s} href={`/${s}`}>{l}</a>)}</div></article>

   <footer className="footer-note">HEPE USABLE-APP CLOSURE · Work-first · One Entry → Many Outputs · Human academic authority preserved · NON-PRODUCTION · TEST DATA ONLY.</footer>
  </section>
 </main>
}
