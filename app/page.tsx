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
  verification_status: string | null;
  creates_system_authority: boolean | null;
};

type WorkspaceSnapshot = {
  state: string;
  authenticated: boolean;
  userEmail?: string;
  academicPersonId?: string;
  teachingStates: TeachingState[];
};

async function loadWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { state: "RUNTIME_NOT_CONFIGURED", authenticated: false, teachingStates: [] };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* read-only workspace snapshot */ },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return { state: "AUTH_REQUIRED", authenticated: false, teachingStates: [] };

  const { data: actorRows, error: actorError } = await supabase
    .from("actors")
    .select("actor_id")
    .eq("external_identity_subject", user.id)
    .eq("status", "ACTIVE")
    .limit(1);

  if (actorError || !actorRows?.[0]) {
    return { state: "ACTOR_BINDING_NOT_READABLE", authenticated: true, userEmail: user.email, teachingStates: [] };
  }

  const { data: bindingRows, error: bindingError } = await supabase
    .from("academic_person_actor_bindings")
    .select("academic_person_id,binding_status")
    .eq("actor_id", actorRows[0].actor_id)
    .eq("binding_status", "VERIFIED")
    .limit(1);

  if (bindingError || !bindingRows?.[0]) {
    return { state: "ACADEMIC_PERSON_BINDING_NOT_READABLE", authenticated: true, userEmail: user.email, teachingStates: [] };
  }

  const academicPersonId = bindingRows[0].academic_person_id;
  const { data: states, error: stateError } = await supabase
    .from("mr30_effective_teaching_states")
    .select("academic_year,term_code,course_code,source_person_label,academic_person_id,disposition,verification_status,creates_system_authority")
    .eq("academic_person_id", academicPersonId)
    .eq("academic_year", "2569")
    .eq("term_code", "1")
    .order("course_code");

  return {
    state: stateError ? "TEACHING_READ_PARTIAL" : "VERIFIED_READ",
    authenticated: true,
    userEmail: user.email,
    academicPersonId,
    teachingStates: (states ?? []) as TeachingState[],
  };
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={{display:"inline-flex",alignItems:"center",padding:"5px 10px",borderRadius:999,border:"1px solid #cbd5e1",background:"#f8fafc",fontSize:12,fontWeight:700,color:"#475569"}}>{children}</span>;
}

