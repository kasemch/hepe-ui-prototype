import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

type ProgrammeRow = {
  programme_code: string | null;
  canonical_identifier: string | null;
  title_th: string | null;
  title_en: string | null;
  status_code: string | null;
  updated_at: string | null;
  open_review_count: number | null;
  open_finding_count: number | null;
  open_action_count: number | null;
  stale_evidence_count: number | null;
};

type State = 'RUNTIME_NOT_CONFIGURED'|'AUTH_REQUIRED'|'QUERY_ERROR'|'EMPTY'|'VERIFIED';

async function loadProgramme(): Promise<{state:State;rows:ProgrammeRow[]}> {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return {state:'RUNTIME_NOT_CONFIGURED',rows:[]};
  const {data:userData,error:userError} = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return {state:'AUTH_REQUIRED',rows:[]};
  const {data,error} = await binding.supabase
    .from('v_hepe_programme_dashboard_v1')
    .select('programme_code,canonical_identifier,title_th,title_en,status_code,updated_at,open_review_count,open_finding_count,open_action_count,stale_evidence_count')
    .order('programme_code',{ascending:true});
  if (error) return {state:'QUERY_ERROR',rows:[]};
  return {state:data?.length?'VERIFIED':'EMPTY',rows:(data??[]) as ProgrammeRow[]};
}

const stateText:Record<State,string> = {
  RUNTIME_NOT_CONFIGURED:'Preview runtime binding is unavailable. No fallback data is shown.',
  AUTH_REQUIRED:'Authenticated HEPE session required. Programme data remains fail-closed.',
  QUERY_ERROR:'The controlled programme read model could not be read under the current RLS/session context.',
  EMPTY:'The controlled read model returned no programme rows visible to the current authority scope.',
  VERIFIED:'Programme identity and governance counts below are returned from the controlled SECURITY_INVOKER programme read model.'
};

export default async function ProgrammeOverview(){
  const result=await loadProgramme();
  return <main className="shell">
    <aside className="sidebar">
      <div className="brand-kicker">HEPE · BED-HEPE</div>
      <div className="brand">Academic Command Center</div>
      <p className="brand-sub">Controlled academic governance workspace.</p>
      <div className="env">● NON-PRODUCTION</div>
      <nav className="nav" aria-label="Programme navigation">
        <a href="/">Command Center</a>
        <a className="active" href="/programme">Programme Overview</a>
        <a href="/mapping">PLO/CLO Mapping</a>
        <a href="/evidence">Evidence</a>
        <a href="/qa">QA / CPRR</a>
        <a href="/tasks">Tasks</a>
        <a href="/ai">AI Advisory</a>
      </nav>
    </aside>
    <section className="workspace">
      <div className="module-wrap">
        <a className="breadcrumb" href="/">← Academic Command Center</a>
        <section className="module-hero">
          <div className="brand-kicker">HEPE-WEB-02B · Controlled Academic Workflow</div>
          <h1>Programme Overview</h1>
          <p>Programme identity and governance posture are read from the controlled programme dashboard. Curriculum detail not yet exposed through an authorized read surface remains explicitly unavailable.</p>
        </section>
        <div className={`pill ${result.state==='VERIFIED'?'pass':''}`}>{result.state}</div>
        <article className="card live-panel" aria-live="polite">
          <div className="label">Controlled source · v_hepe_programme_dashboard_v1</div>
          <div className="live-state">{result.state}</div>
          <p className="note">{stateText[result.state]}</p>
        </article>
        {result.rows.map((row,index)=><article className="card" style={{marginTop:14}} key={`${row.programme_code??'programme'}-${index}`}>
          <span className="screen-tag">VERIFIED PROGRAMME RECORD</span>
          <h2 style={{marginTop:10}}>{row.title_th??row.programme_code??'Programme'}</h2>
          <div className="grid g2">
            <div className="row"><span>Programme code</span><span className="status">{row.programme_code??'—'}</span></div>
            <div className="row"><span>Canonical identifier</span><span className="status">{row.canonical_identifier??'—'}</span></div>
            <div className="row"><span>English title</span><span className="status">{row.title_en??'—'}</span></div>
            <div className="row"><span>Programme status</span><span className="status">{row.status_code??'—'}</span></div>
            <div className="row"><span>Open reviews</span><span className="status">{row.open_review_count??0}</span></div>
            <div className="row"><span>Open findings</span><span className="status">{row.open_finding_count??0}</span></div>
            <div className="row"><span>Open actions</span><span className="status">{row.open_action_count??0}</span></div>
            <div className="row"><span>Stale evidence</span><span className="status">{row.stale_evidence_count??0}</span></div>
            <div className="row"><span>Source updated</span><span className="status">{row.updated_at??'—'}</span></div>
          </div>
        </article>)}
        <section className="grid g2" style={{marginTop:14}}>
          <article className="card item-card"><span className="screen-tag">DATA_NOT_AVAILABLE</span><h2 style={{marginTop:10}}>Curriculum Version</h2><p>No authorized curriculum-version read model is currently registered for WEB-02. No version value is inferred or hard-coded.</p></article>
          <article className="card item-card"><span className="screen-tag">DATA_NOT_AVAILABLE</span><h2 style={{marginTop:10}}>Programme Structure / Course Registry</h2><p>The foundation tables exist but do not currently expose an authenticated controlled SELECT surface approved for this UI gate.</p></article>
          <article className="card item-card"><span className="screen-tag">DATA_NOT_AVAILABLE</span><h2 style={{marginTop:10}}>PLO Registry</h2><p>PLO/CLO outcome data will remain unavailable until the controlled mapping read-surface gap identified in WEB-02A is resolved.</p></article>
          <article className="card item-card"><span className="screen-tag">PROVENANCE</span><h2 style={{marginTop:10}}>Read-model contract</h2><p>RM_PROGRAMME_DASHBOARD · SECURITY_INVOKER · version 1. Human authority and RLS remain authoritative.</p></article>
        </section>
        <div className="firewall">NON-PRODUCTION / TEST DATA ONLY · Controlled read models only · No inferred curriculum values · No service-role client exposure · No Production authorization.</div>
        <footer className="footer-note">HEPE-WEB-02B · Evidence-first · Conversation ≠ Audit Evidence.</footer>
      </div>
    </section>
  </main>;
}
