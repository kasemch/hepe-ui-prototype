const COURSE_RE = /^[A-Z]{2,6}\d{4}$/;
const CREDIT_RE = /^\d+(?:\.\d+)?\(\d+(?:\.\d+)?-\d+(?:\.\d+)?-\d+(?:\.\d+)?\)$/;
const IRM = new Set(['I', 'R', 'M']);

export function buildSyntheticCandidates(fixture, options = {}) {
  const sourceDocumentId = options.sourceDocumentId ?? fixture.fixture_id;
  const sourceFormat = options.sourceFormat ?? 'XLSX';
  const ingestionBatchId = options.ingestionBatchId ?? `BATCH-${fixture.fixture_id}`;
  const version = fixture.programme.curriculum_version;
  const candidates = [];
  const src = (locator) => ({ sourceDocumentId, ...locator });
  const add = (entityType, businessKey, fields, locator) => candidates.push({
    candidateId: `${ingestionBatchId}:${entityType}:${businessKey}:${candidates.length + 1}`,
    ingestionBatchId,
    entityType,
    businessKey,
    fields: { ...fields, curriculum_version_ref: version },
    rawFields: { ...fields },
    sourceRef: src(locator),
    sourceFormat,
    confidence: Object.fromEntries(Object.keys(fields).map((k) => [k, 'HIGH'])),
    verificationStatus: 'EXTRACTED',
  });

  add('PROGRAMME', fixture.programme.programme_code, fixture.programme, { sheetName: 'Programme', cellRange: 'A2:E2' });
  add('CURRICULUM_VERSION', version, { version_label: version }, { sheetName: 'Programme', cellRange: 'D2' });
  fixture.plos.forEach((p, i) => add('PLO', p.plo_code, p, { sheetName: 'PLO', cellRange: `A${i + 2}:B${i + 2}` }));
  fixture.courses.forEach((c, i) => add('COURSE', c.course_code, c, { sheetName: 'Course', cellRange: `A${i + 2}:C${i + 2}` }));
  fixture.irm.forEach((m, i) => add('IRM', `${m.course_code}:${m.plo_code}`, { course_code: m.course_code, plo_code: m.plo_code, irm_level: m.level }, { sheetName: 'IRM', cellRange: `A${i + 2}:C${i + 2}` }));
  fixture.study_plan.forEach((s, i) => add('STUDY_PLAN_ITEM', `${s.year}:${s.semester}:${s.course_code}`, s, { sheetName: 'StudyPlan', cellRange: `A${i + 2}:D${i + 2}` }));
  return candidates;
}

