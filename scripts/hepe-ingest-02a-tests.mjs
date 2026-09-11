import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { executeSyntheticPipeline } from '../lib/ingest/prototype.mjs';

const fixture = JSON.parse(await fs.readFile(new URL('../fixtures/hepe-ingest/HEPE-SYN-CURR-001.json', import.meta.url), 'utf8'));
const results = [];

function test(id, name, fn) {
  try {
    fn();
    results.push({ id, name, expected: 'PASS', actual: 'PASS', status: 'PASS' });
  } catch (error) {
    results.push({ id, name, expected: 'PASS', actual: error?.message ?? String(error), status: 'FAIL' });
  }
}

function semantic(out) {
  return out.candidates.map((c) => ({ entityType: c.entityType, businessKey: c.businessKey, fields: c.fields }));
}

const cleanXlsx = executeSyntheticPipeline(structuredClone(fixture), { sourceFormat: 'XLSX', templateVersion: '0.1' });
const cleanDocx = executeSyntheticPipeline(structuredClone(fixture), { sourceFormat: 'DOCX' });
const cleanPdf = executeSyntheticPipeline(structuredClone(fixture), { sourceFormat: 'PDF' });

test('ING-D01', 'Valid synthetic XLSX source produces candidates', () => {
  assert.ok(cleanXlsx.candidates.length > 0);
  assert.equal(cleanXlsx.validations.filter((v) => v.result === 'FAIL').length, 0);
});

test('ING-D02', 'Valid synthetic DOCX source produces candidates', () => {
  assert.ok(cleanDocx.candidates.length > 0);
  assert.equal(cleanDocx.validations.filter((v) => v.result === 'FAIL').length, 0);
  assert.ok(cleanDocx.candidates.every((c) => c.sourceRef.paragraphReference || c.sourceRef.tableReference || c.sourceRef.sectionHeading));
});

test('ING-D03', 'Valid synthetic PDF source preserves provenance', () => {
  assert.ok(cleanPdf.candidates.length > 0);
  assert.equal(cleanPdf.validations.filter((v) => v.ruleId === 'ING-V011' && v.result !== 'PASS').length, 0);
  assert.ok(cleanPdf.candidates.every((c) => c.sourceRef.pageNumber !== undefined));
});

test('ING-D04', 'Cross-format semantic extraction is equivalent', () => {
  assert.deepEqual(semantic(cleanXlsx), semantic(cleanDocx));
  assert.deepEqual(semantic(cleanXlsx), semantic(cleanPdf));
});

test('ING-D05', 'Unsupported XLSX template version is blocked', () => {
  const out = executeSyntheticPipeline(structuredClone(fixture), { sourceFormat: 'XLSX', templateVersion: '9.9' });
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V012' && v.message === 'UNSUPPORTED_TEMPLATE_VERSION' && v.result === 'FAIL'));
});

test('ING-D06', 'Missing required Programme is rejected', () => {
  const x = structuredClone(fixture);
  delete x.programme;
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V001' && v.result === 'FAIL'));
});

test('ING-D07', 'Duplicate PLO code is rejected', () => {
  const x = structuredClone(fixture);
  x.plos.push(structuredClone(x.plos[0]));
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V002' && v.result === 'FAIL'));
});

test('ING-D08', 'Duplicate course code is rejected', () => {
  const x = structuredClone(fixture);
  x.courses.push(structuredClone(x.courses[0]));
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V002' && v.result === 'FAIL'));
});

test('ING-D09', 'Valid credit notation passes', () => {
  assert.equal(cleanXlsx.validations.filter((v) => v.ruleId === 'ING-V004' && v.result !== 'PASS').length, 0);
});

test('ING-D10', 'Study-plan credit mismatch is rejected', () => {
  const x = structuredClone(fixture);
  x.study_plan[0].credits = 2;
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V010' && v.message === 'STUDY_PLAN_CREDIT_MISMATCH' && v.result === 'FAIL'));
});

test('ING-D11', 'Invalid I-R-M value is rejected', () => {
  const x = structuredClone(fixture);
  x.irm[0].level = 'X';
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V008' && v.message === 'INVALID_IRM_VALUE' && v.result === 'FAIL'));
});

