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

const clean = executeSyntheticPipeline(structuredClone(fixture), { sourceFormat: 'XLSX' });

test('ING-D01', 'Valid synthetic XLSX logical source produces candidates', () => {
  assert.ok(clean.candidates.length > 0);
  assert.equal(clean.validations.filter((v) => v.result === 'FAIL').length, 0);
});

test('ING-D03', 'Synthetic source preserves provenance locators', () => {
  assert.equal(clean.validations.filter((v) => v.ruleId === 'ING-V011' && v.result !== 'PASS').length, 0);
});

test('ING-D08', 'Duplicate course code is rejected', () => {
  const x = structuredClone(fixture);
  x.courses.push(structuredClone(x.courses[0]));
  const out = executeSyntheticPipeline(x);
  assert.ok(out.validations.some((v) => v.ruleId === 'ING-V002' && v.result === 'FAIL'));
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

test('ING-D14', 'Critical validation issue routes record to human review', () => {
  const x = structuredClone(fixture);
  x.irm[0].level = 'X';
  const out = executeSyntheticPipeline(x);
  assert.ok(out.review.some((r) => r.reviewStatus === 'REVIEW_REQUIRED'));
});

test('ING-D17', 'Same input is semantically idempotent', () => {
  const a = executeSyntheticPipeline(structuredClone(fixture), { ingestionBatchId: 'SAME', sourceDocumentId: 'SRC' });
  const b = executeSyntheticPipeline(structuredClone(fixture), { ingestionBatchId: 'SAME', sourceDocumentId: 'SRC' });
  assert.deepEqual(a.candidates, b.candidates);
  assert.deepEqual(a.validations, b.validations);
});

test('ING-D20', 'Parser never attempts canonical write', () => {
  assert.equal(clean.canonicalWriteAttempted, false);
  assert.equal('canonicalWriter' in clean, false);
});

test('ING-X01', 'Clean fixture is explicitly synthetic', () => {
  assert.match(fixture.classification, /SYNTHETIC TEST DATA/);
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
  canonicalWriteAttempted: clean.canonicalWriteAttempted,
  results,
}, null, 2));

if (failed.length) process.exit(1);
