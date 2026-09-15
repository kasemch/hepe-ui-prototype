import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Row={course_offering_id:string;course_code:string;academic_year:string;term_code:string;document_type:string|null;document_status:string|null;provenance_status:string|null;current_version_no:number|null;completeness_state:string;completeness_reason:string;assignment_role:string;assignment_status:string;verification_status:string};
type Snapshot={authenticated:boolean;state:string;rows:Row[]};

async function loadSnapshot():Promise<Snapshot>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return{authenticated:false,state:"RUNTIME_NOT_CONFIGURED",rows:[]};
 const cs=await cookies(); const supabase=createServerClient(url,key,{cookies:{getAll(){return cs.getAll()},setAll(){}}});
 const {data:a}=await supabase.auth.getUser(); const user=a.user; if(!user)return{authenticated:false,state:"AUTH_REQUIRED",rows:[]};
 const {data:actors}=await supabase.from("actors").select("actor_id").eq("external_identity_subject",user.id).eq("status","ACTIVE").limit(1);
 if(!actors?.[0])return{authenticated:true,state:"ACTOR_BINDING_NOT_READABLE",rows:[]};
 const {data:bindings}=await supabase.from("academic_person_actor_bindings").select("academic_person_id").eq("actor_id",actors[0].actor_id).eq("binding_status","VERIFIED").limit(1);
 if(!bindings?.[0])return{authenticated:true,state:"ACADEMIC_PERSON_BINDING_NOT_READABLE",rows:[]};
 const {data:assignments,error:ae}=await supabase.from("person_course_teaching_assignments").select("programme_id,curriculum_version_id,course_id,academic_year,term_code,assignment_role,assignment_status,verification_status").eq("academic_person_id",bindings[0].academic_person_id).eq("academic_year","2569").eq("term_code","1");
 if(ae)return{authenticated:true,state:"ASSIGNMENT_READ_FAILED",rows:[]};
 const verified=(assignments??[]).filter(x=>(x.verification_status??"").includes("VERIFIED")&&(x.assignment_status??"").includes("VERIFIED"));
 const rows:Row[]=[];
 for(const x of verified){
  const {data:offerings}=await supabase.from("v_hepe_mkor_workspace_v1").select("course_offering_id,course_code,academic_year,term_code,document_type,document_status,provenance_status,current_version_no,completeness_state,completeness_reason").eq("programme_id",x.programme_id).eq("curriculum_version_id",x.curriculum_version_id).eq("course_id",x.course_id).eq("academic_year",x.academic_year).eq("term_code",x.term_code);
  if(!offerings?.length){continue}
  for(const o of offerings)rows.push({...o,assignment_role:x.assignment_role,assignment_status:x.assignment_status,verification_status:x.verification_status} as Row);
 }
 return{authenticated:true,state:"VERIFIED_PERSON_SCOPED_MKOR_READ",rows};
}

export default async function MkorPage(){const s=await loadSnapshot();if(!s.authenticated)return <main style={{maxWidth:820,margin:"48px auto",padding:24}}><h1>มคอ.ของฉัน</h1><p>กรุณาเข้าสู่ระบบก่อน</p><a href="/login">เข้าสู่ระบบ</a></main>;
 const complete=s.rows.filter(r=>r.completeness_state==="COMPLETE").length,inProgress=s.rows.filter(r=>r.completeness_state==="IN_PROGRESS").length,notStarted=s.rows.filter(r=>r.completeness_state==="NOT_STARTED").length;
 return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}><div style={{maxWidth:1180,margin:"0 auto",padding:"28px 22px 48px"}}><header><div style={{fontSize:13,fontWeight:800,color:"#0f766e"}}>HEPE · M.KOR WORKSPACE · NON-PRODUCTION</div><h1>มคอ.ของฉัน</h1><p style={{color:"#64748b"}}>แสดงเฉพาะ Course Offering ที่เชื่อมกับ Verified Teaching Assignment และ persisted document state</p></header>
 <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginTop:18}}>{[["Workspace records",s.rows.length],["Complete",complete],["In progress",inProgress],["Not started",notStarted]].map(([l,v])=><div key={String(l)} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>{l}</div><strong style={{fontSize:24}}>{v}</strong></div>)}</section>
 <section style={{marginTop:20,padding:16,borderRadius:16,background:"#f0fdfa",border:"1px solid #99f6e4"}}><strong>{s.state}</strong><p style={{margin:"6px 0 0",color:"#475569"}}>Completeness เป็น CALCULATED STATE จาก persisted document record เท่านั้น ไม่ใช่ Audit Evidence admission และ Teaching Assignment ไม่ได้สร้าง authority เพิ่มเติม</p></section>
 <section style={{marginTop:20,background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:18}}><h2>รายวิชาและสถานะ มคอ.</h2>{s.rows.length===0?<p style={{color:"#64748b"}}>ยังไม่พบ verified assignment ที่เชื่อมกับ Course Offering ซึ่งอ่านได้ ระบบไม่สร้างรายการจำลอง</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>{s.rows.map((r,i)=><a key={`${r.course_offering_id}-${r.document_type??"none"}-${i}`} href={`/mkor/${r.course_offering_id}`} style={{textDecoration:"none",color:"inherit",border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>VERIFIED ASSIGNMENT · {r.assignment_role}</div><h3 style={{margin:"6px 0"}}>{r.course_code}</h3><strong>{r.document_type??"TQF3 / TQF5"}: {r.completeness_state}</strong><p style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>{r.completeness_reason}</p><small>{r.document_status??"NO DOCUMENT"} · version {r.current_version_no??0} · {r.provenance_status??"NO PROVENANCE"}</small></a>)}</div>}</section>
 <div style={{marginTop:22,display:"flex",gap:12}}><a href="/">← หน้าหลัก</a><a href="/teaching">รายวิชาของฉัน</a></div></div></main>}
