import { notFound } from 'next/navigation';
import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

const moduleData:Record<string,{title:string,description:string,status:string,items:string[]}>= {
programme:{title:'Programme Overview',description:'Executive academic view of programme identity, curriculum version, governance posture and controlled academic context.',status:'CONTROLLED PROGRAMME CONTEXT',items:['Programme identity','Curriculum version','Academic governance posture','Controlled programme context']},
curriculum:{title:'Curriculum Overview',description:'Programme structure, curriculum version and controlled academic baseline.',status:'WEB-02 CONTROLLED READ BINDING',items:['Programme structure','Curriculum version','Course registry','Programme outcomes']},
traceability:{title:'PLO / CLO Traceability',description:'Trace academic outcomes through controlled curriculum and course-level relationships.',status:'WEB-02 CONTROLLED READ BINDING',items:['PLO registry','CLO registry','CLO → PLO links','Mapping provenance']},
mapping:{title:'Curriculum Mapping / I-R-M',description:'Inspect RLS-scoped CLO→PLO mapping versions and Introduce–Reinforce–Master semantics without inferred curriculum data.',status:'WEB-02 CONTROLLED READ BINDING',items:['CLO → PLO','PLO × Course via controlled CLO/course relationship','Course × CLO','I-R-M mapping provenance']},
reviews:{title:'Review Queue',description:'Authority-aware academic review work queue.',status:'REL-03 AUTHENTICATED READ BINDING',items:['Pending review','Reviewer scope','Due status','Decision readiness']},
decisions:{title:'Approval / Decision Workspace',description:'Human-governed academic decision workspace.',status:'HUMAN AUTHORITY REQUIRED',items:['Decision context','Evidence bundle','Conflict-of-interest status','Decision provenance']},
evidence:{title:'Evidence Management + AI Assistance',description:'Evidence-first registry with controlled verification/sufficiency status and explicit provenance gaps.',status:'WEB-02 PROVENANCE-AWARE READ',items:['Evidence identity/type','Version/effective period','Verification and sufficiency','Provenance fields not exposed remain NOT YET VERIFIED']},
findings:{title:'Findings & Improvement',description:'Formal findings, reconciliation and improvement tracking.',status:'NO VERIFIED OPEN COUNT DISPLAYED',items:['Findings register','Reconciliation items','Corrective action','Closure evidence']},
qa:{title:'QA / CPRR Workflow',description:'Controlled CPRR review evidence only; no inferred readiness score or fabricated completeness percentage.',status:'WEB-02 VERIFIED-EVIDENCE ONLY',items:['CPRR review context','Evidence-link count','Finding/decision/action counts','No inferred readiness score']},
tasks:{title:'Academic Tasks / Approval Center',description:'Authority-aware review context preserving human decision authority and conflict-of-interest visibility.',status:'WEB-02 AUTHORITY-AWARE READ',items:['Pending review context','Reviewer assignment context','Conflict-of-interest status','Human approval boundary']},
ai:{title:'AI Advisory / Academic Intelligence',description:'Read-only evidence context for advisory assistance. AI cannot approve, mutate baselines, elevate authority or admit Audit Evidence.',status:'AI ADVISORY ONLY',items:['Evidence health context','Verification gaps','Sufficiency gaps','Human decision remains authoritative']},
analytics:{title:'Analytics & Insights',description:'Evidence-aware analytical workspace that displays only verified measures and provenance-resolvable insights.',status:'NO UNVERIFIED KPI DISPLAY',items:['Verified academic indicators','Evidence completeness insights','Trend views when sourced','Provenance for every metric']},
calendar:{title:'Academic Calendar',description:'Academic milestones and controlled calendar visibility.',status:'CALENDAR INTEGRATION NOT VERIFIED',items:['Academic milestones','Review deadlines','Programme events','Upcoming governance gates']},
audit:{title:'Provenance / Audit Trail',description:'Trace controlled records, decisions and verified system evidence.',status:'EVIDENCE-FIRST',items:['Correlation ID','Source version','Authority','Verification status']},
runtime:{title:'Runtime / Connector Health',description:'RLS-preserving view of verified connector health snapshots.',status:'REL-03 AUTHENTICATED READ BINDING',items:['Connector health','Circuit state','Last verified attempt','Runtime binding']},
outbox:{title:'Outbox Queue',description:'RLS-preserving view of the REL-02A durable connector outbox.',status:'REL-03 AUTHENTICATED READ BINDING',items:['Queued command state','Idempotency key','Authority revalidation','Expiry / disposition']},
reconciliation:{title:'Reconciliation Workspace',description:'Human-governed resolution workspace backed by REL-02A reconciliation records.',status:'REL-03 AUTHENTICATED READ BINDING',items:['Open reconciliation','Destination verification','Authority reconfirm','Resolution evidence']},
governance:{title:'System Governance / Gate Status',description:'Controlled HEPE architecture and gate posture.',status:'NON-PRODUCTION',items:['REL-03 controlled / reconciled PASS','HEPE-UI-MASTER-01 controlled','WEB-02 controlled materialization','Production not authorized']},
welcome:{title:'Welcome / Authentication Entry',description:'Modern institutional welcome surface for controlled HEPE access. This presentation layer does not create users, grant authority or enable self-enrolment.',status:'CONTROLLED AUTH BOUNDARY',items:['Institutional welcome','Authentication context','Environment disclosure','No self-enrolment / no authority grant']}
};

