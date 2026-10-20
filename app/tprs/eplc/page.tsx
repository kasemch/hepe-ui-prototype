import Link from 'next/link';
import { REQUIRED_EPLC_HOURS } from '../lib/domain';
import { assertRealEplcInvariants, readRealEplcOperational } from '../lib/eplc-operations';

export const revalidate = 60;

export default async function EplcWorkspace(){
 const totalRequired=REQUIRED_EPLC_HOURS.reduce((a,b)=>a+b,0);
 const participants=await readRealEplcOperational();
 if(!participants) return <main><Link href="/tprs">Back</Link><h1>E-PLC Operational Workspace</h1><p>Trusted operational data is unavailable. No synthetic fallback is shown.</p></main>;
 assertRealEplcInvariants(participants);
 return <main style={{maxWidth:1200,margin:'0 auto',padding:'28px 20px',fontFamily:'system-ui',color:'#0f172a'}}><Link href="/tprs">Back to Dashboard</Link><p>HEPE-TPRS · Trusted operational read model · Privacy-safe</p><h1>E-PLC 4-Year Operational Workspace</h1><p>Displays recorded operational progress without inferring completion, certification, or professional readiness.</p><section>{REQUIRED_EPLC_HOURS.map((h,i)=><article key={i}><b>Stage {i+1}: {h} hours</b></article>)}<article><b>Total requirement: {totalRequired} hours</b></article></section><div style={{overflowX:'auto'}}><table style={{width:'100%',minWidth:1000}}><thead><tr>{['Participant','Stage 1','Stage 2','Stage 3','Stage 4','Recorded','Verified','PLC cycles'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{participants.map(p=>{const stages=[...p.stages].sort((a,b)=>a.sequenceNo-b.sequenceNo);const recorded=stages.reduce((a,s)=>a+s.recordedHours,0);const verified=stages.reduce((a,s)=>a+s.verifiedHours,0);return <tr key={p.participantReference}><td><b>{p.participantReference}</b></td>{stages.map(s=><td key={s.stageCode}>{s.recordedHours}/{s.requiredHours}<small> verified {s.verifiedHours} · {s.state}</small></td>)}<td><b>{recorded}/{totalRequired}</b></td><td><b>{verified}/{totalRequired}</b></td><td>{p.plcCycles.map(c=>`C${c.cycleNumber}:${c.state}`).join(' · ')}</td></tr>})}</tbody></table></div><p>Recorded hours are not verified hours. Human Academic Clearance is not automated.</p></main>;
}
