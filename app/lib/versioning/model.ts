export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: string;
  author: string;
  createdAt: string;
  changeSummary: string;
  workflowState: "DRAFT" | "IN_PROGRESS" | "READY_FOR_REVIEW" | "UNDER_REVIEW" | "NEEDS_REVISION" | "RESUBMITTED" | "APPROVED" | "ARCHIVED";
  sourceVersionId?: string;
  snapshotHash: string;
  sections: readonly {
    sectionId: string;
    title: string;
    summary: string;
  }[];
}

export const HED3505_TQF3_VERSIONS: readonly DocumentVersion[] = [
  {
    id: "hed3505-mko3-v04",
    documentId: "HED3505-MKO3",
    versionNumber: "v0.4",
    author: "Prototype Author",
    createdAt: "2569-09-23",
    changeSummary: "เพิ่มผลลัพธ์การเรียนรู้และปรับ assessment link",
    workflowState: "DRAFT",
    sourceVersionId: "hed3505-mko3-v03",
    snapshotHash: "synthetic:hed3505-mko3-v04",
    sections: [
      { sectionId: "learning-outcomes", title: "ผลลัพธ์การเรียนรู้", summary: "ปรับถ้อยคำ CLO และการเชื่อมโยง" },
      { sectionId: "assessment", title: "การประเมิน", summary: "Rubric revised; evidence blockers remain" },
      { sectionId: "evidence", title: "หลักฐาน", summary: "ยังมี 2 blockers" },
    ],
  },
  {
    id: "hed3505-mko3-v03",
    documentId: "HED3505-MKO3",
    versionNumber: "v0.3",
    author: "Prototype Author",
    createdAt: "2569-09-22",
    changeSummary: "แก้ส่วน Assessment",
    workflowState: "DRAFT",
    sourceVersionId: "hed3505-mko3-v02",
    snapshotHash: "synthetic:hed3505-mko3-v03",
    sections: [
      { sectionId: "learning-outcomes", title: "ผลลัพธ์การเรียนรู้", summary: "CLO candidate baseline" },
      { sectionId: "assessment", title: "การประเมิน", summary: "Rubric draft" },
      { sectionId: "evidence", title: "หลักฐาน", summary: "Evidence link incomplete" },
    ],
  },
  {
    id: "hed3505-mko3-v02",
    documentId: "HED3505-MKO3",
    versionNumber: "v0.2",
    author: "Prototype Author",
    createdAt: "2569-09-21",
    changeSummary: "เพิ่ม Course Information",
    workflowState: "DRAFT",
    sourceVersionId: "hed3505-mko3-v01",
    snapshotHash: "synthetic:hed3505-mko3-v02",
    sections: [
      { sectionId: "course-information", title: "ข้อมูลรายวิชา", summary: "เพิ่มข้อมูลพื้นฐานรายวิชา" },
    ],
  },
  {
    id: "hed3505-mko3-v01",
    documentId: "HED3505-MKO3",
    versionNumber: "v0.1",
    author: "Prototype Author",
    createdAt: "2569-09-20",
    changeSummary: "สร้างเอกสารต้นแบบ",
    workflowState: "DRAFT",
    snapshotHash: "synthetic:hed3505-mko3-v01",
    sections: [
      { sectionId: "course-information", title: "ข้อมูลรายวิชา", summary: "สร้างเอกสารต้นแบบ" },
    ],
  },
];

export function compareVersions(leftId: string, rightId: string) {
  const left = HED3505_TQF3_VERSIONS.find(v => v.id === leftId);
  const right = HED3505_TQF3_VERSIONS.find(v => v.id === rightId);
  if (!left || !right) throw new Error("Unknown controlled document version");

  const sectionIds = Array.from(new Set([
    ...left.sections.map(s => s.sectionId),
    ...right.sections.map(s => s.sectionId),
  ]));

  return sectionIds.map(sectionId => {
    const l = left.sections.find(s => s.sectionId === sectionId);
    const r = right.sections.find(s => s.sectionId === sectionId);
    return {
      sectionId,
      title: r?.title ?? l?.title ?? sectionId,
      before: l?.summary ?? "—",
      after: r?.summary ?? "—",
      changed: (l?.summary ?? "") !== (r?.summary ?? ""),
    };
  });
}
