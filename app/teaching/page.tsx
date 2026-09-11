import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

type Row = Record<string, unknown>;
type State = 'RUNTIME_NOT_CONFIGURED' | 'AUTH_REQUIRED' | 'QUERY_ERROR' | 'EMPTY' | 'VERIFIED';

function short(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  return text.length > 90 ? `${text.slice(0, 87)}…` : text;
}

async function loadTeaching(): Promise<{ state: State; rows: Row[]; note: string }> {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return { state: 'RUNTIME_NOT_CONFIGURED', rows: [], note: 'Preview runtime binding is unavailable.' };
  const { data: userData, error: userError } = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return { state: 'AUTH_REQUIRED', rows: [], note: 'Authenticated HEPE session required. No privileged fallback is used.' };

  const [activityResult, versionResult, deliveryResult, outcomeResult, assessmentLinkResult] = await Promise.all([
    binding.supabase.from('learning_activities').select('learning_activity_id,curriculum_course_id,activity_code,activity_type,status_code,created_at').limit(30),
    binding.supabase.from('learning_activity_versions').select('learning_activity_version_id,learning_activity_id,version_no,title_th,title_en,description,planned_hours,status_code,effective_from,effective_to,is_current,approved_at,activated_at').eq('is_current', true).limit(30),
    binding.supabase.from('learning_activity_deliveries').select('learning_activity_delivery_id,learning_activity_version_id,academic_year,term_code,starts_on,ends_on,status_code,created_at').limit(30),
    binding.supabase.from('learning_activity_outcome_links').select('learning_activity_version_id,outcome_version_id,alignment_level,is_primary').limit(60),
    binding.supabase.from('learning_activity_assessment_links').select('learning_activity_version_id,assessment_version_id,relationship_type,is_primary').limit(60),
  ]);

  if (activityResult.error || versionResult.error || deliveryResult.error || outcomeResult.error || assessmentLinkResult.error) {
    return { state: 'QUERY_ERROR', rows: [], note: 'At least one controlled teaching source could not be read under the current RLS scope.' };
  }

  const activities = new Map((activityResult.data ?? []).map((row) => [row.learning_activity_id, row]));
  const deliveries = new Map<string, Row[]>();
  for (const row of deliveryResult.data ?? []) {
    const key = String(row.learning_activity_version_id);
    deliveries.set(key, [...(deliveries.get(key) ?? []), row]);
  }
  const outcomes = new Map<string, number>();
  for (const row of outcomeResult.data ?? []) {
    const key = String(row.learning_activity_version_id);
    outcomes.set(key, (outcomes.get(key) ?? 0) + 1);
  }
  const assessments = new Map<string, number>();
  for (const row of assessmentLinkResult.data ?? []) {
    const key = String(row.learning_activity_version_id);
    assessments.set(key, (assessments.get(key) ?? 0) + 1);
  }

  const rows: Row[] = (versionResult.data ?? []).map((version) => {
    const activity = activities.get(version.learning_activity_id) ?? {};
    const versionId = String(version.learning_activity_version_id);
    const linkedDeliveries = deliveries.get(versionId) ?? [];
    return {
      activity_code: activity.activity_code ?? 'NO VERIFIED DATA',
      activity_type: activity.activity_type ?? 'NO VERIFIED DATA',
      title_th: version.title_th ?? 'NO VERIFIED DATA',
      version_no: version.version_no,
      planned_hours: version.planned_hours ?? 'NO VERIFIED DATA',
      clo_outcome_links: outcomes.get(versionId) ?? 0,
      assessment_links: assessments.get(versionId) ?? 0,
      recorded_deliveries: linkedDeliveries.length,
      latest_delivery_status: linkedDeliveries.at(-1)?.status_code ?? 'NO EVIDENCE',
      current_status: version.status_code,
    };
  });

  return {
    state: rows.length ? 'VERIFIED' : 'EMPTY',
    rows,
    note: 'Read-only RLS-scoped learning activity, outcome, assessment-link and delivery context. No teaching record is fabricated when evidence is absent.',
  };
}

const nav = [['programme','Programme'],['mapping','PLO/CLO Mapping'],['teaching','Learning & Teaching'],['assessment','Assessment'],['plan-actual','Plan vs Actual'],['reviews','Review Queue'],['evidence','Evidence'],['qa','QA / CPRR'],['tasks','Tasks'],['ai','AI Advisory'],['analytics','Analytics'],['runtime','Runtime'],['governance','Governance']];

export default async function TeachingPage() {
  const result = await loadTeaching();
  return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic Command Center</div><p className="brand-sub">Controlled academic governance workspace.</p><div className="env">● NON-PRODUCTION</div><nav className="nav" aria-label="Primary HEPE navigation"><a href="/">Command Center</a><div className="nav-group">Academic workflow</div>{nav.map(([s,l])=><a className={s==='teaching'?'active':''} href={`/${s}`} key={s}>{l}</a>)}</nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← Academic Command Center</a><section className="module-hero"><div className="brand-kicker">HEPE · PILOT CRITICAL PATH</div><h1>Learning & Teaching</h1><p>Read-only planned learning activities, CLO links, assessment links and recorded delivery evidence under authenticated RLS scope.</p></section><div className="pill pass">HEPE-PILOT-01D · NON-PRODUCTION</div><article className="card live-panel" style={{marginTop:14}} aria-live="polite"><div className="label">Controlled teaching binding</div><div className="live-state">{result.state}</div><p className="note">{result.note} No service-role bypass or write path is used.</p>{result.rows.map((row,index)=><div className="data-record" key={index}>{Object.entries(row).map(([key,value])=><div className="row" key={key}><span>{key}</span><span className="status">{short(value)}</span></div>)}</div>)}</article><div className="firewall">NON-PRODUCTION / TEST DATA ONLY · Read-only authenticated RLS scope · Missing data = NO VERIFIED DATA / NO EVIDENCE · Human academic authority preserved.</div><footer className="footer-note">HEPE-PILOT-MASTER-01 · Learning & Teaching pilot-critical workspace.</footer></div></section></main>;
}
