import { notFound } from 'next/navigation';
import { syntheticStudents } from '../../lib/fixtures';
import { evaluateReadiness, REQUIRED_EPLC_HOURS } from '../../lib/domain';

export default async function StudentPassport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = syntheticStudents.find(s => s.id === id);
  if (!student) notFound();
  const result = evaluateReadiness(student);
  return <main style={{maxWidth:960,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
    <a href="/tprs">← Dashboard</a><p>Professional Passport · Synthetic data</p>
    <h1>{student.displayName} <small>({student.id})</small></h1>
    <p>Entry cohort: {student.entryCohort} · Curriculum: {student.curriculumVersion} · Registration: {student.registrationStatus}</p>
    <h2>Professional readiness: {result.status}</h2>
    <p>{result.reasons.join(', ') || 'All system checks complete'}</p>
    <h2>E-PLC progression</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>{student.eplcHours.map((h,i)=><article key={i} style={{border:'1px solid #ddd',padding:14,borderRadius:10}}><strong>Stage {i+1}</strong><div>{h} / {REQUIRED_EPLC_HOURS[i]} h</div><small>{h >= REQUIRED_EPLC_HOURS[i] ? 'Complete' : 'Incomplete'}</small></article>)}</div>
    <h2>E-PLC in Action</h2><p>{student.plcCycles.map((v,i)=>`Cycle ${i+1}: ${v?'Complete':'Incomplete'}`).join(' · ')}</p>
    <h2>Financial Literacy</h2><p>{student.financialLiteracy}</p>
    <h2>Evidence & verification</h2><p>{student.evidence}</p>
    <h2>Academic progression</h2><p>{student.academicProgression}</p>
    <p><strong>Invariant:</strong> Academic progression does not automatically determine professional readiness.</p>
  </main>;
}
