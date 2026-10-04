"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

function appBase() {
  return window.location.pathname.replace(/\/auth\/callback\/?$/, "");
}

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("กำลังตรวจสอบลิงก์ยืนยัน…");

  useEffect(() => {
    let active = true;

    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const code = new URL(window.location.href).searchParams.get("code");

      if (!url || !key) {
        if (active) setMessage("ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า");
        return;
      }
      if (!code) {
        if (active) setMessage("ไม่พบรหัสยืนยันในลิงก์นี้");
        return;
      }

      const db = createBrowserClient(url, key);
      const { error } = await db.auth.exchangeCodeForSession(code);

      if (error) {
        if (active) setMessage("ลิงก์ยืนยันไม่สมบูรณ์หรือหมดอายุ");
        return;
      }

      window.location.assign(`${appBase()}/department-dashboard`);
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main style={{ maxWidth: 560, margin: "64px auto", padding: 24 }}>
      <h1>HEPE Fast TQF Portal</h1>
      <p>{message}</p>
    </main>
  );
}
