import { AUTHORITY_FIXTURES, canView, canEdit, canSubmit, canReview, canApprove, canExport } from "../../lib/authority/policy";
const contexts = [
  ["ผู้สอน", AUTHORITY_FIXTURES.lecturer],
  ["ประธานหลักสูตร", AUTHORITY_FIXTURES.programmeChair],
  ["Reviewer / QA", AUTHORITY_FIXTURES.reviewerQA],
  ["ผู้ดูแลระบบ", AUTHORITY_FIXTURES.admin],
  ["ผู้บริหาร (อ่านอย่างเดียว)", AUTHORITY_FIXTURES.executiveReadOnly],
] as const;
const programme = "synthetic:HEPE", offering = "synthetic:HED3505";
const permissions = [
  ["ดู",canView],["แก้ไข",canEdit],["ส่งตรวจ",canSubmit],
  ["ตรวจ",canReview],["อนุมัติ",canApprove],
  ["ส่งออก Preview",canExport],
] as const;
export default function Roles(){return <div className="shell"><aside className="side"><div className="brand">🎓 HEPE Fast TQF</div><div className="nav"><a href="/">หน้าหลัก</a><a href="/my-work">งานของฉัน</a><a href="/programme">หลักสูตร</a><a href="/courses/HED3505">รายวิชา</a><a href="/documents/HED3505-mko3">เอกสาร มคอ.</a><a href="/evidence">หลักฐาน</a><a href="/mapping">Mapping</a><a href="/review">ตรวจสอบ/อนุมัติ</a><a href="/quality">รายงาน</a><a href="/calendar">ปฏิทิน</a><a href="/templates">แม่แบบ</a><a className="active" href="/settings">ตั้งค่า</a></div></aside><main className="main"><section className="hero"><h1>Role-Based Experience</h1><div className="muted">ตารางทดสอบสิทธิ์จาก synthetic fixtures เท่านั้น · ไม่ใช่การเปลี่ยนบัญชีหรือมอบอำนาจจริง</div></section><div className="card"><h3>Authority decision matrix — HED3505</h3><table><thead><tr><th>บทบาทจำลอง</th>{permissions.map(p=><th key={p[0]}>{p[0]}</th>)}</tr></thead><tbody>{contexts.map(([label,context])=><tr key={label}><td><b>{label}</b></td>{permissions.map(([name,check])=>{const d=check(context,programme,offering);return <td key={name} title={d.reason}><span className={"status "+(d.allowed?"s-green":"s-red")}>{d.allowed?"UI ONLY":"LOCKED"}</span></td>})}</tr>)}</tbody></table><p className="muted">UI ONLY หมายถึงเปิดมุมมองจำลอง ไม่ใช่สิทธิ์ backend; official export และ approval ถูกล็อกสำหรับทุกบทบาท</p></div><div className="card" style={{marginTop:14}}><h3>Human authority boundary</h3><div className="locked">🔒 Real approval / Official export / Submit — NOT ENABLED</div><p>ต้องตรวจตัวตน ขอบเขตการมอบหมาย และสิทธิ์ที่ server ก่อนเปิดใช้งานจริง ไม่สามารถเปลี่ยนสิทธิ์จากหน้านี้ได้</p></div></main></div>}