import assert from 'node:assert/strict';

const isExpired = (now, expiresAt) => now >= expiresAt;
const decideIdempotency = ({ existing, payloadFingerprint, scopeFingerprint }) => {
  if (!existing) return 'NEW';
  if (existing.payloadFingerprint !== payloadFingerprint) return 'CONFLICT';
  if (existing.scopeFingerprint !== scopeFingerprint) return 'CONFLICT';
  if (existing.completionState === 'COMPLETED') return 'NO_OP_SUCCESS';
  return 'REVALIDATE';
};
const replayDisposition = ({ operationClass, expired, authorityFresh, destinationKnown }) => {
  if (expired) return 'DENY_EXPIRED';
  if (operationClass === 'ADMIN' || operationClass === 'DESTRUCTIVE') return 'NEVER_AUTO_REPLAY';
  if (operationClass === 'PRODUCTION-SENSITIVE') return 'DENY_PRODUCTION';
  if (operationClass === 'HUMAN-GATED' && !authorityFresh) return 'HUMAN_RECONFIRM_REQUIRED';
  if (!destinationKnown) return 'RECONCILIATION_REQUIRED';
  if (!authorityFresh) return 'REVALIDATION_REQUIRED';
  return 'ELIGIBLE_AFTER_VALIDATION';
};
const scopeAllowed = ({ actorProgramme, rowProgramme, actorCourse, rowCourse, crossProgramme = false }) => {
  if (crossProgramme) return true;
  if (actorProgramme !== rowProgramme) return false;
  if (rowCourse && actorCourse !== rowCourse) return false;
  return true;
};

const tests = [
  ['REL02-T01 completed duplicate => no-op', () => assert.equal(decideIdempotency({existing:{payloadFingerprint:'A',scopeFingerprint:'S',completionState:'COMPLETED'},payloadFingerprint:'A',scopeFingerprint:'S'}),'NO_OP_SUCCESS')],
  ['REL02-T02 payload mismatch => conflict', () => assert.equal(decideIdempotency({existing:{payloadFingerprint:'A',scopeFingerprint:'S',completionState:'STARTED'},payloadFingerprint:'B',scopeFingerprint:'S'}),'CONFLICT')],
  ['REL02-T03 authority scope mismatch => conflict', () => assert.equal(decideIdempotency({existing:{payloadFingerprint:'A',scopeFingerprint:'S1',completionState:'STARTED'},payloadFingerprint:'A',scopeFingerprint:'S2'}),'CONFLICT')],
  ['REL02-T04 expired command denied', () => assert.equal(replayDisposition({operationClass:'WRITE',expired:true,authorityFresh:true,destinationKnown:true}),'DENY_EXPIRED')],
  ['REL02-T05 stale human authority reconfirm', () => assert.equal(replayDisposition({operationClass:'HUMAN-GATED',expired:false,authorityFresh:false,destinationKnown:true}),'HUMAN_RECONFIRM_REQUIRED')],
  ['REL02-T06 ambiguous destination reconcile', () => assert.equal(replayDisposition({operationClass:'WRITE',expired:false,authorityFresh:true,destinationKnown:false}),'RECONCILIATION_REQUIRED')],
  ['REL02-T07 admin replay blocked', () => assert.equal(replayDisposition({operationClass:'ADMIN',expired:false,authorityFresh:true,destinationKnown:true}),'NEVER_AUTO_REPLAY')],
  ['REL02-T08 destructive replay blocked', () => assert.equal(replayDisposition({operationClass:'DESTRUCTIVE',expired:false,authorityFresh:true,destinationKnown:true}),'NEVER_AUTO_REPLAY')],
  ['REL02-T09 production-sensitive denied', () => assert.equal(replayDisposition({operationClass:'PRODUCTION-SENSITIVE',expired:false,authorityFresh:true,destinationKnown:true}),'DENY_PRODUCTION')],
  ['REL02-T10 stale non-human authority revalidate', () => assert.equal(replayDisposition({operationClass:'WRITE',expired:false,authorityFresh:false,destinationKnown:true}),'REVALIDATION_REQUIRED')],
  ['REL02-T11 same-programme same-course allowed candidate', () => assert.equal(scopeAllowed({actorProgramme:'P1',rowProgramme:'P1',actorCourse:'C1',rowCourse:'C1'}),true)],
  ['REL02-T12 cross-programme denied candidate', () => assert.equal(scopeAllowed({actorProgramme:'P1',rowProgramme:'P2',actorCourse:'C1',rowCourse:'C1'}),false)],
  ['REL02-T13 wrong-course denied candidate', () => assert.equal(scopeAllowed({actorProgramme:'P1',rowProgramme:'P1',actorCourse:'C1',rowCourse:'C2'}),false)],
  ['REL02-T14 explicit cross-programme scope candidate allowed', () => assert.equal(scopeAllowed({actorProgramme:'P1',rowProgramme:'P2',actorCourse:'C1',rowCourse:'C2',crossProgramme:true}),true)],
  ['REL02-T15 expiry predicate', () => assert.equal(isExpired(100, 100),true)],
];

for (const [name, fn] of tests) {
  fn();
  console.log(`PASS ${name}`);
}
console.log(`HEPE-REL-02 model regression: ${tests.length}/${tests.length} PASS`);