const nav=[['programme','Programme'],['mapping','PLO/CLO Mapping'],['reviews','Review Queue'],['evidence','Evidence'],['decisions','Approval'],['qa','QA / CPRR'],['tasks','Tasks'],['ai','AI Advisory'],['analytics','Analytics'],['runtime','Runtime'],['governance','Governance']];

export function generateStaticParams(){return Object.keys(moduleData).map(module=>({module}))}

type State='NOT_APPLICABLE'|'RUNTIME_NOT_CONFIGURED'|'AUTH_REQUIRED'|'QUERY_ERROR'|'EMPTY'|'VERIFIED'|'NOT_YET_VERIFIED'|'DATA_NOT_AVAILABLE';
type LiveResult={state:State;source?:string;rows?:Record<string,unknown>[];note?:string};
function short(value:unknown){if(value===null||value===undefined||value==='')return '—';const text=String(value);return text.length>86?`${text.slice(0,83)}…`:text}

async function loadLive(module:string):Promise<LiveResult>{
 const liveModules=['runtime','outbox','reconciliation','evidence','reviews','curriculum','traceability','mapping','qa','tasks','ai'];
 if(!liveModules.includes(module))return {state:'NOT_APPLICABLE'};
 const binding=await getHepeServerSupabase();if(!binding.ok)return {state:'RUNTIME_NOT_CONFIGURED'};
 const {data:userData,error:userError}=await binding.supabase.auth.getUser();if(userError||!userData.user)return {state:'AUTH_REQUIRED'};
 const sb=binding.supabase;
 if(module==='runtime'){const {data,error}=await sb.from('connector_health_snapshot').select('connector_id,runtime_state,circuit_state,last_success_at,last_failure_at,last_failure_class,consecutive_failures,queue_depth,pending_reconciliation_count,authority_revalidation_pending,captured_at').order('captured_at',{ascending:false}).limit(20);if(error)return {state:'QUERY_ERROR',source:'connector_health_snapshot'};return {state:data?.length?'VERIFIED':'EMPTY',source:'connector_health_snapshot',rows:data??[]}}
 if(module==='outbox'){const {data,error}=await sb.from('connector_outbox').select('operation_id,connector_id,operation_class,state,attempt_no,created_at,expires_at,last_verified_at,failure_class,final_disposition,provenance_reference').order('created_at',{ascending:false}).limit(20);if(error)return {state:'QUERY_ERROR',source:'connector_outbox'};return {state:data?.length?'VERIFIED':'EMPTY',source:'connector_outbox',rows:data??[]}}
 if(module==='reconciliation'){const {data,error}=await sb.from('reconciliation_item').select('reason_code,opened_at,resolved_at,resolution_status,resolution_notes,evidence_reference').order('opened_at',{ascending:false}).limit(20);if(error)return {state:'QUERY_ERROR',source:'reconciliation_item'};return {state:data?.length?'VERIFIED':'EMPTY',source:'reconciliation_item',rows:data??[]}}
 if(module==='evidence'||module==='ai'){
  const {data,error}=await sb.from('v_hepe_evidence_projection_v1').select('evidence_code,title,evidence_type_code,status_code,version_no,is_current,effective_from,effective_to,verification_result,sufficiency_result,is_stale,health_state').limit(20);
  if(error)return {state:'QUERY_ERROR',source:'v_hepe_evidence_projection_v1'};
  const rows=(data??[]).map(row=>({...row,source_reference:'NOT_YET_VERIFIED',authority_owner:'NOT_YET_VERIFIED',relevant_assertion:'NOT_YET_VERIFIED'}));
  return {state:rows.length?'VERIFIED':'EMPTY',source:'v_hepe_evidence_projection_v1',rows,note:module==='ai'?'AI receives only this RLS-visible read-only evidence context; no decision, write or evidence-admission authority is granted.':'Source/owner/assertion are not exposed by this controlled projection and therefore remain NOT_YET_VERIFIED.'};
 }
 if(module==='reviews'||module==='tasks'){
  const {data,error}=await sb.from('v_hepe_review_queue_v1').select('programme_code,review_code,review_type_code,review_no,review_date,gate_phase,scope_summary,status_code,row_version,updated_at,reviewer_assignment_count,alternate_reviewer_count,review_item_count,has_blocking_coi').order('updated_at',{ascending:false}).limit(20);
  if(error)return {state:'QUERY_ERROR',source:'v_hepe_review_queue_v1'};return {state:data?.length?'VERIFIED':'EMPTY',source:'v_hepe_review_queue_v1',rows:data??[],note:module==='tasks'?'Read-only task/review context. Approval remains a human-authority action.':undefined};
 }
 if(module==='qa'){
  const {data,error}=await sb.from('v_hepe_cprr_projection_v1').select('programme_code,review_code,review_no,review_date,review_type_code,gate_phase,status_code,row_version,updated_at,evidence_link_count,finding_count,decision_count,improvement_action_count,closure_review_count,reviewer_assignment_count,alternate_reviewer_count').order('updated_at',{ascending:false}).limit(20);
  if(error)return {state:'QUERY_ERROR',source:'v_hepe_cprr_projection_v1'};return {state:data?.length?'VERIFIED':'EMPTY',source:'v_hepe_cprr_projection_v1',rows:data??[],note:'Counts are controlled projection values only. No readiness score or completeness percentage is inferred.'};
 }
 if(module==='curriculum'){
  const {data,error}=await sb.from('v_hepe_curriculum_context_v1').select('programme_code,canonical_identifier,title_th,title_en,programme_status_code,curriculum_version_id,version_code,version_label,curriculum_status_code,effective_from,effective_to,is_current,approved_at,activated_at').limit(20);
  if(error)return {state:'QUERY_ERROR',source:'v_hepe_curriculum_context_v1'};return {state:data?.length?'VERIFIED':'EMPTY',source:'v_hepe_curriculum_context_v1',rows:data??[]};
 }
 if(module==='traceability'){
  const {data,error}=await sb.from('v_hepe_outcome_registry_v1').select('programme_code,course_code,outcome_id,outcome_type,canonical_code,outcome_status_code,outcome_version_id,version_no,statement_th,statement_en,version_status_code,effective_from,effective_to,is_current,approved_at,activated_at').limit(30);
  if(error)return {state:'QUERY_ERROR',source:'v_hepe_outcome_registry_v1'};return {state:data?.length?'VERIFIED':'EMPTY',source:'v_hepe_outcome_registry_v1',rows:data??[]};
 }
 const {data,error}=await sb.from('v_hepe_outcome_mapping_v1').select('programme_code,curriculum_version_code,outcome_mapping_id,mapping_kind,source_outcome_id,source_outcome_type,source_outcome_code,target_outcome_id,target_outcome_type,target_outcome_code,mapping_version_id,version_no,irm_level,rationale,mapping_version_status_code,is_current,approved_at,activated_at,mapping_version_created_at').limit(30);
 if(error)return {state:'QUERY_ERROR',source:'v_hepe_outcome_mapping_v1'};return {state:data?.length?'VERIFIED':'EMPTY',source:'v_hepe_outcome_mapping_v1',rows:data??[],note:'Course × CLO is resolved by the outcome registry course relationship; PLO × Course is traceable through controlled CLO→PLO mappings. No relationship is invented when a controlled mapping is absent.'};
}

