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

type Receipt = {
  decisionId?: string;
  reviewId?: string;
  statusCode?: string;
  evidenceId?: string;
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
  ["RHE2201","การป้องกันโรคติดต่อและโรคไม่ติดต่อ","RHE2401","การป้องกันและควบคุมโรคติดต่อและโรคไม่ติดต่อ","HED2501","การป้องกันโรคติดต่อและโรคไม่ติดต่อ"],
  ["RHE2205","สิ่งแวดล้อมเพื่อสุขภาพ","RHE2407","สิ่งแวดล้อมและสุขภาพ","HED2607","สิ่งแวดล้อมกับสุขภาพ"],
  ["RHE2401","การป้องกันและควบคุมโรคติดต่อและโรคไม่ติดต่อ","RHE2401","การป้องกันและควบคุมโรคติดต่อและโรคไม่ติดต่อ","HED2501","การป้องกันโรคติดต่อและโรคไม่ติดต่อ"],
  ["RHE3100","สวัสดิศึกษาและปฐมพยาบาล","RED3101","ปฐมพยาบาลและสวัสดิศึกษาเบื้องต้น","HED2502 / HED2603","การช่วยชีวิตขั้นพื้นฐานและปฐมพยาบาล / สวัสดิศึกษาและการป้องกันอุบัติเหตุ","อาจเกี่ยวข้องมากกว่า 1 รายวิชา — ให้ Human Authority พิจารณา SPLIT / REPLACED / อื่น ๆ"],
  ["RHE3101","เพศศึกษา","RHE3401","เพศศึกษาและการวางแผนครอบครัว","HED2503","เพศวิถีศึกษา","มีหลักฐานการเปิดสอนควบ RHE3101 + HED2503; supporting context เท่านั้น"],
  ["RHE3102","โภชนาการเพื่อสุขภาพ","RHE3406","โภชนาการและสุขภาพ","HED2608","อาหารและโภชนาการ"],
  ["RHE3105","การดูแลสุขภาพผู้สูงอายุ","RHE3407","ผู้สูงอายุและสุขภาพ","HED2609","การส่งเสริมสุขภาพผู้สูงอายุ"],
  ["RHE3106","การสาธารณสุขเบื้องต้น","RHE3408","สาธารณสุข","HED2610","การสาธารณสุขพื้นฐาน"],
  ["RHE3408","สาธารณสุข","RHE3408","สาธารณสุข","HED2610","การสาธารณสุขพื้นฐาน"],
  ["RHE4102","การดูแลสุขภาพชุมชน","RHE3404","ชุมชนและสุขภาพ","HED3503","สุขศึกษาในชุมชน"],
  ["RHE4103","ยาและสิ่งเสพติด","RHE3405","ยาและการป้องกันสิ่งเสพติด","HED3502","ยาและยาเสพติด","มีหลักฐานการเปิดสอนควบ RHE4103 + HED3502 / HED4301; supporting context เท่านั้น"],
  ["RPE3603","หลักและวิธีการสอนกีฬาลีลาศ","RPE3603","หลักและวิธีการสอนกีฬาลีลาศ","PED2515","การสอนกีฬาลีลาศ","ชื่อและตำแหน่งในหลักสูตรช่วยการพิจารณาเท่านั้น ไม่ถือเป็น deterministic mapping"],
].map(([legacyCode,legacyTitle,intermediateCode,intermediateTitle,candidateCode,candidateTitle,operationalNote]) => ({
  legacyCode, legacyTitle, intermediateCode, intermediateTitle, candidateCode, candidateTitle, operationalNote,
}));

export default function CourseEquivalenceDecisionPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [rationales, setRationales] = useState<Record<string, string>>({});
  const [references, setReferences] = useState<Record<string, string>>({});
  const [authorityName, setAuthorityName] = useState("");
  const [authorityRole, setAuthorityRole] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const completed = useMemo(
    () => items.filter((item) => Boolean(decisions[item.legacyCode])).length,
    [decisions]
  );

  const canConfirm =
    completed === items.length &&
    authorityName.trim().length > 0 &&
    authorityRole.trim().length > 0 &&
    acknowledged &&
    !submitting &&
    !confirmed;

  async function confirmPacket() {
    if (!canConfirm) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/governance/course-equivalence/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          decisions,
          rationales,
          references,
          authorityName,
          authorityRole,
          acknowledgement: acknowledged,
          idempotencyNonce: crypto.randomUUID(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setSubmitError(`${data?.code ?? "HEPE_01B2H_SUBMIT_FAILED"}: ${data?.message ?? "ระบบปฏิเสธการบันทึก"}`);
        return;
      }
      const raw = data?.result ?? {};
      setReceipt({
        decisionId: raw.decision_id,
        reviewId: raw.review_id,
        statusCode: raw.status_code,
        evidenceId: data?.evidenceCandidate?.evidenceId,
      });
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("HEPE_01B2H_NETWORK_ERROR: ไม่สามารถส่งคำสั่งยืนยันไปยัง controlled runtime ได้");
    } finally {
      setSubmitting(false);
    }
  }

  const locked = confirmed;

  return (
    <main style={{ maxWidth: 1260, margin: "32px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"flex-start",marginBottom:20,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:13,fontWeight:800,letterSpacing:".08em",color:"#475569"}}>HEPE · PEOPLE-01B.2H</div>
          <h1 style={{margin:"6px 0 8px"}}>Course Equivalence Governance Decision</h1>
          <p style={{margin:0,color:"#64748b",lineHeight:1.6}}>เลือกผลการพิจารณาทีละรายวิชา แล้วบันทึกผ่าน authority-aware controlled runtime</p>
        </div>
        <div style={{padding:"10px 14px",borderRadius:999,background:"#fff7ed",border:"1px solid #fed7aa",color:"#9a3412",fontWeight:800}}>NON-PRODUCTION · NOT_ADMITTED</div>
      </header>

      {confirmed && (
        <section style={{marginBottom:20,background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:16,padding:18}}>
          <strong style={{color:"#065f46"}}>บันทึก Controlled Decision Record สำเร็จและหน้าถูก Lock แล้ว</strong>
          <p style={{margin:"8px 0 0",color:"#047857",lineHeight:1.7}}>
            Decision ID: <code>{receipt?.decisionId ?? "—"}</code> · Review: <code>{receipt?.reviewId ?? "—"}</code> · Status: <strong>{receipt?.statusCode ?? "—"}</strong>
          </p>
          <p style={{margin:"6px 0 0",color:"#047857"}}>Evidence Candidate: <code>{receipt?.evidenceId ?? "—"}</code> · Admission = <strong>NOT_ADMITTED</strong></p>
        </section>
      )}

      {submitError && (
        <section style={{marginBottom:20,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:16,padding:18}}>
          <strong style={{color:"#991b1b"}}>ยังไม่บันทึก — Fail Closed</strong>
          <p style={{margin:"8px 0 0",color:"#b91c1c",lineHeight:1.7}}>{submitError}</p>
          <p style={{margin:"8px 0 0",color:"#7f1d1d"}}>หากขึ้น AUTH_REQUIRED ให้เข้าสู่ระบบก่อน หากขึ้น REVIEW_NOT_READY ต้องจัด controlled review ให้ถึง READY_FOR_DECISION โดยไม่ข้าม workflow</p>
        </section>
      )}

      <section style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:16,padding:18,marginBottom:20}}>
        <strong>ข้อกำกับ</strong>
        <p style={{margin:"8px 0 0",lineHeight:1.75,color:"#334155"}}>
          รายวิชา พ.ศ. 2567 เป็น Candidate for Human Consideration เท่านั้น ชื่อ/รหัสที่อยู่ในแถวเดียวกันไม่ใช่หลักฐาน equivalence.
          ชื่อและบทบาทที่กรอกเป็น declaration metadata เท่านั้น — สิทธิยืนยันจริงต้องผ่าน authenticated HEPE actor + database authority/RLS + SoD/COI checks.
          การยืนยันไม่สร้าง authority และไม่รับเข้า Audit Evidence Set โดยอัตโนมัติ
        </p>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginBottom:22}}>
        {[["รายการทั้งหมด",String(items.length)],["เลือกสถานะแล้ว",`${completed}/${items.length}`],["ยังไม่ตัดสิน",String(items.length-completed)],["Gate",confirmed?"LOCKED":completed===items.length?"READY TO CONFIRM":"HUMAN DECISION REQUIRED"]].map(([label,value]) => (
          <article key={label} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:14,padding:16}}><div style={{color:"#64748b",fontSize:13}}>{label}</div><div style={{marginTop:6,fontSize:19,fontWeight:800}}>{value}</div></article>
        ))}
      </section>

      <section style={{display:"grid",gap:16}}>
        {items.map((item,index) => {
          const decision = decisions[item.legacyCode] ?? "";
          return (
            <article key={item.legacyCode} style={{background:"white",border:decision?"1px solid #86efac":"1px solid #e2e8f0",borderRadius:18,padding:18,opacity:locked?.82:1}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <div><div style={{color:"#64748b",fontSize:13}}>รายการ {index+1} / {items.length}</div><h2 style={{margin:"4px 0"}}>{item.legacyCode} — {item.legacyTitle}</h2></div>
                <span style={{alignSelf:"start",padding:"6px 10px",borderRadius:999,background:decision?"#ecfdf5":"#f8fafc",fontWeight:700,fontSize:13}}>{decision?"DECIDED":"PENDING"}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,margin:"14px 0"}}>
                <div style={{padding:14,borderRadius:12,background:"#f8fafc"}}><div style={{fontSize:12,color:"#64748b"}}>Legacy</div><strong>{item.legacyCode}</strong><div>{item.legacyTitle}</div></div>
                <div style={{padding:14,borderRadius:12,background:"#f8fafc"}}><div style={{fontSize:12,color:"#64748b"}}>2562 / Intermediate</div><strong>{item.intermediateCode}</strong><div>{item.intermediateTitle}</div></div>
                <div style={{padding:14,borderRadius:12,background:"#fff7ed"}}><div style={{fontSize:12,color:"#9a3412"}}>2567 Candidate</div><strong>{item.candidateCode}</strong><div>{item.candidateTitle}</div></div>
              </div>
              {item.operationalNote && <p style={{background:"#fffbeb",border:"1px solid #fde68a",padding:12,borderRadius:10,color:"#854d0e"}}>{item.operationalNote}</p>}
              <label style={{display:"grid",gap:6,fontWeight:700}}>สถานะการตัดสิน
                <select disabled={locked} value={decision} onChange={(e)=>setDecisions((s)=>({...s,[item.legacyCode]:e.target.value as Decision}))} style={{padding:11,borderRadius:10,border:"1px solid #cbd5e1",background:"white"}}>
                  {decisionOptions.map((o)=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginTop:12}}>
                <label style={{display:"grid",gap:6,fontWeight:700}}>เหตุผลจาก controlled evidence
                  <textarea disabled={locked} value={rationales[item.legacyCode]??""} onChange={(e)=>setRationales((s)=>({...s,[item.legacyCode]:e.target.value}))} rows={3} style={{padding:10,borderRadius:10,border:"1px solid #cbd5e1"}} />
                </label>
                <label style={{display:"grid",gap:6,fontWeight:700}}>มติ / เอกสาร / reference
                  <textarea disabled={locked} value={references[item.legacyCode]??""} onChange={(e)=>setReferences((s)=>({...s,[item.legacyCode]:e.target.value}))} rows={3} style={{padding:10,borderRadius:10,border:"1px solid #cbd5e1"}} />
                </label>
              </div>
            </article>
          );
        })}
      </section>

      <section style={{marginTop:22,background:"white",border:"1px solid #e2e8f0",borderRadius:18,padding:18}}>
        <h2 style={{marginTop:0}}>Human Authority Declaration</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
          <label style={{display:"grid",gap:6,fontWeight:700}}>ชื่อผู้พิจารณา<input disabled={locked} value={authorityName} onChange={(e)=>setAuthorityName(e.target.value)} style={{padding:11,borderRadius:10,border:"1px solid #cbd5e1"}} /></label>
          <label style={{display:"grid",gap:6,fontWeight:700}}>บทบาท / Capacity<input disabled={locked} value={authorityRole} onChange={(e)=>setAuthorityRole(e.target.value)} style={{padding:11,borderRadius:10,border:"1px solid #cbd5e1"}} /></label>
        </div>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",marginTop:16,lineHeight:1.6}}>
          <input disabled={locked} type="checkbox" checked={acknowledged} onChange={(e)=>setAcknowledged(e.target.checked)} style={{marginTop:4}} />
          <span>ยืนยันว่าการเลือกสถานะทั้ง 12 รายการเป็นการตัดสินโดยมนุษย์ และรับทราบว่าระบบจะตรวจ authority จาก authenticated HEPE identity ไม่ใช่จากชื่อ/บทบาทที่พิมพ์ในช่องนี้</span>
        </label>
        <button onClick={confirmPacket} disabled={!canConfirm} style={{marginTop:18,padding:"12px 18px",borderRadius:12,border:0,background:canConfirm?"#0f172a":"#cbd5e1",color:"white",fontWeight:800,cursor:canConfirm?"pointer":"not-allowed"}}>
          {submitting?"กำลังตรวจ Authority และบันทึก…":confirmed?"ยืนยันแล้ว — LOCKED":"บันทึกและยืนยัน Controlled Decision"}
        </button>
        <p style={{margin:"10px 0 0",color:"#64748b",fontSize:13}}>ระบบเขียนได้เฉพาะเมื่อมี authenticated actor, controlled review อยู่สถานะ READY_FOR_DECISION และผ่าน authority / SoD / COI checks ทั้งหมด</p>
      </section>
    </main>
  );
}
