'use client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { SUPPORT_CATEGORIES, SUPPORT_SEVERITIES, SupportTicket } from '../support-model';

const storageKey='hepe-support-01-local-tickets';

function safeBrowser(){if(typeof navigator==='undefined')return 'UNKNOWN';return navigator.userAgent.replace(/[\r\n]/g,' ').slice(0,180)}
function viewport(){if(typeof window==='undefined')return 'UNKNOWN';return `${window.innerWidth}x${window.innerHeight}`}

export default function NewSupportTicket(){
  const [saved,setSaved]=useState<string>('');
  const [appSha,setAppSha]=useState('UNVERIFIED_RUNTIME');
  useEffect(()=>{fetch('/api/pilot-build-meta',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(x=>x?.applicationSha&&setAppSha(String(x.applicationSha))).catch(()=>{})},[]);
  const context=useMemo(()=>({module_code:'SUPPORT',page_path:'/support/new',environment:'NON-PRODUCTION' as const,browser:safeBrowser(),viewport:viewport()}),[]);
  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); const f=new FormData(e.currentTarget); const now=new Date().toISOString();
    const suffix=Date.now().toString().slice(-8); const id=`SUP-LOCAL-${suffix}`;
    const ticket:SupportTicket={ticket_id:id,ticket_number:id,created_at:now,created_by_actor:'LOCAL_PILOT_REQUESTER',module_code:String(f.get('module_code')||'SUPPORT').slice(0,64),page_path:String(f.get('page_path')||'/support/new').slice(0,200),course_code:String(f.get('course_code')||'').slice(0,32)||undefined,ticket_category:String(f.get('ticket_category')) as SupportTicket['ticket_category'],severity:String(f.get('severity')) as SupportTicket['severity'],priority:'NORMAL',title:String(f.get('title')||'').slice(0,180),description:String(f.get('description')||'').slice(0,5000),reproduction_steps:String(f.get('reproduction_steps')||'').slice(0,5000)||undefined,expected_result:String(f.get('expected_result')||'').slice(0,3000)||undefined,actual_result:String(f.get('actual_result')||'').slice(0,3000)||undefined,environment:'NON-PRODUCTION',application_sha:appSha,browser:context.browser,viewport:context.viewport,support_status:'OPEN',provenance_status:'USER_INPUT_CANDIDATE',source_reference:'HEPE-SUPPORT-01-LOCAL-BROWSER',authority_scope:'SUPPORT_ONLY',canonical_mutation_allowed:false,audit_evidence_status:'NOT_ADMITTED',production:false};
    const prev=JSON.parse(localStorage.getItem(storageKey)||'[]'); prev.push(ticket); localStorage.setItem(storageKey,JSON.stringify(prev)); setSaved(id); e.currentTarget.reset();
  }
  return <main className="support-shell"><header className="support-top"><div><div className="eyebrow">OPEN SUPPORT TICKET</div><h1>แจ้งปัญหา</h1><p>ข้อมูลใน gate นี้บันทึกเฉพาะ local browser prototype และไม่เขียนฐานข้อมูล controlled schema</p></div><div className="support-badges"><span className="support-badge">LOCAL BROWSER ONLY</span><span className="support-badge">NON-PRODUCTION</span></div></header>
  <div className="support-notice"><strong>Context capture:</strong> เก็บเฉพาะ module/page/SHA/browser/viewport ที่ไม่เป็น secret · ไม่เก็บ token, cookie, password หรือ authorization header</div>
  {saved&&<div className="support-card support-good"><strong>บันทึก local candidate แล้ว: {saved}</strong><p>Ticket นี้ไม่ใช่ Audit Evidence, Formal Finding หรือ Approved Change</p></div>}
  <form className="support-card support-form" onSubmit={submit}><h2>รายละเอียด Ticket</h2><div className="support-form-grid"><label>Module<input name="module_code" defaultValue="SUPPORT" required/></label><label>Page Path<input name="page_path" defaultValue="/support/new" required/></label><label>Course Code (ถ้ามี)<input name="course_code" placeholder="เช่น HED2503"/></label><label>Category<select name="ticket_category" defaultValue="UI_UX">{SUPPORT_CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label><label>Severity<select name="severity" defaultValue="SEV-3">{SUPPORT_SEVERITIES.map(x=><option key={x}>{x}</option>)}</select></label><label>Application SHA<input value={appSha} readOnly/></label><label className="support-wide">หัวข้อ<input name="title" required maxLength={180}/></label><label className="support-wide">คำอธิบาย<textarea name="description" required/></label><label className="support-wide">ขั้นตอนที่ทำให้เกิดปัญหา<textarea name="reproduction_steps"/></label><label>ผลที่คาดหวัง<textarea name="expected_result"/></label><label>ผลที่เกิดขึ้นจริง<textarea name="actual_result"/></label></div><div className="support-empty">Attachment UI placeholder: screenshot / image / PDF / diagnostic text · persistent upload NOT CONNECTED in SUPPORT-01</div><div className="support-actions"><button className="support-action primary" type="submit">บันทึก Local Ticket</button><a className="support-action" href="/support">กลับ Support Center</a></div></form>
  <footer className="support-footer">canonical_mutation_allowed=false · audit_evidence_status=NOT_ADMITTED · production=false</footer></main>
}
