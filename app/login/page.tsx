"use client";

import { useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const CONTROLLED_EMAIL = "kasem.ch@rumail.ru.ac.th";

export default function LoginPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;
    return createBrowserClient(url, key);
  }, []);

  async function sendMagicLink() {
    if (!supabase || sending) return;
    setSending(true);
    setError("");

    const current = new URL(window.location.href);
    const vercelShare = current.searchParams.get("_vercel_share");
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", "/user-access/activate");
    if (vercelShare) callback.searchParams.set("_vercel_share", vercelShare);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: CONTROLLED_EMAIL,
      options: {
        emailRedirectTo: callback.toString(),
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      setError(otpError.message || "ไม่สามารถส่ง Magic Link ได้");
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
  }

  return (
    <main style={{maxWidth:760,margin:"48px auto",padding:24}}>
      <section style={{background:"white",borderRadius:20,padding:28,boxShadow:"0 8px 28px rgba(15,23,42,.08)"}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:".08em",color:"#475569"}}>HEPE · IAM-09C · PEOPLE-01B.2H-A1</div>
        <h1 style={{marginBottom:8}}>เข้าสู่ระบบ HEPE</h1>
        <p style={{marginTop:0,color:"#475569"}}>Controlled Institutional Magic Link · NON-PRODUCTION</p>

        <div style={{marginTop:28,padding:18,border:"1px solid #e2e8f0",borderRadius:14,background:"#f8fafc"}}>
          <label htmlFor="email" style={{display:"block",fontWeight:700,marginBottom:8}}>อีเมลมหาวิทยาลัยที่ผูกกับ Controlled Person Record</label>
          <input
            id="email"
            name="email"
            type="email"
            value={CONTROLLED_EMAIL}
            readOnly
            style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",border:"1px solid #cbd5e1",borderRadius:10,background:"#fff"}}
          />
          <button
            type="button"
            onClick={sendMagicLink}
            disabled={!supabase || sending || sent}
            style={{marginTop:14,width:"100%",padding:"12px 16px",border:0,borderRadius:10,fontWeight:700,background:sent?"#bbf7d0":"#0f766e",color:sent?"#166534":"white",cursor:sent?"default":"pointer"}}
          >
            {sent ? "ส่ง Magic Link แล้ว — กรุณาเปิดอีเมล" : sending ? "กำลังส่ง..." : "ส่ง Magic Link เพื่อยืนยันตัวตน"}
          </button>
          {!supabase && <p style={{color:"#b91c1c",marginBottom:0}}>Runtime Supabase binding ยังไม่พร้อมใน Preview นี้</p>}
          {error && <p style={{color:"#b91c1c",marginBottom:0}}>{error}</p>}
        </div>

        <div style={{marginTop:24,padding:18,borderLeft:"4px solid #0f766e",background:"#f0fdfa"}}>
          <strong>Controlled behaviour</strong>
          <p style={{marginBottom:0,lineHeight:1.7}}>
            Magic Link ใช้ยืนยันการควบคุมอีเมลสถาบันเท่านั้น หลังยืนยันแล้วระบบจะยังไม่ถือว่ามีสิทธิ์โดยอัตโนมัติ
            ต้องผ่าน PEOPLE-01B.2H-A1 เพื่อผูก Auth User → Academic Person → Programme-scoped Authority จาก controlled source ที่กำหนดไว้
          </p>
        </div>

        <p style={{marginTop:24,fontSize:14,color:"#64748b"}}>
          Authentication ≠ Authorization · NON-PRODUCTION · ไม่มี Production Authorization
        </p>
      </section>
    </main>
  );
}
