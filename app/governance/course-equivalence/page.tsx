"use client";

import { useMemo, useState } from "react";

type Decision =
  | ""
  | "CONFIRM_EXACT_PREDECESSOR"
  | "REJECT"
  | "SPLIT"
  | "MERGED"
  | "REPLACED"
  | "NO_EQUIVALENCE"
  | "DEFER_NEED_MORE_EVIDENCE";

type CourseItem = {
  legacyCode: string;
  legacyTitle: string;
  intermediateCode: string;
  intermediateTitle: string;
  candidateCode: string;
  candidateTitle: string;
  operationalNote?: string;
};

const decisionOptions: { value: Decision; label: string }[] = [
  { value: "", label: "— เลือกสถานะการตัดสิน —" },
  { value: "CONFIRM_EXACT_PREDECESSOR", label: "ยืนยัน / Exact predecessor" },
  { value: "REJECT", label: "ปฏิเสธคู่ที่เสนอ" },
  { value: "SPLIT", label: "Split — วิชาเดิมแตกเป็นหลายวิชาใหม่" },
  { value: "MERGED", label: "Merged — หลายวิชาเดิมรวมเป็นวิชาใหม่" },
  { value: "REPLACED", label: "Replaced — ถูกแทนด้วยวิชาใหม่" },
  { value: "NO_EQUIVALENCE", label: "No equivalence — ไม่มีรายวิชาเทียบ" },
  { value: "DEFER_NEED_MORE_EVIDENCE", label: "พักการตัดสิน — ต้องการหลักฐานเพิ่ม" },
];

