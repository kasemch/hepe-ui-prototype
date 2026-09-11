import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

type Row = Record<string, unknown>;
type State = 'RUNTIME_NOT_CONFIGURED' | 'AUTH_REQUIRED' | 'QUERY_ERROR' | 'EMPTY' | 'VERIFIED';

type Result = { state: State; rows: Row[]; note: string };

function short(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  return text.length > 96 ? `${text.slice(0, 93)}…` : text;
}

async function loadPlanActual(): Promise<Result> {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return { state: 'RUNTIME_NOT_CONFIGURED', rows: [], note: 'Preview runtime binding is unavailable.' };
  const { data: userData, error: userError } = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return { state: 'AUTH_REQUIRED', rows: [], note: 'Authenticated HEPE session required. No privileged fallback is used.' };

  const [activityResult, versionResult, deliveryResult, outcomeResult, assessmentResult] = await Promise.all([
    binding.supabase.from('learning_activities').select('learning_activity_id,activity_code,activity_type,status_code,curriculum_course_id').limit(40),
    binding.supabase.from('learning_activity_versions').select('learning_activity_version_id,learning_activity_id,version_no,title_th,planned_hours,status_code,is_current,effective_from,effective_to').eq('is_current', true).limit(40),
    binding.supabase.from('learning_activity_deliveries').select('learning_activity_version_id,academic_year,term_code,starts_on,ends_on,status_code').limit(80),
    binding.supabase.from('learning_activity_outcome_links').select('learning_activity_version_id,outcome_version_id,alignment_level,is_primary').limit(120),
    binding.supabase.from('learning_activity_assessment_links').select('learning_activity_version_id,assessment_version_id,relationship_type,is_primary').limit(120),
  ]);

  if (activityResult.error || versionResult.error || deliveryResult.error || outcomeResult.error || assessmentResult.error) {
    return { state: 'QUERY_ERROR', rows: [], note: 'At least one controlled plan-versus-actual source could not be read under the current RLS scope.' };
  }

  const activities = new Map((activityResult.data ?? []).map((row) => [row.learning_activity_id, row]));
  const deliveryByVersion = new Map<string, Row[]>();
  for (const row of deliveryResult.data ?? []) {
    const key = String(row.learning_activity_version_id);
    deliveryByVersion.set(key, [...(deliveryByVersion.get(key) ?? []), row]);
  }
  const outcomeCount = new Map<string, number>();
  for (const row of outcomeResult.data ?? []) {
    const key = String(row.learning_activity_version_id);
    outcomeCount.set(key, (outcomeCount.get(key) ?? 0) + 1);
  }
  const assessmentCount = new Map<string, number>();
  for (const row of assessmentResult.data ?? []) {
    const key = String(row.learning_activity_version_id);
    assessmentCount.set(key, (assessmentCount.get(key) ?? 0) + 1);
  }

  const rows: Row[] = (versionResult.data ?? []).map((version) => {
    const activity = activities.get(version.learning_activity_id) ?? {};
    const versionId = String(version.learning_activity_version_id);
    const deliveries = deliveryByVersion.get(versionId) ?? [];
    const cloLinks = outcomeCount.get(versionId) ?? 0;
    const assessmentLinks = assessmentCount.get(versionId) ?? 0;
    const deliveryRecorded = deliveries.length > 0;
    const classification = !deliveryRecorded
      ? 'NO EVIDENCE'
      : cloLinks > 0 && assessmentLinks > 0
        ? 'PARTIALLY ALIGNED'
        : 'PARTIALLY ALIGNED';
    return {
      activity_code: activity.activity_code ?? 'NO VERIFIED DATA',
      topic_or_activity: version.title_th ?? 'NO VERIFIED DATA',
      planned_hours: version.planned_hours ?? 'NO VERIFIED DATA',
      clo_links: cloLinks,
      assessment_links: assessmentLinks,
      delivery_records: deliveries.length,
      latest_delivery_status: deliveries.at(-1)?.status_code ?? 'NO EVIDENCE',
      latest_delivery_window: deliveries.length ? `${deliveries.at(-1)?.starts_on ?? '—'} → ${deliveries.at(-1)?.ends_on ?? '—'}` : 'NO EVIDENCE',
      evidence_status: deliveryRecorded ? 'DELIVERY EVIDENCE PRESENT' : 'NO EVIDENCE',
      alignment_classification: classification,
    };
  });

  return {
    state: rows.length ? 'VERIFIED' : 'EMPTY',
    rows,
    note: 'The pilot compares planned activity versions against recorded delivery plus controlled CLO and assessment links. It intentionally does not claim ALIGNED because complete assessment-result/evidence sufficiency and week-level teaching records are not yet available in this read model.',
  };
}

const nav = [['programme','Programme'],['mapping','PLO/CLO Mapping'],['teaching','Learning & Teaching'],['assessment','Assessment'],['plan-actual','Plan vs Actual'],['reviews','Review Queue'],['evidence','Evidence'],['qa','QA / CPRR'],['tasks','Tasks'],['ai','AI Advisory'],['analytics','Analytics'],['runtime','Runtime'],['governance','Governance']];

export default async function PlanActualPage() {
  const result = await loadPlanActual();
  return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic Command Center</div><p className="brand-sub">Controlled academic governance workspace.</p><div className="env">● NON-PRODUCTION</div><nav className="nav" aria-label="Primary HEPE navigation"><a href="/">Command Center</a><div className="nav-group">Academic workflow</div>{nav.map(([s,l])=><a className={s==='plan-actual'?'active':''} href={`/${s}`} key={s}>{l}</a>)}</nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← Academic Command Center</a><section className="module-hero"><div className="brand-kicker">HEPE · PILOT CRITICAL PATH</div><h1>Teaching Plan vs Actual Teaching</h1><p>Evidence-first comparison of planned learning activities against recorded delivery, CLO links and assessment links.</p></section><div className="pill pass">HEPE-PILOT-01D · ADVISORY ANALYSIS ONLY</div><article className="card live-panel" style={{marginTop:14}} aria-live="polite"><div className="label">Controlled plan-versus-actual analysis</div><div className="live-state">{result.state}</div><p className="note">{result.note} Human review remains authoritative.</p>{result.rows.map((row,index)=><div className="data-record" key={index}>{Object.entries(row).map(([key,value])=><div className="row" key={key}><span>{key}</span><span className="status">{short(value)}</span></div>)}</div>)}</article><div className="firewall">NON-PRODUCTION / TEST DATA ONLY · AI may summarize or flag but cannot approve, write, grant authority or declare compliance · Missing evidence stays explicit.</div><footer className="footer-note">HEPE-PILOT-MASTER-01 · Plan vs Actual pilot workspace.</footer></div></section></main>;
}
