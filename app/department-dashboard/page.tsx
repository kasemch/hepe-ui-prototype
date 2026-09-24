"use client";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import "./dashboard.css";

type Row = Record<string, any>;
const IDS = [
  ["69e3361e-b342-43e1-b386-ac73b191b9a4","ศษ.บ. สุขศึกษาและพลศึกษา","BED-HEPE"],
  ["beb806d1-89f8-4ca0-b49a-1e157056432b","ศษ.บ. พลศึกษา","BED-PE"],
  ["d7cd108c-7e88-436f-b802-87786ce61ef0","วท.บ. วิทยาศาสตร์การกีฬา","BSC-SS"],
  ["659d7d53-5d8b-4bbe-b650-05cae9755221","ศษ.ม. พลศึกษาและกีฬา","MED-PES"]
] as const;
function status(x: string|undefined) { return x ? x.replaceAll("_"," ") : "ยังไม่มีระเบียน"; }
export default function DepartmentDashboard() {
 const [data,setData] = useState<{versions:Row[];members:Row[];courses:Row[];offerings:Row[];t3:Row[];t5:Row[];results:Row[]}|null>(null);
 const [error,setError] = useState("");
 const [loading,setLoading] = useState(true);
 const [selected,setSelected] = useState("all");
 const [term,setTerm] = useState("");
 const [search,setSearch] = useState("");
 useEffect(()=>{let active=true;(async()=>{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key){setError("ยังไม่ได้ตั้งค่า Supabase environment");setLoading(false);return;}
  const db=createBrowserClient(url,key);
  const {data:auth,error:authError}=await db.auth.getUser();
  if(authError||!auth.user){setError("กรุณาเข้าสู่ระบบก่อนเปิดข้อมูลหลักสูตร");setLoading(false);return;}
  const ids=IDS.map(x=>x[0]);
  const versions=await db.from("curriculum_versions").select("curriculum_version_id,programme_id,version_label,is_current,status_code").in("programme_id",ids).eq("is_current",true);
  if(versions.error)throw Error(versions.error.message);
  const vids=(versions.data||[]).map(x=>x.curriculum_version_id);
  const members=vids.length?await db.from("curriculum_courses").select("curriculum_version_id,course_id,course_role,recommended_year,recommended_term,is_active").in("curriculum_version_id",vids).eq("is_active",true):{data:[],error:null};
  if(members.error)throw Error(members.error.message);
  const cids=[...new Set((members.data||[]).map(x=>x.course_id))];
  const courses=cids.length?await db.from("courses").select("course_id,course_code,title_th,credit_value").in("course_id",cids):{data:[],error:null};
  if(courses.error)throw Error(courses.error.message);
  const offerings=await db.from("course_offerings").select("course_offering_id,programme_id,course_id,academic_term_id,offering_status").in("programme_id",ids);
  if(offerings.error)throw Error(offerings.error.message);
  const oids=(offerings.data||[]).map(x=>x.course_offering_id);
  const t3=oids.length?await db.from("tqf3_records").select("tqf3_record_id,course_offering_id,lifecycle_status").in("course_offering_id",oids):{data:[],error:null};
  const t5=oids.length?await db.from("tqf5_records").select("tqf5_record_id,course_offering_id,lifecycle_status").in("course_offering_id",oids):{data:[],error:null};
  if(t3.error||t5.error)throw Error(t3.error?.message||t5.error?.message);
  const fids=(t5.data||[]).map(x=>x.tqf5_record_id);
  const results=fids.length?await db.from("result_snapshots").select("result_snapshot_id,tqf5_record_id,snapshot_status").in("tqf5_record_id",fids):{data:[],error:null};
  if(results.error)throw Error(results.error.message);
  if(active)setData({versions:versions.data||[],members:members.data||[],courses:courses.data||[],offerings:offerings.data||[],t3:t3.data||[],t5:t5.data||[],results:results.data||[]});
 })().catch(e=>{if(active)setError(e.message||"ไม่สามารถโหลดข้อมูลได้");}).finally(()=>{if(active)setLoading(false)});return()=>{active=false};},[]);
 const courseMap=useMemo(()=>new Map((data?.courses||[]).map(x=>[x.course_id,x])),[data]);
 const versionMap=useMemo(()=>new Map((data?.versions||[]).map(x=>[x.curriculum_version_id,x.programme_id])),[data]);
 const rows=useMemo(()=> (data?.members||[]).map(m=>{
   const programme=versionMap.get(m.curriculum_version_id);const c=courseMap.get(m.course_id);
   const os=data?.offerings.filter(o=>o.programme_id===programme&&o.course_id===m.course_id&&(term===""||o.academic_term_id===term))||[];
   const offeringIds=new Set(os.map(x=>x.course_offering_id));
   const t3=data?.t3.filter(x=>offeringIds.has(x.course_offering_id))||[];
   const t5=data?.t5.filter(x=>offeringIds.has(x.course_offering_id))||[];
   const ids=new Set(t5.map(x=>x.tqf5_record_id));
   const results=data?.results.filter(x=>ids.has(x.tqf5_record_id))||[];
   return {...m,programme,course_code:c?.course_code||"—",title_th:c?.title_th||"ไม่พบชื่อวิชา",credit_value:c?.credit_value,offerings:os,t3,t5,results};
 }).filter(x=>(selected==="all"||x.programme===selected)&&((x.course_code+" "+x.title_th).toLowerCase().includes(search.toLowerCase()))),[data,courseMap,versionMap,selected,term,search]);
 const terms=[...new Set((data?.offerings||[]).map(x=>x.academic_term_id).filter(Boolean))];
 const summary=(id:string)=>{const mine=rows.filter(x=>x.programme===id);return {courses:mine.length,offerings:mine.reduce((n,x)=>n+x.offerings.length,0),t3:mine.reduce((n,x)=>n+x.t3.length,0),t5:mine.reduce((n,x)=>n+x.t5.length,0),results:mine.reduce((n,x)=>n+x.results.length,0)}};
 return <main className="hepe-dashboard">
  <header className="hepe-header"><div><span className="hepe-eyebrow">HEPE FAST TQF PORTAL · NON-PRODUCTION</span><h1>ภาพรวมหลักสูตรภาควิชาพลานามัย</h1><p>ทะเบียนรายวิชา · มคอ.3 · มคอ.5 · รายงานผลการสอบ</p></div><span className="hepe-security">ข้อมูลตามสิทธิ์ของบัญชีที่เข้าสู่ระบบ</span></header>
  {loading&&<div className="hepe-message">กำลังอ่านข้อมูลจาก Supabase…</div>}
  {error&&<div role="alert" className="hepe-message hepe-error">{error}</div>}
  {data&&<><section className="hepe-cards">{IDS.map(([id,name,code])=>{const x=summary(id);return <button type="button" key={id} aria-pressed={selected===id} onClick={()=>setSelected(selected===id?"all":id)} className={"hepe-card "+(selected===id?"active":"")}><small>{code}</small><h2>{name}</h2><strong>{x.courses} <span>รายวิชา</span></strong><div className="hepe-stats"><span>เปิดสอน {x.offerings}</span><span>มคอ.3 {x.t3}</span><span>มคอ.5 {x.t5}</span><span>ผลสอบ {x.results}</span></div></button>})}</section>
   <section className="hepe-panel"><div className="hepe-toolbar"><div><h2>ทะเบียนรายวิชาและความคืบหน้าเอกสาร</h2><p>สถานะเอกสารแสดงจากระเบียนจริง ไม่ถือว่าการมีระเบียนคืออนุมัติแล้ว</p></div><div className="hepe-filters"><button type="button" onClick={()=>setSelected("all")}>ทุกหลักสูตร</button><select aria-label="เลือกภาคเรียน" value={term} onChange={e=>setTerm(e.target.value)}><option value="">ทุกภาคเรียน</option>{terms.map(t=><option key={t} value={t}>{t}</option>)}</select><input aria-label="ค้นหารายวิชา" placeholder="ค้นหารหัสหรือชื่อวิชา" value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
   <div className="hepe-table-scroll"><table><thead><tr><th>รหัสวิชา / ชื่อวิชา</th><th>ชั้นปี</th><th>เปิดสอน</th><th>มคอ.3</th><th>มคอ.5</th><th>รายงานสอบ</th></tr></thead><tbody>{rows.map((r,i)=><tr key={r.curriculum_version_id+"-"+r.course_id+"-"+i}><td><b>{r.course_code}</b><div>{r.title_th}</div></td><td>{r.recommended_year||"—"}</td><td>{r.offerings.length||"—"}</td><td><span className={r.t3.length?"hepe-pill exists":"hepe-pill"}>{r.t3.length?status(r.t3[0].lifecycle_status):"ยังไม่มี"}</span></td><td><span className={r.t5.length?"hepe-pill exists":"hepe-pill"}>{r.t5.length?status(r.t5[0].lifecycle_status):"ยังไม่มี"}</span></td><td><span className={r.results.length?"hepe-pill exists":"hepe-pill"}>{r.results.length?status(r.results[0].snapshot_status):"ยังไม่มี"}</span></td></tr>)}</tbody></table>{rows.length===0&&<p className="hepe-empty">ไม่พบรายวิชาตามเงื่อนไข หรือบัญชีนี้ยังไม่มีสิทธิ์อ่านข้อมูลที่เกี่ยวข้อง</p>}</div>
  </section><p className="hepe-footnote">แสดงเฉพาะหลักสูตรจริง 4 หลักสูตร · นับรายวิชาตาม membership ของหลักสูตรปัจจุบัน · ไม่รวม synthetic fixtures · ไม่มีคำสั่งเปลี่ยนสถานะหรือเผยแพร่เอกสาร</p></>}
 </main>;
}
