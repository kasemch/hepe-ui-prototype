import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type TeachingState = {
  academic_year: string;
  term_code: string;
  course_code: string;
  source_person_label: string | null;
  academic_person_id: string | null;
  disposition: string | null;
  source_chain: string[] | null;
  verification_status: string | null;
  creates_system_authority: boolean | null;
  calculated_at: string | null;
};

type Result = {
  state: string;
  authenticated: boolean;
  email?: string;
  academicPersonId?: string;
  rows: TeachingState[];
};

async function loadMyTeaching(): Promise<Result> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { state: "RUNTIME_NOT_CONFIGURED", authenticated: false, rows: [] };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() { /* read-only */ } },
  });

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return { state: "AUTH_REQUIRED", authenticated: false, rows: [] };

  const { data: actorRows, error: actorError } = await supabase
    .from("actors")
    .select("actor_id")
    .eq("external_identity_subject", user.id)
    .eq("status", "ACTIVE")
    .limit(1);

  if (actorError || !actorRows?.[0]) return { state: "ACTOR_BINDING_NOT_READABLE", authenticated: true, email: user.email, rows: [] };

  const { data: bindings, error: bindingError } = await supabase
    .from("academic_person_actor_bindings")
    .select("academic_person_id,binding_status")
    .eq("actor_id", actorRows[0].actor_id)
    .eq("binding_status", "VERIFIED")
    .limit(1);

  if (bindingError || !bindings?.[0]) return { state: "ACADEMIC_PERSON_BINDING_NOT_READABLE", authenticated: true, email: user.email, rows: [] };

  const academicPersonId = bindings[0].academic_person_id;
  const { data, error } = await supabase
    .from("mr30_effective_teaching_states")
    .select("academic_year,term_code,course_code,source_person_label,academic_person_id,disposition,source_chain,verification_status,creates_system_authority,calculated_at")
    .eq("academic_person_id", academicPersonId)
    .eq("academic_year", "2569")
    .eq("term_code", "1")
    .order("course_code");

  return {
    state: error ? "TEACHING_READ_PARTIAL" : "VERIFIED_READ",
    authenticated: true,
    email: user.email,
    academicPersonId,
    rows: (data ?? []) as TeachingState[],
  };
}

