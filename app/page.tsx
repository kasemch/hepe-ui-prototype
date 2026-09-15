import { headers } from 'next/headers';

const tasks=[
 ['จัดทำ มคอ.3','วางแผนรายวิชา ผลลัพธ์การเรียนรู้ แผนสอน และการประเมิน','/tqf3','เริ่ม / ทำต่อ'],
 ['จัดทำ มคอ.5','สรุปผลการจัดการเรียนรู้และผลการประเมินรายวิชา','/tqf5','เปิดงาน'],
 ['ทวนสอบผลการเรียนรู้','ตรวจความสอดคล้องของผลลัพธ์ หลักฐาน และการประเมิน','/verification','เปิดงาน'],
 ['จัดทำ มคอ.7','สรุปผลระดับหลักสูตรและประเด็นเพื่อการพัฒนา','/tqf7','เปิดงาน'],
 ['ปรับปรุงรายวิชา','บันทึกสิ่งที่ควรปรับจากผลการสอนและการทวนสอบ','/course-review','เปิดงาน'],
 ['งานที่รออนุมัติ','ตรวจรายการที่ต้องใช้การตัดสินใจของผู้มีอำนาจทางวิชาการ','/approval','ดูรายการ']
];

async function isProductionRuntime(){
 const h=await headers();
 const host=(h.get('x-forwarded-host')??h.get('host')??'').split(':')[0].toLowerCase();
 return process.env.VERCEL_ENV==='production' || host==='hepe-ui-prototype.vercel.app' || host==='hepe-ui-prototype-kasemch-3467s-projects.vercel.app';
}

export default async function Home(){
 const isProduction=await isProductionRuntime();
 const environmentChip=isProduction?'Production':'Controlled Preview';
 return <main className="teacher-home">
 <header className="teacher-top"><div><div className="brand-kicker dark">HEPE · Curriculum Governance & Development</div><h1>งานหลักสูตรของฉัน</h1><p>เลือกงานที่ต้องการทำ ระบบจะพาไปทีละขั้น</p></div><div className="contexts"><span className="chip">ศษ.บ. สุขศึกษาและพลศึกษา</span><span className="chip">หลักสูตร 2567</span><span className="chip">{environmentChip}</span></div></header>
 {isProduction
  ? <div className="notice"><strong>ระบบใช้งานจริง · PRODUCTION</strong> — การดำเนินการที่มีผลต่อหลักสูตรยังอยู่ภายใต้สิทธิ์ บทบาท และ Human Approval ตาม Governance ของระบบ ข้อมูลจะเป็น Audit Evidence ได้ต่อเมื่อผ่านกระบวนการ Evidence Admission ที่กำหนด</div>
  : <div className="notice"><strong>รุ่นทดลองใช้งาน · NON-PRODUCTION</strong> — ใช้สำหรับ Preview/ทดสอบเท่านั้น ข้อมูลจากการทดลองไม่ถือเป็น Audit Evidence โดยอัตโนมัติ และไม่ถือเป็น Production Authorization</div>}
 <section className="welcome-card"><div><div className="eyebrow">เริ่มจากตรงนี้</div><h2>วันนี้ต้องการทำอะไร?</h2><p>ไม่จำเป็นต้องรู้โครงสร้างระบบ เลือกงานที่ต้องการ แล้วทำตามขั้นตอนที่แสดงบนหน้าจอ</p></div><a className="primary-action" href="/tqf3">เริ่มจัดทำ มคอ.3 →</a></section>
 <section aria-labelledby="my-work"><div className="home-section-head"><div><div className="eyebrow">MY WORK</div><h2 id="my-work">งานของฉัน</h2></div><p>เส้นทางงานหลักของผู้สอนและผู้รับผิดชอบหลักสูตร</p></div><div className="task-grid">{tasks.map(([title,desc,href,action],i)=><a className="task-card" href={href} key={title}><span className="task-number">{i+1}</span><div><h3>{title}</h3><p>{desc}</p><strong>{action} →</strong></div></a>)}</div></section>
 <section className="journey-card"><div className="home-section-head"><div><div className="eyebrow">WORKFLOW</div><h2>ระบบพาไปตามลำดับนี้</h2></div></div><div className="journey">{['มคอ.3','จัดการเรียนรู้','มคอ.5','ทวนสอบ','มคอ.7','ปรับปรุง','Human Approval'].map((x,i)=><div className="journey-step" key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div></section>
 <details className="advanced"><summary>ข้อมูลหลักสูตรและเครื่องมือขั้นสูง</summary><div className="advanced-links"><a href="/programme">ภาพรวมหลักสูตร</a><a href="/curriculum">โครงสร้างหลักสูตร</a><a href="/study-plan">แผนการศึกษา</a><a href="/traceability">PLO / รายวิชา</a><a href="/mapping">I-R-M</a><a href="/evidence">หลักฐาน</a><a href="/qa">QA / CPRR</a><a href="/governance">Governance</a></div></details>
 <footer className="footer-note">{isProduction?'HEPE Production · Human academic authority preserved · Evidence Admission remains governed':'HEPE Controlled Preview · Human academic authority preserved · NON-PRODUCTION'}</footer>
 </main>}
