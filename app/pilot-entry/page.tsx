import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';
import PilotEntryClient from './PilotEntryClient';

export const dynamic = 'force-dynamic';

type State = 'RUNTIME_NOT_CONFIGURED' | 'AUTH_REQUIRED' | 'QUERY_ERROR' | 'EMPTY' | 'VERIFIED';
type Option = { id: string; label: string };

async function loadOptions(): Promise<{ state: State; activities: Option[]; assessments: Option[]; note: string }> {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return { state:'RUNTIME_NOT_CONFIGURED', activities:[], assessments:[], note:'Preview runtime binding is unavailable.' };
  const { data:userData, error:userError } = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return { state:'AUTH_REQUIRED', activities:[], assessments:[], note:'Authenticated HEPE session required.' };

  const [activityResult, assessmentResult] = await Promise.all([
    binding.supabase.from('learning_activity_versions').select('learning_activity_version_id,learning_activity_id,title_th,title_en,version_no,is_current').eq('is_current',true).limit(30),
    binding.supabase.from('assessment_versions').select('assessment_version_id,assessment_id,title_th,title_en,version_no,is_current').eq('is_current',true).limit(30),
  ]);
  if (activityResult.error || assessmentResult.error) return { state:'QUERY_ERROR', activities:[], assessments:[], note:'Current RLS scope could not read controlled pilot options.' };

  const activities=(activityResult.data??[]).map(r=>({id:String(r.learning_activity_version_id),label:`${r.title_th || r.title_en || r.learning_activity_id} · v${r.version_no}`}));
  const assessments=(assessmentResult.data??[]).map(r=>({id:String(r.assessment_version_id),label:`${r.title_th || r.title_en || r.assessment_id} · v${r.version_no}`}));
  return { state:(activities.length||assessments.length)?'VERIFIED':'EMPTY', activities, assessments, note:'Options are read through the authenticated RLS scope. Writes remain synthetic-only and authority-checked by database RPC.' };
}

export default async function PilotEntryPage(){
  const result=await loadOptions();
  return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · TEACHER WORKSPACE</div><div className="brand">My Academic Workspace</div><p className="brand-sub">Work-first pilot entry for daily teaching records.</p><div className="env">● NON-PRODUCTION</div><nav className="nav"><a href="/">Home</a><a href="/teaching">Learning & Teaching</a><a href="/assessment">Assessment</a><a href="/plan-actual">Plan vs Actual</a><a className="active" href="/pilot-entry">Quick Entry</a><a href="/evidence">Evidence</a></nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← My Academic Workspace</a><section className="module-hero"><div className="brand-kicker">HEPE · WORK-FIRST PILOT</div><h1>Quick Entry</h1><p>บันทึกการสอนและหลักฐานการประเมินจากงานประจำวัน โดยให้ governance และ traceability ทำงานอยู่ด้านหลัง</p></section><div className="pill pass">HEPE-PILOT-01F · SYNTHETIC ONLY</div><article className="card live-panel" style={{marginTop:14}}><div className="label">Authenticated workspace state</div><div className="live-state">{result.state}</div><p className="note">{result.note}</p></article>{result.state==='VERIFIED'?<PilotEntryClient activities={result.activities} assessments={result.assessments}/>:null}<div className="firewall">NON-PRODUCTION / SYNTHETIC TEST DATA ONLY · No real institutional/student/staff data · No production authorization · Human authority preserved.</div></div></section></main>;
}