const items: CourseItem[] = [
  {
    legacyCode: "RHE2201",
    legacyTitle: "การป้องกันโรคติดต่อและโรคไม่ติดต่อ",
    intermediateCode: "RHE2401",
    intermediateTitle: "การป้องกันและควบคุมโรคติดต่อและโรคไม่ติดต่อ",
    candidateCode: "HED2501",
    candidateTitle: "การป้องกันโรคติดต่อและโรคไม่ติดต่อ",
  },
  {
    legacyCode: "RHE2205",
    legacyTitle: "สิ่งแวดล้อมเพื่อสุขภาพ",
    intermediateCode: "RHE2407",
    intermediateTitle: "สิ่งแวดล้อมและสุขภาพ",
    candidateCode: "HED2607",
    candidateTitle: "สิ่งแวดล้อมกับสุขภาพ",
  },
  {
    legacyCode: "RHE2401",
    legacyTitle: "การป้องกันและควบคุมโรคติดต่อและโรคไม่ติดต่อ",
    intermediateCode: "RHE2401",
    intermediateTitle: "การป้องกันและควบคุมโรคติดต่อและโรคไม่ติดต่อ",
    candidateCode: "HED2501",
    candidateTitle: "การป้องกันโรคติดต่อและโรคไม่ติดต่อ",
  },
  {
    legacyCode: "RHE3100",
    legacyTitle: "สวัสดิศึกษาและปฐมพยาบาล",
    intermediateCode: "RED3101",
    intermediateTitle: "ปฐมพยาบาลและสวัสดิศึกษาเบื้องต้น",
    candidateCode: "HED2502 / HED2603",
    candidateTitle: "การช่วยชีวิตขั้นพื้นฐานและปฐมพยาบาล / สวัสดิศึกษาและการป้องกันอุบัติเหตุ",
    operationalNote: "อาจเกี่ยวข้องมากกว่า 1 รายวิชา — ให้ Human Authority พิจารณา SPLIT / REPLACED / อื่น ๆ",
  },
  {
    legacyCode: "RHE3101",
    legacyTitle: "เพศศึกษา",
    intermediateCode: "RHE3401",
    intermediateTitle: "เพศศึกษาและการวางแผนครอบครัว",
    candidateCode: "HED2503",
    candidateTitle: "เพศวิถีศึกษา",
    operationalNote: "มีหลักฐานการเปิดสอนควบ RHE3101 + HED2503; ใช้เป็น supporting context เท่านั้น",
  },
  {
    legacyCode: "RHE3102",
    legacyTitle: "โภชนาการเพื่อสุขภาพ",
    intermediateCode: "RHE3406",
    intermediateTitle: "โภชนาการและสุขภาพ",
    candidateCode: "HED2608",
    candidateTitle: "อาหารและโภชนาการ",
  },
  {
    legacyCode: "RHE3105",
    legacyTitle: "การดูแลสุขภาพผู้สูงอายุ",
    intermediateCode: "RHE3407",
    intermediateTitle: "ผู้สูงอายุและสุขภาพ",
    candidateCode: "HED2609",
    candidateTitle: "การส่งเสริมสุขภาพผู้สูงอายุ",
  },
  {
    legacyCode: "RHE3106",
    legacyTitle: "การสาธารณสุขเบื้องต้น",
    intermediateCode: "RHE3408",
    intermediateTitle: "สาธารณสุข",
    candidateCode: "HED2610",
    candidateTitle: "การสาธารณสุขพื้นฐาน",
  },
  {
    legacyCode: "RHE3408",
    legacyTitle: "สาธารณสุข",
    intermediateCode: "RHE3408",
    intermediateTitle: "สาธารณสุข",
    candidateCode: "HED2610",
    candidateTitle: "การสาธารณสุขพื้นฐาน",
  },
  {
    legacyCode: "RHE4102",
    legacyTitle: "การดูแลสุขภาพชุมชน",
    intermediateCode: "RHE3404",
    intermediateTitle: "ชุมชนและสุขภาพ",
    candidateCode: "HED3503",
    candidateTitle: "สุขศึกษาในชุมชน",
  },
  {
    legacyCode: "RHE4103",
    legacyTitle: "ยาและสิ่งเสพติด",
    intermediateCode: "RHE3405",
    intermediateTitle: "ยาและการป้องกันสิ่งเสพติด",
    candidateCode: "HED3502",
    candidateTitle: "ยาและยาเสพติด",
    operationalNote: "มีหลักฐานการเปิดสอนควบ RHE4103 + HED3502 / HED4301; ใช้เป็น supporting context เท่านั้น",
  },
  {
    legacyCode: "RPE3603",
    legacyTitle: "หลักและวิธีการสอนกีฬาลีลาศ",
    intermediateCode: "RPE3603",
    intermediateTitle: "หลักและวิธีการสอนกีฬาลีลาศ",
    candidateCode: "PED2515",
    candidateTitle: "การสอนกีฬาลีลาศ",
    operationalNote: "ชื่อและตำแหน่งในหลักสูตรช่วยการพิจารณาเท่านั้น ไม่ถือเป็น deterministic mapping",
  },
];

export default function CourseEquivalenceDecisionPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [rationales, setRationales] = useState<Record<string, string>>({});
  const [references, setReferences] = useState<Record<string, string>>({});
  const [authorityName, setAuthorityName] = useState("");
  const [authorityRole, setAuthorityRole] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const completed = useMemo(
    () => items.filter((item) => Boolean(decisions[item.legacyCode])).length,
    [decisions]
  );

  const canConfirm =
    completed === items.length &&
    authorityName.trim().length > 0 &&
    authorityRole.trim().length > 0 &&
    acknowledged;

  function confirmPacket() {
    if (!canConfirm) return;
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main style={{ maxWidth: 1260, margin: "32px auto", padding: 24 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "flex-start",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".08em", color: "#475569" }}>
            HEPE · PEOPLE-01B.2H
          </div>
          <h1 style={{ margin: "6px 0 8px" }}>Course Equivalence Governance Decision</h1>
          <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
            หน้าพิจารณาความสัมพันธ์รายวิชาเดิมกับหลักสูตร พ.ศ. 2567 สำหรับ Human Curriculum Authority
          </p>
        </div>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#9a3412",
            fontWeight: 800,
          }}
        >
          NON-PRODUCTION · NOT_ADMITTED
        </div>
      </header>

      {confirmed && (
        <section
          style={{
            marginBottom: 20,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <strong style={{ color: "#065f46" }}>ยืนยันแบบฟอร์มในหน้าจอนี้แล้ว</strong>
          <p style={{ margin: "6px 0 0", color: "#047857", lineHeight: 1.6 }}>
            การยืนยันครั้งนี้เป็น UI confirmation เท่านั้น ยังไม่มีการเขียนข้อมูลลง Supabase, ไม่สร้าง authority,
            ไม่เปลี่ยน baseline และไม่รับเข้า Audit Evidence Set โดยอัตโนมัติ
          </p>
        </section>
      )}

      <section
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <strong>ข้อกำกับการตัดสิน</strong>
        <p style={{ margin: "8px 0 0", lineHeight: 1.75, color: "#334155" }}>
          รายวิชา พ.ศ. 2567 ที่แสดงด้านล่างเป็น Candidate for Human Consideration เท่านั้น การอยู่ในแถวเดียวกัน
          หรือชื่อคล้ายกันไม่ใช่หลักฐานเทียบรายวิชา การเปลี่ยนสถานะจริงต้องอาศัย controlled decision record
          และ authority ที่ตรวจสอบได้
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
          marginBottom: 22,
        }}
      >
        {[
          ["รายการทั้งหมด", String(items.length)],
          ["เลือกสถานะแล้ว", `${completed}/${items.length}`],
          ["ยังไม่ตัดสิน", String(items.length - completed)],
          ["สถานะ Gate", completed === items.length ? "READY TO CONFIRM" : "HUMAN DECISION REQUIRED"],
        ].map(([label, value]) => (
          <article key={label} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: 16 }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
            <div style={{ marginTop: 6, fontSize: 19, fontWeight: 800 }}>{value}</div>
          </article>
        ))}
      </section>

      <section style={{ display: "grid", gap: 16 }}>
        {items.map((item, index) => {
          const decision = decisions[item.legacyCode] ?? "";
          return (
            <article
              key={item.legacyCode}
              style={{
                background: "white",
                border: decision ? "1px solid #86efac" : "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>รายการ {index + 1} / {items.length}</div>
                  <h2 style={{ margin: "4px 0" }}>{item.legacyCode} — {item.legacyTitle}</h2>
                </div>
                <span
                  style={{
                    alignSelf: "flex-start",
                    padding: "7px 10px",
                    borderRadius: 999,
                    background: decision ? "#ecfdf5" : "#f8fafc",
                    color: decision ? "#047857" : "#64748b",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {decision ? "SELECTED" : "PENDING"}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                  gap: 12,
                  marginTop: 14,
                }}
              >
                <div style={{ padding: 14, borderRadius: 12, background: "#f8fafc" }}>
                  <div style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>LEGACY</div>
                  <strong>{item.legacyCode}</strong>
                  <div style={{ marginTop: 4 }}>{item.legacyTitle}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 12, background: "#f8fafc" }}>
                  <div style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>2562 / INTERMEDIATE</div>
                  <strong>{item.intermediateCode}</strong>
                  <div style={{ marginTop: 4 }}>{item.intermediateTitle}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 12, background: "#eef2ff" }}>
                  <div style={{ color: "#4f46e5", fontSize: 12, fontWeight: 700 }}>2567 CANDIDATE</div>
                  <strong>{item.candidateCode}</strong>
                  <div style={{ marginTop: 4 }}>{item.candidateTitle}</div>
                </div>
              </div>

              {item.operationalNote && (
                <div style={{ marginTop: 12, padding: 12, background: "#fff7ed", borderRadius: 12, color: "#9a3412" }}>
                  <strong>ข้อมูลประกอบ:</strong> {item.operationalNote}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px,1fr) minmax(260px,1fr)",
                  gap: 12,
                  marginTop: 14,
                }}
              >
                <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                  สถานะการตัดสิน
                  <select
                    value={decision}
                    onChange={(e) => {
                      setConfirmed(false);
                      setDecisions((prev) => ({ ...prev, [item.legacyCode]: e.target.value as Decision }));
                    }}
                    style={{ padding: "11px 12px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white" }}
                  >
                    {decisionOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                  มติ / คำสั่ง / Controlled record reference
                  <input
                    value={references[item.legacyCode] ?? ""}
                    onChange={(e) => {
                      setConfirmed(false);
                      setReferences((prev) => ({ ...prev, [item.legacyCode]: e.target.value }));
                    }}
                    placeholder="เช่น มติคณะกรรมการ... ครั้งที่... วันที่..."
                    style={{ padding: "11px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: 6, fontWeight: 700, marginTop: 12 }}>
                เหตุผล / Controlled evidence rationale
                <textarea
                  rows={3}
                  value={rationales[item.legacyCode] ?? ""}
                  onChange={(e) => {
                    setConfirmed(false);
                    setRationales((prev) => ({ ...prev, [item.legacyCode]: e.target.value }));
                  }}
                  placeholder="บันทึกเหตุผลประกอบการตัดสิน โดยอ้างจาก controlled evidence ที่ตรวจสอบได้"
                  style={{ padding: "11px 12px", borderRadius: 10, border: "1px solid #cbd5e1", resize: "vertical" }}
                />
              </label>
            </article>
          );
        })}
      </section>

      <section
        style={{
          marginTop: 22,
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Human Curriculum Authority Confirmation</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
          <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
            ชื่อผู้พิจารณา
            <input
              value={authorityName}
              onChange={(e) => { setConfirmed(false); setAuthorityName(e.target.value); }}
              placeholder="ชื่อ–สกุล"
              style={{ padding: "11px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
            บทบาท / Capacity
            <input
              value={authorityRole}
              onChange={(e) => { setConfirmed(false); setAuthorityRole(e.target.value); }}
              placeholder="เช่น ประธานหลักสูตร / คณะกรรมการหลักสูตร"
              style={{ padding: "11px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
          </label>
        </div>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, lineHeight: 1.65 }}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => { setConfirmed(false); setAcknowledged(e.target.checked); }}
            style={{ marginTop: 4 }}
          />
          <span>
            ข้าพเจ้ายืนยันว่าได้พิจารณาทั้ง 12 รายการและเข้าใจว่า UI นี้ยังไม่เขียนผลลงฐานข้อมูล ไม่สร้าง authority
            และไม่ทำให้ผลการตัดสินเข้าสู่ Audit Evidence Set โดยอัตโนมัติ
          </span>
        </label>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 18, flexWrap: "wrap" }}>
          <div style={{ color: "#64748b" }}>
            ต้องเลือกสถานะครบ 12 รายการ + ระบุชื่อ/บทบาท + ยืนยันเงื่อนไข
          </div>
          <button
            type="button"
            onClick={confirmPacket}
            disabled={!canConfirm}
            style={{
              border: 0,
              borderRadius: 12,
              padding: "12px 18px",
              fontWeight: 800,
              cursor: canConfirm ? "pointer" : "not-allowed",
              background: canConfirm ? "#0f172a" : "#cbd5e1",
              color: "white",
            }}
          >
            ยืนยันผลการพิจารณาในหน้าจอนี้
          </button>
        </div>
      </section>

      <section style={{ marginTop: 18, padding: 16, borderRadius: 14, background: "#f8fafc", color: "#475569", lineHeight: 1.7 }}>
        <strong>Implementation boundary:</strong> Client-side decision UI only · no Supabase write · no IAM change · no authority creation · no production authorization · no automatic evidence admission.
      </section>
    </main>
  );
}
