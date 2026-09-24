"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function signIn() {
    if (busy) return;
    setError("");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setError("ระบบยืนยันตัวตนของ Preview ยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ");
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserClient(url, key);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: new URL("/auth/callback", window.location.origin).toString() },
      });
      if (authError) {
        setError("ไม่สามารถเริ่มเข้าสู่ระบบได้: " + authError.message);
        setBusy(false);
      }
    } catch {
      setError("การเชื่อมต่อระบบยืนยันตัวตนไม่สำเร็จ กรุณาลองใหม่");
      setBusy(false);
    }
  }
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20,background:"#f1f6ff"}}>
    <section style={{maxWidth:460,width:"100%",background:"white",borderRadius:22,padding:32,boxShadow:"0 14px 44px rgba(24,57,119,.12)"}}>
      <div style={{fontSize:32}}>🎓</div>
      <h1 style={{marginBottom:4,color:"#17386e"}}>HEPE Fast TQF Portal</h1>
      <p style={{color:"#667085",marginTop:0}}>เข้าสู่ระบบสำหรับอาจารย์ผู้สอนและผู้รับผิดชอบหลักสูตร</p>
      <p style={{padding:"8px 12px",background:"#fff3d6",borderRadius:9,fontWeight:700,fontSize:13}}>NON-PRODUCTION · CONTROLLED PREVIEW</p>
      <button onClick={signIn} disabled={busy} style={{width:"100%",padding:15,border:0,borderRadius:10,background:"#1677ff",color:"white",fontWeight:700,cursor:busy?"wait":"pointer"}}>
        {busy?"กำลังเชื่อมต่อ…":"เข้าสู่ระบบด้วย Google"}
      </button>
      {error && <p role="alert" style={{color:"#b42318"}}>{error}</p>}
      <p style={{color:"#667085",fontSize:13,lineHeight:1.7}}>ใช้อีเมลที่ได้รับการลงทะเบียนไว้ การยืนยันตัวตนสำเร็จไม่ได้หมายถึงการได้รับสิทธิ์เข้าถึงรายวิชาหรืออนุมัติเอกสารโดยอัตโนมัติ</p>
      <p style={{fontSize:13}}><a href="/" style={{color:"#1677ff"}}>กลับหน้าหลัก</a></p>
    </section>
  </main>;
}
