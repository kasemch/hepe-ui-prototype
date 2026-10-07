export type ComplianceStatus = 'READY' | 'REVIEW' | 'HOLD' | 'INCOMPLETE';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'MISSING';

export type StudentReadiness = {
  id: string;
  displayName: string;
  entryCohort: string;
  curriculumVersion: string;
  registrationStatus: 'REGISTERED' | 'INTERRUPTED' | 'NOT_REGISTERED';
  academicProgression: string;
  eplcHours: [number, number, number, number];
  plcCycles: [boolean, boolean, boolean];
  financialLiteracy: 'VERIFIED' | 'INCOMPLETE' | 'UNVERIFIED_REQUIREMENT';
  evidence: VerificationStatus;
  humanClearance: boolean;
};

export type ComplianceResult = { status: ComplianceStatus; reasons: string[] };

export const REQUIRED_EPLC_HOURS: [number, number, number, number] = [3, 5, 5, 11];

export function evaluateReadiness(student: StudentReadiness): ComplianceResult {
  const reasons: string[] = [];
  student.eplcHours.forEach((hours, i) => {
    if (hours < REQUIRED_EPLC_HOURS[i]) reasons.push(`EPLC_YEAR${i + 1}_INCOMPLETE`);
  });
  student.plcCycles.forEach((complete, i) => {
    if (!complete) reasons.push(`PLC_CYCLE_${i + 1}_INCOMPLETE`);
  });
  if (student.financialLiteracy === 'UNVERIFIED_REQUIREMENT') reasons.push('AUTHORITATIVE_REQUIREMENT_PENDING');
  if (student.financialLiteracy === 'INCOMPLETE') reasons.push('FINLIT_INCOMPLETE');
  if (student.evidence === 'MISSING') reasons.push('EVIDENCE_MISSING');
  if (student.evidence === 'PENDING') reasons.push('EVIDENCE_PENDING');
  if (student.evidence === 'REJECTED') reasons.push('EVIDENCE_REJECTED');

  const blocking = reasons.some(r => r.includes('INCOMPLETE') || r === 'EVIDENCE_MISSING' || r === 'EVIDENCE_REJECTED');
  if (blocking) return { status: 'HOLD', reasons };
  if (reasons.length) return { status: 'REVIEW', reasons };
  if (!student.humanClearance) return { status: 'REVIEW', reasons: ['HUMAN_CLEARANCE_PENDING'] };
  return { status: 'READY', reasons: [] };
}
