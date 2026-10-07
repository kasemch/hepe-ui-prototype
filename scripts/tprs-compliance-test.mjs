import assert from 'node:assert/strict';
import { evaluateReadiness } from '../app/tprs/lib/domain.ts';
import { can } from '../app/tprs/lib/rbac.ts';

const base = {
  id:'TEST', displayName:'Synthetic', entryCohort:'2567', curriculumVersion:'BED-HEPE-2567',
  registrationStatus:'REGISTERED', academicProgression:'Synthetic acceptance',
  eplcHours:[3,5,5,11], plcCycles:[true,true,true], financialLiteracy:'VERIFIED',
  evidence:'VERIFIED', humanClearance:false
};
const run = overrides => evaluateReadiness({ ...base, ...overrides });

const cases = [
 ['SYN-001 fully complete',{},'READY'],
 ['SYN-002 missing stage 1',{eplcHours:[2,6,5,11]},'INCOMPLETE'],
 ['SYN-003 missing stage 2',{eplcHours:[3,4,6,11]},'INCOMPLETE'],
 ['SYN-004 missing stage 3',{eplcHours:[3,5,4,12]},'INCOMPLETE'],
 ['SYN-005 missing stage 4',{eplcHours:[3,5,6,10]},'INCOMPLETE'],
 ['SYN-006 total below 24',{eplcHours:[3,5,5,10]},'INCOMPLETE'],
 ['SYN-007 cycle 3 missing',{plcCycles:[true,true,false]},'INCOMPLETE'],
 ['SYN-008 FinLit incomplete',{financialLiteracy:'INCOMPLETE'},'INCOMPLETE'],
 ['SYN-009 evidence pending',{evidence:'PENDING'},'REVIEW'],
 ['SYN-010 evidence rejected',{evidence:'REJECTED'},'HOLD'],
 ['SYN-011 requirement mismatch',{requirementVersionMatch:false},'HOLD'],
 ['SYN-012 system ready / human pending',{},'READY'],
 ['SYN-013 FinLit rule unverified',{financialLiteracy:'UNVERIFIED_REQUIREMENT'},'REVIEW'],
 ['SYN-014 controlled equivalency',{transferCredit:true,professionalEquivalencyApproved:true},'READY'],
 ['SYN-015 evidence conflict',{evidence:'CONFLICT'},'HOLD']
];
for (const [name, overrides, expected] of cases) {
  const result = run(overrides);
  assert.equal(result.status, expected, `${name}: expected ${expected}, got ${result.status}`);
  console.log(`PASS ${name}: ${result.status}`);
}

assert.ok(run({eplcHours:[3,5,5,10]}).reasons.includes('EPLC_TOTAL_HOURS_INCOMPLETE'));
assert.equal(run({}).clearanceStatus,'PENDING');
assert.ok(run({transferCredit:true}).reasons.includes('PROFESSIONAL_EQUIVALENCY_PENDING'));
assert.ok(run({financialLiteracy:'UNVERIFIED_REQUIREMENT'}).reasons.includes('FINLIT_REQUIREMENT_UNVERIFIED'));
assert.equal(run({registrationStatus:'INTERRUPTED'}).status,'READY');
assert.equal(run({registrationStatus:'NOT_REGISTERED'}).status,'READY');

assert.equal(can('STUDENT','VERIFY_EVIDENCE'),false);
assert.equal(can('STUDENT','REVIEW_CLEARANCE'),false);
assert.equal(can('STUDENT','MANAGE_REQUIREMENTS'),false);
assert.equal(can('ADVISOR','MANAGE_REQUIREMENTS'),false);
assert.equal(can('VERIFIER','VERIFY_EVIDENCE'),true);
assert.equal(can('VERIFIER','MANAGE_REQUIREMENTS'),false);
assert.equal(can('PROGRAMME_CHAIR','MANAGE_REQUIREMENTS'),true);

console.log(`HEPE-TPRS production evaluator acceptance: ${cases.length}/${cases.length} PASS; invariants + RBAC negative assertions PASS`);
