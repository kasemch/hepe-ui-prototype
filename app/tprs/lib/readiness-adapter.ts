import type { StudentReadiness, VerificationStatus } from './domain.ts';
import { controlledPilotFinLitFact } from './controlled-pilot-facts.ts';
import type { PersistentEvidenceRow, PersistentReadinessRow } from './persistence.ts';

export type IndependentPilotFacts = {
  learnerReference: string;
  synthetic: boolean;
  readiness: Pick<PersistentReadinessRow,'registrationStatus'|'academicProgression'|'eplcStages'|'plcCycles'|'humanClearanceStatus'>;
  evidence?: PersistentEvidenceRow;
};

export function deriveEvidenceStatus(evidence?: PersistentEvidenceRow): VerificationStatus {
  if (!evidence) return 'MISSING';
  const decisions = new Set(evidence.versions.flatMap(v=>v.decisions));
  if (decisions.has('VERIFIED') && decisions.has('REJECTED')) return 'CONFLICT';
  if (evidence.status === 'REJECTED' || decisions.has('REJECTED')) return 'REJECTED';
  if (evidence.status === 'VERIFIED' && decisions.has('VERIFIED')) return 'VERIFIED';
  if (evidence.status === 'UNDER_REVIEW' || evidence.status === 'SUBMITTED') return 'PENDING';
  return 'MISSING';
}

function requirementVersionMatch(learnerReference:string){
  // Controlled-pilot synthetic boundary fact only; persisted authoritative version model is deferred.
  return learnerReference !== 'SYN-011';
}

export function adaptIndependentPilotFacts(facts: IndependentPilotFacts): StudentReadiness {
  if (!facts.synthetic) throw new Error('TPRS_CONTROLLED_PILOT_ADAPTER_DENIED_FOR_REAL_LEARNER');
  return {
    id:facts.learnerReference,
    displayName:facts.learnerReference,
    entryCohort:'SYN-PILOT',
    curriculumVersion:'BED-HEPE-2567',
    registrationStatus:facts.readiness.registrationStatus,
    academicProgression:facts.readiness.academicProgression,
    eplcHours:facts.readiness.eplcStages,
    plcCycles:facts.readiness.plcCycles,
    financialLiteracy:controlledPilotFinLitFact({learnerReference:facts.learnerReference,synthetic:true}),
    evidence:deriveEvidenceStatus(facts.evidence),
    humanClearance:facts.readiness.humanClearanceStatus==='APPROVED',
    requirementVersionMatch:requirementVersionMatch(facts.learnerReference),
    transferCredit:facts.learnerReference==='SYN-014',
    professionalEquivalencyApproved:facts.learnerReference==='SYN-014',
  };
}

export function joinIndependentPilotFacts(readiness:PersistentReadinessRow[], evidence:PersistentEvidenceRow[]):IndependentPilotFacts[]{
  const byLearner=new Map(evidence.map(e=>[e.learnerReference,e]));
  return readiness.map(r=>({learnerReference:r.learnerReference,synthetic:true,readiness:r,evidence:byLearner.get(r.learnerReference)}));
}
