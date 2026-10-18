import Link from 'next/link';
import { assertCohortInvariants, readCohortKpi, readCohortOperational } from '../lib/cohort-operations';

const card = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, background: '#fff' } as const;
const tone: Record<string, {bg:string;fg:string}> = {
  ACTIVE:{bg:'#dcfce7',fg:'#166534'},
  PENDING_VERIFICATION:{bg:'#fef3c7',fg:'#92400e'},
  BLOCKED:{bg:'#fee2e2',fg:'#991b1b'},
  UNRESOLVED:{bg:'#f1f5f9',fg:'#334155'},
};

export default async function CohortOperationsPage() {
  const [kpi, rows] = await Promise.all([readCohortKpi(), readCohortOperational()]);
  if (kpi && rows) assertCohortInvariants(kpi, rows);
  const configured = Boolean(kpi && rows);
  return <main style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'system-ui',color:'#0f172a'}}>
    <header style={{background:'#0f2f57',color:'#fff',padding:'18px 24px'}}><div style={{maxWidth:1280,margin:'0 auto',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}><div><strong style={{fontSize:22}}>HEPE-TPRS · Cohort Operations</strong><div style={{fontSize:13,opacity:.85}}>Privacy-safe operational read model</div></div><Link href="/tprs" style={{color:'#fff'}}>← Command Center</Link></div></header>
    <div style={{maxWidth:1280,margin:'0 auto',padding:'24px 20px'}}>
      <div style={{padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10,background:configured?'#ecfdf5':'#fff7ed',marginBottom:18,fontSize:13}}><b>Data source:</b> {configured?'Neon trusted cohort read model':'TPRS_DATABASE_URL not configured · no real cohort data rendered'}.</div>
      {kpi && rows ? <>
        <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:12,marginBottom:20}}>
          <article style={card}><small>Total cohort</small><div style={{fontSize:34,fontWeight:750}}>{kpi.total}</div></article>
          <article style={{...card,background:tone.ACTIVE.bg}}><small style={{color:tone.ACTIVE.fg}}>ACTIVE</small><div style={{fontSize:34,fontWeight:750,color:tone.ACTIVE.fg}}>{kpi.active}</div></article>
          <article style={{...card,background:tone.PENDING_VERIFICATION.bg}}><small style={{color:tone.PENDING_VERIFICATION.fg}}>PENDING VERIFICATION</small><div style={{fontSize:34,fontWeight:750,color:tone.PENDING_VERIFICATION.fg}}>{kpi.pendingVerification}</div></article>
          <article style={{...card,background:tone.BLOCKED.bg}}><small style={{color:tone.BLOCKED.fg}}>BLOCKED</small><div style={{fontSize:34,fontWeight:750,color:tone.BLOCKED.fg}}>{kpi.blocked}</div></article>
        </section>
        <section style={card}><h1 style={{marginTop:0}}>Operational cohort</h1><p style={{color:'#475569'}}>1 participant = 1 row. Summary view intentionally excludes national ID, phone and email.</p><div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:820}}><thead><tr>{['Ref','Source','Status','Data status','Study year','Entry year','Action'].map(h=><th key={h} style={{textAlign:'left',padding:10,borderBottom:'2px solid #cbd5e1'}}>{h}</th>)}</tr></thead><tbody>{rows.map(r=>{const t=tone[r.operationalStatus]??tone.UNRESOLVED;return <tr key={r.participantReference}><td style={{padding:10,borderBottom:'1px solid #e2e8f0',fontWeight:700}}>{r.participantReference}</td><td>{r.sourceNo}</td><td><span style={{padding:'4px 8px',borderRadius:12,background:t.bg,color:t.fg,fontWeight:700}}>{r.operationalStatus}</span></td><td>{r.participantStatus}</td><td>{r.studyYear ?? '—'}</td><td>{r.entryYearBe ?? '—'}</td><td>{r.operationalStatus==='ACTIVE'?'Track E-PLC':r.operationalStatus==='PENDING_VERIFICATION'?'Verify source/contact':'Governed review'}</td></tr>})}</tbody></table></div></section>
        <p style={{fontSize:13,color:'#64748b'}}>E-PLC completion, evidence and Financial Literacy criteria remain evidence-gated. This page does not infer completion.</p>
      </> : <section style={card}><h1>Real cohort data unavailable</h1><p>Configure the server-only TPRS database connection before controlled preview. Synthetic fixture fallback is intentionally disabled on this route.</p></section>}
    </div>
  </main>;
}
