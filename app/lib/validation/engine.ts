import type { ValidationFinding, ValidationSummary } from "./contracts";
import { controlledData } from "../data/synthetic-adapter";

export function validateHED3505(): ValidationSummary {
  const course = controlledData.course.getCourseReadModel("HED3505");
  const blockers = controlledData.course.getBlockers("HED3505");

  const findings: ValidationFinding[] = [
    {
      ruleId: "COMP-001",
      group: "COMPLETENESS",
      severity: "INFO",
      status: "PASS",
      objectType: "TQF_DOCUMENT",
      objectId: "HED3505-MKO3",
      message: "ส่วนหลักของเอกสารครบ",
      source: "controlled prototype document state",
    },
    {
      ruleId: "CONS-001",
      group: "CONSISTENCY",
      severity: "WARNING",
      status: "NOT_CHECKED",
      objectType: "TQF_DOCUMENT",
      objectId: "HED3505-MKO3",
      message: "ความสอดคล้องกับ Master Data ต้องตรวจอีกครั้ง",
      remediation: "ทบทวนข้อมูลรายวิชาเทียบกับ master source",
    },
    {
      ruleId: "MAP-001",
      group: "MAPPING",
      severity: "INFO",
      status: "PASS",
      objectType: "COURSE_MAPPING",
      objectId: "HED3505",
      message: "มี CLO → PLO candidate mapping ใน prototype",
      source: "controlled mapping display state",
    },
    {
      ruleId: "ASM-001",
      group: "ASSESSMENT",
      severity: "INFO",
      status: "PASS",
      objectType: "ASSESSMENT_PLAN",
      objectId: "HED3505",
      message: "CLO มี assessment candidate",
      source: "controlled prototype assessment state",
    },
    ...blockers.map((b) => ({
      ruleId: b.id,
      group: "EVIDENCE" as const,
      severity: "ERROR" as const,
      status: "FAIL" as const,
      objectType: "EVIDENCE",
      objectId: "HED3505",
      message: b.message,
      remediation: b.requirement,
    })),
  ];

  return {
    ready: course.readiness === "READY" && blockers.length === 0,
    headline:
      course.readiness === "READY" && blockers.length === 0
        ? "พร้อมส่ง"
        : `ยังไม่พร้อมส่ง — ต้องแก้ ${blockers.length} จุด`,
    blockers: blockers.length,
    findings,
  };
}
