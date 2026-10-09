import 'server-only';
import { neon } from '@neondatabase/serverless';
import type { ComplianceStatus } from './domain';

export type PersistentReadinessRow = {
  learnerReference: string;
  eplcHours: number;
  completedCycles: number;
  systemStatus: ComplianceStatus;
  humanClearanceStatus: 'PENDING'|'APPROVED'|'REVOKED';
  findings: string[];
};

function databaseUrl(){
  const value=process.env.TPRS_DATABASE_URL;
  if(!value) return null;
  return value;
}

export function persistenceConfigured(){return Boolean(databaseUrl());}

export async function readPersistentReadiness():Promise<PersistentReadinessRow[]|null>{
  const url=databaseUrl();
  if(!url) return null;
  const sql=neon(url);
  const rows=await sql`
    SELECT l.learner_reference,
      (SELECT COALESCE(sum(sp.verified_hours),0) FROM tprs.stage_progress sp WHERE sp.learner_id=l.id) AS eplc_hours,
      (SELECT count(*) FROM tprs.plc_cycles pc WHERE pc.learner_id=l.id AND pc.state='COMPLETED') AS completed_cycles,
      cr.system_status, cr.human_clearance_status,
      COALESCE((SELECT array_agg(cf.reason_code ORDER BY cf.reason_code) FROM tprs.compliance_findings cf WHERE cf.learner_id=l.id AND cf.status='OPEN'), ARRAY[]::text[]) AS findings
    FROM tprs.learners l
    JOIN tprs.clearance_reviews cr ON cr.learner_id=l.id
    WHERE l.synthetic=true AND l.learner_reference LIKE 'SYN-%'
    ORDER BY l.learner_reference`;
  return rows.map(row=>({
    learnerReference:String(row.learner_reference),
    eplcHours:Number(row.eplc_hours),
    completedCycles:Number(row.completed_cycles),
    systemStatus:String(row.system_status) as ComplianceStatus,
    humanClearanceStatus:String(row.human_clearance_status) as PersistentReadinessRow['humanClearanceStatus'],
    findings:Array.isArray(row.findings)?row.findings.map(String):[]
  }));
}

export function assertPersistenceInvariants(rows:PersistentReadinessRow[]){
  const complete=rows.find(r=>r.learnerReference==='SYN-001');
  if(!complete||complete.eplcHours!==24||complete.completedCycles!==3) throw new Error('TPRS_PERSISTENCE_AGGREGATION_INVARIANT_FAILED');
  const humanPending=rows.find(r=>r.learnerReference==='SYN-012');
  if(!humanPending||humanPending.systemStatus!=='READY'||humanPending.humanClearanceStatus!=='PENDING') throw new Error('TPRS_HUMAN_CLEARANCE_SEPARATION_FAILED');
}
