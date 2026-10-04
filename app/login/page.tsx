"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import "./login.css";

function appBase() {
  return window.location.pathname.replace(/\/login\/?$/, "");
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setMessage("ระบบเข้าสู่ระบบยังไม่ได้ตั้งค่า");
        return;
      }

      const response = await fetch(`${url}/functions/v1/hepe-username-login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: key,
        },
        body: JSON.stringify({ username, password }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.ok || !body?.session) {
        setMessage(body?.message || "ไม่สามารถเข้าสู่ระบบได้");
        return;
      }

      const db = createBrowserClient(url, key);
      const { error } = await db.auth.setSession({
        access_token: body.session.access_token,
        refresh_token: body.session.refresh_token,
      });

      if (error) {
        setMessage("เข้าสู่ระบบสำเร็จ แต่ไม่สามารถบันทึก Session ได้");
        return;
      }

      const next = String(body.next || "/department-dashboard");
      window.location.assign(`${appBase()}${next}`);
    } catch {
      setMessage("ไม่สามารถเชื่อมต่อระบบเข้าสู่ระบบได้");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <p className="login-eyebrow">HEPE FAST TQF PORTAL · PILOT</p>
        <h1 id="login-title">เข้าสู่ระบบ</h1>
        <p className="login-intro">
          ใช้ Username และ Password ของบัญชีที่ผ่านการผูกกับทะเบียนบุคลากรแล้ว
        </p>

        <form onSubmit={onSubmit} className="login-form">
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              inputMode="text"
              spellCheck={false}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {message && (
            <div className="login-message" role="alert">
              {message}
            </div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="login-note">
          การเข้าสู่ระบบไม่ถือเป็นการได้รับอำนาจอนุมัติหรือแก้ไขข้อมูลหลักสูตร
        </p>
      </section>
    </main>
  );
}
