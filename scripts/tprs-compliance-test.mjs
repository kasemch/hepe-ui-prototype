import assert from 'node:assert/strict';
import { evaluateReadiness } from '../app/tprs/lib/domain.ts';
import { can, requirePermission } from '../app/tprs/lib/rbac.ts';
import { controlledPilotFinLitFact, assertControlledPilotFinLitSafety } from '../app/tprs/lib/controlled-pilot-facts.ts';
import { deriveEvidenceStatus, adaptIndependentPilotFacts } from '../app/tprs/lib/readiness-adapter.ts';

const base={id:'TEST',displayName:'Synthetic',entryCohort:'2567',curriculumVersion:'BED-HEPE-2567',registrationStatus:'REGISTERED',academicProgression:'Synthetic acceptance',eplcHours:[3,5,5,11],plcCycles:[true,true,true],financialLiteracy:'VERIFIED',evidence:'VERIFIED',humanClearance:false};
const run=overrides=>evaluateReadiness({...base,...overrides});
const finlit=learnerReference=>controlledPilotFinLitFact({learnerReference,synthetic:true});
const cases=[
 ['SYN-001 fully complete',{financialLiteracy:finlit('SYN-001')},'READY'],['SYN-002 missing stage 1',{eplcHours:[2,6,5,11],financialLiteracy:finlit('SYN-002')},'INCOMPLETE'],['SYN-003 missing stage 2',{eplcHours:[3,4,6,11],financialLiteracy:finlit('SYN-003')},'INCOMPLETE'],['SYN-004 missing stage 3',{eplcHours:[3,5,4,12],financialLiteracy:finlit('SYN-004')},'INCOMPLETE'],['SYN-005 missing stage 4',{eplcHours:[3,5,6,10],financialLiteracy:finlit('SYN-005')},'INCOMPLETE'],['SYN-006 total below 24',{eplcHours:[3,5,5,10],financialLiteracy:finlit('SYN-006')},'INCOMPLETE'],['SYN-007 cycle 3 missing',{plcCycles:[true,true,false],financialLiteracy:finlit('SYN-007')},'INCOMPLETE'],['SYN-008 FinLit incomplete',{financialLiteracy:finlit('SYN-008')},'INCOMPLETE'],['SYN-009 evidence pending',{evidence:'PENDING',financialLiteracy:finlit('SYN-009')},'REVIEW'],['SYN-010 evidence rejected',{evidence:'REJECTED',financialLiteracy:finlit('SYN-010')},'HOLD'],['SYN-011 requirement mismatch',{requirementVersionMatch:false,financialLiteracy:finlit('SYN-011')},'HOLD'],['SYN-012 system ready / human pending',{financialLiteracy:finlit('SYN-012')},'READY'],['SYN-013 FinLit rule unverified',{financialLiteracy:finlit('SYN-013')},'REVIEW'],['SYN-014 controlled equivalency',{transferCredit:true,professionalEquivalencyApproved:true,financialLiteracy:finlit('SYN-014')},'READY'],['SYN-015 evidence conflict',{evidence:'CONFLICT',financialLiteracy:finlit('SYN-015')},'HOLD']
];
for(const [name,overrides,expected] of cases){const result=run(overrides);assert.equal(result.status,expected,`${name}: expected ${expected}, got ${result.status}`);console.log(`PASS ${name}: ${result.status}`)}

const ev=(status,decisions)=>({evidenceId:'E',learnerReference:'SYN-001',activityReference:'A',requirementReference:'R',evidenceType:'SYNTHETIC_DOCUMENT',currentVersion:1,status,createdAt:'2026-01-01',versions:[{id:'V',versionNo:1,submittedAt:'2026-01-01',supersededAt:null,decisions}]});
assert.equal(deriveEvidenceStatus(ev('VERIFIED',['VERIFIED'])),'VERIFIED');
assert.equal(deriveEvidenceStatus(ev('UNDER_REVIEW',[])),'PENDING');
assert.equal(deriveEvidenceStatus(ev('REJECTED',['REJECTED'])),'REJECTED');
assert.equal(deriveEvidenceStatus(ev('UNDER_REVIEW',['VERIFIED','REJECTED'])),'CONFLICT');
assert.equal(deriveEvidenceStatus(undefined),'MISSING');
const readiness={registrationStatus:'REGISTERED',academicProgression:'Synthetic',eplcStages:[3,5,5,11],plcCycles:[true,true,true],humanClearanceStatus:'PENDING'};
assert.throws(()=>adaptIndependentPilotFacts({learnerReference:'REAL-001',synthetic:false,readiness,evidence:ev('VERIFIED',['VERIFIED'])}),/TPRS_CONTROLLED_PILOT_ADAPTER_DENIED_FOR_REAL_LEARNER/);
assert.equal(evaluateReadiness(adaptIndependentPilotFacts({learnerReference:'SYN-001',synthetic:true,readiness,evidence:ev('VERIFIED',['VERIFIED'])})).status,'READY');

assertControlledPilotFinLitSafety();
assert.throws(()=>controlledPilotFinLitFact({learnerReference:'SYN-001',synthetic:false}),/TPRS_SYNTHETIC_FINLIT_DENIED_FOR_REAL_LEARNER/);assert.throws(()=>controlledPilotFinLitFact({learnerReference:'REAL-001',synthetic:true}),/TPRS_SYNTHETIC_FINLIT_INVALID_FIXTURE/);
assert.ok(run({eplcHours:[3,5,5,10]}).reasons.includes('EPLC_TOTAL_HOURS_INCOMPLETE'));assert.equal(run({}).clearanceStatus,'PENDING');assert.ok(run({transferCredit:true}).reasons.includes('PROFESSIONAL_EQUIVALENCY_PENDING'));assert.ok(run({financialLiteracy:'UNVERIFIED_REQUIREMENT'}).reasons.includes('FINLIT_REQUIREMENT_UNVERIFIED'));assert.equal(run({registrationStatus:'INTERRUPTED'}).status,'READY');assert.equal(run({registrationStatus:'NOT_REGISTERED'}).status,'READY');
assert.equal(can(null,'READ_SELF'),false);assert.equal(can(undefined,'READ_COHORT'),false);assert.equal(can('STUDENT','VERIFY_EVIDENCE'),false);assert.equal(can('STUDENT','REVIEW_CLEARANCE'),false);assert.equal(can('STUDENT','MANAGE_REQUIREMENTS'),false);assert.equal(can('ADVISOR','MANAGE_REQUIREMENTS'),false);assert.equal(can('VERIFIER','VERIFY_EVIDENCE'),true);assert.equal(can('VERIFIER','MANAGE_REQUIREMENTS'),false);assert.equal(can('PROGRAMME_CHAIR','MANAGE_REQUIREMENTS'),true);assert.throws(()=>requirePermission(undefined,'READ_SELF'),/TPRS_ACCESS_DENIED/);assert.doesNotThrow(()=>requirePermission('VERIFIER','VERIFY_EVIDENCE'));
console.log(`HEPE-TPRS production evaluator acceptance: ${cases.length}/${cases.length} PASS; independent evidence adapter + synthetic FinLit isolation + invariants + deny-by-default RBAC PASS`);
