"use client";

import { FormEvent, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const AUTHORIZED_PILOT_EMAIL = "kasem.ch@rumail.ru.ac.th";
const CANONICAL_PREVIEW_ORIGIN = "https://hepe-ui-prototype-git-feat-hepe-i-2574e3-kasemch-3467s-projects.vercel.app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const pilotEnabled = process.env.NEXT_PUBLIC_HEPE_IAM_REAL_PILOT_ENABLED === "true";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const normalizedEmail = email.trim().toLowerCase();
  const isAuthorizedEmail = normalizedEmail === AUTHORIZED_PILOT_EMAIL;
  const runtimeConfigured = Boolean(supabaseUrl && supabaseKey);
  const canSend = pilotEnabled && runtimeConfigured && isAuthorizedEmail && status !== "sending";

  const readinessText = useMemo(() => {
    if (!pilotEnabled) return "HOLD — real-user pilot feature flag is not enabled.";
    if (!runtimeConfigured) return "HOLD — Supabase preview runtime is not configured.";
    if (!isAuthorizedEmail) return "Enter the explicitly authorized institutional pilot email.";
    return "READY — authorized HEPE NON-PRODUCTION Magic Link pilot only.";
  }, [pilotEnabled, runtimeConfigured, isAuthorizedEmail]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!canSend || !supabaseUrl || !supabaseKey) {
      setStatus("error");
      setMessage("Fail-closed: pilot authorization/runtime conditions are not satisfied.");
      return;
    }

    setStatus("sending");

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const callback = new URL("/auth/callback", CANONICAL_PREVIEW_ORIGIN);
    callback.searchParams.set("next", "/");

    const currentUrl = new URL(window.location.href);
    const vercelShare = currentUrl.searchParams.get("_vercel_share");
    if (vercelShare) callback.searchParams.set("_vercel_share", vercelShare);

    const { error } = await supabase.auth.signInWithOtp({
      email: AUTHORIZED_PILOT_EMAIL,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: callback.toString(),
      },
    });

    if (error) {
      setStatus("error");
      setMessage(`Magic Link request failed: ${error.message}`);
      return;
    }

    setStatus("sent");
    setMessage("Magic Link request accepted by Supabase. Check the authorized institutional inbox.");
  }

  return (
    <main style={{ maxWidth: 760, margin: "48px auto", padding: 24 }}>
      <section style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 8px 28px rgba(15,23,42,.08)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em", color: "#475569" }}>HEPE · IAM-09G.2D.5</div>
        <h1 style={{ marginBottom: 8 }}>เข้าสู่ระบบ HEPE</h1>
        <p style={{ marginTop: 0, color: "#475569" }}>Controlled Real-User Pilot · NON-PRODUCTION ONLY</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28, padding: 18, border: "1px solid #e2e8f0", borderRadius: 14, background: "#f8fafc" }}>
          <label htmlFor="email" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>อีเมลมหาวิทยาลัยที่ได้รับอนุญาต</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus("idle");
              setMessage("");
            }}
            placeholder="name@university.ac.th"
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #cbd5e1", borderRadius: 10, background: "white" }}
          />
          <button
            type="submit"
            disabled={!canSend}
            style={{ marginTop: 14, width: "100%", padding: "12px 16px", border: 0, borderRadius: 10, fontWeight: 700, background: canSend ? "#0f172a" : "#cbd5e1", color: canSend ? "white" : "#475569", cursor: canSend ? "pointer" : "not-allowed" }}
          >
            {status === "sending" ? "กำลังขอ Magic Link…" : "ส่ง Magic Link สำหรับ Pilot"}
          </button>
          <p style={{ marginBottom: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{readinessText}</p>
          {message ? <p role="status" style={{ marginBottom: 0, fontSize: 14, lineHeight: 1.6 }}>{message}</p> : null}
        </form>

        <div style={{ marginTop: 24, padding: 18, borderLeft: "4px solid #94a3b8", background: "#f8fafc" }}>
          <strong>Controlled behaviour</strong>
          <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
            หน้านี้เปิดทางส่ง Magic Link เฉพาะเมื่อ Preview runtime มี feature flag สำหรับ HEPE IAM real-user pilot,
            Supabase runtime ถูกผูกครบ และอีเมลตรงกับบัญชีที่ได้รับอนุญาตเท่านั้น. Magic Link จะกลับเข้าสู่ canonical Preview origin
            ของ branch IAM เดียวกันก่อนสร้าง session. การเรียก Auth นี้อาจสร้าง Supabase Auth user หากยังไม่มีบัญชีตาม authorization
            ที่บันทึกไว้ แต่จะไม่สร้าง HEPE profile, role, scope หรือ academic authority.
          </p>
        </div>

        <p style={{ marginTop: 24, fontSize: 14, color: "#64748b" }}>
          Authentication สำเร็จไม่ได้หมายถึงมีสิทธิ์ใช้งานระบบโดยอัตโนมัติ (Authenticated ≠ Authorized)
        </p>
      </section>
    </main>
  );
}
