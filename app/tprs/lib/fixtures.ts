import { StudentReadiness } from './domain';

const base = {
  entryCohort: '2567', curriculumVersion: 'BED-HEPE-2567', registrationStatus: 'REGISTERED' as const,
  eplcHours: [3,5,5,11] as [number,number,number,number], plcCycles: [true,true,true] as [boolean,boolean,boolean],
  financialLiteracy: 'VERIFIED' as const, evidence: 'VERIFIED' as const, humanClearance: false
};

export const syntheticStudents: StudentReadiness[] = [
  { ...base, id:'SYN-001', displayName:'นักศึกษาจำลอง 001', academicProgression:'Fully complete', humanClearance:true },
  { ...base, id:'SYN-002', displayName:'นักศึกษาจำลอง 002', academicProgression:'24h total but Stage 1 below minimum', eplcHours:[2,6,5,11] },
  { ...base, id:'SYN-003', displayName:'นักศึกษาจำลอง 003', academicProgression:'Stage 2 below minimum', eplcHours:[3,4,6,11] },
  { ...base, id:'SYN-004', displayName:'นักศึกษาจำลอง 004', academicProgression:'Stage 3 below minimum', eplcHours:[3,5,4,12] },
  { ...base, id:'SYN-005', displayName:'นักศึกษาจำลอง 005', academicProgression:'Stage 4 below minimum', eplcHours:[3,5,6,10] },
  { ...base, id:'SYN-006', displayName:'นักศึกษาจำลอง 006', academicProgression:'Total below 24 hours', eplcHours:[3,5,5,10] },
  { ...base, id:'SYN-007', displayName:'นักศึกษาจำลอง 007', academicProgression:'PLC Cycle 3 incomplete', plcCycles:[true,true,false] },
  { ...base, id:'SYN-008', displayName:'นักศึกษาจำลอง 008', academicProgression:'Financial Literacy incomplete', financialLiteracy:'INCOMPLETE' },
  { ...base, id:'SYN-009', displayName:'นักศึกษาจำลอง 009', academicProgression:'Evidence pending verification', evidence:'PENDING' },
  { ...base, id:'SYN-010', displayName:'นักศึกษาจำลอง 010', academicProgression:'Evidence rejected', evidence:'REJECTED' },
  { ...base, id:'SYN-011', displayName:'นักศึกษาจำลอง 011', academicProgression:'Requirement-version mismatch', requirementVersionMatch:false },
  { ...base, id:'SYN-012', displayName:'นักศึกษาจำลอง 012', academicProgression:'System READY · Human clearance pending' },
  { ...base, id:'SYN-013', displayName:'นักศึกษาจำลอง 013', academicProgression:'Financial authoritative rule unverified', financialLiteracy:'UNVERIFIED_REQUIREMENT' },
  { ...base, id:'SYN-014', displayName:'นักศึกษาจำลอง 014', academicProgression:'Controlled professional equivalency approved', transferCredit:true, professionalEquivalencyApproved:true },
  { ...base, id:'SYN-015', displayName:'นักศึกษาจำลอง 015', academicProgression:'Conflicting evidence requires resolution', evidence:'CONFLICT' }
];
