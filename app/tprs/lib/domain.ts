export type ComplianceStatus = 'READY' | 'REVIEW' | 'HOLD' | 'INCOMPLETE';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'MISSING';
export type ClearanceStatus = 'APPROVED' | 'PENDING';

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
  requirementVersionMatch?: boolean;
  transferCredit?: boolean;
  professionalEquivalencyApproved?: boolean;
};

export type ComplianceResult = { status: ComplianceStatus; reasons: string[]; clearanceStatus: ClearanceStatus };

export const REQUIRED_EPLC_HOURS: [number, number, number, number] = [3, 5, 5, 11];
export const REQUIRED_EPLC_TOTAL = 24;

export function evaluateReadiness(student: StudentReadiness): ComplianceResult {
  const reasons: string[] = [];
  student.eplcHours.forEach((hours, i) => {
    if (hours < REQUIRED_EPLC_HOURS[i]) reasons.push(`EPLC_YEAR${i + 1}_INCOMPLETE`);
  });
  const total = student.eplcHours.reduce((sum, hours) => sum + hours, 0);
  if (total < REQUIRED_EPLC_TOTAL) reasons.push('EPLC_TOTAL_HOURS_INCOMPLETE');
  student.plcCycles.forEach((complete, i) => {
    if (!complete) reasons.push(`PLC_CYCLE_${i + 1}_INCOMPLETE`);
  });
  if (student.financialLiteracy === 'UNVERIFIED_REQUIREMENT') reasons.push('AUTHORITATIVE_REQUIREMENT_PENDING');
  if (student.financialLiteracy === 'INCOMPLETE') reasons.push('FINLIT_INCOMPLETE');
  if (student.evidence === 'MISSING') reasons.push('EVIDENCE_MISSING');
  if (student.evidence === 'PENDING') reasons.push('EVIDENCE_PENDING');
  if (student.evidence === 'REJECTED') reasons.push('EVIDENCE_REJECTED');
  if (student.requirementVersionMatch === false) reasons.push('REQUIREMENT_VERSION_MISMATCH');
  if (student.transferCredit && !student.professionalEquivalencyApproved) reasons.push('PROFESSIONAL_EQUIVALENCY_PENDING');

  const clearanceStatus: ClearanceStatus = student.humanClearance ? 'APPROVED' : 'PENDING';
  const incomplete = reasons.some(r => r.includes('INCOMPLETE') || r === 'EVIDENCE_MISSING');
  const hold = reasons.some(r => r === 'EVIDENCE_REJECTED' || r === 'REQUIREMENT_VERSION_MISMATCH');
  if (hold) return { status: 'HOLD', reasons, clearanceStatus };
  if (incomplete) return { status: 'INCOMPLETE', reasons, clearanceStatus };
  if (reasons.length) return { status: 'REVIEW', reasons, clearanceStatus };
  return { status: 'READY', reasons: [], clearanceStatus };
}
