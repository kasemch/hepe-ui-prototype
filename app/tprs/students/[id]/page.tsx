import Link from 'next/link';
import { notFound } from 'next/navigation';
import { syntheticStudents } from '../../lib/fixtures';
import { evaluateReadiness, REQUIRED_EPLC_HOURS } from '../../lib/domain';

const card = {border:'1px solid #e2e8f0',borderRadius:16,padding:18,background:'#fff'} as const;
const tones: Record<string,{bg:string;fg:string}> = {READY:{bg:'#dcfce7',fg:'#166534'},REVIEW:{bg:'#fef3c7',fg:'#92400e'},HOLD:{bg:'#fee2e2',fg:'#991b1b'},INCOMPLETE:{bg:'#ffe4e6',fg:'#9f1239'}};

export default async function StudentPassport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = syntheticStudents.find(s => s.id === id);
  if (!student) notFound();
  const result = evaluateReadiness(student);
  const totalHours = student.eplcHours.reduce((a,b)=>a+b,0);
  const tone = tones[result.status];
  return <main style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'system-ui',color:'#0f172a'}}>
    <header style={{background:'#0f2f57',color:'#fff',padding:'16px 20px'}}><div style={{maxWidth:1120,margin:'0 auto',display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><strong>HEPE-TPRS · Professional Passport</strong><span style={{fontSize:13}}>SYNTHETIC DATA ONLY</span></div></header>
    <div style={{maxWidth:1120,margin:'0 auto',padding:'22px 20px'}}>
      <Link href="/tprs">← Student Readiness Command Center</Link>
      <section style={{...card,marginTop:18,display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',flexWrap:'wrap'}}><div><p style={{margin:0,color:'#64748b'}}>{student.id} · {student.entryCohort}</p><h1 style={{margin:'5px 0'}}>{student.displayName}</h1><p style={{margin:0}}>Curriculum {student.curriculumVersion} · Registration {student.registrationStatus}</p></div><div><span style={{padding:'8px 13px',borderRadius:20,background:tone.bg,color:tone.fg,fontWeight:800}}>{result.status}</span><p style={{margin:'9px 0 0',fontSize:13}}>Human clearance: <b>{result.clearanceStatus}</b></p></div></section>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,margin:'16px 0'}}><article style={card}><small>Academic progression</small><h3>{student.academicProgression}</h3><p style={{color:'#64748b'}}>ข้อมูลนี้ไม่ใช้แทน Professional Readiness</p></article><article style={card}><small>E-PLC total</small><h3>{totalHours}/24 ชั่วโมง</h3><p style={{color:'#64748b'}}>ต้องผ่านทั้งเกณฑ์รายช่วงและยอดรวม</p></article><article style={card}><small>PLC in Action</small><h3>{student.plcCycles.filter(Boolean).length}/3 cycles</h3><p style={{color:'#64748b'}}>Cycle 1–3 ตรวจแยกกัน</p></article><article style={card}><small>Financial Literacy</small><h3 style={{fontSize:16}}>{student.financialLiteracy}</h3><p style={{color:'#64748b'}}>เกณฑ์ authoritative ที่ยังไม่ยืนยันจะไม่ถูกสมมติ</p></article></section>
      <section style={card}><h2 style={{marginTop:0}}>E-PLC 4-stage progression</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>{student.eplcHours.map((h,i)=>{const complete=h>=REQUIRED_EPLC_HOURS[i];return <article key={i} style={{border:'1px solid #e2e8f0',borderRadius:12,padding:14}}><small>ช่วงที่ {i+1}</small><div style={{fontSize:25,fontWeight:750}}>{h}/{REQUIRED_EPLC_HOURS[i]} h</div><span style={{color:complete?'#166534':'#991b1b',fontWeight:700}}>{complete?'COMPLETE':'INCOMPLETE'}</span></article>})}</div></section>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginTop:16}}><article style={card}><h2 style={{marginTop:0}}>PLC Cycles</h2>{student.plcCycles.map((v,i)=><p key={i}>Cycle {i+1}: <b style={{color:v?'#166534':'#991b1b'}}>{v?'COMPLETE':'INCOMPLETE'}</b></p>)}</article><article style={card}><h2 style={{marginTop:0}}>Evidence & verification</h2><p>Current evidence state: <b>{student.evidence}</b></p><Link href="/tprs/evidence">เปิด Evidence Vault →</Link><br/><br/><Link href="/tprs/verification">เปิด Verification Queue →</Link></article></section>
      <section style={{...card,marginTop:16}}><h2 style={{marginTop:0}}>Readiness findings & next action</h2>{result.reasons.length ? <ul>{result.reasons.map(reason=><li key={reason} style={{marginBottom:8}}><code>{reason}</code></li>)}</ul> : <p style={{color:'#166534',fontWeight:700}}>All system checks complete.</p>}<p><strong>System status:</strong> {result.status} · <strong>Human Academic Clearance:</strong> {result.clearanceStatus}</p><p style={{marginBottom:0,color:'#64748b'}}>System READY ไม่ใช่การอนุมัติสิทธิฝึกปฏิบัติวิชาชีพโดยอัตโนมัติ การอนุมัติขั้นสุดท้ายเป็นอำนาจของผู้มีอำนาจทางวิชาการ</p></section>
    </div>
  </main>;
}
