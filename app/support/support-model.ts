export const SUPPORT_CATEGORIES = [
  'TECHNICAL_RUNTIME','UI_UX','ACCESSIBILITY','AUTHENTICATION','AUTHORIZATION','DATA_DISPLAY','DATA_RECONCILIATION','CURRICULUM_CONTEXT','TQF3','TQF5','VERIFICATION','IMPROVEMENT','DOCUMENT_EXPORT','PERFORMANCE','INTEGRATION','USER_GUIDANCE','OTHER'
] as const;

export const SUPPORT_SEVERITIES = ['SEV-1','SEV-2','SEV-3','SEV-4'] as const;
export const SUPPORT_STATUSES = ['OPEN','TRIAGED','ASSIGNED','IN_PROGRESS','RESOLVED','USER_VERIFICATION','CLOSED','REOPENED'] as const;

export type SupportTicket = {
  ticket_id:string; ticket_number:string; created_at:string; created_by_actor:string;
  programme_id?:string; curriculum_version_id?:string; course_offering_id?:string; course_code?:string;
  module_code:string; page_path:string; entity_type?:string; entity_id?:string;
  ticket_category:(typeof SUPPORT_CATEGORIES)[number]; severity:(typeof SUPPORT_SEVERITIES)[number]; priority:string;
  title:string; description:string; reproduction_steps?:string; expected_result?:string; actual_result?:string;
  environment:'NON-PRODUCTION'; application_sha:string; deployment_id?:string; browser?:string; viewport?:string;
  support_status:(typeof SUPPORT_STATUSES)[number]; assigned_to?:string; assigned_group?:string;
  resolution_summary?:string; resolution_code?:string; resolved_at?:string; verified_by_user_at?:string; closed_at?:string; reopened_at?:string;
  provenance_status:'SYNTHETIC_DEMO'|'USER_INPUT_CANDIDATE'; source_reference:string; authority_scope:'SUPPORT_ONLY';
  canonical_mutation_allowed:false; audit_evidence_status:'NOT_ADMITTED'; production:false;
};

export const demoTickets:SupportTicket[]=[
  {ticket_id:'SUP-DEMO-001',ticket_number:'SUP-DEMO-001',created_at:'SYNTHETIC',created_by_actor:'SYNTHETIC_REQUESTER',course_code:'HED2503',module_code:'TQF3',page_path:'/tqf3',ticket_category:'UI_UX',severity:'SEV-3',priority:'NORMAL',title:'ตัวอย่างปัญหาการแสดงผลบนจอขนาดเล็ก',description:'ข้อมูลตัวอย่างสำหรับทดสอบโครงสร้าง Support เท่านั้น',environment:'NON-PRODUCTION',application_sha:'RUNTIME_CONTEXT',support_status:'TRIAGED',assigned_group:'SUPPORT_AGENT',provenance_status:'SYNTHETIC_DEMO',source_reference:'HEPE-SUPPORT-01-SYNTHETIC',authority_scope:'SUPPORT_ONLY',canonical_mutation_allowed:false,audit_evidence_status:'NOT_ADMITTED',production:false},
  {ticket_id:'SUP-DEMO-002',ticket_number:'SUP-DEMO-002',created_at:'SYNTHETIC',created_by_actor:'SYNTHETIC_REQUESTER',module_code:'DOCUMENT_EXPORT',page_path:'/documents',ticket_category:'DOCUMENT_EXPORT',severity:'SEV-4',priority:'LOW',title:'ตัวอย่างคำขอปรับข้อความในหน้าพิมพ์เอกสาร',description:'ข้อมูลตัวอย่าง ไม่ใช่ปัญหาที่ตรวจพบจริง',environment:'NON-PRODUCTION',application_sha:'RUNTIME_CONTEXT',support_status:'RESOLVED',resolution_summary:'ตัวอย่าง resolution เพื่อทดสอบ UI',provenance_status:'SYNTHETIC_DEMO',source_reference:'HEPE-SUPPORT-01-SYNTHETIC',authority_scope:'SUPPORT_ONLY',canonical_mutation_allowed:false,audit_evidence_status:'NOT_ADMITTED',production:false}
];

export const supportBoundary = {
  canonicalMutation:false,
  auditEvidenceAdmission:false,
  aiMayClose:false,
  production:false,
  emailSend:false,
  attachmentPersistence:false
} as const;

export const transitionAllowed=(from:string,to:string)=>{
  const map:Record<string,string[]>={
    OPEN:['TRIAGED'], TRIAGED:['ASSIGNED'], ASSIGNED:['IN_PROGRESS'], IN_PROGRESS:['RESOLVED'],
    RESOLVED:['USER_VERIFICATION','REOPENED'], USER_VERIFICATION:['CLOSED','REOPENED'], CLOSED:['REOPENED'], REOPENED:['TRIAGED']
  };
  return (map[from]||[]).includes(to);
};
