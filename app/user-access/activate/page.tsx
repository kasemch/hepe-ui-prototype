"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type BindingResult = {
  ok?: boolean;
  gate?: string;
  environment?: string;
  academic_person_id?: string;
  actor_id?: string;
  binding_id?: string;
  authority_assignment_id?: string;
  role_code?: string;
  authority_level?: string;
  programme_code?: string;
  created_actor?: boolean;
  created_binding?: boolean;
  created_assignment?: boolean;
  evidence_candidate_id?: string;
  evidence_admission?: string;
};

export default function ActivateUserAccessPage() {
  const [email, setEmail] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [activating, setActivating] = useState(false);
  const [result, setResult] = useState<BindingResult | null>(null);
  const [error, setError] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;
    return createBrowserClient(url, key);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        if (mounted) setLoadingUser(false);
        return;
      }
      const { data, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;
      if (userError || !data.user) {
        setError("ยังไม่มี authenticated session กรุณาเข้าสู่ระบบด้วย Magic Link ก่อน");
        setLoadingUser(false);
        return;
      }
      setEmail(data.user.email ?? "");
      setLoadingUser(false);
    }
    load();
    return () => { mounted = false; };
  }, [supabase]);

  async function activate() {
    if (!supabase || activating) return;
    setActivating(true);
    setError("");

    const { data, error: rpcError } = await supabase.rpc("hepe_people_01b2h_bind_current_programme_chair");
    if (rpcError) {
      setError(rpcError.message || "ไม่สามารถผูก Human Authority ได้");
      setActivating(false);
      return;
    }

    setResult((data ?? {}) as BindingResult);
    setActivating(false);
  }

  const ready = !loadingUser && Boolean(email) && !result;

  return (
    <main style={{maxWidth:900,margin:"40px auto",padding:24}}>
      <section style={{background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:26}}>
        <div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#475569"}}>HEPE · PEOPLE-01B.2H-A1</div>
        <h1 style={{margin:"6px 0 8px"}}>Human Authority Binding Readiness</h1>
        <p style={{marginTop:0,color:"#64748b",lineHeight:1.7}}>
          ขั้นตอนนี้ผูก authenticated institutional identity กับ Academic Person ที่ตรวจสอบแล้ว และสร้างสิทธิ์ PROGRAMME_CHAIR A4
          เฉพาะหลักสูตร 25510071103503 ใน HEPE NON-PRODUCTION โดยใช้ controlled source ที่ล็อกไว้ใน gate นี้
        </p>

        <div style={{display:"grid",gap:12,marginTop:22}}>
          <div style={{padding:16,borderRadius:14,background:"#f8fafc",border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:13,color:"#64748b"}}>Authenticated institutional email</div>
            <strong>{loadingUser ? "กำลังตรวจ session..." : email || "ยังไม่ authenticated"}</strong>
          </div>
          <div style={{padding:16,borderRadius:14,background:"#eff6ff",border:"1px solid #bfdbfe"}}>
            <strong>Controlled role source</strong>
            <p style={{margin:"6px 0 0",lineHeight:1.65,color:"#334155"}}>
              รายงานการประชุมคณะกรรมการบริหารหลักสูตรสาขาวิชาสุขศึกษาและพลศึกษา ครั้งที่ 1/2569 วันที่ 24 มิถุนายน 2569
              ระบุ ผู้ช่วยศาสตราจารย์ ดร.เกษม ชูรัตน์ เป็นประธานกรรมการ และเอกสารเดียวกันระบุอีเมล kasem.ch@rumail.ru.ac.th
            </p>
          </div>
        </div>

        {error && (
          <div style={{marginTop:18,padding:14,borderRadius:12,background:"#fef2f2",border:"1px solid #fecaca",color:"#991b1b"}}>{error}</div>
        )}

        {result ? (
          <div style={{marginTop:20,padding:18,borderRadius:14,background:"#ecfdf5",border:"1px solid #a7f3d0"}}>
            <strong style={{color:"#065f46"}}>Binding สำเร็จ</strong>
            <div style={{marginTop:10,lineHeight:1.8,color:"#047857"}}>
              <div>Role: {result.role_code} · {result.authority_level}</div>
              <div>Programme: {result.programme_code}</div>
              <div>Authority Assignment: {result.authority_assignment_id}</div>
              <div>Evidence Candidate: {result.evidence_candidate_id} · {result.evidence_admission}</div>
            </div>
            <a href="/governance/course-equivalence" style={{display:"inline-block",marginTop:16,padding:"11px 16px",borderRadius:10,background:"#0f766e",color:"white",fontWeight:800,textDecoration:"none"}}>
              ไปหน้า Course Equivalence Decision
            </a>
          </div>
        ) : (
          <button
            type="button"
            onClick={activate}
            disabled={!ready || activating || !supabase}
            style={{marginTop:20,width:"100%",padding:"13px 16px",border:0,borderRadius:10,fontWeight:800,background:ready?"#0f766e":"#cbd5e1",color:ready?"white":"#475569",cursor:ready?"pointer":"not-allowed"}}
          >
            {activating ? "กำลังตรวจและผูกสิทธิ์..." : "ยืนยันผูกตัวตนและสิทธิ์ PROGRAMME_CHAIR A4"}
          </button>
        )}

        <div style={{marginTop:22,padding:16,borderLeft:"4px solid #f59e0b",background:"#fffbeb",lineHeight:1.7,color:"#78350f"}}>
          <strong>Authority safety</strong><br />
          ฟังก์ชันนี้ fail-closed และทำงานได้เฉพาะ authenticated email ที่ตรงกับ controlled institutional contact,
          academic-person baseline ที่ตรวจสอบแล้ว และ programme/role ที่ระบุไว้เท่านั้น ไม่ให้สิทธิ์ข้ามหลักสูตร ไม่สร้าง Production authority
          และ Evidence Candidate ยังคง NOT_ADMITTED
        </div>
      </section>
    </main>
  );
}
