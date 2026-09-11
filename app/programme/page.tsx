import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

type State='RUNTIME_NOT_CONFIGURED'|'AUTH_REQUIRED'|'QUERY_ERROR'|'EMPTY'|'VERIFIED';
type Section={state:State;source:string;rows:Record<string,unknown>[]};

async function loadProgramme(){
 const binding=await getHepeServerSupabase();
 if(!binding.ok)return {state:'RUNTIME_NOT_CONFIGURED' as State,sections:[] as Section[]};
 const {data:userData,error:userError}=await binding.supabase.auth.getUser();
 if(userError||!userData.user)return {state:'AUTH_REQUIRED' as State,sections:[] as Section[]};
 const sb=binding.supabase;
 const specs=[
  ['v_hepe_programme_dashboard_v1','programme_code,canonical_identifier,title_th,title_en,status_code,updated_at,open_review_count,open_finding_count,open_action_count,stale_evidence_count'],
  ['v_hepe_curriculum_context_v1','programme_code,version_code,version_label,curriculum_status_code,effective_from,effective_to,is_current,approved_at,activated_at'],
  ['v_hepe_course_registry_v1','programme_code,curriculum_version_code,course_code,title_th,title_en,credit_value,course_role,recommended_year,recommended_term,is_active'],
  ['v_hepe_outcome_registry_v1','programme_code,course_code,outcome_type,canonical_code,version_no,statement_th,statement_en,version_status_code,is_current']
 ] as const;
 const sections:Section[]=[];
 for(const [source,select] of specs){const {data,error}=await sb.from(source).select(select).limit(30);if(error)return {state:'QUERY_ERROR' as State,sections:[...sections,{state:'QUERY_ERROR',source,rows:[]}]};sections.push({state:data?.length?'VERIFIED':'EMPTY',source,rows:(data??[]) as Record<string,unknown>[]});}
 return {state:'VERIFIED' as State,sections};
}
function short(value:unknown){if(value===null||value===undefined||value==='')return '—';const t=String(value);return t.length>84?`${t.slice(0,81)}…`:t}
const stateText:Record<State,string>={RUNTIME_NOT_CONFIGURED:'Preview runtime binding is unavailable. No fallback data is shown.',AUTH_REQUIRED:'Authenticated HEPE session required. Programme data remains fail-closed.',QUERY_ERROR:'A controlled programme read model could not be read under the current RLS/session context.',EMPTY:'Controlled source returned no rows visible to the current authority scope.',VERIFIED:'Controlled SECURITY_INVOKER read models returned RLS-visible academic context.'};

export default async function ProgrammeOverview(){
 const result=await loadProgramme();
 return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic Command Center</div><p className="brand-sub">Controlled academic governance workspace.</p><div className="env">● NON-PRODUCTION</div><nav className="nav" aria-label="Programme navigation"><a href="/">Command Center</a><a className="active" href="/programme">Programme Overview</a><a href="/mapping">PLO/CLO Mapping</a><a href="/evidence">Evidence</a><a href="/qa">QA / CPRR</a><a href="/tasks">Tasks</a><a href="/ai">AI Advisory</a></nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← Academic Command Center</a><section className="module-hero"><div className="brand-kicker">HEPE-WEB-02 · Controlled Academic Workflow</div><h1>Programme Overview</h1><p>Programme, curriculum, course and outcome context are read only from controlled SECURITY_INVOKER read models. Missing rows remain EMPTY rather than inferred.</p></section><div className={`pill ${result.state==='VERIFIED'?'pass':''}`}>{result.state}</div><article className="card live-panel" aria-live="polite"><div className="label">Controlled academic context</div><div className="live-state">{result.state}</div><p className="note">{stateText[result.state]}</p></article>{result.sections.map(section=><article className="card" style={{marginTop:14}} key={section.source}><div className="label">Controlled source · {section.source}</div><div className="live-state">{section.state}</div><p className="note">{stateText[section.state]}</p>{section.rows.map((row,index)=><div className="data-record" key={index}>{Object.entries(row).map(([key,value])=><div className="row" key={key}><span>{key}</span><span className="status">{short(value)}</span></div>)}</div>)}</article>)}<section className="grid g2" style={{marginTop:14}}><article className="card item-card"><span className="screen-tag">CONTROLLED</span><h2 style={{marginTop:10}}>Curriculum / Course Context</h2><p>Values are displayed only when returned through the authenticated RLS-preserving read surface.</p></article><article className="card item-card"><span className="screen-tag">CONTROLLED</span><h2 style={{marginTop:10}}>PLO / CLO Registry</h2><p>Outcome records are separated by outcome_type and retain version/status fields. No outcome is generated from conversation or UI assumptions.</p></article><article className="card item-card"><span className="screen-tag">PROVENANCE</span><h2 style={{marginTop:10}}>Read-model contract</h2><p>RM_PROGRAMME_DASHBOARD + RM_CURRICULUM_CONTEXT + RM_COURSE_REGISTRY + RM_OUTCOME_REGISTRY · SECURITY_INVOKER.</p></article><article className="card item-card"><span className="screen-tag">AUTHORITY</span><h2 style={{marginTop:10}}>Human authority preserved</h2><p>Authenticated RLS scope remains authoritative; this page performs no academic write or approval action.</p></article></section><div className="firewall">NON-PRODUCTION / TEST DATA ONLY · Controlled read models only · Conversation ≠ Audit Evidence · No service-role client exposure · No Production authorization.</div><footer className="footer-note">HEPE-WEB-02 · Evidence-first · Provenance-aware.</footer></div></section></main>;
}