export function validatePrototype(candidates) {
  const results = [];
  const push = (c, ruleId, result, severity, message, fieldName, expectedCondition, actualValue) => results.push({
    ruleId, candidateId: c.candidateId, fieldName, expectedCondition, actualValue, severity, result, message,
  });

  for (const c of candidates) {
    const r = c.sourceRef ?? {};
    const provenanceOk = Boolean(r.sourceDocumentId && (r.pageNumber !== undefined || r.tableReference || r.sheetName || r.cellRange || r.paragraphReference || r.sectionHeading));
    push(c, 'ING-V011', provenanceOk ? 'PASS' : 'FAIL', 'CRITICAL', provenanceOk ? 'Provenance locator present' : 'PROVENANCE_INCOMPLETE', undefined, 'source provenance locator is present', r);

    if (c.entityType === 'COURSE') {
      const code = String(c.fields.course_code ?? c.businessKey ?? '');
      const notation = String(c.fields.credit_notation ?? '');
      push(c, 'ING-V003', COURSE_RE.test(code) ? 'PASS' : 'FAIL', 'MAJOR', COURSE_RE.test(code) ? 'Course code valid' : 'INVALID_COURSE_CODE', 'course_code', 'course code matches controlled pattern', code);
      push(c, 'ING-V004', CREDIT_RE.test(notation) ? 'PASS' : 'FAIL', 'MAJOR', CREDIT_RE.test(notation) ? 'Credit notation valid' : 'INVALID_CREDIT_NOTATION', 'credit_notation', 'credit notation matches N(L-P-S)', notation);
    }

    if (c.entityType === 'IRM') {
      const value = String(c.fields.irm_level ?? '');
      push(c, 'ING-V008', IRM.has(value) ? 'PASS' : 'FAIL', 'CRITICAL', IRM.has(value) ? 'I-R-M value valid' : 'INVALID_IRM_VALUE', 'irm_level', 'I, R or M', value);
    }
  }

  const keys = new Map();
  for (const c of candidates.filter((x) => ['PLO', 'COURSE'].includes(x.entityType))) {
    const key = `${c.fields.curriculum_version_ref}:${c.entityType}:${c.businessKey}`;
    keys.set(key, [...(keys.get(key) ?? []), c]);
  }
  for (const [key, list] of keys) {
    if (list.length < 2) continue;
    for (const c of list) push(c, 'ING-V002', 'FAIL', 'CRITICAL', 'DUPLICATE_BUSINESS_KEY', undefined, 'business key unique within curriculum version', key);
  }

  const courseCodes = new Set(candidates.filter((c) => c.entityType === 'COURSE').map((c) => c.businessKey));
  const ploCodes = new Set(candidates.filter((c) => c.entityType === 'PLO').map((c) => c.businessKey));
  for (const c of candidates.filter((x) => x.entityType === 'IRM')) {
    const courseOk = courseCodes.has(String(c.fields.course_code));
    const ploOk = ploCodes.has(String(c.fields.plo_code));
    push(c, 'ING-V007', courseOk ? 'PASS' : 'FAIL', 'CRITICAL', courseOk ? 'Course reference exists' : 'MISSING_COURSE_REFERENCE', 'course_code', 'referenced course exists', c.fields.course_code);
    push(c, 'ING-V006', ploOk ? 'PASS' : 'FAIL', 'CRITICAL', ploOk ? 'PLO reference exists' : 'MISSING_PLO_REFERENCE', 'plo_code', 'referenced PLO exists', c.fields.plo_code);
  }
  for (const c of candidates.filter((x) => x.entityType === 'STUDY_PLAN_ITEM')) {
    const ok = courseCodes.has(String(c.fields.course_code));
    push(c, 'ING-V009', ok ? 'PASS' : 'FAIL', 'CRITICAL', ok ? 'Study-plan course exists' : 'UNKNOWN_STUDY_PLAN_COURSE', 'course_code', 'study-plan course exists', c.fields.course_code);
  }
  return results;
}

export function buildReviewPackage(candidates, validations) {
  const byCandidate = new Map();
  for (const v of validations) byCandidate.set(v.candidateId, [...(byCandidate.get(v.candidateId) ?? []), v]);
  return candidates.map((c) => {
    const issues = (byCandidate.get(c.candidateId) ?? []).filter((v) => v.result !== 'PASS');
    return { candidate: c, issues, reviewStatus: issues.some((i) => i.severity === 'CRITICAL') ? 'REVIEW_REQUIRED' : 'READY_FOR_HUMAN_VERIFICATION' };
  });
}

export function executeSyntheticPipeline(fixture, options = {}) {
  const candidates = buildSyntheticCandidates(fixture, options);
  const validations = validatePrototype(candidates);
  const review = buildReviewPackage(candidates, validations);
  return {
    ingestionBatchId: candidates[0]?.ingestionBatchId ?? `BATCH-${fixture.fixture_id}`,
    sourceDocumentId: options.sourceDocumentId ?? fixture.fixture_id,
    sourceFormat: options.sourceFormat ?? 'XLSX',
    candidates,
    validations,
    conflicts: [],
    review,
    canonicalWriteAttempted: false,
  };
}
