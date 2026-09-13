'use client';

import {useEffect,useMemo,useState} from 'react';
import {usePathname} from 'next/navigation';
import {getHelpBinding} from '../lib/help/hepe-help';

export default function HelpTools(){
 const pathname=usePathname();
 const binding=useMemo(()=>getHelpBinding(pathname),[pathname]);
 const [open,setOpen]=useState(false);
 const [step,setStep]=useState(0);
 useEffect(()=>{setOpen(false);setStep(0)},[pathname]);
 if(!binding)return null;
 const current=binding.steps[step];
 const targetFound=typeof document!=='undefined'&&current?.selector?Boolean(document.querySelector(current.selector)):true;
 return <>
  <div className="help-tools" aria-label="Help tools">
   <a className="help-link" href={`/help/${binding.slug}`} aria-label={`Help for ${binding.slug}`}>? Help</a>
   <button className="tour-launcher" type="button" onClick={()=>{setStep(0);setOpen(true)}}>Guided tour</button>
  </div>
  {open&&current?<div className="tour-layer" role="dialog" aria-modal="true" aria-labelledby="hepe-tour-title">
   <div className="tour-card">
    <div className="tour-meta">{binding.tourId} · {step+1}/{binding.steps.length}</div>
    <h2 id="hepe-tour-title">{current.title}</h2>
    <p>{current.body}</p>
    {!targetFound?<p className="tour-warning">จุดบนหน้าจอนี้ไม่พร้อมใน state ปัจจุบัน แต่คำอธิบายยังใช้ได้</p>:null}
    <div className="tour-actions">
     <button type="button" className="button ghost" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>ย้อนกลับ</button>
     {step<binding.steps.length-1?<button type="button" className="button" onClick={()=>setStep(s=>s+1)}>ถัดไป</button>:<button type="button" className="button" onClick={()=>setOpen(false)}>จบทัวร์</button>}
     <button type="button" className="tour-close" onClick={()=>setOpen(false)}>ปิด</button>
    </div>
   </div>
  </div>:null}
 </>;
}
