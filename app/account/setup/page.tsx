"use client";

import { FormEvent, useState } from "react";
import "../../login/login.css";

export default function AccountSetupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (password !== confirm) {
      setMessage("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/account/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.ok) {
        setMessage(body?.message || "ไม่สามารถตั้งค่าบัญชีได้");
        return;
      }
      window.location.assign("/department-dashboard");
    } catch {
      setMessage("ไม่สามารถเชื่อมต่อระบบตั้งค่าบัญชีได้");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="setup-title">
        <p className="login-eyebrow">HEPE FAST TQF PORTAL · FIRST SETUP</p>
        <h1 id="setup-title">ตั้งค่าบัญชีส่วนตัว</h1>
        <p className="login-intro">
          กำหนด Username และรหัสผ่านใหม่สำหรับการเข้าใช้ครั้งถัดไป
        </p>
        <form onSubmit={onSubmit} className="login-form">
          <label>
            Username ใหม่
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="เช่น kasem.ch"
              required
            />
          </label>
          <label>
            Password ใหม่
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          <label>
            ยืนยัน Password ใหม่
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          {message && <div className="login-message" role="alert">{message}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? "กำลังบันทึก…" : "บันทึกและเข้าสู่ Dashboard"}
          </button>
        </form>
        <p className="login-note">
          บัญชีส่วนตัวไม่สร้างสิทธิ์อนุมัติหลักสูตรโดยอัตโนมัติ
        </p>
      </section>
    </main>
  );
}
