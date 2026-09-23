"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setMessage("Runtime is not configured.");
      return;
    }

    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(url, key);
    const redirectTo =
      window.location.origin +
      "/auth/callback?next=" +
      encodeURIComponent(next.startsWith("/") ? next : "/");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setMessage(error.message || "Unable to start Google sign-in.");
      setBusy(false);
    }
  }

  return (
    <main style={{maxWidth:640,margin:"60px auto",padding:24,fontFamily:"system-ui,sans-serif"}}>
      <div style={{border:"1px solid #e2e8f0",borderRadius:16,padding:24,background:"white"}}>
        <div style={{fontSize:13,color:"#64748b"}}>HEPE · NON-PRODUCTION</div>
        <h1>Sign in to HEPE</h1>
        <p style={{lineHeight:1.6}}>
          ใช้ Google Sign-In เพื่อสร้าง Supabase session สำหรับพื้นที่ทบทวนเอกสาร
          การเข้าสู่ระบบไม่ทำให้เกิดสิทธิ์ทางวิชาการโดยอัตโนมัติ
        </p>
        <button
          onClick={signIn}
          disabled={busy}
          style={{padding:"12px 16px",borderRadius:10,fontWeight:700}}
        >
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>
        {message ? <p style={{color:"#991b1b"}}>{message}</p> : null}
      </div>
    </main>
  );
}
