import fs from 'node:fs';
import assert from 'node:assert/strict';
const sql=fs.readFileSync('supabase/migrations/202610070001_tprs_backend_v15.sql','utf8');
const required=[
 'create table tprs.learners','create table tprs.stage_progress','create table tprs.plc_cycles',
 'create table tprs.evidence_records','create table tprs.evidence_versions','create table tprs.assessments',
 'create table tprs.assessment_attempts','create table tprs.audit_events','enable row level security',
 "cycle_no between 1 and 3",'verified_not_over_recorded','evidence_insert_own','assessment_insert_assessor',
 "tprs.has_role('academic_authority')",'synthetic=true'
];
for(const token of required) assert.ok(sql.toLowerCase().includes(token.toLowerCase()),`Missing backend control: ${token}`);
assert.ok(!/score\s*>=\s*80/i.test(sql),'Invented Financial Literacy threshold detected');
assert.ok(!/create\s+table\s+tprs\.certificates/i.test(sql),'Certificate issuance must remain gated');
assert.match(sql,/no update\/delete policies on evidence_versions, assessment_attempts or audit_events/i);
console.log(`TPRS backend static acceptance PASS (${required.length} controls)`);