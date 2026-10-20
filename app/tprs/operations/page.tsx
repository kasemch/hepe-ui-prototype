import Link from 'next/link';
import { readRealEplcOperational, assertRealEplcInvariants } from '../lib/eplc-operations';
import { readRealEvidence } from '../lib/real-evidence';

export const revalidate = 60;

export default async function OperationsPage() {
  const [participants, evidence] = await Promise.all([readRealEplcOperational(), readRealEvidence()]);
  if (!participants || !evidence) return <main style={{maxWidth:1100,margin:'0 auto',padding:24}}><h1>HEPE-TPRS Operations</h1><p>Trusted production data is temporarily unavailable. No synthetic fallback is used.</p></main>;
  assertRealEplcInvariants(participants);
  const evidenceCount = new Map<string, number>();
  for (const item of evidence) evidenceCount.set(item.participantReference, (evidenceCount.get(item.participantReference) ?? 0) + 1);
  return <main style={{maxWidth:1200,margin:'0 auto',padding:'28px 20px',fontFamily:'system-ui',color:'#0f172a'}}>
    <Link href="/tprs">Back to Dashboard</Link>
    <p>HEPE-TPRS · Minimum Usable Production Workspace · Read-only</p>
    <h1>Participant Operations</h1>
    <p>Real active cohort only. Recorded progress is not academic verification or clearance.</p>
    <div style={{overflowX:'auto'}}><table style={{width:'100%',minWidth:900}}><thead><tr><th>Participant</th><th>Recorded</th><th>Verified</th><th>PLC</th><th>Evidence</th></tr></thead><tbody>
      {participants.map(p => { const recorded=p.stages.reduce((n,s)=>n+s.recordedHours,0); const verified=p.stages.reduce((n,s)=>n+s.verifiedHours,0); return <tr key={p.participantReference}><td><b>{p.participantReference}</b></td><td>{recorded}/24</td><td>{verified}/24</td><td>{p.plcCycles.map(c=>`C${c.cycleNumber}:${c.state}`).join(' · ')}</td><td>{evidenceCount.get(p.participantReference) ?? 0}</td></tr>; })}
    </tbody></table></div>
    <p style={{marginTop:24}}>Evidence shown here is evidence already recorded in the trusted production store. This page cannot submit, verify, reject, or approve academic completion.</p>
  </main>;
}