function Metric({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return <article style={{background:"white",border:"1px solid #e2e8f0",borderRadius:18,padding:18,boxShadow:"0 8px 24px rgba(15,23,42,.04)"}}>
    <div style={{fontSize:12,color:"#64748b"}}>{label}</div>
    <div style={{fontSize:28,fontWeight:850,marginTop:6,color:"#0f172a"}}>{value}</div>
    {note && <div style={{fontSize:12,color:"#64748b",marginTop:6,lineHeight:1.5}}>{note}</div>}
  </article>;
}

export default async function Home() {
  const snapshot = await loadWorkspaceSnapshot();
  const verifiedStates = snapshot.teachingStates.filter((s) => (s.verification_status ?? "").includes("VERIFIED")).length;
  const courseCount = new Set(snapshot.teachingStates.map((s) => s.course_code)).size;

  if (!snapshot.authenticated) {
    return (
      <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"linear-gradient(135deg,#f0fdfa,#f8fafc 55%,#eff6ff)"}}>
        <section style={{maxWidth:720,background:"white",border:"1px solid #e2e8f0",borderRadius:24,padding:30,boxShadow:"0 18px 48px rgba(15,23,42,.08)"}}>
          <div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#0f766e"}}>HEPE · ACADEMIC WORKSPACE · NON-PRODUCTION</div>
          <h1 style={{margin:"8px 0 10px"}}>พื้นที่ทำงานอาจารย์</h1>
          <p style={{color:"#475569",lineHeight:1.8}}>กรุณาเข้าสู่ระบบก่อน ระบบจะพาเข้าสู่หน้าหลักที่แสดงงานประจำภาคเรียน รายวิชา และสถานะเอกสาร โดยไม่เริ่มจากหน้าบริหารระบบ</p>
          <a href="/login" style={{display:"inline-block",marginTop:12,padding:"12px 18px",borderRadius:12,background:"#0f766e",color:"white",fontWeight:800,textDecoration:"none"}}>เข้าสู่ระบบ</a>
        </section>
      </main>
    );
  }

  const timeline = [
    ["ก่อนเปิดภาค", "เตรียมข้อมูลรายวิชาและแผนการสอน"],
    ["ต้นภาคเรียน", "จัดทำเอกสารต้นภาคและตรวจความครบถ้วน"],
    ["ระหว่างภาค", "บันทึกการสอน หลักฐาน และผลการประเมิน"],
    ["สิ้นสุดภาค", "สรุปผลการเรียนรู้และผลการดำเนินงาน"],
    ["หลังสิ้นสุดภาค", "ปิดภาคและส่งสัญญาณเข้าสู่การปรับปรุงหลักสูตร"],
  ];

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"28px 22px 48px"}}>
        <header style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#0f766e"}}>HEPE · POST-LOGIN HOME · NON-PRODUCTION</div>
            <h1 style={{margin:"6px 0 6px",fontSize:34}}>พื้นที่ทำงานอาจารย์</h1>
            <p style={{margin:0,color:"#64748b",lineHeight:1.7}}>ภาคเรียนนี้ต้องทำอะไร งานไปถึงไหน และอะไรควรทำต่อ</p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <Pill>ปีการศึกษา 2569</Pill>
            <Pill>ภาคเรียน 1</Pill>
            <Pill>{snapshot.state}</Pill>
          </div>
        </header>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14,marginTop:24}}>
          <Metric label="รายวิชาที่พบใน Teaching State" value={courseCount} note="นับจาก verified person binding และ MR30 effective teaching state" />
          <Metric label="Teaching State ที่มีสถานะ VERIFIED" value={verifiedStates} note={`ทั้งหมด ${snapshot.teachingStates.length} records`} />
          <Metric label="ความครบถ้วน มคอ. ภาคเรียนนี้" value="ยังไม่เชื่อม" note="จะไม่สร้างเปอร์เซ็นต์จำลองจนกว่าจะมี M.Kor read model จริง" />
          <Metric label="งานเร่งด่วน" value="ยังไม่เชื่อม" note="รอ deadline/completeness engine ที่ตรวจสอบได้" />
        </section>

        <section style={{marginTop:22,background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <div><h2 style={{margin:0,fontSize:20}}>Timeline การจัดทำ มคอ.</h2><p style={{margin:"5px 0 0",fontSize:13,color:"#64748b"}}>โครงสร้างตามวงจรภาคเรียนที่ LOCK ไว้; สถานะจริงจะเชื่อมเมื่อ M.Kor runtime พร้อม</p></div>
            <Pill>NO MOCK STATUS</Pill>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginTop:16}}>
            {timeline.map(([phase,description],i) => <div key={phase} style={{padding:16,borderRadius:16,border:"1px solid #e2e8f0",background:i===0?"#f0fdfa":"#fff"}}>
              <div style={{fontSize:12,fontWeight:800,color:"#0f766e"}}>STEP {i+1}</div>
              <strong style={{display:"block",marginTop:5}}>{phase}</strong>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.6,marginBottom:8}}>{description}</p>
              <span style={{fontSize:11,fontWeight:800,color:"#92400e",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:999,padding:"4px 8px"}}>READ MODEL PENDING</span>
            </div>)}
          </div>
        </section>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginTop:22}}>
          <a href="/teaching" style={{textDecoration:"none",color:"inherit",background:"white",border:"1px solid #bbf7d0",borderRadius:20,padding:20}}>
            <div style={{fontSize:12,fontWeight:800,color:"#166534"}}>PRIMARY WORKSPACE</div>
            <h3 style={{margin:"7px 0 7px"}}>รายวิชาของฉัน</h3>
            <p style={{margin:0,color:"#64748b",lineHeight:1.65}}>เปิดรายวิชาที่ผูกกับบุคคลจาก MR30 effective teaching state และดู provenance ก่อนพัฒนา M.Kor workspace ต่อ</p>
          </a>
          <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:20}}>
            <div style={{fontSize:12,fontWeight:800,color:"#475569"}}>NEXT BUILD</div>
            <h3 style={{margin:"7px 0 7px"}}>มคอ.ของฉัน</h3>
            <p style={{margin:0,color:"#64748b",lineHeight:1.65}}>Create/Edit/Validate/Preview/Submit พร้อม One Data Entry → Many Outputs จะเชื่อมใน wave ถัดไป</p>
          </div>
          <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:20}}>
            <div style={{fontSize:12,fontWeight:800,color:"#475569"}}>NEXT BUILD</div>
            <h3 style={{margin:"7px 0 7px"}}>เตรียมปรับปรุงหลักสูตร</h3>
            <p style={{margin:0,color:"#64748b",lineHeight:1.65}}>Signal → Evidence → Analysis → Priority → Recommendation → Human Decision → Follow-up</p>
          </div>
        </section>

        {snapshot.teachingStates.length > 0 && <section style={{marginTop:22,background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div><h2 style={{margin:0,fontSize:20}}>รายวิชาที่ระบบพบในภาคเรียนนี้</h2><p style={{margin:"5px 0 0",fontSize:13,color:"#64748b"}}>แสดงจาก Verified System Data; ไม่ตีความเป็น course ownership หรือ authority เพิ่มเติม</p></div>
            <a href="/teaching" style={{fontWeight:800,color:"#0f766e",textDecoration:"none"}}>ดูทั้งหมด →</a>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,marginTop:14}}>
            {snapshot.teachingStates.slice(0,6).map((s) => <article key={`${s.course_code}-${s.disposition}`} style={{padding:14,border:"1px solid #e2e8f0",borderRadius:14}}>
              <strong>{s.course_code}</strong>
              <div style={{fontSize:13,color:"#64748b",marginTop:6}}>{s.source_person_label ?? "—"}</div>
              <div style={{fontSize:12,color:"#475569",marginTop:8}}>{s.disposition ?? "NO DISPOSITION"}</div>
            </article>)}
          </div>
        </section>}

        <section style={{marginTop:22,padding:18,borderRadius:18,background:"#eef2ff",border:"1px solid #c7d2fe"}}>
          <strong>Programme Administration / Governance</strong>
          <p style={{margin:"7px 0 12px",color:"#475569",lineHeight:1.7}}>ส่วนนี้เป็น secondary navigation ตามบทบาท ไม่ใช่หน้าเริ่มต้นของผู้สอน</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <a href="/governance/course-equivalence" style={{padding:"9px 12px",borderRadius:10,background:"white",border:"1px solid #c7d2fe",textDecoration:"none",color:"#3730a3",fontWeight:800}}>Course Equivalence</a>
            <a href="/governance/responsibilities" style={{padding:"9px 12px",borderRadius:10,background:"white",border:"1px solid #c7d2fe",textDecoration:"none",color:"#3730a3",fontWeight:800}}>Academic Responsibility</a>
            <a href="/governance/evidence" style={{padding:"9px 12px",borderRadius:10,background:"white",border:"1px solid #c7d2fe",textDecoration:"none",color:"#3730a3",fontWeight:800}}>Evidence Explorer</a>
          </div>
        </section>

        <footer style={{marginTop:26,fontSize:12,color:"#64748b",lineHeight:1.7}}>VERIFIED SYSTEM DATA is shown where available. Calculated or unavailable M.Kor states are not fabricated. NON-PRODUCTION · No automatic Audit Evidence Admission · Human authority preserved.</footer>
      </div>
    </main>
  );
}
