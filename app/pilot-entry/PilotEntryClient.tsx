'use client';

import { useState } from 'react';

type Option = { id: string; label: string };

export default function PilotEntryClient({ activities, assessments }: { activities: Option[]; assessments: Option[] }) {
  const [status, setStatus] = useState('READY');

  async function submit(kind: 'delivery' | 'assessment_evidence', form: HTMLFormElement) {
    setStatus('SAVING');
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
    setStatus(result.ok ? `PASS · ${kind}` : `DENIED · ${result.code || response.status}`);
    if (result.ok) form.reset();
  }

  return <div className="grid two" style={{marginTop:16}}>
    <article className="card">
      <div className="brand-kicker">QUICK ENTRY · TEACHING</div>
      <h2>บันทึกการสอนจริง</h2>
      <p className="note">เฉพาะข้อมูลสังเคราะห์ที่มองเห็นภายใต้ RLS ของผู้ใช้ปัจจุบัน</p>
      <form onSubmit={(e)=>{e.preventDefault(); void submit('delivery', e.currentTarget);}}>
        <label>กิจกรรมการเรียนรู้<select name="learningActivityVersionId" required defaultValue=""><option value="" disabled>เลือกกิจกรรม</option>{activities.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
        <label>ปีการศึกษา<input name="academicYear" defaultValue="2569" required /></label>
        <label>ภาคการศึกษา<input name="termCode" defaultValue="1" required /></label>
        <label>วันที่สอน<input name="startsOn" type="date" required /></label>
        <label>วันที่สิ้นสุด (ถ้ามี)<input name="endsOn" type="date" /></label>
        <button className="button" type="submit">บันทึกการสอน</button>
      </form>
    </article>

    <article className="card">
      <div className="brand-kicker">QUICK ENTRY · EVIDENCE</div>
      <h2>บันทึกหลักฐานการประเมิน</h2>
      <p className="note">สร้าง Evidence draft จาก Assessment ที่ได้รับอนุญาตเท่านั้น</p>
      <form onSubmit={(e)=>{e.preventDefault(); void submit('assessment_evidence', e.currentTarget);}}>
        <label>รายการประเมิน<select name="assessmentVersionId" required defaultValue=""><option value="" disabled>เลือกรายการประเมิน</option>{assessments.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
        <label>ชื่อหลักฐาน<input name="title" placeholder="เช่น แบบประเมินกิจกรรม Week 8" required /></label>
        <label>วันที่มีผล<input name="effectiveFrom" type="date" /></label>
        <button className="button" type="submit">เพิ่มหลักฐาน</button>
      </form>
    </article>

    <article className="card" style={{gridColumn:'1 / -1'}} aria-live="polite">
      <div className="label">Pilot entry status</div>
      <div className="live-state">{status}</div>
      <p className="note">Human authority is preserved. The API cannot write outside SYN-* programme scope and cannot bypass RLS/authority checks.</p>
    </article>
  </div>;
}
