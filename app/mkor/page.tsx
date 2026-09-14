import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type TeachingState = {
  academic_year: string;
  term_code: string;
  course_code: string;
  source_person_label: string | null;
  disposition: string | null;
  verification_status: string | null;
};

type Snapshot = {
  authenticated: boolean;
  state: string;
  rows: TeachingState[];
};

async function loadSnapshot(): Promise<Snapshot> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { authenticated: false, state: "RUNTIME_NOT_CONFIGURED", rows: [] };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() { /* read-only */ } },
  });
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return { authenticated: false, state: "AUTH_REQUIRED", rows: [] };

  const { data: actors } = await supabase.from("actors").select("actor_id").eq("external_identity_subject", user.id).eq("status", "ACTIVE").limit(1);
  if (!actors?.[0]) return { authenticated: true, state: "ACTOR_BINDING_NOT_READABLE", rows: [] };
  const { data: bindings } = await supabase.from("academic_person_actor_bindings").select("academic_person_id").eq("actor_id", actors[0].actor_id).eq("binding_status", "VERIFIED").limit(1);
  if (!bindings?.[0]) return { authenticated: true, state: "ACADEMIC_PERSON_BINDING_NOT_READABLE", rows: [] };

  const { data, error } = await supabase.from("mr30_effective_teaching_states")
    .select("academic_year,term_code,course_code,source_person_label,disposition,verification_status")
    .eq("academic_person_id", bindings[0].academic_person_id)
    .eq("academic_year", "2569").eq("term_code", "1").order("course_code");

  return { authenticated: true, state: error ? "TEACHING_READ_PARTIAL" : "VERIFIED_TEACHING_CONTEXT", rows: (data ?? []) as TeachingState[] };
}

export default async function MkorPage() {
  const snapshot = await loadSnapshot();
  if (!snapshot.authenticated) return <main style={{maxWidth:820,margin:"48px auto",padding:24}}><h1>มคอ.ของฉัน</h1><p>กรุณาเข้าสู่ระบบก่อน</p><a href="/login">เข้าสู่ระบบ</a></main>;

  return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}><div style={{maxWidth:1180,margin:"0 auto",padding:"28px 22px 48px"}}>
    <header><div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#0f766e"}}>HEPE · M.KOR WORKSPACE · NON-PRODUCTION</div><h1 style={{margin:"7px 0"}}>มคอ.ของฉัน</h1><p style={{margin:0,color:"#64748b",lineHeight:1.7}}>เริ่มจากรายวิชาที่ระบบยืนยันความเชื่อมโยงกับผู้สอนแล้ว และแยกสถานะเอกสารออกจาก Teaching State อย่างชัดเจน</p></header>

    <section style={{marginTop:20,padding:16,borderRadius:16,background:"#fffbeb",border:"1px solid #fde68a"}}><strong>Evidence-first boundary</strong><p style={{margin:"6px 0 0",lineHeight:1.7,color:"#854d0e"}}>ขณะนี้ยังไม่พบ Controlled M.Kor document/completeness read model ที่ยืนยันได้ จึงไม่สร้างเปอร์เซ็นต์ ความครบถ้วน deadline หรือสถานะเอกสารจำลอง หน้านี้เปิดเฉพาะ workspace entry จาก Verified Teaching Context ก่อน</p></section>

    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:18}}>
      <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>ปีการศึกษา / ภาค</div><strong>2569 / 1</strong></div>
      <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>Teaching Context</div><strong>{snapshot.rows.length} records</strong></div>
      <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>M.Kor Completeness</div><strong>READ MODEL PENDING</strong></div>
      <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>Runtime state</div><strong>{snapshot.state}</strong></div>
    </section>

    <section style={{marginTop:20,background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:18}}><h2 style={{marginTop:0}}>เลือกรายวิชาเพื่อเข้าสู่พื้นที่ มคอ.</h2>{snapshot.rows.length===0?<p style={{color:"#64748b"}}>ไม่พบรายวิชาที่อ่านได้ ระบบไม่สร้างรายการจำลอง</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>{snapshot.rows.map((row,index)=><article key={`${row.course_code}-${index}`} style={{border:"1px solid #e2e8f0",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#64748b"}}>VERIFIED / CALCULATED TEACHING CONTEXT</div><h3 style={{margin:"6px 0"}}>{row.course_code}</h3><p style={{margin:"4px 0",color:"#475569"}}>{row.source_person_label ?? "—"}</p><div style={{fontSize:12,color:"#64748b",marginTop:8}}>{row.disposition ?? "—"} · {row.verification_status ?? "—"}</div><div style={{marginTop:14,padding:"9px 11px",borderRadius:10,background:"#f8fafc",fontSize:12,fontWeight:800,color:"#64748b"}}>M.Kor document runtime: PENDING VERIFIED READ MODEL</div></article>)}</div>}</section>

    <section style={{marginTop:20,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}><div style={{padding:18,borderRadius:18,background:"#f0fdfa",border:"1px solid #99f6e4"}}><strong>Next controlled build</strong><p style={{margin:"7px 0 0",color:"#475569",lineHeight:1.7}}>ตรวจ schema/read models ที่มีอยู่จริง แล้ว bind Course → Curriculum Baseline → M.Kor Document → Version → Validation → Submission โดยไม่สร้างข้อมูลเทียม</p></div><div style={{padding:18,borderRadius:18,background:"#eff6ff",border:"1px solid #bfdbfe"}}><strong>One Data Entry → Many Outputs</strong><p style={{margin:"7px 0 0",color:"#475569",lineHeight:1.7}}>จะเปิดเมื่อ source/version/provenance ของข้อมูลที่จะ carry forward ตรวจสอบได้ และต้องมี human confirmation ก่อนเปลี่ยน controlled content</p></div></section>
    <div style={{marginTop:22,display:"flex",gap:10}}><a href="/" style={{fontWeight:800,color:"#0f766e"}}>← หน้าหลัก</a><a href="/teaching" style={{fontWeight:800,color:"#0f766e"}}>รายวิชาของฉัน</a></div>
  </div></main>;
}
