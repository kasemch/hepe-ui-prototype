export const HED3505_STATE = {
  courseCode: "HED3505",
  readiness: "HOLD",
  evidenceReadiness: 65,
  blockers: [
    { id: "EVIDENCE-01", message: "Rubric การประเมินยังอยู่สถานะรอตรวจ", requirement: "ต้อง Verified ก่อนส่ง" },
    { id: "EVIDENCE-02", message: "หลักฐานผลการเรียนรู้ CLO3 ยังไม่ครบ", requirement: "ต้องเชื่อมโยง Evidence" },
  ],
  officialExport: "LOCKED",
  tqf5: "INCOMPLETE",
} as const;

export const NOTIFICATION_ITEMS = [
  { title: "กำหนดส่ง HED3505", detail: "มคอ.3 ต้องตรวจความพร้อมวันนี้", priority: "High", state: "ACTION_REQUIRED", href: "/review/HED3505" },
  { title: "Evidence HED3505", detail: "Rubric ยังรอตรวจ", priority: "Medium", state: "UNREAD", href: "/review/HED3505" },
  { title: "Review HED2503", detail: "มีรายการรอ Human Review", priority: "Medium", state: "ACKNOWLEDGED", href: "/my-work" },
  { title: "มคอ.5 PED1101", detail: "เอกสารยังไม่ครบ", priority: "Low", state: "UNREAD", href: "/my-work" },
] as const;

export const ROLE_VISIBILITY = [
  { role: "ผู้สอน", visible: "My Work, Course, Document, Evidence", restricted: "Final approval" },
  { role: "ประธานหลักสูตร", visible: "Programme, Mapping, Review", restricted: "System admin" },
  { role: "Reviewer / QA", visible: "Review, Quality, Audit", restricted: "Author editing" },
] as const;
