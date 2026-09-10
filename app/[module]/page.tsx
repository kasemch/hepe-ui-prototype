import { notFound } from 'next/navigation';

const moduleData: Record<string,{title:string,description:string,status:string,items:string[]}> = {
  curriculum:{title:'Curriculum Overview',description:'Programme structure, curriculum version and controlled academic baseline.',status:'CONTROLLED BASELINE AVAILABLE',items:['Programme structure','Curriculum version','Course registry','Programme outcomes']},
  traceability:{title:'PLO / CLO Traceability',description:'Trace academic outcomes through curriculum and course-level relationships.',status:'READ-MODEL FOUNDATION',items:['PLO registry','CLO registry','CLO → PLO links','Evidence trace']},
  mapping:{title:'Curriculum Mapping / I-R-M',description:'Inspect curriculum mapping and Introduce–Reinforce–Master relationships.',status:'READ-MODEL FOUNDATION',items:['PLO × Course','PLO × I-R-M','Course × CLO','Mapping provenance']},
  reviews:{title:'Review Queue',description:'Authority-aware academic review work queue.',status:'DATA NOT YET VERIFIED FOR PREVIEW',items:['Pending review','Reviewer scope','Due status','Decision readiness']},
  decisions:{title:'Approval / Decision Workspace',description:'Human-governed academic decision workspace.',status:'HUMAN AUTHORITY REQUIRED',items:['Decision context','Evidence bundle','Conflict-of-interest status','Decision provenance']},
  evidence:{title:'Evidence Explorer',description:'Evidence-first registry with provenance and admissibility status.',status:'CONTROLLED EVIDENCE MODEL',items:['Evidence type','Source / version','Authority / owner','Verification status']},
  findings:{title:'Findings & Improvement',description:'Formal findings, reconciliation and improvement tracking.',status:'NO VERIFIED OPEN COUNT DISPLAYED',items:['Findings register','Reconciliation items','Corrective action','Closure evidence']},
  qa:{title:'QA Readiness',description:'Quality assurance readiness without fabricated scores.',status:'METRICS NOT YET VERIFIED',items:['AUN-QA readiness','Regulatory evidence','Evidence completeness','Improvement readiness']},
  calendar:{title:'Academic Calendar / Tasks',description:'Academic milestones and controlled task visibility.',status:'CALENDAR INTEGRATION NOT VERIFIED BY WEB-01',items:['Academic milestones','Review deadlines','Programme tasks','Upcoming governance gates']},
  audit:{title:'Provenance / Audit Trail',description:'Trace controlled records, decisions and verified system evidence.',status:'EVIDENCE-FIRST',items:['Correlation ID','Source version','Authority','Verification status']},
  runtime:{title:'Runtime / Connector Health',description:'Operational reliability foundation and runtime readiness.',status:'REL-03 APPLICATION BINDING PENDING',items:['Connector health','Circuit state','Last verified attempt','Runtime binding']},
  outbox:{title:'Outbox Queue',description:'Durable connector command persistence foundation.',status:'REL-02A VERIFIED FOUNDATION',items:['Queued command state','Idempotency key','Authority revalidation','Expiry / disposition']},
  reconciliation:{title:'Reconciliation Workspace',description:'Human-governed resolution for ambiguous or conflicting connector states.',status:'FOUNDATION READY / LIVE RUNTIME PENDING',items:['Open reconciliation','Destination verification','Authority reconfirm','Resolution evidence']},
  governance:{title:'System Governance / Gate Status',description:'Controlled HEPE architecture and gate posture.',status:'NON-PRODUCTION',items:['REL-01 controlled','REL-02 controlled','REL-02A controlled','REL-03 pending','WEB-01 active']}
};

export function generateStaticParams(){ return Object.keys(moduleData).map(module => ({module})); }

export default async function ModulePage({params}:{params:Promise<{module:string}>}){
  const {module} = await params;
  const data = moduleData[module];
  if(!data) notFound();
  return <main style={{minHeight:'100vh',background:'#f4f7fb',padding:30,fontFamily:'system-ui,sans-serif',color:'#172033'}}>
    <div style={{maxWidth:1100,margin:'0 auto'}}>
      <a href="/" style={{textDecoration:'none',color:'#245b91'}}>← Academic Command Center</a>
      <div style={{marginTop:18,background:'#0f2747',color:'white',borderRadius:18,padding:28}}>
        <div style={{fontSize:12,opacity:.8,letterSpacing:1}}>HEPE · BED-HEPE · NON-PRODUCTION</div>
        <h1 style={{margin:'8px 0',fontSize:32}}>{data.title}</h1>
        <p style={{margin:0,maxWidth:760,color:'#dbe8f7'}}>{data.description}</p>
      </div>
      <div style={{margin:'18px 0',display:'inline-block',padding:'8px 12px',borderRadius:999,background:'#fff7e6',border:'1px solid #f5d48a',fontWeight:700,fontSize:13}}>{data.status}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:14}}>
        {data.items.map(item => <section key={item} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:16,padding:20}}><h2 style={{fontSize:18,marginTop:0}}>{item}</h2><p style={{color:'#64748b',fontSize:14,marginBottom:0}}>No unverified metric is presented as fact in this preview. Authoritative data will be bound when the corresponding runtime/read model is verified.</p></section>)}
      </div>
      <div style={{marginTop:18,padding:16,border:'1px solid #dbe2ea',background:'white',borderRadius:14,fontSize:13,color:'#526174'}}>Environment firewall: NON-PRODUCTION only · No Production authorization · No real external connector write · No real-user authority change.</div>
    </div>
  </main>;
}
