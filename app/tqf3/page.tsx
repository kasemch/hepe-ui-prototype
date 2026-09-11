'use client';

import {useMemo,useState} from 'react';

const sections=[
 {id:'identity',label:'1. ข้อมูลรายวิชา',status:'CONTROLLED + DEMO'},
 {id:'clo',label:'2. CLO / PLO',status:'SYNTHETIC / DEMO'},
 {id:'weekly',label:'3. Weekly Plan',status:'SYNTHETIC / DEMO'},
 {id:'assessment',label:'4. Assessment',status:'SYNTHETIC / DEMO'},
 {id:'evidence',label:'5. Evidence',status:'DEMO LINK'},
 {id:'qa',label:'6. QA / Review',status:'READ-ONLY LINK'}
];

export default function Tqf3Workspace(){
 const [title,setTitle]=useState('รายวิชาตัวอย่างสำหรับทดลองกรอก มคอ.3');
 const [clo,setClo]=useState('ผู้เรียนสามารถอธิบายและประยุกต์สาระสำคัญของรายวิชาได้อย่างเหมาะสม');
 const [week,setWeek]=useState('อภิปรายกรณีศึกษาและกิจกรรมกลุ่ม');
 const [assessment,setAssessment]=useState('งานวิเคราะห์กรณีศึกษา');
 const [saved,setSaved]=useState(false);
 const completion=useMemo(()=>[title,clo,week,assessment].filter(v=>v.trim()).length*25,[title,clo,week,assessment]);
 function saveDemo(){
   try{localStorage.setItem('hepe-tqf3-demo',JSON.stringify({title,clo,week,assessment,savedAt:new Date().toISOString()}));}catch{}
   setSaved(true);
 }
 return <main className="shell">
  <aside className="sidebar">
   <div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Course<br/>Workspace</div><div className="env">NON-PRODUCTION</div>
   <nav className="nav sans" aria-label="TQF3 workspace sections">
    <a href="/">← Command Center</a>
    <a className="active" href="/tqf3">มคอ.3 Workspace</a>
    <a href="/curriculum">Curriculum</a><a href="/traceability">PLO / CLO</a><a href="/mapping">I-R-M</a><a href="#weekly">Weekly Plan</a><a href="#assessment">Assessment</a><a href="/evidence">Evidence</a><a href="/qa">QA / CPRR</a>
   </nav>
  </aside>
  <section className="workspace">
   <header className="topline"><div><div className="eyebrow">Course Specification · มคอ.3</div><h1 className="page-title">Synthetic มคอ.3 Workspace</h1></div><div className="contexts"><span className="chip">Programme · 25510071103503</span><span className="chip">Version · 2567-SOURCEB-VALIDATION</span><span className="chip">DEMO DRAFT</span></div></header>
   <div className="notice"><strong>NON-PRODUCTION / SYNTHETIC DEMO.</strong> ข้อมูลหลักสูตรที่แสดงเป็น controlled validation context; เนื้อหาที่กรอกในแบบฟอร์มนี้เป็นข้อมูลตัวอย่างและบันทึกเฉพาะใน browser ของผู้ใช้เท่านั้น — ไม่มีการเขียนลง canonical database และไม่ถือเป็น Audit Evidence.</div>

   <div className="grid g4 tqf-metrics">
    <article className="card"><div className="label">Controlled curriculum</div><div className="value">151</div><div className="note">credits</div></article>
    <article className="card"><div className="label">Controlled registry</div><div className="value">92</div><div className="note">courses</div></article>
    <article className="card"><div className="label">Programme outcomes</div><div className="value">7</div><div className="note">PLO</div></article>
    <article className="card"><div className="label">Demo completion</div><div className="value">{completion}%</div><div className="note">browser-only draft</div></article>
   </div>

   <div className="tqf-layout">
    <aside className="card tqf-index"><div className="label">มคอ.3 Sections</div>{sections.map(s=><a key={s.id} href={`#${s.id}`}><span>{s.label}</span><small>{s.status}</small></a>)}</aside>
    <div className="tqf-main">
      <section id="identity" className="card tqf-section"><div className="section-head"><div><div className="label">ส่วนที่ 1</div><h2>ข้อมูลรายวิชา</h2></div><span className="demo-badge">CONTROLLED CONTEXT + DEMO INPUT</span></div>
       <div className="form-grid"><label>หลักสูตร<input value="ศษ.บ. สุขศึกษาและพลศึกษา · Programme 25510071103503" readOnly/></label><label>Curriculum Version<input value="2567-SOURCEB-VALIDATION" readOnly/></label><label>รายวิชา DEMO<input value={title} onChange={e=>{setTitle(e.target.value);setSaved(false)}}/></label><label>สถานะ<input value="SYNTHETIC / DEMO · DRAFT" readOnly/></label></div>
       <p className="note">เลือกดูทะเบียนรายวิชาที่ตรวจสอบแล้วได้จาก <a href="/curriculum"><strong>Curriculum Structure →</strong></a></p>
      </section>

      <section id="clo" className="card tqf-section"><div className="section-head"><div><div className="label">ส่วนที่ 2</div><h2>CLO และการเชื่อมโยง PLO</h2></div><span className="demo-badge">SYNTHETIC / DEMO</span></div>
       <label className="field">CLO ตัวอย่าง<textarea rows={3} value={clo} onChange={e=>{setClo(e.target.value);setSaved(false)}}/></label>
       <div className="link-strip"><a href="/traceability">เปิด PLO / Course Traceability →</a><a href="/mapping">เปิด I-R-M Mapping →</a></div>
       <div className="firewall">ยังไม่มีการสร้าง CLO→PLO relationship ใน canonical registry จากข้อมูลตัวอย่างนี้ การ mapping ที่ผู้ใช้ทดลองในหน้านี้เป็นเพียง DEMO context.</div>
      </section>

      <section id="weekly" className="card tqf-section"><div className="section-head"><div><div className="label">ส่วนที่ 3</div><h2>Weekly Teaching Plan</h2></div><span className="demo-badge">SYNTHETIC / DEMO</span></div>
       <div className="table-wrap"><table><thead><tr><th>สัปดาห์</th><th>หัวข้อ/กิจกรรม</th><th>เชื่อม CLO</th><th>Evidence</th></tr></thead><tbody><tr><td>1</td><td><input aria-label="กิจกรรมสัปดาห์ที่ 1" value={week} onChange={e=>{setWeek(e.target.value);setSaved(false)}}/></td><td>DEMO-CLO-01</td><td><a href="/evidence">Attach evidence →</a></td></tr><tr><td>2</td><td><span className="muted-demo">SYNTHETIC / DEMO — เพิ่มหัวข้อภายหลัง</span></td><td>—</td><td>—</td></tr></tbody></table></div>
      </section>

      <section id="assessment" className="card tqf-section"><div className="section-head"><div><div className="label">ส่วนที่ 4</div><h2>Assessment Plan</h2></div><span className="demo-badge">SYNTHETIC / DEMO</span></div>
       <div className="form-grid"><label>วิธีประเมิน<input value={assessment} onChange={e=>{setAssessment(e.target.value);setSaved(false)}}/></label><label>เชื่อม CLO<input value="DEMO-CLO-01" readOnly/></label><label>น้ำหนัก (%)<input value="20" readOnly/></label><label>สถานะ<input value="DEMO ONLY" readOnly/></label></div>
       <div className="link-strip"><a href="/evidence">Evidence Explorer →</a><a href="/qa">QA / CPRR →</a></div>
      </section>

      <section id="evidence" className="card tqf-section"><div className="section-head"><div><div className="label">ส่วนที่ 5</div><h2>Evidence & Traceability</h2></div><span className="demo-badge">READ-ONLY LINKS</span></div>
       <div className="grid g3"><a className="module-link" href="/evidence">Evidence Explorer</a><a className="module-link" href="/traceability">PLO / Course Traceability</a><a className="module-link" href="/audit">Provenance</a></div>
      </section>

      <section id="qa" className="card tqf-section"><div className="section-head"><div><div className="label">ส่วนที่ 6</div><h2>QA / Review Handoff</h2></div><span className="demo-badge">NO APPROVAL ACTION</span></div>
       <p className="note">เมื่อระบบจริงมี controlled record เพียงพอ ส่วนนี้จะเชื่อม มคอ.3 → มคอ.5 → CLO Attainment → Course Review → QA/CPRR โดย Human Authority เป็นผู้ตัดสินใจ.</p>
       <div className="link-strip"><a href="/qa">เปิด QA / CPRR →</a><a href="/reviews">เปิด Review Queue →</a><a href="/governance">Governance →</a></div>
      </section>

      <div className="tqf-actions"><button type="button" onClick={saveDemo}>Save DEMO Draft in this browser</button><span className={saved?'save-state saved':'save-state'}>{saved?'บันทึก DEMO draft ใน browser แล้ว':'ยังไม่ได้บันทึก DEMO draft'}</span></div>
      <div className="firewall">SAVE TARGET = LOCAL BROWSER ONLY · CANONICAL DATABASE WRITE = DISABLED · ACTIVATION = DISABLED · PUBLICATION = DISABLED · AUDIT EVIDENCE ADMISSION = DISABLED.</div>
    </div>
   </div>
  </section>
 </main>
}
