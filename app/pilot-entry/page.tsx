import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';
import PilotEntryClient from './PilotEntryClient';

export const dynamic = 'force-dynamic';

type State = 'RUNTIME_NOT_CONFIGURED' | 'AUTH_REQUIRED' | 'QUERY_ERROR' | 'EMPTY' | 'VERIFIED';
type Option = { id: string; label: string };

async function loadOptions(courseId?:string): Promise<{ state: State; activities: Option[]; assessments: Option[]; note: string; courseLabel:string|null }> {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return { state:'RUNTIME_NOT_CONFIGURED', activities:[], assessments:[], note:'Preview runtime binding is unavailable.', courseLabel:null };
  const { data:userData, error:userError } = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return { state:'AUTH_REQUIRED', activities:[], assessments:[], note:'Authenticated HEPE session required.', courseLabel:null };

  let activityIds:string[]|null=null;
  let assessmentIds:string[]|null=null;
  let courseLabel:string|null=null;

  if(courseId){
    const course=await binding.supabase.from('curriculum_courses').select('curriculum_course_id,courses!inner(course_code,title_th,title_en)').eq('curriculum_course_id',courseId).maybeSingle();
    if(course.error) return {state:'QUERY_ERROR',activities:[],assessments:[],note:'Selected course could not be verified in the current RLS scope.',courseLabel:null};
    if(!course.data) return {state:'EMPTY',activities:[],assessments:[],note:'Selected course is not visible in the current authenticated RLS scope.',courseLabel:null};
    const raw:any=course.data.courses;
    const c=Array.isArray(raw)?raw[0]:raw;
    courseLabel=`${c?.course_code??'Course'} · ${c?.title_th||c?.title_en||'NO VERIFIED TITLE'}`;
    const [la,ass]=await Promise.all([
      binding.supabase.from('learning_activities').select('learning_activity_id').eq('curriculum_course_id',courseId),
      binding.supabase.from('assessments').select('assessment_id').eq('curriculum_course_id',courseId),
    ]);
    if(la.error||ass.error) return {state:'QUERY_ERROR',activities:[],assessments:[],note:'Selected course teaching/assessment context could not be read.',courseLabel};
    activityIds=(la.data??[]).map(r=>String(r.learning_activity_id));
    assessmentIds=(ass.data??[]).map(r=>String(r.assessment_id));
  }

  let activityQuery=binding.supabase.from('learning_activity_versions').select('learning_activity_version_id,learning_activity_id,title_th,title_en,version_no,is_current').eq('is_current',true).limit(30);
  let assessmentQuery=binding.supabase.from('assessment_versions').select('assessment_version_id,assessment_id,title_th,title_en,version_no,is_current').eq('is_current',true).limit(30);
  if(activityIds) activityQuery=activityIds.length?activityQuery.in('learning_activity_id',activityIds):activityQuery.in('learning_activity_id',['00000000-0000-0000-0000-000000000000']);
  if(assessmentIds) assessmentQuery=assessmentIds.length?assessmentQuery.in('assessment_id',assessmentIds):assessmentQuery.in('assessment_id',['00000000-0000-0000-0000-000000000000']);

  const [activityResult, assessmentResult] = await Promise.all([activityQuery,assessmentQuery]);
  if (activityResult.error || assessmentResult.error) return { state:'QUERY_ERROR', activities:[], assessments:[], note:'Current RLS scope could not read controlled pilot options.', courseLabel };

  const activities=(activityResult.data??[]).map(r=>({id:String(r.learning_activity_version_id),label:`${r.title_th || r.title_en || r.learning_activity_id} · v${r.version_no}`}));
  const assessments=(assessmentResult.data??[]).map(r=>({id:String(r.assessment_version_id),label:`${r.title_th || r.title_en || r.assessment_id} · v${r.version_no}`}));
  const scoped=courseId?' Selected course context is preserved and options are filtered to that RLS-visible course.':'';
  return { state:(activities.length||assessments.length)?'VERIFIED':'EMPTY', activities, assessments, note:`Options are read through the authenticated RLS scope.${scoped} Writes remain synthetic-only and authority-checked by database RPC.`, courseLabel };
}

export default async function PilotEntryPage({searchParams}:{searchParams:Promise<{course?:string}>}){
  const {course}=await searchParams;
  const result=await loadOptions(course);
  const backHref=course?`/course-workspace/${encodeURIComponent(course)}`:'/';
  return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · TEACHER WORKSPACE</div><div className="brand">My Academic Workspace</div><p className="brand-sub">Work-first pilot entry for daily teaching records.</p><div className="env">● NON-PRODUCTION</div><nav className="nav"><a href="/">Home</a><a href="/my-courses">My Courses</a><a href="/teaching">Learning & Teaching</a><a href="/assessment">Assessment</a><a href="/plan-actual">Plan vs Actual</a><a className="active" href="/pilot-entry">Quick Entry</a><a href="/evidence">Evidence</a></nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href={backHref}>← {course?'Course Workspace':'My Academic Workspace'}</a><section className="module-hero"><div className="brand-kicker">HEPE · WORK-FIRST PILOT</div><h1>Quick Entry</h1><p>บันทึกการสอนและหลักฐานการประเมินจากงานประจำวัน โดยให้ governance และ traceability ทำงานอยู่ด้านหลัง</p>{result.courseLabel?<p style={{marginTop:8}}><strong>Course context:</strong> {result.courseLabel}</p>:null}</section><div className="pill pass">HEPE-PILOT-01F · SYNTHETIC ONLY</div><article className="card live-panel" style={{marginTop:14}}><div className="label">Authenticated workspace state</div><div className="live-state">{result.state}</div><p className="note">{result.note}</p></article>{result.state==='VERIFIED'?<PilotEntryClient activities={result.activities} assessments={result.assessments}/>:null}<div className="firewall">NON-PRODUCTION / SYNTHETIC TEST DATA ONLY · No real institutional/student/staff data · No production authorization · Human authority preserved.</div></div></section></main>;
}