function LivePanel({result}:{result:LiveResult}){
 if(result.state==='NOT_APPLICABLE')return null;
 const stateText:Record<State,string>={NOT_APPLICABLE:'',RUNTIME_NOT_CONFIGURED:'Runtime environment is not configured for this deployment.',AUTH_REQUIRED:'Authenticated HEPE session required. No privileged fallback is used.',QUERY_ERROR:'Controlled source could not be read under the current RLS/session context.',EMPTY:'Controlled source returned no rows visible to the current authority scope.',VERIFIED:'Controlled rows returned under the current authenticated RLS scope.',NOT_YET_VERIFIED:'A controlled source or claim exists but required verification/provenance is incomplete.',DATA_NOT_AVAILABLE:'No controlled source is currently available for this field.'};
 return <article className="card live-panel" style={{marginTop:14}} aria-live="polite"><div className="label">Controlled academic binding · {result.source??'HEPE Supabase'}</div><div className="live-state">{result.state}</div><p className="note">{stateText[result.state]} No service-role bypass or fabricated fallback data is used.</p>{result.note&&<p className="note"><strong>Boundary:</strong> {result.note}</p>}{result.rows?.map((row,index)=><div className="data-record" key={index}>{Object.entries(row).map(([key,value])=><div className="row" key={key}><span>{key}</span><span className="status">{short(value)}</span></div>)}</div>)}</article>
}

