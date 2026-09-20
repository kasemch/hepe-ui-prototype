"use client";

import { useState } from "react";

const roleConfig = {
  STUDENT: {
    label: "นักศึกษา · Student A",
    scope: "SELF · SYN2569A",
    pages: ["Dashboard","My Workspace","Courses","Students"],
  },
  LECTURER: {
    label: "อาจารย์ผู้สอน · Lecturer A",
    scope: "TEACHING_INSTANCE · SYN-STU-A1",
    pages: ["Dashboard","My Workspace","People","Courses","Teaching","Students","Evidence","Documents","Research"],
  },
  PROGRAMME_CHAIR: {
    label: "ประธานหลักสูตร",
    scope: "PROGRAMME · SYN-HEPE-A",
    pages: ["Dashboard","My Workspace","People","Programmes","Courses","Teaching","Students","Evidence","Documents","Meetings","Requests","Research","QA","Reports","Authority"],
  },
  QA: {
    label: "ผู้รับผิดชอบ QA",
    scope: "PROGRAMME · SYN-HEPE-A",
    pages: ["Dashboard","My Workspace","People","Programmes","Courses","Evidence","Documents","Meetings","Research","QA","Reports","Authority","Audit"],
  },
  DEPARTMENT_HEAD: {
    label: "หัวหน้าภาควิชา",
    scope: "DEPARTMENT · A5",
    pages: ["Dashboard","My Workspace","People","Programmes","Courses","Teaching","Students","Evidence","Documents","Meetings","Requests","Research","QA","Reports","Authority","Audit"],
  },
  SYSTEM_ADMIN: {
    label: "ผู้ดูแลระบบ",
    scope: "SYSTEM · TECHNICAL ONLY",
    pages: ["Dashboard","My Workspace","People","Authority","Audit","Administration"],
  },
};

function Badge({ children, tone = "blue" }) {
  return <span className={"status status-" + tone}>{children}</span>;
}

function Card({ title, value, note, tone = "blue" }) {
  return (
    <article className={"stat tone-" + tone}>
      <div className="statLabel">{title}</div>
      <div className="statValue">{value}</div>
      <div className="statNote">{note}</div>
    </article>
  );
}

