import { getHepeServerSupabase } from '../../../lib/hepe/server-supabase';

export const dynamic='force-dynamic';

type State='RUNTIME_NOT_CONFIGURED'|'AUTH_REQUIRED'|'QUERY_ERROR'|'EMPTY'|'VERIFIED';

type CourseSummary={
  curriculum_course_id:string;
  course_code:string;
  title_th:string|null;
  title_en:string|null;
  credit_value:number|null;
  learning_activities:number;
  assessments:number;
  deliveries:number;
};

async function loadCourse(id:string):Promise<{state:State;course:CourseSummary|null;note:string}>{
  const binding=await getHepeServerSupabase();
  if(!binding.ok) return {state:'RUNTIME_NOT_CONFIGURED',course:null,note:'Preview runtime binding is unavailable.'};
  const {data:userData,error:userError}=await binding.supabase.auth.getUser();
  if(userError||!userData.user) return {state:'AUTH_REQUIRED',course:null,note:'Authenticated HEPE session required.'};

  const courseResult=await binding.supabase
    .from('curriculum_courses')
    .select('curriculum_course_id,courses!inner(course_code,title_th,title_en,credit_value)')
    .eq('curriculum_course_id',id)
    .maybeSingle();
  if(courseResult.error) return {state:'QUERY_ERROR',course:null,note:'Current RLS scope could not read this course.'};
  if(!courseResult.data) return {state:'EMPTY',course:null,note:'Course is not visible in the current authenticated RLS scope.'};

  const [activities,assessments]=await Promise.all([
    binding.supabase.from('learning_activities').select('learning_activity_id').eq('curriculum_course_id',id),
    binding.supabase.from('assessments').select('assessment_id').eq('curriculum_course_id',id),
  ]);
  if(activities.error||assessments.error) return {state:'QUERY_ERROR',course:null,note:'Course-linked teaching or assessment context could not be read.'};

  const activityIds=(activities.data??[]).map(r=>r.learning_activity_id);
  let deliveries=0;
  if(activityIds.length){
    const versions=await binding.supabase.from('learning_activity_versions').select('learning_activity_version_id').in('learning_activity_id',activityIds).eq('is_current',true);
    if(versions.error) return {state:'QUERY_ERROR',course:null,note:'Current learning activity versions could not be read.'};
    const versionIds=(versions.data??[]).map(r=>r.learning_activity_version_id);
    if(versionIds.length){
      const deliveryResult=await binding.supabase.from('learning_activity_deliveries').select('learning_activity_delivery_id',{count:'exact',head:true}).in('learning_activity_version_id',versionIds);
      if(deliveryResult.error) return {state:'QUERY_ERROR',course:null,note:'Delivery progress could not be read.'};
      deliveries=deliveryResult.count??0;
    }
  }

  const c:any=courseResult.data.courses;
  const course=Array.isArray(c)?c[0]:c;
  return {state:'VERIFIED',course:{
    curriculum_course_id:String(courseResult.data.curriculum_course_id),
    course_code:String(course?.course_code??'NO VERIFIED CODE'),
    title_th:course?.title_th??null,
    title_en:course?.title_en??null,
    credit_value:course?.credit_value??null,
    learning_activities:(activities.data??[]).length,
    assessments:(assessments.data??[]).length,
    deliveries,
  },note:'Course context is assembled only from authenticated RLS-scoped reads. No privileged fallback is used.'};
}

export default async function CourseWorkspacePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const result=await loadCourse(id);
  const c=result.course;
  return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · TEACHER WORKSPACE</div><div className="brand">Course Workspace</div><p className="brand-sub">รายวิชาเป็นจุดเริ่มต้น งานกำกับทำงานอยู่ด้านหลัง</p><div className="env">● NON-PRODUCTION</div><nav className="nav"><a href="/">My Workspace</a><a href="/my-courses">My Courses</a><a href="/pilot-entry">Quick Entry</a><a href="/teaching">Learning & Teaching</a><a href="/assessment">Assessment</a><a href="/plan-actual">Plan vs Actual</a><a href="/evidence">Evidence</a></nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/my-courses">← My Courses</a><section className="module-hero"><div className="brand-kicker">HEPE · COURSE WORKSPACE</div><h1>{c?`${c.course_code} · ${c.title_th||c.title_en||'รายวิชา'}`:'Course Workspace'}</h1><p>พื้นที่ทำงานรายวิชาเดียวสำหรับ Teaching, Assessment, Evidence และ Plan vs Actual โดยไม่ต้องไล่เมนู Governance</p></section><div className="pill pass">HEPE USABLE-APP · RLS SCOPED</div><article className="card live-panel" style={{marginTop:14}}><div className="label">Authenticated course workspace state</div><div className="live-state">{result.state}</div><p className="note">{result.note}</p></article>{c?<><section className="grid g3" style={{marginTop:14}}>{[["Learning activities",String(c.learning_activities)],["Assessments",String(c.assessments)],["Delivery records",String(c.deliveries)]].map(([a,b])=><article className="card" key={a}><div className="label">{a}</div><div className="value">{b}</div></article>)}</section><article className="card" style={{marginTop:14}}><div className="brand-kicker">COURSE CONTINUITY</div><h2 className="section-title">ทำงานรายวิชานี้ต่อ</h2><p className="note">{c.title_en??''}{c.credit_value!==null?` · ${c.credit_value} credits`:''}</p><div className="hero-actions" style={{marginTop:12}}><a className="button" href="/pilot-entry">บันทึกหลังสอน</a><a className="button secondary" href="/teaching">Teaching Record</a><a className="button secondary" href="/assessment">Assessment</a><a className="button secondary" href="/plan-actual">Plan vs Actual</a><a className="button secondary" href="/evidence">Evidence</a></div></article></>:null}<div className="firewall">NON-PRODUCTION / SYNTHETIC TEST DATA ONLY · Course visibility is RLS-scoped · Human academic authority preserved.</div></div></section></main>;
}