export default async function ModulePage({params}:{params:Promise<{module:string}>}){
 const {module}=await params;const data=moduleData[module];if(!data)notFound();const live=await loadLive(module);
 return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic Command Center</div><p className="brand-sub">Controlled academic governance workspace.</p><div className="env">● NON-PRODUCTION</div><nav className="nav" aria-label="Primary HEPE navigation"><a href="/">Command Center</a><div className="nav-group">Academic workflow</div>{nav.map(([s,l])=><a className={s===module?'active':''} href={`/${s}`} key={s}>{l}</a>)}</nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← Academic Command Center</a><section className="module-hero"><div className="brand-kicker">HEPE · BED-HEPE · Controlled Academic Workspace</div><h1>{data.title}</h1><p>{data.description}</p></section><div className={`pill ${data.status.includes('WEB-02')||data.status.includes('REL-03')||data.status.includes('CONTROLLED')?'pass':''}`}>{data.status}</div><LivePanel result={live}/><section className="grid g2" aria-label={`${data.title} workspace areas`}>{data.items.map(item=><article className="card item-card interactive" key={item}><span className="screen-tag">Academic workspace</span><h2 style={{marginTop:10}}>{item}</h2><p>Only controlled or RLS-visible records are presented. Missing provenance or unavailable data remains explicitly marked rather than inferred.</p></article>)}</section><div className="firewall">Environment firewall · NON-PRODUCTION / TEST DATA ONLY · Authenticated RLS reads only · AI advisory only · Conversation ≠ Audit Evidence · No service-role client exposure · No Production authorization · No real external connector write · No real-user authority change.</div><footer className="footer-note">HEPE-WEB-02 · Evidence-first · Provenance-aware · Human academic authority preserved.</footer></div></section></main>
}
