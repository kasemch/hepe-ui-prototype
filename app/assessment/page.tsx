import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

type Row = Record<string, unknown>;
type State = 'RUNTIME_NOT_CONFIGURED' | 'AUTH_REQUIRED' | 'QUERY_ERROR' | 'EMPTY' | 'VERIFIED';

function short(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  return text.length > 90 ? `${text.slice(0, 87)}…` : text;
}

async function loadAssessment(): Promise<{ state: State; rows: Row[]; note: string }> {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return { state: 'RUNTIME_NOT_CONFIGURED', rows: [], note: 'Preview runtime binding is unavailable.' };
  const { data: userData, error: userError } = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return { state: 'AUTH_REQUIRED', rows: [], note: 'Authenticated HEPE session required. No privileged fallback is used.' };

  const [assessmentResult, versionResult, outcomeResult] = await Promise.all([
    binding.supabase.from('assessments').select('assessment_id,curriculum_course_id,assessment_code,assessment_type,status_code,created_at').limit(30),
    binding.supabase.from('assessment_versions').select('assessment_version_id,assessment_id,version_no,title_th,title_en,weight_percent,status_code,is_current,approved_at,activated_at').eq('is_current', true).limit(30),
    binding.supabase.from('assessment_outcome_links').select('assessment_version_id,outcome_version_id,alignment_level,is_primary').limit(60),
  ]);

  if (assessmentResult.error || versionResult.error || outcomeResult.error) {
    return { state: 'QUERY_ERROR', rows: [], note: 'At least one controlled assessment source could not be read under the current RLS scope.' };
  }

  const assessments = new Map((assessmentResult.data ?? []).map((row) => [row.assessment_id, row]));
  const outcomes = new Map<string, number>();
  for (const row of outcomeResult.data ?? []) {
    const key = String(row.assessment_version_id);
    outcomes.set(key, (outcomes.get(key) ?? 0) + 1);
  }

  const rows: Row[] = (versionResult.data ?? []).map((version) => {
    const assessment = assessments.get(version.assessment_id) ?? {};
    const versionId = String(version.assessment_version_id);
    return {
      assessment_code: assessment.assessment_code ?? 'NO VERIFIED DATA',
      assessment_type: assessment.assessment_type ?? 'NO VERIFIED DATA',
      title_th: version.title_th ?? 'NO VERIFIED DATA',
      version_no: version.version_no,
      weight_percent: version.weight_percent ?? 'NO VERIFIED DATA',
      linked_outcomes: outcomes.get(versionId) ?? 0,
      status_code: version.status_code,
      approved_at: version.approved_at ?? 'NO VERIFIED DATA',
    };
  });

  return {
    state: rows.length ? 'VERIFIED' : 'EMPTY',
    rows,
    note: 'Read-only RLS-scoped assessment and outcome-alignment context. No score, completeness percentage or compliance conclusion is inferred.',
  };
}

const nav = [['programme','Programme'],['mapping','PLO/CLO Mapping'],['teaching','Learning & Teaching'],['assessment','Assessment'],['plan-actual','Plan vs Actual'],['reviews','Review Queue'],['evidence','Evidence'],['qa','QA / CPRR'],['tasks','Tasks'],['ai','AI Advisory'],['analytics','Analytics'],['runtime','Runtime'],['governance','Governance']];

export default async function AssessmentPage() {
  const result = await loadAssessment();
  return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · BED-HEPE</div><div className="brand">Academic Command Center</div><p className="brand-sub">Controlled academic governance workspace.</p><div className="env">● NON-PRODUCTION</div><nav className="nav" aria-label="Primary HEPE navigation"><a href="/">Command Center</a><div className="nav-group">Academic workflow</div>{nav.map(([s,l])=><a className={s==='assessment'?'active':''} href={`/${s}`} key={s}>{l}</a>)}</nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← Academic Command Center</a><section className="module-hero"><div className="brand-kicker">HEPE · PILOT CRITICAL PATH</div><h1>Assessment</h1><p>Read-only assessment versions and outcome-alignment evidence under authenticated RLS scope.</p></section><div className="pill pass">HEPE-PILOT-01D · NON-PRODUCTION</div><article className="card live-panel" style={{marginTop:14}} aria-live="polite"><div className="label">Controlled assessment binding</div><div className="live-state">{result.state}</div><p className="note">{result.note} No service-role bypass or write path is used.</p>{result.rows.map((row,index)=><div className="data-record" key={index}>{Object.entries(row).map(([key,value])=><div className="row" key={key}><span>{key}</span><span className="status">{short(value)}</span></div>)}</div>)}</article><div className="firewall">NON-PRODUCTION / TEST DATA ONLY · Read-only authenticated RLS scope · Human academic authority preserved.</div><footer className="footer-note">HEPE-PILOT-MASTER-01 · Assessment pilot-critical workspace.</footer></div></section></main>;
}
