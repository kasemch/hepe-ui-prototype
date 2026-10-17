import type { StudentReadiness } from './domain';

export type ControlledPilotFinLitState = StudentReadiness['financialLiteracy'];

/**
 * NON-AUTHORITATIVE / SYNTHETIC-ONLY acceptance facts.
 * These values exist solely to exercise the production evaluator while the
 * Financial Literacy regulatory rule remains PROVISIONAL. They MUST NOT be
 * used for real learners, regulatory applicability, or academic clearance.
 */
const SYNTHETIC_FINLIT: Readonly<Record<string, ControlledPilotFinLitState>> = Object.freeze({
  'SYN-001': 'VERIFIED',
  'SYN-002': 'VERIFIED',
  'SYN-003': 'VERIFIED',
  'SYN-004': 'VERIFIED',
  'SYN-005': 'VERIFIED',
  'SYN-006': 'VERIFIED',
  'SYN-007': 'VERIFIED',
  'SYN-008': 'INCOMPLETE',
  'SYN-009': 'VERIFIED',
  'SYN-010': 'VERIFIED',
  'SYN-011': 'VERIFIED',
  'SYN-012': 'VERIFIED',
  'SYN-013': 'UNVERIFIED_REQUIREMENT',
  'SYN-014': 'VERIFIED',
  'SYN-015': 'VERIFIED',
});

export function controlledPilotFinLitFact(input: {
  learnerReference: string;
  synthetic: boolean;
}): ControlledPilotFinLitState {
  if (!input.synthetic) throw new Error('TPRS_SYNTHETIC_FINLIT_DENIED_FOR_REAL_LEARNER');
  if (!/^SYN-\d{3}$/.test(input.learnerReference)) throw new Error('TPRS_SYNTHETIC_FINLIT_INVALID_FIXTURE');
  const state = SYNTHETIC_FINLIT[input.learnerReference];
  if (!state) throw new Error('TPRS_SYNTHETIC_FINLIT_UNKNOWN_FIXTURE');
  return state;
}

export function assertControlledPilotFinLitSafety() {
  let denied = false;
  try { controlledPilotFinLitFact({ learnerReference: 'REAL-001', synthetic: false }); }
  catch (error) { denied = error instanceof Error && error.message === 'TPRS_SYNTHETIC_FINLIT_DENIED_FOR_REAL_LEARNER'; }
  if (!denied) throw new Error('TPRS_SYNTHETIC_FINLIT_REAL_LEARNER_GUARD_FAILED');
  if (controlledPilotFinLitFact({ learnerReference: 'SYN-008', synthetic: true }) !== 'INCOMPLETE') throw new Error('TPRS_SYNTHETIC_FINLIT_INCOMPLETE_FIXTURE_FAILED');
  if (controlledPilotFinLitFact({ learnerReference: 'SYN-013', synthetic: true }) !== 'UNVERIFIED_REQUIREMENT') throw new Error('TPRS_SYNTHETIC_FINLIT_AUTHORITY_FIXTURE_FAILED');
}
