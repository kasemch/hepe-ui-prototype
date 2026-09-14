"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const CONTROLLED_EMAIL = "kasem.ch@rumail.ru.ac.th";
const CANONICAL_PREVIEW_ORIGIN = "https://hepe-ui-prototype-git-feat-hepe-p-685c79-kasemch-3467s-projects.vercel.app";

export default function LoginPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [canonicalReady, setCanonicalReady] = useState(false);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;
    return createBrowserClient(url, key);
  }, []);

  useEffect(() => {
    const current = new URL(window.location.href);
    const canonical = new URL("/login", CANONICAL_PREVIEW_ORIGIN);
    const vercelShare = current.searchParams.get("_vercel_share");
    if (vercelShare) canonical.searchParams.set("_vercel_share", vercelShare);

    if (window.location.origin !== CANONICAL_PREVIEW_ORIGIN) {
      window.location.replace(canonical.toString());
      return;
    }

    setCanonicalReady(true);
  }, []);

  async function sendMagicLink() {
    if (!supabase || sending || !canonicalReady) return;
    setSending(true);
    setError("");

    const current = new URL(window.location.href);
    const vercelShare = current.searchParams.get("_vercel_share");
    const callback = new URL("/auth/callback", CANONICAL_PREVIEW_ORIGIN);
    callback.searchParams.set("next", "/");
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
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"linear-gradient(135deg,#e0f2fe 0%,#f8fafc 45%,#dcfce7 100%)"}}>
      <section style={{width:"min(760px,100%)",background:"rgba(255,255,255,.78)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.8)",borderRadius:28,padding:30,boxShadow:"0 24px 70px rgba(15,23,42,.14)"}}>
        <div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#0f766e"}}>HEPE · ACADEMIC WORKSPACE · NON-PRODUCTION</div>
        <h1 style={{margin:"8px 0 8px",fontSize:34}}>เข้าสู่ระบบ HEPE</h1>
        <p style={{marginTop:0,color:"#475569",lineHeight:1.7}}>ยืนยันตัวตนด้วยอีเมลมหาวิทยาลัย แล้วเข้าสู่พื้นที่ทำงานอาจารย์โดยตรง</p>

        <div style={{marginTop:28,padding:20,border:"1px solid rgba(148,163,184,.45)",borderRadius:18,background:"rgba(248,250,252,.72)"}}>
          <label htmlFor="email" style={{display:"block",fontWeight:800,marginBottom:8}}>อีเมลมหาวิทยาลัย</label>
          <input id="email" name="email" type="email" value={CONTROLLED_EMAIL} readOnly style={{width:"100%",boxSizing:"border-box",padding:"13px 14px",border:"1px solid #cbd5e1",borderRadius:12,background:"rgba(255,255,255,.9)"}} />
          <button type="button" onClick={sendMagicLink} disabled={!supabase || sending || sent || !canonicalReady} style={{marginTop:14,width:"100%",padding:"13px 16px",border:0,borderRadius:12,fontWeight:800,background:sent?"#bbf7d0":"#0f766e",color:sent?"#166534":"white",cursor:sent?"default":"pointer"}}>
            {!canonicalReady ? "กำลังเตรียมช่องทางยืนยันตัวตน..." : sent ? "ส่ง Magic Link แล้ว — กรุณาเปิดอีเมล" : sending ? "กำลังส่ง..." : "ส่ง Magic Link เพื่อเข้าสู่ระบบ"}
          </button>
          {!supabase && <p style={{color:"#b91c1c",marginBottom:0}}>Runtime Supabase binding ยังไม่พร้อมใน Preview นี้</p>}
          {error && <p style={{color:"#b91c1c",marginBottom:0}}>{error}</p>}
        </div>

        <div style={{marginTop:22,padding:16,borderLeft:"4px solid #0f766e",background:"rgba(240,253,250,.82)",lineHeight:1.7,color:"#334155"}}>
          <strong>หลังเข้าสู่ระบบ</strong><br />
          ระบบจะพาไปยังพื้นที่ทำงานอาจารย์: งานที่ต้องทำในภาคเรียน → รายวิชาของฉัน → มคอ. → หลักฐาน → ทวนสอบ/ส่งอนุมัติ ส่วนงาน Governance จะแสดงตามบทบาทและสิทธิ์เท่านั้น
        </div>

        <p style={{marginTop:22,fontSize:13,color:"#64748b"}}>Authentication ≠ Authorization · NON-PRODUCTION · ไม่มี Production Authorization</p>
      </section>
    </main>
  );
}
