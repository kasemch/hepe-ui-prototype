import Link from 'next/link';
import { syntheticStudents } from './lib/fixtures';
import { evaluateReadiness } from './lib/domain';
import { assertPersistenceInvariants, persistenceConfigured, readPersistentReadiness } from './lib/persistence';

const statusTone: Record<string, { bg: string; fg: string }> = {
  READY: { bg: '#dcfce7', fg: '#166534' }, REVIEW: { bg: '#fef3c7', fg: '#92400e' },
  HOLD: { bg: '#fee2e2', fg: '#991b1b' }, INCOMPLETE: { bg: '#ffe4e6', fg: '#9f1239' },
};
const card = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, background: '#fff' } as const;

export default async function TprsDashboard() {
  const persistent = await readPersistentReadiness();
  if (persistent) assertPersistenceInvariants(persistent);
  const persistedById = new Map((persistent ?? []).map(row => [row.learnerReference,row]));
  const rows = syntheticStudents.map(student => {
    const domain = evaluateReadiness(student);
    const stored = persistedById.get(student.id);
    return { student, result: stored ? {...domain,status:stored.systemStatus,clearanceStatus:stored.humanClearanceStatus==='APPROVED'?'APPROVED' as const:'PENDING' as const,reasons:stored.findings} : domain, persisted:stored };
  });
  const count = (status: string) => rows.filter(r => r.result.status === status).length;
  const total = rows.length;
  const ready = count('READY');
  const pendingEvidence = rows.filter(r => r.student.evidence === 'PENDING').length;
  const finlitAttention = rows.filter(r => r.student.financialLiteracy !== 'VERIFIED').length;
  const cycleAttention = rows.filter(r => (r.persisted?.completedCycles ?? r.student.plcCycles.filter(Boolean).length) < 3).length;
  const source = persistent ? 'NEON CONTROLLED-PILOT PERSISTENCE' : persistenceConfigured() ? 'PERSISTENCE ERROR' : 'FIXTURE FALLBACK · DB ENV NOT CONFIGURED';
  return <main style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'system-ui',color:'#0f172a'}}>
    <header style={{background:'#0f2f57',color:'#fff',padding:'18px 24px'}}><div style={{maxWidth:1280,margin:'0 auto',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}><div><strong style={{fontSize:22}}>HEPE-TPRS</strong><div style={{fontSize:13,opacity:.85}}>Teacher Professional Readiness System · Controlled Pilot</div></div><div style={{fontSize:13}}>SYNTHETIC DATA ONLY · Human Academic Authority</div></div></header>
    <div style={{maxWidth:1280,margin:'0 auto',padding:'24px 20px'}}>
      <div style={{padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10,background:persistent?'#ecfdf5':'#fff7ed',marginBottom:16,fontSize:13}}><b>Data source:</b> {source}. Fixture fallback is explicitly labelled and never represents production authority.</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:16,flexWrap:'wrap'}}><div><p style={{margin:0,color:'#64748b'}}>หลักสูตร ศษ.บ. สุขศึกษาและพลศึกษา</p><h1 style={{margin:'4px 0'}}>Student Readiness Command Center</h1><p style={{margin:0,color:'#475569'}}>Academic Progress ≠ Professional Readiness · Year Level ≠ Automatic Requirement Completion</p></div><nav style={{display:'flex',gap:10,flexWrap:'wrap'}}>{[['E-PLC','/tprs/eplc'],['FinLit','/tprs/financial-literacy'],['Requirements','/tprs/requirements'],['Evidence','/tprs/evidence'],['Verification','/tprs/verification'],['Exceptions','/tprs/exceptions'],['Clearance','/tprs/clearance'],['Reports','/tprs/reports'],['Audit','/tprs/audit']].map(([label,href])=><Link key={href} href={href} style={{padding:'8px 11px',border:'1px solid #cbd5e1',borderRadius:9,background:'#fff',textDecoration:'none',color:'#0f2f57'}}>{label}</Link>)}</nav></div>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,margin:'24px 0'}}><article style={card}><small>Requirement-applicable</small><div style={{fontSize:32,fontWeight:750}}>{total}</div></article>{['READY','REVIEW','HOLD','INCOMPLETE'].map(s=><article key={s} style={{...card,background:statusTone[s].bg}}><small style={{color:statusTone[s].fg,fontWeight:700}}>{s}</small><div style={{fontSize:32,fontWeight:750,color:statusTone[s].fg}}>{count(s)}</div><small>{Math.round(count(s)/total*100)}%</small></article>)}</section>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12,marginBottom:24}}><article style={card}><strong>System readiness</strong><div style={{fontSize:28,marginTop:8}}>{ready}/{total}</div><p style={{color:'#64748b',marginBottom:0}}>ผ่าน system checks; ไม่เท่ากับการอนุมัติฝึกปฏิบัติวิชาชีพ</p></article><article style={card}><strong>ประเด็นที่ต้องติดตาม</strong><p>Evidence pending <b>{pendingEvidence}</b></p><p>Financial Literacy attention <b>{finlitAttention}</b></p><p>PLC cycle attention <b>{cycleAttention}</b></p></article><article style={card}><strong>Pre-Practicum Gate</strong><p>E-PLC 4 stages → PLC 3 cycles → Financial Literacy → Evidence → System readiness → Human clearance</p><Link href="/tprs/clearance">เปิด Clearance Matrix →</Link></article></section>
      <section style={card}><h2 style={{marginTop:0}}>Student readiness matrix</h2><div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}><thead><tr>{['Student','Curriculum','Registration','E-PLC','PLC','FinLit','Evidence','System status','Human clearance'].map(h=><th key={h} style={{textAlign:'left',padding:10,borderBottom:'2px solid #cbd5e1',fontSize:13}}>{h}</th>)}</tr></thead><tbody>{rows.map(({student:s,result:r,persisted:p})=><tr key={s.id}><td style={{padding:10,borderBottom:'1px solid #e2e8f0'}}><Link href={`/tprs/students/${s.id}`} style={{fontWeight:700}}>{s.id}</Link><br/><small>{s.displayName}</small></td><td>{s.curriculumVersion}</td><td>{s.registrationStatus}</td><td>{p?.eplcHours ?? s.eplcHours.reduce((a,b)=>a+b,0)}/24 h</td><td>{p?.completedCycles ?? s.plcCycles.filter(Boolean).length}/3</td><td>{s.financialLiteracy}</td><td>{s.evidence}</td><td><span style={{display:'inline-block',padding:'4px 8px',borderRadius:12,background:statusTone[r.status].bg,color:statusTone[r.status].fg,fontWeight:700}}>{r.status}</span><br/><small>{r.reasons[0] || 'All system checks complete'}</small></td><td>{r.clearanceStatus}</td></tr>)}</tbody></table></div></section>
      <p style={{fontSize:13,color:'#64748b',marginTop:18}}>Financial Literacy authoritative criteria remain evidence-gated. No unverified criterion is treated as an official rule.</p>
    </div>
  </main>;
}