export default async function TeachingPage() {
  const result = await loadMyTeaching();

  if (!result.authenticated) {
    return <main style={{maxWidth:820,margin:"48px auto",padding:24}}><section style={{background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:24}}><h1>รายวิชาของฉัน</h1><p>กรุณาเข้าสู่ระบบก่อน</p><a href="/login">เข้าสู่ระบบ</a></section></main>;
  }

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc"}}>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"28px 22px 48px"}}>
        <header style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#0f766e"}}>HEPE · MY TEACHING · NON-PRODUCTION</div>
            <h1 style={{margin:"6px 0 6px",fontSize:32}}>รายวิชาของฉัน</h1>
            <p style={{margin:0,color:"#64748b",lineHeight:1.7}}>รายการจาก MR30 Effective Teaching State ที่ผูกกับ Academic Person ของผู้ใช้ที่ authenticated</p>
          </div>
          <div style={{padding:"8px 12px",borderRadius:999,border:"1px solid #cbd5e1",background:"white",fontSize:12,fontWeight:800,color:"#475569"}}>{result.state}</div>
        </header>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:22}}>
          <div style={{padding:16,border:"1px solid #e2e8f0",borderRadius:16,background:"white"}}><div style={{fontSize:12,color:"#64748b"}}>อีเมล</div><strong style={{display:"block",marginTop:5}}>{result.email ?? "—"}</strong></div>
          <div style={{padding:16,border:"1px solid #e2e8f0",borderRadius:16,background:"white"}}><div style={{fontSize:12,color:"#64748b"}}>Academic Person</div><strong style={{display:"block",marginTop:5,fontSize:13}}>{result.academicPersonId ?? "—"}</strong></div>
          <div style={{padding:16,border:"1px solid #e2e8f0",borderRadius:16,background:"white"}}><div style={{fontSize:12,color:"#64748b"}}>ปีการศึกษา / ภาค</div><strong style={{display:"block",marginTop:5}}>2569 / 1</strong></div>
          <div style={{padding:16,border:"1px solid #e2e8f0",borderRadius:16,background:"white"}}><div style={{fontSize:12,color:"#64748b"}}>Teaching State Records</div><strong style={{display:"block",marginTop:5,fontSize:24}}>{result.rows.length}</strong></div>
        </section>

        <section style={{marginTop:20,background:"white",border:"1px solid #e2e8f0",borderRadius:20,overflow:"hidden"}}>
          <div style={{padding:18,borderBottom:"1px solid #e2e8f0"}}><strong>Verified / Calculated Teaching Context</strong><p style={{margin:"5px 0 0",fontSize:13,color:"#64748b"}}>Teaching responsibility ไม่สร้าง authority โดยอัตโนมัติ และหน้านี้ยังไม่ถือเป็น M.Kor completeness record</p></div>
          {result.rows.length===0 ? <div style={{padding:24,color:"#64748b"}}>ไม่พบ Teaching State ที่อ่านได้สำหรับบุคคลนี้ใน 2569/1 — ระบบไม่สร้างรายการจำลอง</div> : <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
              <thead><tr style={{background:"#f8fafc",textAlign:"left"}}>{["รายวิชา","Source Person Label","Disposition","Verification","Authority?","Calculated"].map(h=><th key={h} style={{padding:"12px 14px",fontSize:12,color:"#475569",borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
              <tbody>{result.rows.map((row,index)=><tr key={`${row.course_code}-${index}`}>
                <td style={{padding:"13px 14px",borderBottom:"1px solid #f1f5f9",fontWeight:800}}>{row.course_code}</td>
                <td style={{padding:"13px 14px",borderBottom:"1px solid #f1f5f9"}}>{row.source_person_label ?? "—"}</td>
                <td style={{padding:"13px 14px",borderBottom:"1px solid #f1f5f9",fontSize:13}}>{row.disposition ?? "—"}</td>
                <td style={{padding:"13px 14px",borderBottom:"1px solid #f1f5f9",fontSize:12}}>{row.verification_status ?? "—"}</td>
                <td style={{padding:"13px 14px",borderBottom:"1px solid #f1f5f9",fontSize:12}}>{row.creates_system_authority ? "YES" : "NO"}</td>
                <td style={{padding:"13px 14px",borderBottom:"1px solid #f1f5f9",fontSize:12}}>{row.calculated_at ? new Date(row.calculated_at).toLocaleString("th-TH") : "—"}</td>
              </tr>)}</tbody>
            </table>
          </div>}
        </section>

        <section style={{marginTop:20,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
          <div style={{padding:18,borderRadius:18,background:"#f0fdfa",border:"1px solid #99f6e4"}}><strong>ถัดไป: M.Kor Workspace</strong><p style={{margin:"7px 0 0",color:"#475569",lineHeight:1.7}}>เชื่อม Course → Controlled Curriculum Data → M.Kor sections → validation → preview → submission โดยไม่กรอกข้อมูลซ้ำ</p></div>
          <div style={{padding:18,borderRadius:18,background:"#eff6ff",border:"1px solid #bfdbfe"}}><strong>ถัดไป: Evidence Workspace</strong><p style={{margin:"7px 0 0",color:"#475569",lineHeight:1.7}}>ผูกหลักฐานกับรายวิชา ภาคเรียน CLO/PLO การประเมิน และ review โดยรักษา provenance</p></div>
        </section>

        <div style={{marginTop:22,display:"flex",gap:10,flexWrap:"wrap"}}><a href="/" style={{padding:"10px 13px",borderRadius:10,background:"white",border:"1px solid #cbd5e1",textDecoration:"none",color:"#334155",fontWeight:800}}>← หน้าหลัก</a><a href="/governance/responsibilities" style={{padding:"10px 13px",borderRadius:10,background:"white",border:"1px solid #cbd5e1",textDecoration:"none",color:"#334155",fontWeight:800}}>ดู Academic Responsibility</a></div>
      </div>
    </main>
  );
}