function Panel({ title, kicker, children }) {
  return (
    <section className="panel">
      <div className="panelHead">
        <div>
          {kicker ? <div className="kicker">{kicker}</div> : null}
          <h3>{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function Header({ title, description, badge, tone = "blue" }) {
  return (
    <div className="hero">
      <div>
        <div className="eyebrow">HEPE DEPARTMENT PLATFORM</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Badge tone={tone}>{badge}</Badge>
    </div>
  );
}

function SimpleTable({ rows }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr><th>รายการ</th><th>บริบท</th><th>สถานะ</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td><Badge tone={row[3] || "blue"}>{row[2]}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Denied({ children }) {
  return (
    <div className="denied">
      <div className="deniedIcon">⊘</div>
      <strong>Access denied by role/scope contract</strong>
      <span>{children}</span>
    </div>
  );
}

function Dashboard({ role }) {
  if (role === "STUDENT") {
    return (
      <div className="screen">
        <Header title="My Learning" description="ข้อมูลตนเองและรายวิชาที่ลงทะเบียนเท่านั้น" badge="SELF · VERIFIED" />
        <div className="stats">
          <Card title="My Courses" value="1" note="1/2569" />
          <Card title="Enrollment" value="1" note="ENROLLED" tone="teal" />
          <Card title="Other Student" value="0" note="DENY" tone="red" />
          <Card title="Portfolio" value="72%" note="synthetic" tone="amber" />
        </div>
        <div className="grid2">
          <Panel title="วิชาของฉัน" kicker="SELF-SCOPED">
            <SimpleTable rows={[["SYN-STU-A1","ภาค 1/2569","ENROLLED","green"]]} />
          </Panel>
          <Panel title="Privacy Boundary" kicker="NEGATIVE TEST">
            <Denied>Student A → Student B ถูกปฏิเสธโดย backend RLS และ UI ไม่มี lateral navigation</Denied>
          </Panel>
        </div>
      </div>
    );
  }

  if (role === "LECTURER") {
    return (
      <div className="screen">
        <Header title="Teaching Workspace" description="เข้าถึงเฉพาะ offering ที่ได้รับมอบหมาย" badge="ASSIGNED TEACHING" tone="teal" />
        <div className="stats">
          <Card title="Assigned Courses" value="1" note="SYN-STU-A1" tone="teal" />
          <Card title="Students" value="2" note="same offering" />
          <Card title="Academic Authority" value="0" note="teaching ≠ authority" tone="red" />
          <Card title="Evidence Pending" value="1" note="verification" tone="amber" />
        </div>
        <Panel title="Teaching Responsibility" kicker="SECURITY INVARIANT">
          <SimpleTable rows={[
            ["SYN-STU-A1","Instructor assignment","ACTIVE","green"],
            ["Academic approval","Not derived from teaching","DENY","red"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (role === "PROGRAMME_CHAIR") {
    return (
      <div className="screen">
        <Header title="Programme Governance" description="การกำกับภายใน programme scope" badge="SYN-HEPE-A" tone="violet" />
        <div className="stats">
          <Card title="Curriculum" value="2567" note="ACTIVE / EFFECTIVE" tone="violet" />
          <Card title="Evidence" value="12/14" note="2 gaps" tone="amber" />
          <Card title="Courses" value="94" note="canonical master" />
          <Card title="Open Reviews" value="1" note="programme scope" tone="teal" />
        </div>
        <Panel title="Programme Status" kicker="LATEST ≠ EFFECTIVE">
          <SimpleTable rows={[
            ["SYN-HEPE-A","Curriculum 2567","ACTIVE / EFFECTIVE","green"],
            ["SYN-HEPE-B","Draft record","DRAFT / LATEST","blue"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (role === "QA") {
    return (
      <div className="screen">
        <Header title="QA & Evidence" description="Evidence-first workflow: reuse ก่อนสร้างหลักฐานใหม่" badge="QA SCOPE" tone="amber" />
        <div className="stats">
          <Card title="Verified" value="1" note="current evidence" tone="green" />
          <Card title="Pending" value="1" note="sufficiency" tone="amber" />
          <Card title="Findings" value="2" note="open" tone="red" />
          <Card title="Actions" value="3" note="tracked" />
        </div>
        <div className="workflow">
          {["Criterion","Evidence","Verification","Finding","Improvement"].map((item, index) => (
            <div className="workflowStep" key={item}><span>{index + 1}</span><strong>{item}</strong></div>
          ))}
        </div>
      </div>
    );
  }

  if (role === "DEPARTMENT_HEAD") {
    return (
      <div className="screen">
        <Header title="Department Command Center" description="ภาพรวม Programme, Teaching, QA และ Evidence" badge="DEPARTMENT_HEAD · A5" tone="red" />
        <div className="stats">
          <Card title="Programmes" value="2" note="synthetic portfolio" tone="red" />
          <Card title="Teaching Coverage" value="94%" note="pilot projection" tone="teal" />
          <Card title="Evidence Health" value="86%" note="2 gaps" tone="amber" />
          <Card title="A5 Actions" value="2" note="FREEZE · SUPERSEDE" tone="violet" />
        </div>
        <div className="grid2">
          <Panel title="Programme Portfolio" kicker="AGGREGATE-FIRST">
            <SimpleTable rows={[
              ["SYN-HEPE-A","Curriculum 2567","ACTIVE","green"],
              ["SYN-HEPE-B","Draft version","DRAFT","blue"],
            ]} />
          </Panel>
          <Panel title="Academic Governance" kicker="STATE + AUTHORITY">
            <div className="actionStack">
              <button className="dangerSoft">Freeze governed record</button>
              <button className="secondary">Supersede version</button>
              <p className="muted">ปุ่มนี้ไม่มีใน System Admin</p>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <Header title="System Administration" description="Technical administration เท่านั้น ไม่มี academic governance" badge="TECHNICAL ONLY" tone="slate" />
      <div className="stats">
        <Card title="Anon SECURITY DEFINER" value="0" note="callable" tone="green" />
        <Card title="Auth RPC Review" value="94" note="advisor inventory" tone="amber" />
        <Card title="Academic Actions" value="0" note="DENY" tone="red" />
        <Card title="Environment" value="SBX" note="NON-PRODUCTION" />
      </div>
      <Denied>FREEZE, SUPERSEDE, ACTIVATE และ academic decision ไม่อยู่ในสิทธิ์ SYSTEM_ADMIN</Denied>
    </div>
  );
}

function GenericPage({ name, role }) {
  if (name === "Administration") {
    if (role !== "SYSTEM_ADMIN") return <Denied>Administration สำหรับ technical administrator เท่านั้น</Denied>;
    return (
      <div className="screen">
        <Header title="Administration" description="Auth, RLS, RPC และ integration diagnostics" badge="TECHNICAL" tone="slate" />
        <div className="grid3">
          <Panel title="Authentication"><Badge tone="amber">SANDBOX</Badge><p className="muted">Synthetic identities only</p></Panel>
          <Panel title="RPC"><strong className="big">94</strong><p className="muted">authenticated SECURITY DEFINER inventory</p></Panel>
          <Panel title="Anonymous"><strong className="big">0</strong><p className="muted">SECURITY DEFINER callable</p></Panel>
        </div>
      </div>
    );
  }

  if (name === "Students") {
    if (role === "STUDENT") {
      return <div className="screen"><Header title="My Student Record" description="SELF only" badge="SELF" /><Panel title="Enrollment"><SimpleTable rows={[["SYN2569A","SYN-STU-A1","ENROLLED","green"]]} /></Panel></div>;
    }
    if (role === "LECTURER" || role === "PROGRAMME_CHAIR" || role === "DEPARTMENT_HEAD") {
      return <div className="screen"><Header title="Students" description="Offering-scoped student visibility" badge="SCOPED" tone="teal" /><Panel title="SYN-STU-A1"><SimpleTable rows={[["SYN2569A","Assigned offering","ENROLLED","green"],["SYN2569B","Assigned offering","ENROLLED","green"]]} /></Panel></div>;
    }
    return <Denied>Student-level records ไม่เปิดให้ role นี้โดย default</Denied>;
  }

  if (name === "Meetings") {
    return (
      <div className="screen">
        <Header title="Meetings & Resolutions" description="วาระ การประชุม เรื่องเวียนมติ มติ และ action items" badge="DEPARTMENT OPERATIONS" tone="violet" />
        <Panel title="Meeting Lifecycle">
          <SimpleTable rows={[
            ["Agenda candidate","Draft agenda item","DRAFT","blue"],
            ["Circulation","Resolution circulation","PENDING","amber"],
            ["Resolution","Meeting decision record","APPROVED","green"],
          ]} />
        </Panel>
        <div className="callout">Task/Action Item ≠ Authority Assignment · ทุกมติต้องมี source, authority และ audit trail</div>
      </div>
    );
  }

  if (name === "Requests") {
    return (
      <div className="screen">
        <Header title="Course Request Portal" description="ขอเปิดวิชา เพิ่มวิชา และของดสอน โดยดึง metadata จาก canonical course/programme" badge="CONTROLLED REQUEST" tone="teal" />
        <Panel title="Request Pipeline">
          <SimpleTable rows={[
            ["OPEN_NEW_OFFERING","DRAFT → REVIEW → RESOLUTION","CONTROLLED","blue"],
            ["ADD_OFFERING","DRAFT → REVIEW → RESOLUTION","CONTROLLED","blue"],
            ["CANCEL_OFFERING","DRAFT → REVIEW → RESOLUTION","CONTROLLED","amber"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "Documents") {
    return (
      <div className="screen">
        <Header title="Document Studio" description="Document Intelligence, versioning, provenance และ smart dispatch" badge="DOCUMENT INTELLIGENCE" tone="amber" />
        <Panel title="Document Control">
          <SimpleTable rows={[
            ["document_records","Canonical metadata","ACTIVE","green"],
            ["document_versions","Version lineage","VERSIONED","green"],
            ["Smart Dispatch","Routing rule candidate","SANDBOX","blue"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "Research") {
    return (
      <div className="screen">
        <Header title="Research Command" description="Department-level research pipeline โดยไม่แทน AWOS personal research workspace" badge="RESEARCH & ACADEMIC WORK" tone="teal" />
        <Panel title="Lifecycle">
          <SimpleTable rows={[
            ["Idea → Proposal","Research development","TRACKED","blue"],
            ["Ethics → Data → Analysis","Research execution","CONTROLLED","amber"],
            ["Manuscript → Publication","Academic output","TRACEABLE","green"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "Reports") {
    return (
      <div className="screen">
        <Header title="Analytics & Reports" description="ภาพรวมหลักสูตร การสอน QA งานวิจัย และหลักฐาน" badge="DERIVED READ MODEL" tone="slate" />
        <Panel title="Report Families">
          <SimpleTable rows={[
            ["Programme Health","Curriculum / Evidence / QA","DERIVED","green"],
            ["Teaching Coverage","Offering / Assignment","DERIVED","green"],
            ["Research & Outputs","Projects / Publications","DERIVED","blue"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "Authority") {
    return (
      <div className="screen">
        <Header title="Authority Explorer" description="Role + Scope + Period + Source" badge="EXPLICIT AUTHORITY" tone="violet" />
        <Panel title="Boundary Register">
          <SimpleTable rows={[
            ["Department Head","A5 SYSTEM","GOVERNANCE","green"],
            ["System Admin","A5 TECHNICAL","ACADEMIC DENY","red"],
            ["Lecturer A","Teaching assignment","NO IAM AUTHORITY","red"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "Evidence") {
    return (
      <div className="screen">
        <Header title="Evidence Explorer" description="Evidence → Version → Verification → Governed Object" badge="EVIDENCE-FIRST" tone="amber" />
        <Panel title="Evidence Registry">
          <SimpleTable rows={[
            ["EVD-001","Programme / PLO","VERIFIED","green"],
            ["EVD-002","Course / Offering","PENDING","amber"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "Programmes") {
    return (
      <div className="screen">
        <Header title="Programmes" description="Lifecycle และ version context" badge="ACADEMIC STRUCTURE" tone="violet" />
        <Panel title="Programme Registry">
          <SimpleTable rows={[
            ["SYN-HEPE-A","Version 2567","ACTIVE / EFFECTIVE","green"],
            ["SYN-HEPE-B","Version 2567-D","DRAFT / LATEST","blue"],
          ]} />
        </Panel>
        <div className="callout">LATEST RECORD ≠ ACTIVE / EFFECTIVE RECORD</div>
      </div>
    );
  }

  if (name === "Teaching") {
    return (
      <div className="screen">
        <Header title="Teaching" description="Teaching Instance → course_offerings" badge="ASSIGNMENT-BASED" tone="teal" />
        <Panel title="Current Assignment">
          <SimpleTable rows={[
            ["SYN-STU-A1","Instructor A","ACTIVE","green"],
            ["IAM authority","Not created by teaching","FALSE","red"],
          ]} />
        </Panel>
      </div>
    );
  }

  if (name === "QA") {
    return (
      <div className="screen">
        <Header title="QA & Improvement" description="Evidence-first quality workflow" badge="TRACEABLE" tone="amber" />
        <div className="workflow">
          {["Criterion","Evidence","Verification","Finding","Improvement"].map((item, index) => (
            <div className="workflowStep" key={item}><span>{index + 1}</span><strong>{item}</strong></div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "Audit") {
    return (
      <div className="screen">
        <Header title="Audit Timeline" description="Append-only privileged action trace" badge="READ ONLY" tone="slate" />
        <div className="timeline">
          <div><span>01</span><strong>System Admin academic governance denied</strong><p>Technical Admin ≠ Academic Governor</p></div>
          <div><span>02</span><strong>Student lateral access denied</strong><p>Student A → Student B = DENY</p></div>
          <div><span>03</span><strong>Internal RPC exposure reduced</strong><p>Template metadata RPCs restricted</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <Header title={name} description="Role-aware HEPE Department Platform workspace" badge={roleConfig[role].scope} tone="blue" />
      <Panel title="Pilot Contract">
        <p className="muted">หน้านี้แสดงเฉพาะ synthetic information ที่ role ปัจจุบันได้รับอนุญาต</p>
      </Panel>
    </div>
  );
}

export default function Home() {
  const [role, setRole] = useState("DEPARTMENT_HEAD");
  const [page, setPage] = useState("Dashboard");
  const config = roleConfig[role];

  function changeRole(event) {
    const nextRole = event.target.value;
    setRole(nextRole);
    setPage(nextRole === "SYSTEM_ADMIN" ? "Administration" : "Dashboard");
  }

  return (
    <div className="app">
      <div className="sandboxBanner">SANDBOX · TEST DATA ONLY · NON-PRODUCTION</div>
      <aside className="sidebar">
        <div className="brand"><div className="mark">H</div><div><strong>HEPE</strong><span>Department Platform</span></div></div>
        <nav>
          {config.pages.map((item) => (
            <button key={item} onClick={() => setPage(item)} className={page === item ? "navItem active" : "navItem"}>
              <span>•</span>{item}
            </button>
          ))}
        </nav>
        <div className="sideFoot"><span>HEPE-DIGITAL</span><strong>Visual Pilot · 11D</strong></div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div><div className="breadcrumb">HEPE / {page}</div><h1>{page}</h1></div>
          <div className="topActions">
            <div className="scopeBadge blue"><span>{config.label}</span><small>{config.scope}</small></div>
            <select aria-label="Synthetic pilot role" value={role} onChange={changeRole}>
              {Object.entries(roleConfig).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
          </div>
        </header>
        <div className="content">{page === "Dashboard" ? <Dashboard role={role} /> : <GenericPage name={page} role={role} />}</div>
        <footer><span>Canonical backend · synthetic pilot</span><span>Production publishing locked</span></footer>
      </main>
    </div>
  );
}
