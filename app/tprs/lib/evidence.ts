export type EvidenceVersion = { version:number; status:'VERIFIED'|'PENDING'|'REJECTED'; submittedAt:string; verifier?:string };
export type EvidenceRecord = { id:string; studentId:string; requirementId:string; activity:string; versions:EvidenceVersion[] };
export type AuditEvent = { id:string; actor:string; action:string; entityType:string; entityId:string; at:string; reason:string };

export const evidenceRecords: EvidenceRecord[] = [
 {id:'EV-001',studentId:'SYN-001',requirementId:'REQ-EPLC-24H-V1',activity:'E-PLC completion evidence',versions:[{version:1,status:'VERIFIED',submittedAt:'2026-09-01',verifier:'SYNTHETIC_VERIFIER'}]},
 {id:'EV-005',studentId:'SYN-005',requirementId:'REQ-EPLC-24H-V1',activity:'E-PLC completion evidence',versions:[{version:1,status:'PENDING',submittedAt:'2026-09-05'}]},
 {id:'EV-REV',studentId:'SYN-004',requirementId:'REQ-EPLC-24H-V1',activity:'Example versioned evidence',versions:[{version:1,status:'REJECTED',submittedAt:'2026-08-01',verifier:'SYNTHETIC_VERIFIER'},{version:2,status:'VERIFIED',submittedAt:'2026-08-10',verifier:'SYNTHETIC_VERIFIER'}]}
];

export const auditEvents: AuditEvent[] = evidenceRecords.flatMap(e => e.versions.map(v => ({id:`AUD-${e.id}-${v.version}`,actor:v.verifier ?? 'SYNTHETIC_STUDENT',action:v.status,entityType:'EVIDENCE_VERSION',entityId:`${e.id}:v${v.version}`,at:v.submittedAt,reason:'Synthetic prototype event'})));
