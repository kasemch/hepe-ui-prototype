"use client";

import { useMemo, useState } from "react";\nimport type { ReactNode } from "react";

type Role = "STUDENT" | "LECTURER" | "PROGRAMME_CHAIR" | "QA" | "DEPARTMENT_HEAD" | "SYSTEM_ADMIN";
type NavKey = "dashboard" | "workspace" | "people" | "programmes" | "courses" | "teaching" | "students" | "evidence" | "qa" | "authority" | "audit" | "admin";

const roles: { key: Role; label: string; scope: string }[] = [
  { key: "STUDENT", label: "นักศึกษา (Student A)", scope: "SELF · SYN2569A" },
  { key: "LECTURER", label: "อาจารย์ผู้สอน (Lecturer A)", scope: "TEACHING_INSTANCE · SYN-STU-A1" },
  { key: "PROGRAMME_CHAIR", label: "ประธานหลักสูตร", scope: "PROGRAMME · SYN-HEPE-A" },
  { key: "QA", label: "ผู้รับผิดชอบ QA", scope: "PROGRAMME · SYN-HEPE-A" },
  { key: "DEPARTMENT_HEAD", label: "หัวหน้าภาควิชา", scope: "DEPARTMENT · RU-EDU-DPE" },
  { key: "SYSTEM_ADMIN", label: "ผู้ดูแลระบบ", scope: "SYSTEM · TECHNICAL ONLY" },
];

const nav: { key: NavKey; label: string; icon: string; roles: Role[] }[] = [
  { key: "dashboard", label: "Dashboard", icon: "⌂", roles: roles.map(r => r.key) },
  { key: "workspace", label: "My Workspace", icon: "◫", roles: roles.map(r => r.key) },
  { key: "people", label: "People", icon: "◎", roles: ["LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"] },
  { key: "programmes", label: "Programmes", icon: "▦", roles: ["LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"] },
  { key: "courses", label: "Courses", icon: "▤", roles: ["STUDENT","LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"] },
  { key: "teaching", label: "Teaching", icon: "△", roles: ["LECTURER","PROGRAMME_CHAIR","DEPARTMENT_HEAD"] },
  { key: "students", label: "Students", icon: "◉", roles: ["STUDENT","LECTURER","PROGRAMME_CHAIR","DEPARTMENT_HEAD"] },
  { key: "evidence", label: "Evidence", icon: "◇", roles: ["LECTURER","PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"] },
  { key: "qa", label: "QA", icon: "✓", roles: ["PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD"] },
  { key: "authority", label: "Authority", icon: "◆", roles: ["PROGRAMME_CHAIR","QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"] },
  { key: "audit", label: "Audit", icon: "≡", roles: ["QA","DEPARTMENT_HEAD","SYSTEM_ADMIN"] },
  { key: "admin", label: "Administration", icon: "⚙", roles: ["SYSTEM_ADMIN"] },
];

const roleHome: Record<Role, NavKey> = {
  STUDENT: "dashboard",
  LECTURER: "dashboard",
  PROGRAMME_CHAIR: "dashboard",
  QA: "qa",
  DEPARTMENT_HEAD: "dashboard",
  SYSTEM_ADMIN: "admin",
};

const scopeTone: Record<Role, string> = {
  STUDENT: "blue",
  LECTURER: "teal",
  PROGRAMME_CHAIR: "violet",
  QA: "amber",
  DEPARTMENT_HEAD: "red",
  SYSTEM_ADMIN: "slate",
};

const programmeRows = [
  { code: "SYN-HEPE-A", title: "ศษ.บ. สุขศึกษาและพลศึกษา", status: "ACTIVE / EFFECTIVE", version: "2567", evidence: "12/14", health: "พร้อมติดตาม" },
  { code: "SYN-HEPE-B", title: "ศษ.บ. พลศึกษา", status: "DRAFT / LATEST", version: "2567-D", evidence: "8/14", health: "รอตรวจหลักฐาน" },
];

const evidenceRows = [
  { code: "EVD-001", title: "Curriculum approval evidence", type: "CURRICULUM", verify: "VERIFIED", usage: "Programme · PLO", state: "CURRENT" },
  { code: "EVD-002", title: "Teaching responsibility source", type: "TEACHING", verify: "PENDING", usage: "Course · Offering", state: "SUFFICIENCY_PENDING" },
];

function Stat({ label, value, note, tone = "blue" }: { label: string; value: string; note: string; tone?: string }) {
  return <article className={"stat tone-" + tone}><div className="statLabel">{label}</div><div className="statValue">{value}</div><div className="statNote">{note}</div></article>;
}

