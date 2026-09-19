"use client";

import { useMemo, useState } from "react";

const ROLES = [
  ["STUDENT","นักศึกษา (Student A)","SELF · SYN2569A","blue"],
  ["LECTURER","อาจารย์ผู้สอน (Lecturer A)","TEACHING_INSTANCE · SYN-STU-A1","teal"],
  ["PROGRAMME_CHAIR","ประธานหลักสูตร","PROGRAMME · SYN-HEPE-A","violet"],
  ["QA","ผู้รับผิดชอบ QA","PROGRAMME · SYN-HEPE-A","amber"],
  ["DEPARTMENT_HEAD","หัวหน้าภาควิชา","DEPARTMENT · RU-EDU-DPE","red"],
  ["SYSTEM_ADMIN","ผู้ดูแลระบบ","SYSTEM · TECHNICAL ONLY","slate"],
];

const NAV = [
  ["dashboard","⌂","Dashboard",["STUDENT","LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"]],
  ["workspace","◫","My Workspace",["STUDENT","LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"]],
  ["people","◎","People",["LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"]],
  ["programmes","▦","Programmes",["LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"]],
  ["courses","▤","Courses",["STUDENT","LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"]],
  ["teaching","△","Teaching",["LECTURER","PROGRAMME_CHAIR","DEPARTMENT_HEAD"]],
  ["students","◉","Students",["STUDENT","LECTURER","PROGRAMME_CHAIR","DEPARTMENT_HEAD"]],
  ["evidence","◇","Evidence",["LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"]],
  ["qa","✓","QA",["PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"]],
  ["authority","◆","Authority",["PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"]],
  ["audit","≡","Audit",["QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"]],
  ["admin","⚙","Administration",["SYSTEM_ADMIN"]],
];

const PROGRAMMES = [
  ["SYN-HEPE-A","ศษ.บ. สุขศึกษาและพลศึกษา","2567","ACTIVE / EFFECTIVE","12/14"],
  ["SYN-HEPE-B","ศษ.บ. พลศึกษา","2567-D","DRAFT / LATEST","8/14"],
];

const EVIDENCE = [
  ["EVD-001","Curriculum approval evidence","CURRICULUM","VERIFIED","Programme · PLO"],
  ["EVD-002","Teaching responsibility source","TEACHING","PENDING","Course · Offering"],
];

function Status({children,tone="neutral"}) {
  return <span className={"status status-"+tone}>{children}</span>;
}
function Stat({label,value,note,tone="blue"}) {
  return <article className={"stat tone-"+tone}><div className="statLabel">{label}</div><div className="statValue">{value}</div><div className="statNote">{note}</div></article>;
}
function Panel({title,kicker,children}) {
  return <section className="panel"><div className="panelHead"><div>{kicker&&<div className="kicker">{kicker}</div>}<h3>{title}</h3></div></div>{children}</section>;
}
function DataTable({headers,rows}) {
  return <div className="tableWrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
}
function Denied({children}) {
  return <div className="denied"><div className="deniedIcon">⊘</div><strong>Access not available in this role</strong><span>{children}</span></div>;
}
function Header({eyebrow,title,desc,badge,tone}) {
  return <div className="hero"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{desc}</p></div>{badge&&<Status tone={tone}>{badge}</Status>}</div>;
}

