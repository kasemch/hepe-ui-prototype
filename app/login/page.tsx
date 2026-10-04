"use client";

import { FormEvent, useState } from "react";
import "./login.css";

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.ok) {
        setMessage(body?.message || "ไม่สามารถเข้าสู่ระบบได้");
        return;
      }
      window.location.assign(body.next || "/department-dashboard");
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
          ใช้ชื่อผู้ใช้และรหัสผ่านของบัญชีที่ผ่านการผูกกับทะเบียนบุคลากรแล้ว
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
          {message && <div className="login-message" role="alert">{message}</div>}
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