function Status({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={"status status-" + tone}>{children}</span>;
}

function Panel({ title, kicker, children, action }: { title: string; kicker?: string; children: ReactNode; action?: ReactNode }) {
  return <section className="panel"><div className="panelHead"><div>{kicker && <div className="kicker">{kicker}</div>}<h3>{title}</h3></div>{action}</div>{children}</section>;
}

function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return <div className="tableWrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
}

function Denied({ text }: { text: string }) {
  return <div className="denied"><div className="deniedIcon">⊘</div><strong>Access not available in this role</strong><span>{text}</span></div>;
}

function Dashboard({ role }: { role: Role }) {
  if (role === "STUDENT") return <div className="screen">
    <div className="hero"><div><div className="eyebrow">MY LEARNING</div><h2>สวัสดี นักศึกษาทดสอบ A</h2><p>มองเห็นเฉพาะข้อมูลของตนเองผ่าน self-scoped RLS และ enrollment ที่ได้รับอนุญาต</p></div><Status tone="blue">SELF · VERIFIED BINDING</Status></div>
    <div className="stats"><Stat label="My Courses" value="1" note="ภาค 1/2569" tone="blue"/><Stat label="Activities" value="5" note="2 รายการกำลังทำ" tone="teal"/><Stat label="Feedback" value="3" note="มีรายการใหม่ 1" tone="violet"/><Stat label="Portfolio" value="72%" note="ความครบถ้วน" tone="amber"/></div>
    <div className="grid2"><Panel title="วิชาของฉัน" kicker="SELF-SCOPED COURSE SUMMARY"><div className="courseCard"><div><Status tone="green">ENROLLED</Status><h4>SYN-STU-A1 · การประเมินสุขภาพในโรงเรียน</h4><p>ปีการศึกษา 2569 · ภาค 1</p></div><button className="primary">เปิดรายวิชา</button></div></Panel><Panel title="Privacy boundary" kicker="NEGATIVE TEST"><div className="privacy"><strong>Student A → Student B</strong><Status tone="red">DENY</Status><p>ไม่มี lateral student navigation และไม่มี student_id parameter ใน My Courses RPC</p></div></Panel></div>
  </div>;

  if (role === "LECTURER") return <div className="screen">
    <div className="hero"><div><div className="eyebrow">TEACHING WORKSPACE</div><h2>Lecturer A · Assigned Offering</h2><p>สิทธิ์การเห็นนักศึกษาเกิดจาก active instructor assignment เท่านั้น ไม่ใช่ IAM authority</p></div><Status tone="teal">TEACHING_INSTANCE · ACTIVE</Status></div>
    <div className="stats"><Stat label="Assigned Courses" value="1" note="SYN-STU-A1" tone="teal"/><Stat label="Students" value="2" note="เฉพาะ offering นี้" tone="blue"/><Stat label="Evidence Pending" value="1" note="verification" tone="amber"/><Stat label="Academic Authority" value="0" note="teaching ≠ authority" tone="red"/></div>
    <div className="grid2"><Panel title="Teaching Coverage" kicker="ASSIGNED TEACHING"><Table headers={["Course","Term","Students","State"]} rows={[["SYN-STU-A1","1/2569","2",<Status tone="green" key="s">ACTIVE</Status>]]}/></Panel><Panel title="Authority boundary" kicker="SECURITY INVARIANT"><div className="boundaryBox"><div>Teaching assignment</div><span>≠</span><div>Academic approval authority</div></div><p className="muted">creates_system_authority = false</p></Panel></div>
  </div>;

  if (role === "PROGRAMME_CHAIR") return <div className="screen">
    <div className="hero"><div><div className="eyebrow">PROGRAMME GOVERNANCE</div><h2>Programme Chair · SYN-HEPE-A</h2><p>ภาพรวมหลักสูตร หลักฐาน และงานกำกับภายใน programme scope</p></div><Status tone="violet">PROGRAMME · A-SCOPE</Status></div>
    <div className="stats"><Stat label="Curriculum" value="2567" note="ACTIVE / EFFECTIVE" tone="violet"/><Stat label="PLO" value="8" note="programme-level" tone="blue"/><Stat label="Evidence" value="12/14" note="2 gaps" tone="amber"/><Stat label="Open Reviews" value="1" note="scope only" tone="teal"/></div>
    <Panel title="Programme health" kicker="CANONICAL READ MODEL"><Table headers={["Programme","Version","Lifecycle","Evidence","Health"]} rows={programmeRows.slice(0,1).map(p=>[p.code,p.version,<Status tone="green" key="s">{p.status}</Status>,p.evidence,p.health])}/></Panel>
  </div>;

  if (role === "QA") return <div className="screen">
    <div className="hero"><div><div className="eyebrow">QUALITY ASSURANCE</div><h2>Evidence-first QA Workspace</h2><p>ค้นหา → reuse → verify → link → finding → improvement โดยไม่อัปโหลดหลักฐานซ้ำ</p></div><Status tone="amber">PROGRAMME QA SCOPE</Status></div>
    <div className="stats"><Stat label="Evidence Current" value="1" note="verified" tone="green"/><Stat label="Pending" value="1" note="sufficiency" tone="amber"/><Stat label="Findings" value="2" note="open" tone="red"/><Stat label="Actions" value="3" note="tracked" tone="blue"/></div>
    <Panel title="Evidence health" kicker="TRACEABLE EVIDENCE"><Table headers={["Code","Evidence","Verification","Usage","State"]} rows={evidenceRows.map(e=>[e.code,e.title,<Status tone={e.verify==="VERIFIED"?"green":"amber"} key="v">{e.verify}</Status>,e.usage,e.state])}/></Panel>
  </div>;

  if (role === "DEPARTMENT_HEAD") return <div className="screen">
    <div className="hero"><div><div className="eyebrow">DEPARTMENT COMMAND CENTER</div><h2>ภาควิชาพลานามัย · Executive Overview</h2><p>มองภาพรวม programme / teaching / QA / evidence และใช้ A5 governance เฉพาะเมื่อ state อนุญาต</p></div><Status tone="red">DEPARTMENT_HEAD · A5</Status></div>
    <div className="stats"><Stat label="Programmes" value="2" note="1 active · 1 draft" tone="red"/><Stat label="Teaching Coverage" value="94%" note="synthetic projection" tone="teal"/><Stat label="Evidence Health" value="86%" note="2 gaps" tone="amber"/><Stat label="Governance Actions" value="2" note="FREEZE · SUPERSEDE" tone="violet"/></div>
    <div className="grid2"><Panel title="Programme portfolio" kicker="AGGREGATE-FIRST"><Table headers={["Programme","Lifecycle","Evidence","Health"]} rows={programmeRows.map(p=>[p.code,<Status tone={p.status.includes("ACTIVE")?"green":"blue"} key="s">{p.status}</Status>,p.evidence,p.health])}/></Panel><Panel title="A5 Governance" kicker="STATE + AUTHORITY REQUIRED"><div className="actionStack"><button className="dangerSoft">Freeze governed record</button><button className="secondary">Supersede version</button><p className="muted">SYSTEM_ADMIN does not receive these actions.</p></div></Panel></div>
  </div>;

  return <div className="screen">
    <div className="hero"><div><div className="eyebrow">TECHNICAL ADMINISTRATION</div><h2>System Administration</h2><p>บัญชี การเชื่อมต่อ และ security diagnostics เท่านั้น ไม่มี academic governance</p></div><Status tone="slate">SYSTEM · TECHNICAL ONLY</Status></div>
    <div className="stats"><Stat label="Anon SECURITY DEFINER" value="0" note="callable" tone="green"/><Stat label="Auth RPC Review" value="94" note="advisor inventory" tone="amber"/><Stat label="RLS No Policy" value="69" note="classify, do not bulk-fix" tone="blue"/><Stat label="Academic Actions" value="0" note="DENY by contract" tone="red"/></div>
    <div className="grid2"><Panel title="Technical controls" kicker="ALLOWED"><div className="chips"><Status tone="green">Account diagnostics</Status><Status tone="green">RLS diagnostics</Status><Status tone="green">RPC inventory</Status><Status tone="green">Integration health</Status></div></Panel><Panel title="Academic governance" kicker="DENIED"><Denied text="FREEZE, SUPERSEDE, ACTIVATE และ academic decision ถูกแยกออกจาก SYSTEM_ADMIN แล้ว"/></Panel></div>
  </div>;
}

