'use client';

import { useMemo, useState } from 'react';

type Option = { id: string; label: string };

export default function PilotEntryClient({ activities, assessments }: { activities: Option[]; assessments: Option[] }) {
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
  const [status, setStatus] = useState('READY');
  const [lastSaved, setLastSaved] = useState<'delivery' | 'assessment_evidence' | null>(null);

  async function submit(kind: 'delivery' | 'assessment_evidence', form: HTMLFormElement) {
    setStatus('SAVING');
    setLastSaved(null);
    const fd = new FormData(form);
    const payload = kind === 'delivery'
      ? {
          kind,
          learningActivityVersionId: String(fd.get('learningActivityVersionId') || ''),
          academicYear: String(fd.get('academicYear') || ''),
          termCode: String(fd.get('termCode') || ''),
          startsOn: String(fd.get('startsOn') || ''),
          endsOn: String(fd.get('endsOn') || '') || null,
        }
      : {
          kind,
          assessmentVersionId: String(fd.get('assessmentVersionId') || ''),
          title: String(fd.get('title') || ''),
          effectiveFrom: String(fd.get('effectiveFrom') || ''),
        };

    const response = await fetch('/api/pilot-entry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({ ok: false, code: 'INVALID_RESPONSE' }));
    if (result.ok) {
      setStatus(kind === 'delivery' ? 'บันทึกการสอนแล้ว' : 'เพิ่มหลักฐานแล้ว');
      setLastSaved(kind);
      form.reset();
    } else {
      setStatus(`ไม่สามารถบันทึกได้ · ${result.code || response.status}`);
    }
  }

  return <div className="grid two" style={{marginTop:16}}>
    <article className="card">
      <div className="brand-kicker">60-SECOND ENTRY · TEACHING</div>
      <h2>บันทึกหลังสอน</h2>
      <p className="note">ข้อมูลปีการศึกษาและภาคเตรียมไว้ให้แล้ว เพื่อลดการกรอกซ้ำ เหลือเลือกกิจกรรมและยืนยันวันที่เป็นหลัก</p>
      <form onSubmit={(e)=>{e.preventDefault(); void submit('delivery', e.currentTarget);}}>
        <label>กิจกรรมการเรียนรู้<select name="learningActivityVersionId" required defaultValue=""><option value="" disabled>เลือกกิจกรรม</option>{activities.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
        <div className="grid g2">
          <label>ปีการศึกษา<input name="academicYear" defaultValue="2569" required /></label>
          <label>ภาคการศึกษา<input name="termCode" defaultValue="1" required /></label>
        </div>
        <label>วันที่สอน<input name="startsOn" type="date" defaultValue={today} required /></label>
        <details><summary className="note">ตัวเลือกเพิ่มเติม</summary><label>วันที่สิ้นสุด (ถ้ามี)<input name="endsOn" type="date" /></label></details>
        <button className="button" type="submit">บันทึกการสอน</button>
      </form>
    </article>

    <article className="card">
      <div className="brand-kicker">QUICK ENTRY · EVIDENCE</div>
      <h2>เพิ่มหลักฐานการประเมิน</h2>
      <p className="note">เลือก Assessment ที่ระบบมีอยู่แล้ว แล้วระบุชื่อหลักฐาน โดยไม่ต้องกรอกข้อมูลรายวิชาซ้ำ</p>
      <form onSubmit={(e)=>{e.preventDefault(); void submit('assessment_evidence', e.currentTarget);}}>
        <label>รายการประเมิน<select name="assessmentVersionId" required defaultValue=""><option value="" disabled>เลือกรายการประเมิน</option>{assessments.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
        <label>ชื่อหลักฐาน<input name="title" placeholder="เช่น แบบประเมินกิจกรรม Week 8" required /></label>
        <label>วันที่มีผล<input name="effectiveFrom" type="date" defaultValue={today} /></label>
        <button className="button" type="submit">เพิ่มหลักฐาน</button>
      </form>
    </article>

    <article className="card" style={{gridColumn:'1 / -1'}} aria-live="polite">
      <div className="label">สถานะการบันทึก</div>
      <div className="live-state">{status}</div>
      {lastSaved?<div className="hero-actions" style={{marginTop:12}}>{lastSaved==='delivery'?<><a className="button" href="/teaching">ดู Teaching Record</a><a className="button secondary" href="/plan-actual">ดู Plan vs Actual</a></>:<><a className="button" href="/evidence">ดู Evidence</a><a className="button secondary" href="/assessment">กลับไป Assessment</a></>}</div>:null}
      <p className="note" style={{marginTop:12}}>Human authority is preserved. API writes remain limited to SYN-* programme scope and database authority checks.</p>
    </article>
  </div>;
}