test('ING-D12', 'Broken PLO reference is rejected', () => {
  const x = structuredClone(fixture);
  x.irm[0].plo_code = 'PLO999';
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V006' && v.result === 'FAIL'));
});

test('ING-D13', 'Unknown study-plan course is rejected', () => {
  const x = structuredClone(fixture);
  x.study_plan[0].course_code = 'SYN9999';
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V009' && v.result === 'FAIL'));
});

test('ING-D14', 'Low-confidence extraction routes to human review', () => {
  const out = executeSyntheticPipeline(structuredClone(fixture), { confidenceOverrides: { 'COURSE.course_name_th': 'LOW' } });
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V014' && v.message === 'LOW_CONFIDENCE_EXTRACTION'));
  assert.ok(out.review.some((r) => r.reviewStatus === 'REVIEW_REQUIRED'));
});

test('ING-D15', 'Unreadable source is blocked without fabrication', () => {
  const out = executeSyntheticPipeline(structuredClone(fixture), { sourceFormat: 'PDF', readable: false });
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V013' && v.message === 'UNREADABLE_SOURCE' && v.result === 'FAIL'));
  assert.equal(out.batchStatus, 'PARTIAL_OR_BLOCKED');
});

test('ING-D16', 'Content conflict requires human reconciliation', () => {
  const canonical = [{ entityType: 'COURSE', businessKey: 'SYN1001', fields: { course_code: 'SYN1001', course_name_th: 'Existing', credit_notation: '3(2-2-5)', curriculum_version_ref: fixture.programme.curriculum_version } }];
  const out = executeSyntheticPipeline(structuredClone(fixture), { canonicalSnapshot: canonical });
  assert.ok(out.conflicts.some((c) => c.type === 'CONTENT_DIFFERENCE' && c.requiresHumanReview));
  assert.ok(out.review.some((r) => r.candidate.businessKey === 'SYN1001' && r.reviewStatus === 'REVIEW_REQUIRED'));
});

test('ING-D17', 'Same input is semantically idempotent', () => {
  const a = executeSyntheticPipeline(structuredClone(fixture), { ingestionBatchId: 'SAME', sourceDocumentId: 'SRC', sourceFormat: 'XLSX' });
  const b = executeSyntheticPipeline(structuredClone(fixture), { ingestionBatchId: 'SAME', sourceDocumentId: 'SRC', sourceFormat: 'XLSX' });
  assert.deepEqual(a.candidates, b.candidates);
  assert.deepEqual(a.validations, b.validations);
});

test('ING-D18', 'Human-review package preserves raw extraction', () => {
  const out = executeSyntheticPipeline(structuredClone(fixture));
  const course = out.review.find((r) => r.candidate.entityType === 'COURSE');
  assert.ok(course);
  assert.deepEqual(course.candidate.rawFields.course_name_th, course.candidate.fields.course_name_th);
});

test('ING-D19', 'Synthetic fixture classification remains explicit', () => {
  assert.match(fixture.classification, /SYNTHETIC TEST DATA/);
  assert.doesNotMatch(JSON.stringify(fixture), /Ramkhamhaeng University|มหาวิทยาลัยรามคำแหง/);
});

test('ING-D20', 'Parser never attempts canonical write', () => {
  for (const out of [cleanXlsx, cleanDocx, cleanPdf]) {
    assert.equal(out.canonicalWriteAttempted, false);
    assert.equal('canonicalWriter' in out, false);
  }
});

const failed = results.filter((r) => r.status === 'FAIL');
console.log(JSON.stringify({
  gate: 'HEPE-INGEST-02A',
  fixture: fixture.fixture_id,
  scope: 'NON-PRODUCTION / SYNTHETIC ONLY',
  expectedResultModel: 'Expected vs Actual with PASS/FAIL',
  testCount: results.length,
  passCount: results.length - failed.length,
  failCount: failed.length,
  canonicalWriteAttempted: cleanXlsx.canonicalWriteAttempted,
  results,
}, null, 2));

if (failed.length) process.exit(1);