function GenericScreen({ active, role }: { active: NavKey; role: Role }) {
  if (active === "workspace") return <div className="screen"><div className="hero compact"><div><div className="eyebrow">PERSONAL WORK QUEUE</div><h2>My Workspace</h2><p>งานที่ต้องทำตาม role + scope ปัจจุบัน</p></div></div><div className="grid3"><Panel title="Pending"><div className="task"><span>Review evidence sufficiency</span><Status tone="amber">TODAY</Status></div><div className="task"><span>Check programme status</span><Status tone="blue">OPEN</Status></div></Panel><Panel title="Recent"><p className="muted">Synthetic audit events and recent documents appear here.</p></Panel><Panel title="Scope"><div className="scopeCard"><strong>{roles.find(r=>r.key===role)?.label}</strong><span>{roles.find(r=>r.key===role)?.scope}</span></div></Panel></div></div>;

  if (active === "people") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">PEOPLE & RESPONSIBILITY</div><h2>People</h2></div><button className="secondary">Filter</button></div><Panel title="Department People" kicker="ACADEMIC PERSON ≠ ACTOR"><Table headers={["Person","Position","Affiliation","Teaching","Verification"]} rows={[["อาจารย์ทดสอบ A","อาจารย์","RU-EDU-DPE","SYN-STU-A1",<Status tone="amber" key="1">SYNTHETIC</Status>],["หัวหน้าภาควิชาทดสอบ","—","RU-EDU-DPE","—",<Status tone="amber" key="2">SYNTHETIC</Status>]]}/></Panel></div>;

  if (active === "programmes") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">ACADEMIC STRUCTURE</div><h2>Programmes</h2></div></div><Panel title="Programme Registry"><Table headers={["Code","Programme","Version","Lifecycle","Evidence"]} rows={programmeRows.map(p=>[p.code,p.title,p.version,<Status tone={p.status.includes("ACTIVE")?"green":"blue"} key="s">{p.status}</Status>,p.evidence])}/></Panel><div className="callout">LATEST RECORD ≠ ACTIVE / EFFECTIVE RECORD · UI ต้องแสดงแยกอย่างชัดเจน</div></div>;

  if (active === "courses") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">COURSE MASTER + OFFERING</div><h2>Courses</h2></div></div><div className="grid2"><Panel title="Course Master"><h4>SYN-STU-A1</h4><p>การประเมินสุขภาพในโรงเรียน</p><div className="metaRows"><span>Canonical: courses</span><span>Curriculum context: curriculum_courses</span></div></Panel><Panel title="Current Offering"><h4>1/2569</h4><p>Teaching Instance → course_offerings</p><Status tone="blue">DRAFT · SYNTHETIC</Status></Panel></div></div>;

  if (active === "teaching") return role === "LECTURER" || role === "PROGRAMME_CHAIR" || role === "DEPARTMENT_HEAD" ? <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">TEACHING INSTANCE</div><h2>Teaching</h2></div></div><Panel title="Teaching Assignments"><Table headers={["Course","Term","Instructor","Role","Authority"]} rows={[["SYN-STU-A1","1/2569","อาจารย์ทดสอบ A","INSTRUCTOR",<Status tone="red" key="a">NO IAM AUTHORITY</Status>]]}/></Panel></div> : <Denied text="Teaching workspace is restricted to assigned teaching and governance roles."/>;

  if (active === "students") {
    if (role === "SYSTEM_ADMIN" || role === "QA") return <Denied text="Student-level records are not exposed to this role by default."/>;
    if (role === "STUDENT") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">SELF ONLY</div><h2>My Student Record</h2></div></div><Panel title="Enrollment"><Table headers={["Student","Course","Term","Status"]} rows={[["SYN2569A","SYN-STU-A1","1/2569",<Status tone="green" key="e">ENROLLED</Status>]]}/></Panel></div>;
    return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">OFFERING-SCOPED</div><h2>Students</h2></div></div><Panel title="Enrolled Students"><Table headers={["Student","Offering","Status","Access Basis"]} rows={[["SYN2569A","SYN-STU-A1",<Status tone="green" key="a">ENROLLED</Status>,"Assigned offering"],["SYN2569B","SYN-STU-A1",<Status tone="green" key="b">ENROLLED</Status>,"Assigned offering"]]}/></Panel></div>;
  }

  if (active === "evidence") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">EVIDENCE-FIRST</div><h2>Evidence Explorer</h2></div><button className="primary">Search evidence</button></div><Panel title="Evidence Registry"><Table headers={["Code","Title","Type","Verification","Usage"]} rows={evidenceRows.map(e=>[e.code,e.title,e.type,<Status tone={e.verify==="VERIFIED"?"green":"amber"} key="x">{e.verify}</Status>,e.usage])}/></Panel><div className="lineage"><span>Evidence</span><b>→</b><span>Version</span><b>→</b><span>Verification</span><b>→</b><span>Governed Object</span><b>→</b><span>QA / Course</span></div></div>;

  if (active === "qa") return role === "PROGRAMME_CHAIR" || role === "QA" || role === "DEPARTMENT_HEAD" ? <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">QUALITY WORKFLOW</div><h2>QA & Improvement</h2></div></div><div className="workflow">{["Criterion","Evidence","Verification","Finding","Improvement"].map((x,i)=><div className="workflowStep" key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div><Panel title="Open Items"><div className="task"><span>Evidence sufficiency review</span><Status tone="amber">PENDING</Status></div><div className="task"><span>Improvement action follow-up</span><Status tone="blue">OPEN</Status></div></Panel></div> : <Denied text="QA workspace requires programme/QA governance scope."/>;

  if (active === "authority") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">EXPLICIT AUTHORITY</div><h2>Authority Explorer</h2></div></div><Panel title="Authority Register"><Table headers={["Persona","Role","Level","Scope","Academic Decision"]} rows={[["Department Head","DEPARTMENT_HEAD","A5","SYSTEM",<Status tone="green" key="1">GOVERNANCE</Status>],["System Admin","SYSTEM_ADMIN","A5","SYSTEM",<Status tone="red" key="2">DENY</Status>],["Lecturer A","Teaching assignment","—","Offering",<Status tone="red" key="3">NO IAM AUTHORITY</Status>]]}/></Panel></div>;

  if (active === "audit") return <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">APPEND-ONLY TRACE</div><h2>Audit Timeline</h2></div></div><div className="timeline"><div><span>03:42</span><strong>Authority policy hardened</strong><p>SYSTEM_ADMIN removed from academic governance command families.</p></div><div><span>03:18</span><strong>Student scope verified</strong><p>Student A cannot view Student B.</p></div><div><span>02:56</span><strong>RPC exposure reduced</strong><p>Internal template metadata RPCs restricted.</p></div></div></div>;

  if (active === "admin") return role === "SYSTEM_ADMIN" ? <div className="screen"><div className="sectionTitle"><div><div className="eyebrow">TECHNICAL ONLY</div><h2>Administration</h2></div></div><div className="grid3"><Panel title="Authentication"><Status tone="amber">SANDBOX</Status><p className="muted">Synthetic identities only.</p></Panel><Panel title="RPC Security"><strong className="big">94</strong><p className="muted">authenticated SECURITY DEFINER advisor inventory</p></Panel><Panel title="Anonymous"><strong className="big">0</strong><p className="muted">SECURITY DEFINER callable</p></Panel></div><Denied text="Academic governance actions intentionally excluded from System Admin."/></div> : <Denied text="Administration is restricted to technical administrators."/>;
  return null;
}

