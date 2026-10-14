import 'server-only';
import { neon } from '@neondatabase/serverless';
import type { ComplianceStatus } from './domain';

export type PersistentReadinessRow = {
  learnerReference: string;
  registrationStatus: 'REGISTERED'|'INTERRUPTED'|'NOT_REGISTERED';
  academicProgression: string;
  professionalProgression: string;
  eplcStages: [number,number,number,number];
  eplcHours: number;
  plcCycles: [boolean,boolean,boolean];
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
      COALESCE(lc.registration_status,'NOT_REGISTERED') AS registration_status,
      COALESCE(lc.academic_progression,'UNRECORDED') AS academic_progression,
      COALESCE(lc.professional_progression,'NOT_STARTED') AS professional_progression,
      ARRAY[
        COALESCE((SELECT sp.verified_hours FROM tprs.stage_progress sp JOIN tprs.learning_stages ls ON ls.id=sp.stage_id WHERE sp.learner_id=l.id AND ls.sequence_no=1 LIMIT 1),0),
        COALESCE((SELECT sp.verified_hours FROM tprs.stage_progress sp JOIN tprs.learning_stages ls ON ls.id=sp.stage_id WHERE sp.learner_id=l.id AND ls.sequence_no=2 LIMIT 1),0),
        COALESCE((SELECT sp.verified_hours FROM tprs.stage_progress sp JOIN tprs.learning_stages ls ON ls.id=sp.stage_id WHERE sp.learner_id=l.id AND ls.sequence_no=3 LIMIT 1),0),
        COALESCE((SELECT sp.verified_hours FROM tprs.stage_progress sp JOIN tprs.learning_stages ls ON ls.id=sp.stage_id WHERE sp.learner_id=l.id AND ls.sequence_no=4 LIMIT 1),0)
      ] AS eplc_stages,
      (SELECT COALESCE(sum(sp.verified_hours),0) FROM tprs.stage_progress sp WHERE sp.learner_id=l.id) AS eplc_hours,
      ARRAY[
        EXISTS(SELECT 1 FROM tprs.plc_cycles pc WHERE pc.learner_id=l.id AND pc.cycle_number=1 AND pc.state='COMPLETED'),
        EXISTS(SELECT 1 FROM tprs.plc_cycles pc WHERE pc.learner_id=l.id AND pc.cycle_number=2 AND pc.state='COMPLETED'),
        EXISTS(SELECT 1 FROM tprs.plc_cycles pc WHERE pc.learner_id=l.id AND pc.cycle_number=3 AND pc.state='COMPLETED')
      ] AS plc_cycles,
      (SELECT count(*) FROM tprs.plc_cycles pc WHERE pc.learner_id=l.id AND pc.state='COMPLETED') AS completed_cycles,
      cr.system_status, cr.human_clearance_status,
      COALESCE((SELECT array_agg(cf.reason_code ORDER BY cf.reason_code) FROM tprs.compliance_findings cf WHERE cf.learner_id=l.id AND cf.status='OPEN'), ARRAY[]::text[]) AS findings
    FROM tprs.learners l
    LEFT JOIN tprs.learner_contexts lc ON lc.learner_id=l.id
    JOIN tprs.clearance_reviews cr ON cr.learner_id=l.id
    WHERE l.synthetic=true AND l.learner_reference LIKE 'SYN-%'
    ORDER BY l.learner_reference`;
  return rows.map(row=>({
    learnerReference:String(row.learner_reference),
    registrationStatus:String(row.registration_status) as PersistentReadinessRow['registrationStatus'],
    academicProgression:String(row.academic_progression),
    professionalProgression:String(row.professional_progression),
    eplcStages:(Array.isArray(row.eplc_stages)?row.eplc_stages.map(Number):[0,0,0,0]) as PersistentReadinessRow['eplcStages'],
    eplcHours:Number(row.eplc_hours),
    plcCycles:(Array.isArray(row.plc_cycles)?row.plc_cycles.map(Boolean):[false,false,false]) as PersistentReadinessRow['plcCycles'],
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
  const marketSystem=rows.find(r=>r.learnerReference==='SYN-014');
  if(!marketSystem||marketSystem.registrationStatus!=='INTERRUPTED'||marketSystem.systemStatus!=='READY') throw new Error('TPRS_MARKET_SYSTEM_INVARIANT_FAILED');
}
