import { getHepeServerSupabase } from '../../lib/hepe/server-supabase';

export const dynamic='force-dynamic';

type State='RUNTIME_NOT_CONFIGURED'|'AUTH_REQUIRED'|'QUERY_ERROR'|'EMPTY'|'VERIFIED';
type Course={course_id:string;course_code:string;title_th:string|null;title_en:string|null;credit_value:number|null;curriculum_course_id:string};

async function loadCourses():Promise<{state:State;rows:Course[];note:string}>{
 const binding=await getHepeServerSupabase();
 if(!binding.ok) return {state:'RUNTIME_NOT_CONFIGURED',rows:[],note:'Preview runtime binding is unavailable.'};
 const {data:userData,error:userError}=await binding.supabase.auth.getUser();
 if(userError||!userData.user) return {state:'AUTH_REQUIRED',rows:[],note:'Authenticated HEPE session required.'};
 const {data,error}=await binding.supabase.from('courses').select('course_id,course_code,title_th,title_en,credit_value,curriculum_courses!inner(curriculum_course_id)').order('course_code').limit(30);
 if(error) return {state:'QUERY_ERROR',rows:[],note:'Current RLS scope could not read assigned course context.'};
 const rows=(data??[]).flatMap((r:any)=>{
   const links=Array.isArray(r.curriculum_courses)?r.curriculum_courses:[r.curriculum_courses].filter(Boolean);
   return links.map((cc:any)=>({course_id:String(r.course_id),course_code:String(r.course_code),title_th:r.title_th??null,title_en:r.title_en??null,credit_value:r.credit_value??null,curriculum_course_id:String(cc.curriculum_course_id)}));
 });
 return {state:rows.length?'VERIFIED':'EMPTY',rows,note:'Courses are shown only through the authenticated RLS scope. No service-role fallback is used.'};
}

export default async function MyCoursesPage(){
 const result=await loadCourses();
 return <main className="shell"><aside className="sidebar"><div className="brand-kicker">HEPE · TEACHER WORKSPACE</div><div className="brand">My Academic Workspace</div><p className="brand-sub">งานสอนก่อน ระบบกำกับทำงานอยู่ด้านหลัง</p><div className="env">● NON-PRODUCTION</div><nav className="nav"><a href="/">My Workspace</a><a className="active" href="/my-courses">My Courses</a><a href="/pilot-entry">Quick Entry</a><a href="/teaching">Learning & Teaching</a><a href="/assessment">Assessment</a><a href="/plan-actual">Plan vs Actual</a><a href="/evidence">Evidence</a></nav></aside><section className="workspace"><div className="module-wrap"><a className="breadcrumb" href="/">← My Academic Workspace</a><section className="module-hero"><div className="brand-kicker">HEPE · MY COURSES</div><h1>รายวิชาของฉัน</h1><p>เริ่มจากรายวิชาที่ผู้ใช้มีสิทธิ์เห็น แล้วเข้าบันทึกการสอน การประเมิน และติดตาม Plan vs Actual ได้จากจุดเดียว</p></section><div className="pill pass">HEPE USABLE-APP · RLS SCOPED</div><article className="card live-panel" style={{marginTop:14}}><div className="label">Authenticated course state</div><div className="live-state">{result.state}</div><p className="note">{result.note}</p></article>{result.rows.length?<section className="grid g2" style={{marginTop:14}}>{result.rows.map(c=><article className="card interactive" key={c.curriculum_course_id}><div className="brand-kicker">{c.course_code}</div><h2 className="section-title">{c.title_th||c.title_en||'NO VERIFIED TITLE'}</h2><p className="note">{c.title_en&&c.title_th?c.title_en:''}{c.credit_value!==null?` · ${c.credit_value} credits`:''}</p><div className="hero-actions" style={{marginTop:12}}><a className="button" href="/pilot-entry">บันทึกหลังสอน</a><a className="button secondary" href="/teaching">Teaching Record</a><a className="button secondary" href="/assessment">Assessment</a><a className="button secondary" href="/plan-actual">Plan vs Actual</a></div></article>)}</section>:null}<div className="firewall">NON-PRODUCTION / SYNTHETIC TEST DATA ONLY · RLS-scoped course visibility · Human academic authority preserved.</div></div></section></main>;
}