export default function Home() {
  const [role, setRole] = useState<Role>("DEPARTMENT_HEAD");
  const [active, setActive] = useState<NavKey>("dashboard");
  const allowedNav = useMemo(() => nav.filter(n => n.roles.includes(role)), [role]);

  function switchRole(next: Role) {
    setRole(next);
    setActive(roleHome[next]);
  }

  const currentRole = roles.find(r => r.key === role)!;
  const activeLabel = nav.find(n => n.key === active)?.label ?? "Dashboard";

  return (
    <div className="app">
      <div className="sandboxBanner">SANDBOX · TEST DATA ONLY · NON-PRODUCTION</div>
      <aside className="sidebar">
        <div className="brand"><div className="mark">H</div><div><strong>HEPE</strong><span>Department Platform</span></div></div>
        <nav>{allowedNav.map(item => <button key={item.key} onClick={()=>setActive(item.key)} className={active===item.key?"navItem active":"navItem"}><span>{item.icon}</span>{item.label}</button>)}</nav>
        <div className="sideFoot"><span>HEPE-DIGITAL</span><strong>Visual Pilot · 11D</strong></div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div><div className="breadcrumb">HEPE / {activeLabel}</div><h1>{activeLabel}</h1></div>
          <div className="topActions">
            <div className={"scopeBadge " + scopeTone[role]}><span>{currentRole.label}</span><small>{currentRole.scope}</small></div>
            <select aria-label="Synthetic pilot role" value={role} onChange={e=>switchRole(e.target.value as Role)}>
              {roles.map(r=><option value={r.key} key={r.key}>{r.label}</option>)}
            </select>
          </div>
        </header>
        <div className="content">
          {active === "dashboard" ? <Dashboard role={role}/> : <GenericScreen active={active} role={role}/>}
        </div>
        <footer><span>Canonical backend · RLS enforced · synthetic fixtures</span><span>Production publishing locked</span></footer>
      </main>
    </div>
  );
}
