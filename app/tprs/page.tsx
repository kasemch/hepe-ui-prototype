import Link from 'next/link';
import { syntheticStudents } from './lib/fixtures';
import { evaluateReadiness } from './lib/domain';

export default function TprsDashboard() {
  const rows = syntheticStudents.map(student => ({ student, result: evaluateReadiness(student) }));
  const count = (status: string) => rows.filter(r => r.result.status === status).length;
  return <main style={{maxWidth:1200,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
    <p style={{margin:0,color:'#555'}}>HEPE · Ramkhamhaeng University · Non-production prototype</p><h1>Teacher Professional Readiness</h1>
    <p>ติดตามความพร้อมตามเส้นทางจริงของนักศึกษาในบริบทตลาดวิชา โดยแยก Academic Progression ออกจาก Professional Readiness</p>
    <nav style={{display:'flex',gap:16,flexWrap:'wrap',margin:'20px 0'}}><Link href="/tprs/requirements">Requirement Registry</Link><Link href="/tprs/exceptions">Exceptions</Link><Link href="/tprs/clearance">Clearance Matrix</Link></nav>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,margin:'24px 0'}}>{['READY','REVIEW','HOLD','INCOMPLETE'].map(s=><article key={s} style={{border:'1px solid #ddd',borderRadius:12,padding:16}}><strong>{s}</strong><div style={{fontSize:32}}>{count(s)}</div></article>)}</section>
    <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr>{['Student','Cohort','Curriculum','Registration','Academic progression','E-PLC','PLC','FinLit','Evidence','Status / reason'].map(h=><th key={h} style={{textAlign:'left',padding:10,borderBottom:'2px solid #222'}}>{h}</th>)}</tr></thead><tbody>{rows.map(({student:s,result:r})=><tr key={s.id}><td style={{padding:10,borderBottom:'1px solid #ddd'}}><Link href={`/tprs/students/${s.id}`}>{s.id}</Link></td><td>{s.entryCohort}</td><td>{s.curriculumVersion}</td><td>{s.registrationStatus}</td><td>{s.academicProgression}</td><td>{s.eplcHours.join('+')} = {s.eplcHours.reduce((a,b)=>a+b,0)}h</td><td>{s.plcCycles.filter(Boolean).length}/3</td><td>{s.financialLiteracy}</td><td>{s.evidence}</td><td><strong>{r.status}</strong><br/><small>{r.reasons.join(', ') || 'All system checks complete'}</small></td></tr>)}</tbody></table></div>
    <p style={{marginTop:24,fontSize:14,color:'#555'}}>Synthetic data only · Financial Literacy authoritative rule remains evidence-gated · Final clearance remains Human Academic Authority.</p>
  </main>;
}