function Dashboard({role}) {
  if(role==="STUDENT") return <div className="screen">
    <Header eyebrow="MY LEARNING" title="สวัสดี นักศึกษาทดสอบ A" desc="มองเห็นเฉพาะข้อมูลของตนเองผ่าน self-scoped RLS และ enrollment ที่ได้รับอนุญาต" badge="SELF · VERIFIED BINDING" tone="blue"/>
    <div className="stats"><Stat label="My Courses" value="1" note="ภาค 1/2569"/><Stat label="Activities" value="5" note="2 รายการกำลังทำ" tone="teal"/><Stat label="Feedback" value="3" note="มีรายการใหม่ 1" tone="violet"/><Stat label="Portfolio" value="72%" note="ความครบถ้วน" tone="amber"/></div>
    <div className="grid2"><Panel title="วิชาของฉัน" kicker="SELF-SCOPED COURSE SUMMARY"><div className="courseCard"><div><Status tone="green">ENROLLED</Status><h4>SYN-STU-A1 · การประเมินสุขภาพในโรงเรียน</h4><p>ปีการศึกษา 2569 · ภาค 1</p></div><button className="primary">เปิดรายวิชา</button></div></Panel><Panel title="Privacy boundary" kicker="NEGATIVE TEST"><div className="privacy"><strong>Student A → Student B</strong><Status tone="red">DENY</Status><p>ไม่มี lateral student navigation และไม่มี caller-selected student_id</p></div></Panel></div>
  </div>;

  if(role==="LECTURER") return <div className="screen">
    <Header eyebrow="TEACHING WORKSPACE" title="Lecturer A · Assigned Offering" desc="การเห็นนักศึกษาเกิดจาก active instructor assignment ไม่ใช่ IAM authority" badge="TEACHING_INSTANCE · ACTIVE" tone="teal"/>
    <div className="stats"><Stat label="Assigned Courses" value="1" note="SYN-STU-A1" tone="teal"/><Stat label="Students" value="2" note="เฉพาะ offering นี้"/><Stat label="Evidence Pending" value="1" note="verification" tone="amber"/><Stat label="Academic Authority" value="0" note="teaching ≠ authority" tone="red"/></div>
    <div className="grid2"><Panel title="Teaching Coverage" kicker="ASSIGNED TEACHING"><DataTable headers={["Course","Term","Students","State"]} rows={[["SYN-STU-A1","1/2569","2",<Status tone="green" key="s">ACTIVE</Status>]]}/></Panel><Panel title="Authority boundary" kicker="SECURITY INVARIANT"><div className="boundaryBox"><div>Teaching assignment</div><span>≠</span><div>Academic authority</div></div><p className="muted">creates_system_authority = false</p></Panel></div>
  </div>;

  if(role==="PROGRAMME_CHAIR") return <div className="screen">
    <Header eyebrow="PROGRAMME GOVERNANCE" title="Programme Chair · SYN-HEPE-A" desc="ภาพรวมหลักสูตร หลักฐาน และงานกำกับภายใน programme scope" badge="PROGRAMME · A-SCOPE" tone="violet"/>
    <div className="stats"><Stat label="Curriculum" value="2567" note="ACTIVE / EFFECTIVE" tone="violet"/><Stat label="PLO" value="8" note="programme-level"/><Stat label="Evidence" value="12/14" note="2 gaps" tone="amber"/><Stat label="Open Reviews" value="1" note="scope only" tone="teal"/></div>
    <Panel title="Programme health" kicker="CANONICAL READ MODEL"><DataTable headers={["Programme","Version","Lifecycle","Evidence"]} rows={PROGRAMMES.slice(0,1).map(p=>[p[0],p[2],<Status tone="green" key="x">{p[3]}</Status>,p[4]])}/></Panel>
  </div>;

  if(role==="QA") return <div className="screen">
    <Header eyebrow="QUALITY ASSURANCE" title="Evidence-first QA Workspace" desc="ค้นหา → reuse → verify → link → finding → improvement โดยไม่อัปโหลดหลักฐานซ้ำ" badge="PROGRAMME QA SCOPE" tone="amber"/>
    <div className="stats"><Stat label="Evidence Current" value="1" note="verified" tone="green"/><Stat label="Pending" value="1" note="sufficiency" tone="amber"/><Stat label="Findings" value="2" note="open" tone="red"/><Stat label="Actions" value="3" note="tracked"/></div>
    <Panel title="Evidence health" kicker="TRACEABLE EVIDENCE"><DataTable headers={["Code","Evidence","Verification","Usage"]} rows={EVIDENCE.map(e=>[e[0],e[1],<Status tone={e[3]==="VERIFIED"?"green":"amber"} key="v">{e[3]}</Status>,e[4]])}/></Panel>
  </div>;

  if(role==="DEPARTMENT_HEAD") return <div className="screen">
    <Header eyebrow="DEPARTMENT COMMAND CENTER" title="ภาควิชาพลานามัย · Executive Overview" desc="Programme / Teaching / QA / Evidence พร้อม A5 governance เฉพาะเมื่อ state อนุญาต" badge="DEPARTMENT_HEAD · A5" tone="red"/>
    <div className="stats"><Stat label="Programmes" value="2" note="1 active · 1 draft" tone="red"/><Stat label="Teaching Coverage" value="94%" note="synthetic projection" tone="teal"/><Stat label="Evidence Health" value="86%" note="2 gaps" tone="amber"/><Stat label="Governance Actions" value="2" note="FREEZE · SUPERSEDE" tone="violet"/></div>
    <div className="grid2"><Panel title="Programme portfolio" kicker="AGGREGATE-FIRST"><DataTable headers={["Programme","Lifecycle","Evidence"]} rows={PROGRAMMES.map(p=>[p[0],<Status tone={p[3].includes("ACTIVE")?"green":"blue"} key="x">{p[3]}</Status>,p[4]])}/></Panel><Panel title="A5 Governance" kicker="STATE + AUTHORITY REQUIRED"><div className="actionStack"><button className="dangerSoft">Freeze governed record</button><button className="secondary">Supersede version</button><p className="muted">SYSTEM_ADMIN ไม่ได้รับปุ่มเหล่านี้</p></div></Panel></div>
  </div>;

  return <div className="screen">
    <Header eyebrow="TECHNICAL ADMINISTRATION" title="System Administration" desc="บัญชี การเชื่อมต่อ และ security diagnostics เท่านั้น ไม่มี academic governance" badge="SYSTEM · TECHNICAL ONLY" tone="slate"/>
    <div className="stats"><Stat label="Anon SECURITY DEFINER" value="0" note="callable" tone="green"/><Stat label="Auth RPC Review" value="94" note="advisor inventory" tone="amber"/><Stat label="RLS No Policy" value="69" note="classify, do not bulk-fix"/><Stat label="Academic Actions" value="0" note="DENY by contract" tone="red"/></div>
    <div className="grid2"><Panel title="Technical controls" kicker="ALLOWED"><div className="chips"><Status tone="green">Account diagnostics</Status><Status tone="green">RLS diagnostics</Status><Status tone="green">RPC inventory</Status></div></Panel><Panel title="Academic governance" kicker="DENIED"><Denied>FREEZE, SUPERSEDE, ACTIVATE และ academic decision ถูกแยกออกจาก SYSTEM_ADMIN</Denied></Panel></div>
  </div>;
}

