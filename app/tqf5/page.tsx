'use client';
import {useState} from 'react';

const lifecycle=[
 ['TQF3 eligible','ต้องอ้างอิง มคอ.3 ของ course offering เดียวกัน','DESIGN GATE'],
 ['Regular result','ผลรอบปกติ / grade evidence','UNVERIFIED UNTIL HUMAN CHECK'],
 ['QA reporting snapshot','snapshot ที่ใช้ตาม reporting cut-off','DESIGN CANDIDATE'],
 ['Makeup result','เก็บเป็น event แยก ไม่ overwrite ผลเดิม','DESIGN CANDIDATE'],
 ['Consolidated result','รวม regular + makeup ตาม controlled rule','CONTROLLED RULE REQUIRED'],
 ['Verification','ต้องระบุ result snapshot ที่ใช้','HUMAN / CONTROLLED']
];
const reportRows=[
 ['CLO attainment','NOT VERIFIED','Await controlled course-result evidence'],
 ['Learner result distribution','NOT VERIFIED','Await verified regular / makeup result dataset'],
 ['Plan deviation','SYNTHETIC / DEMO','Record variance from eligible มคอ.3'],
 ['Problems / constraints','SYNTHETIC / DEMO','Document observed implementation issues'],
 ['Improvement action','SYNTHETIC / DEMO','Human-authored corrective / development action']
];

export default function Tqf5(){
 const [gradeNote,setGradeNote]=useState('');
 const [confirmed,setConfirmed]=useState(false);
 return <main className="workspace"><div className="module-wrap">
  <a className="breadcrumb" href="/">← Academic Command Center</a>
  <section className="hero"><div className="brand-kicker">HEPE · TQF5 RESULT LIFECYCLE · NON-PRODUCTION</div><h1>มคอ.5 · Course Report & Result Consolidation</h1><p>เชื่อม มคอ.3 → การสอน → ผลรอบปกติ → QA reporting snapshot → ผลสอบซ่อม → consolidated result → การทวนสอบ โดยรักษา provenance และไม่ overwrite ผลเดิม.</p></section>
  <div className="notice">DESIGN CANDIDATE · NO STUDENT-GRADE DATABASE WRITE · IMAGE/OCR EXTRACTION NOT CONNECTED · HUMAN VERIFICATION REQUIRED · AUDIT EVIDENCE ADMISSION DISABLED</div>

  <div className="grid g2"><article className="card"><div className="label">Lifecycle prerequisite</div><h2 className="section-title">TQF3 → TQF5 gate</h2><div className="row"><span>Course offering</span><span className="status">BINDING REQUIRED</span></div><div className="row"><span>Eligible มคอ.3</span><span className="status">REQUIRED BEFORE TQF5</span></div><div className="row"><span>รายวิชา prepared but not offered</span><span className="status">NO TQF5 UNTIL OFFERED</span></div><p className="note">หน้านี้ยังไม่บังคับ gate ที่ฐานข้อมูล เพราะต้องเปิด schema/authority gate แยก.</p></article><article className="card"><div className="label">Reporting model</div><h2 className="section-title">Teaching Term ≠ Exam Cycle ≠ Reporting Period</h2><div className="row"><span>Teaching Term</span><span className="status">SOURCE TERM</span></div><div className="row"><span>Examination Cycle</span><span className="status">REGULAR / MAKEUP</span></div><div className="row"><span>QA reporting cut-off</span><span className="status">SEPARATE SNAPSHOT</span></div></article></div>

  <article className="card" style={{marginTop:14}}><div className="label">Result lifecycle</div><h2 className="section-title">มคอ.5 result-state architecture</h2>{lifecycle.map(([a,b,c])=><div className="row" key={a}><span><strong>{a}</strong><br/><span className="note">{b}</span></span><span className="status">{c}</span></div>)}</article>

  <div className="grid g2" style={{marginTop:14}}><article className="card"><div className="label">Grade Evidence Intake</div><h2 className="section-title">ภาพ/เอกสารผลการเรียน</h2><p className="note">รองรับในสถาปัตยกรรม: Camera / Image / PDF / Structured file. รุ่นนี้ยังไม่ส่งไฟล์ออกจาก browser และยังไม่ OCR.</p><label className="field">บันทึกคำอธิบายหลักฐาน DEMO<textarea rows={4} value={gradeNote} onChange={e=>{setGradeNote(e.target.value);setConfirmed(false)}} placeholder="เช่น เอกสารส่งเกรดรอบปกติ ภาค 1/2569 — DEMO only"/></label><div className="clo-actions"><button onClick={()=>setConfirmed(Boolean(gradeNote.trim()))} disabled={!gradeNote.trim()}>✓ ผู้ใช้ตรวจรายการ DEMO แล้ว</button></div><div className="row"><span>Extraction / OCR</span><span className="status">NOT CONNECTED</span></div><div className="row"><span>Human confirmation</span><span className="status">{confirmed?'DEMO CONFIRMED':'REQUIRED'}</span></div></article><article className="card"><div className="label">No-overwrite rule</div><h2 className="section-title">รักษาประวัติผลสอบ</h2>{[['Regular result','IMMUTABLE EVENT CANDIDATE'],['Makeup result','SEPARATE EVENT CANDIDATE'],['QA snapshot','HISTORICAL SNAPSHOT'],['Consolidated result','DERIVED SNAPSHOT'],['Underlying evidence','PROVENANCE REQUIRED']].map(([a,b])=><div className="row" key={a}><span>{a}</span><span className="status">{b}</span></div>)}</article></div>

  <article className="card" style={{marginTop:14}}><h2 className="section-title">Course implementation report</h2>{reportRows.map(([a,b,c])=><div className="row" key={a}><span><strong>{a}</strong><br/><span className="note">{c}</span></span><span className="status">{b}</span></div>)}</article>

  <div className="grid g3" style={{marginTop:14}}><a className="module-link" href="/tqf3">← มคอ.3 Workspace</a><a className="module-link" href="/verification">ทวนสอบผลการเรียนรู้ →</a><a className="module-link" href="/course-review">Curriculum Improvement →</a></div>
  <div className="firewall">LOCAL / SYNTHETIC UI ONLY · CANONICAL WRITE = DISABLED · STUDENT GRADE IMPORT = DISABLED · ACTIVATION = DISABLED · PUBLICATION = DISABLED · HUMAN AUTHORITY PRESERVED.</div>
 </div></main>
}
