const actions=[
 ['มคอ.3','จัดทำหรือทำต่อแผนรายวิชา','/tqf3'],
 ['มคอ.5','สรุปผลการจัดการเรียนรู้','/tqf5'],
 ['การทวนสอบ','เปิดงานทวนสอบผลการเรียนรู้','/verification'],
 ['ข้อเสนอปรับปรุง','เปิด Curriculum Improvement Hub','/course-review'],
 ['งานรออนุมัติ','ดู Human Review / Approval Queue','/approval'],
 ['เอกสารและการพิมพ์','เตรียม Preview / Print / Export Center','/evidence'],
 ['Support Center','แจ้งปัญหา ติดตามการแก้ไข และดู Known Issues','/support']
];
const timeline=['Instructor Assignment','มคอ.3','Teaching','Assessment','มคอ.5','Verification','Improvement'];
const calendar=[
 ['ต้นภาค','จัดทำ/ตรวจ มคอ.3','UPCOMING'],
 ['ระหว่างภาค','Weekly plan · Assessment · Evidence','PLANNED'],
 ['ปลายภาค','จัดทำ มคอ.5','PLANNED'],
 ['หลังประกาศผล','ทวนสอบและสรุปข้อเสนอปรับปรุง','PLANNED']
];

export default function Home(){return <main className="academic-command">
 <header className="command-top"><div><div className="brand-kicker dark">HEPE · Adaptive Academic Command Center</div><h1>พื้นที่ทำงานวิชาการของฉัน</h1><p>หน้าแรกจะปรับข้อมูลตามบทบาท สิทธิ ภาคการศึกษา และรายวิชาที่ได้รับมอบหมาย</p></div><div className="contexts"><span className="chip">Instructor View · PILOT</span><span className="chip">NON-PRODUCTION</span></div></header>
 <div className="notice"><strong>CONTROLLED PILOT</strong> หน้านี้เป็นโครงสร้าง UX สำหรับ UAT ยังไม่มี real-user assignment, canonical write, production authority หรือ Audit Evidence admission.</div>

 <section className="command-hero"><div><div className="eyebrow">MY ACADEMIC WORKSPACE</div><h2>เริ่มจากงานที่ต้องทำ ไม่ต้องไล่หาเมนู</h2><p>เมื่อ Course Offering + Instructor Assignment ถูกผูกใน controlled workflow ระบบจะแสดงเฉพาะรายละเอียดวิชาที่ผู้ใช้รับผิดชอบ ส่วนวิชาอื่นจะแสดงเพียงสถานะตามสิทธิ</p></div><a className="primary-action" href="/tqf3">เปิด มคอ.3 →</a></section>

 <section className="command-grid command-grid-4" aria-label="สถานะงานส่วนตัว"><article className="metric-card"><span>วิชาที่รับผิดชอบ</span><strong>—</strong><small>รอ controlled assignment binding</small></article><article className="metric-card"><span>มคอ.3 ที่ต้องดำเนินการ</span><strong>—</strong><small>คำนวณจาก Course Offering</small></article><article className="metric-card"><span>มคอ.5 / ทวนสอบ</span><strong>—</strong><small>เปิดตาม lifecycle gate</small></article><article className="metric-card"><span>งานใกล้ครบกำหนด</span><strong>—</strong><small>เชื่อม Academic Calendar</small></article></section>

 <section className="command-grid command-grid-2"><article className="command-panel"><div className="panel-head"><div><div className="eyebrow">MY WORK</div><h2>งานของฉัน</h2></div><span className="status-pill">ACTION FIRST</span></div><div className="action-list">{actions.map(([title,desc,href])=><a href={href} key={title}><div><strong>{title}</strong><span>{desc}</span></div><b>เปิด →</b></a>)}</div></article>
 <article className="command-panel"><div className="panel-head"><div><div className="eyebrow">ACADEMIC CALENDAR</div><h2>ปฏิทินงานวิชาการ</h2></div><span className="status-pill">SOURCE-AWARE</span></div><div className="calendar-stack">{calendar.map(([when,title,status])=><div className="calendar-row" key={when}><span>{when}</span><div><strong>{title}</strong><small>{status}</small></div></div>)}</div><p className="panel-note">รุ่นถัดไปจะผูก University Academic Calendar + Programme Calendar + My Tasks และคำนวณ Upcoming / Due Soon / Overdue / Blocked</p></article></section>

 <section className="command-panel course-area"><div className="panel-head"><div><div className="eyebrow">MY COURSES</div><h2>รายวิชาที่รับผิดชอบและสถานะเอกสาร</h2></div><a href="/programme">ดูภาพรวมตามสิทธิ →</a></div><div className="empty-assignment"><strong>ยังไม่แสดงรายวิชาเพื่อหลีกเลี่ยงการสมมติ assignment</strong><p>เมื่อมี controlled instructor assignment ระบบจะแสดงเฉพาะรายละเอียดรายวิชาของผู้ใช้ พร้อม มคอ.3 / มคอ.5 / Verification / Print / Timeline ส่วนรายวิชาอื่นจะแสดงเฉพาะสถานะที่ policy อนุญาต</p></div></section>

 <section className="command-grid command-grid-2"><article className="command-panel"><div className="panel-head"><div><div className="eyebrow">COURSE TIMELINE</div><h2>วงจรของรายวิชา</h2></div></div><div className="timeline-row">{timeline.map((x,i)=><div className="timeline-node" key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div><p className="panel-note">แต่ละจุดจะมีเวลา ผู้ดำเนินการ เวอร์ชัน และสถานะ โดยการ export เอกสารไม่ถือเป็น Audit Evidence โดยอัตโนมัติ</p></article>
 <article className="command-panel"><div className="panel-head"><div><div className="eyebrow">VISIBILITY & OVERSIGHT</div><h2>มุมมองตามบทบาท</h2></div></div><div className="role-lines"><div><strong>Instructor</strong><span>ดูเนื้อหาเฉพาะวิชาของตน · เห็น status ของวิชาอื่นตามสิทธิ</span></div><div><strong>Programme Chair</strong><span>เห็นทุกวิชาในหลักสูตร · ติดตาม completion / overdue / improvement</span></div><div><strong>Department Head</strong><span>เห็นทุกหลักสูตรในภาควิชา · oversight และ escalation</span></div><div><strong>Pilot Super User</strong><span>support scope แบบชั่วคราว · elevated access ต้องแสดงชัด</span></div></div></article></section>

 <section className="command-grid command-grid-3"><a className="insight-card" href="/course-review"><div className="eyebrow">IMPROVEMENT</div><h3>Curriculum Improvement Hub</h3><p>แยก recommendation, action plan, owner, due date และผลการนำไปใช้</p></a><a className="insight-card" href="/verification"><div className="eyebrow">QUALITY</div><h3>Verification Overview</h3><p>รองรับวิธีทวนสอบต่างกันแต่สรุปรวมระดับหลักสูตร/ภาควิชาได้</p></a><a className="insight-card" href="/support"><div className="eyebrow">SUPPORT</div><h3>Support & Issue Resolution</h3><p>แจ้งปัญหาและติดตาม resolution โดยแยก Ticket ออกจาก Finding, Evidence และ Canonical Change</p></a></section>

 <details className="advanced"><summary>ข้อมูลหลักสูตรและเครื่องมือขั้นสูง</summary><div className="advanced-links"><a href="/programme">ภาพรวมหลักสูตร</a><a href="/curriculum">โครงสร้างหลักสูตร</a><a href="/study-plan">แผนการศึกษา</a><a href="/traceability">PLO / รายวิชา</a><a href="/mapping">I-R-M</a><a href="/evidence">หลักฐาน</a><a href="/qa">QA / CPRR</a><a href="/governance">Governance</a><a href="/support">Support Center</a></div></details>
 <footer className="footer-note">HEPE-ACADEMIC-WORKFLOW-03 + HEPE-SUPPORT-01 · Human authority preserved · NON-PRODUCTION</footer>
 </main>}