function Screen({active,role}) {
  if(active==="workspace") return <div className="screen"><Header eyebrow="PERSONAL WORK QUEUE" title="My Workspace" desc="งานที่ต้องทำตาม role + scope ปัจจุบัน"/><div className="grid3"><Panel title="Pending"><div className="task"><span>Review evidence sufficiency</span><Status tone="amber">TODAY</Status></div><div className="task"><span>Check programme status</span><Status tone="blue">OPEN</Status></div></Panel><Panel title="Recent"><p className="muted">Synthetic audit events and recent documents appear here.</p></Panel><Panel title="Scope"><p className="muted">Role-aware backend remains authoritative.</p></Panel></div></div>;
  if(active==="people") return <div className="screen"><Header eyebrow="PEOPLE & RESPONSIBILITY" title="People" desc="Academic Person ≠ Actor ≠ Authority"/><Panel title="Department People"><DataTable headers={["Person","Affiliation","Teaching","Verification"]} rows={[["อาจารย์ทดสอบ A","RU-EDU-DPE","SYN-STU-A1",<Status tone="amber" key="1">SYNTHETIC</Status>],["หัวหน้าภาควิชาทดสอบ","RU-EDU-DPE","—",<Status tone="amber" key="2">SYNTHETIC</Status>]]}/></Panel></div>;
  if(active==="programmes") return <div className="screen"><Header eyebrow="ACADEMIC STRUCTURE" title="Programmes" desc="LATEST RECORD แยกจาก ACTIVE / EFFECTIVE อย่างชัดเจน"/><Panel title="Programme Registry"><DataTable headers={["Code","Programme","Version","Lifecycle","Evidence"]} rows={PROGRAMMES.map(p=>[p[0],p[1],p[2],<Status tone={p[3].includes("ACTIVE")?"green":"blue"} key="s">{p[3]}</Status>,p[4]])}/></Panel><div className="callout">LATEST RECORD ≠ ACTIVE / EFFECTIVE RECORD</div></div>;
  if(active==="courses") return <div className="screen"><Header eyebrow="COURSE MASTER + OFFERING" title="Courses" desc="Course master แยกจาก teaching instance"/><div className="grid2"><Panel title="Course Master"><h4>SYN-STU-A1</h4><p>การประเมินสุขภาพในโรงเรียน</p><div className="metaRows"><span>Canonical: courses</span><span>Context: curriculum_courses</span></div></Panel><Panel title="Current Offering"><h4>1/2569</h4><p>Teaching Instance → course_offerings</p><Status tone="blue">DRAFT · SYNTHETIC</Status></Panel></div></div>;
  if(active==="teaching") return ["LECTURER","PROGRAMME_CHAIR","DEPARTMENT_HEAD"].includes(role)?<div className="screen"><Header eyebrow="TEACHING INSTANCE" title="Teaching" desc="Teaching responsibility ไม่สร้าง academic authority"/><Panel title="Teaching Assignments"><DataTable headers={["Course","Term","Instructor","Role","Authority"]} rows={[["SYN-STU-A1","1/2569","อาจารย์ทดสอบ A","INSTRUCTOR",<Status tone="red" key="a">NO IAM AUTHORITY</Status>]]}/></Panel></div>:<Denied>Teaching workspace requires assigned teaching/governance scope.</Denied>;
  if(active==="students"){
    if(["QA","SYSTEM_ADMIN"].includes(role)) return <Denied>Student-level records are hidden by default for this role.</Denied>;
    if(role==="STUDENT") return <div className="screen"><Header eyebrow="SELF ONLY" title="My Student Record" desc="RLS self boundary"/><Panel title="Enrollment"><DataTable headers={["Student","Course","Term","Status"]} rows={[["SYN2569A","SYN-STU-A1","1/2569",<Status tone="green" key="e">ENROLLED</Status>]]}/></Panel></div>;
    return <div className="screen"><Header eyebrow="OFFERING-SCOPED" title="Students" desc="แสดงเฉพาะนักศึกษาใน offering ที่ได้รับมอบหมาย"/><Panel title="Enrolled Students"><DataTable headers={["Student","Offering","Status"]} rows={[["SYN2569A","SYN-STU-A1",<Status tone="green" key="a">ENROLLED</Status>],["SYN2569B","SYN-STU-A1",<Status tone="green" key="b">ENROLLED</Status>]]}/></Panel></div>;
  }
  if(active==="evidence") return <div className="screen"><Header eyebrow="EVIDENCE-FIRST" title="Evidence Explorer" desc="Evidence → Version → Verification → Governed Object → QA/Course"/><Panel title="Evidence Registry"><DataTable headers={["Code","Title","Type","Verification","Usage"]} rows={EVIDENCE.map(e=>[e[0],e[1],e[2],<Status tone={e[3]==="VERIFIED"?"green":"amber"} key="v">{e[3]}</Status>,e[4]])}/></Panel><div className="lineage">{["Evidence","Version","Verification","Governed Object","QA / Course"].map((x,i)=><span key={x}>{i?<>→ {x}</>:x}</span>)}</div></div>;
  if(active==="qa") return ["PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"].includes(role)?<div className="screen"><Header eyebrow="QUALITY WORKFLOW" title="QA & Improvement" desc="Criterion → Evidence → Verification → Finding → Improvement"/><div className="workflow">{["Criterion","Evidence","Verification","Finding","Improvement"].map((x,i)=><div className="workflowStep" key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div></div>:<Denied>QA workspace requires governance scope.</Denied>;
  if(active==="authority") return <div className="screen"><Header eyebrow="EXPLICIT AUTHORITY" title="Authority Explorer" desc="Role + Scope + Period + Source"/><Panel title="Authority Register"><DataTable headers={["Persona","Role","Level","Scope","Academic Decision"]} rows={[["Department Head","DEPARTMENT_HEAD","A5","SYSTEM",<Status tone="green" key="1">GOVERNANCE</Status>],["System Admin","SYSTEM_ADMIN","A5","SYSTEM",<Status tone="red" key="2">DENY</Status>],["Lecturer A","Teaching assignment","—","Offering",<Status tone="red" key="3">NO IAM AUTHORITY</Status>]]}/></Panel></div>;
  if(active==="audit") return <div className="screen"><Header eyebrow="APPEND-ONLY TRACE" title="Audit Timeline" desc="Actor + Authority + Action + Object + Correlation"/><div className="timeline"><div><span>03:42</span><strong>Authority policy hardened</strong><p>SYSTEM_ADMIN removed from academic governance command families.</p></div><div><span>03:18</span><strong>Student scope verified</strong><p>Student A cannot view Student B.</p></div><div><span>02:56</span><strong>RPC exposure reduced</strong><p>Internal template metadata RPCs restricted.</p></div></div></div>;
  if(active==="admin") return role==="SYSTEM_ADMIN"?<div className="screen"><Header eyebrow="TECHNICAL ONLY" title="Administration" desc="Technical diagnostics without academic governance"/><div className="grid3"><Panel title="Authentication"><Status tone="amber">SANDBOX</Status><p className="muted">Synthetic identities only.</p></Panel><Panel title="RPC Security"><strong className="big">94</strong><p className="muted">authenticated SECURITY DEFINER</p></Panel><Panel title="Anonymous"><strong className="big">0</strong><p className="muted">SECURITY DEFINER callable</p></Panel></div><Denied>Academic governance actions intentionally excluded.</Denied></div>:<Denied>Administration is restricted to System Admin.</Denied>;
  return null;
}

export default function Home(){
  const [role,setRole]=useState("DEPARTMENT_HEAD");
  const [active,setActive]=useState("dashboard");
  const current=ROLES.find(r=>r[0]===role);
  const allowed=useMemo(()=>NAV.filter(n=>n[3].includes(role)),[role]);
  const activeLabel=(NAV.find(n=>n[0]===active)||[])[2]||"Dashboard";

  function changeRole(next){
    setRole(next);
    setActive(next==="QA"?"qa":next==="SYSTEM_ADMIN"?"admin":"dashboard");
  }

  return <div className="app">
    <div className="sandboxBanner">SANDBOX · TEST DATA ONLY · NON-PRODUCTION</div>
    <aside className="sidebar">
      <div className="brand"><div className="mark">H</div><div><strong>HEPE</strong><span>Department Platform</span></div></div>
      <nav>{allowed.map(item=><button key={item[0]} onClick={()=>setActive(item[0])} className={active===item[0]?"navItem active":"navItem"}><span>{item[1]}</span>{item[2]}</button>)}</nav>
      <div className="sideFoot"><span>HEPE-DIGITAL</span><strong>Visual Pilot · 11D</strong></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div><div className="breadcrumb">HEPE / {activeLabel}</div><h1>{activeLabel}</h1></div>
        <div className="topActions">
          <div className={"scopeBadge "+current[3]}><span>{current[1]}</span><small>{current[2]}</small></div>
          <select aria-label="Synthetic pilot role" value={role} onChange={e=>changeRole(e.target.value)}>
            {ROLES.map(r=><option value={r[0]} key={r[0]}>{r[1]}</option>)}
          </select>
        </div>
      </header>
      <div className="content">{active==="dashboard"?<Dashboard role={role}/>:<Screen active={active} role={role}/>}</div>
      <footer><span>Canonical backend · RLS enforced · synthetic fixtures</span><span>Production publishing locked</span></footer>
    </main>
  </div>;
}
