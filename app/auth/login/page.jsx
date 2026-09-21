"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export default function PilotLogin() {
  const [status, setStatus] = useState("");

  async function signInWithGoogle() {
    setStatus("กำลังส่งต่อไปยัง Google…");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setStatus("OAuth runtime ยังไม่ได้ตั้งค่า");
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      setStatus("ไม่สามารถเริ่ม Google OAuth ได้: " + error.message);
    }
  }

  return (
    <main className="authShell">
      <section className="authCard">
        <div className="authMark">H</div>
        <div className="eyebrow">HEPE DEPARTMENT PLATFORM</div>
        <h1>Limited Pilot Sign-in</h1>
        <p className="authLead">
          การทดสอบระยะนี้ใช้ Google OAuth เท่านั้น และไม่ใช้ Email/Password authentication
          ของ Supabase
        </p>

        <div className="authBoundary">
          <strong>Authentication ≠ Authority</strong>
          <span>
            การเข้าสู่ระบบสำเร็จยังไม่ให้สิทธิ์ทางวิชาการ จนกว่าจะผ่าน Actor Binding,
            Role, Scope และ Authority Assignment
          </span>
        </div>

        <button className="googleButton" onClick={signInWithGoogle}>
          Continue with Google
        </button>

        {status ? <p className="authStatus" role="status">{status}</p> : null}

        <div className="authMeta">
          <span>SANDBOX · TEST DATA ONLY</span>
          <span>OAuth-only compensating control</span>
          <span>Production locked</span>
        </div>

        <a className="authBack" href="/">← กลับสู่ Visual Pilot</a>
      </section>
    </main>
  );
}
