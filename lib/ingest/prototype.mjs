const COURSE_RE = /^[A-Z]{2,6}\d{4}$/;
const CREDIT_RE = /^\d+(?:\.\d+)?\(\d+(?:\.\d+)?-\d+(?:\.\d+)?-\d+(?:\.\d+)?\)$/;
const IRM = new Set(['I', 'R', 'M']);
const SUPPORTED_TEMPLATE_VERSION = '0.1';

function locatorFor(sourceFormat, entity, index = 0) {
  if (sourceFormat === 'PDF') return { pageNumber: Math.floor(index / 20) + 1, tableReference: `${entity}-TABLE`, rowReference: String(index + 1) };
  if (sourceFormat === 'DOCX') return { sectionHeading: `${entity} Section`, tableReference: `${entity}-TABLE`, rowReference: String(index + 1), paragraphReference: `P${index + 1}` };
  return { sheetName: entity, cellRange: `A${index + 2}:F${index + 2}` };
}

export function buildSyntheticCandidates(fixture, options = {}) {
  const sourceDocumentId = options.sourceDocumentId ?? `${fixture.fixture_id}-${options.sourceFormat ?? 'XLSX'}`;
  const sourceFormat = options.sourceFormat ?? 'XLSX';
  const ingestionBatchId = options.ingestionBatchId ?? `BATCH-${fixture.fixture_id}-${sourceFormat}`;
  const version = fixture.programme?.curriculum_version ?? 'UNKNOWN_VERSION';
  const candidates = [];
  const src = (locator) => ({ sourceDocumentId, ...locator });
  const add = (entityType, businessKey, fields, locator, index = 0) => {
    const confidence = Object.fromEntries(Object.keys(fields ?? {}).map((k) => [k, options.confidenceOverrides?.[`${entityType}.${k}`] ?? 'HIGH']));
    candidates.push({
      candidateId: `${ingestionBatchId}:${entityType}:${businessKey}:${candidates.length + 1}`,
      ingestionBatchId,
      entityType,
      businessKey,
      fields: { ...(fields ?? {}), curriculum_version_ref: version },
      rawFields: { ...(fields ?? {}) },
      sourceRef: src(locator ?? locatorFor(sourceFormat, entityType, index)),
      sourceFormat,
      confidence,
      verificationStatus: 'EXTRACTED',
    });
  };

  if (fixture.programme) {
    add('PROGRAMME', fixture.programme.programme_code ?? 'UNKNOWN_PROGRAMME', fixture.programme, undefined, 0);
    add('CURRICULUM_VERSION', version, { version_label: version }, undefined, 0);
  }
  (fixture.plos ?? []).forEach((p, i) => add('PLO', p.plo_code, p, undefined, i));
  (fixture.courses ?? []).forEach((c, i) => add('COURSE', c.course_code, c, undefined, i));
  (fixture.irm ?? []).forEach((m, i) => add('IRM', `${m.course_code}:${m.plo_code}`, { course_code: m.course_code, plo_code: m.plo_code, irm_level: m.level }, undefined, i));
  (fixture.study_plan ?? []).forEach((s, i) => add('STUDY_PLAN_ITEM', `${s.year}:${s.semester}:${s.course_code}`, s, undefined, i));
  return candidates;
}

export function validatePrototype(candidates, options = {}) {
  const results = [];
  const push = (c, ruleId, result, severity, message, fieldName, expectedCondition, actualValue) => results.push({ ruleId, candidateId: c.candidateId, fieldName, expectedCondition, actualValue, severity, result, message });

  if (options.sourceFormat === 'XLSX' && options.templateVersion && options.templateVersion !== SUPPORTED_TEMPLATE_VERSION) {
    results.push({ ruleId: 'ING-V012', candidateId: 'BATCH', fieldName: 'template_version', expectedCondition: `template version ${SUPPORTED_TEMPLATE_VERSION}`, actualValue: options.templateVersion, severity: 'CRITICAL', result: 'FAIL', message: 'UNSUPPORTED_TEMPLATE_VERSION' });
  }
  if (options.readable === false) {
    results.push({ ruleId: 'ING-V013', candidateId: 'BATCH', expectedCondition: 'source is structurally readable', actualValue: false, severity: 'CRITICAL', result: 'FAIL', message: 'UNREADABLE_SOURCE' });
  }
  const programmeCandidates = candidates.filter((c) => c.entityType === 'PROGRAMME');
  if (programmeCandidates.length === 0) {
    results.push({ ruleId: 'ING-V001', candidateId: 'BATCH', fieldName: 'programme', expectedCondition: 'required programme record exists', actualValue: null, severity: 'CRITICAL', result: 'FAIL', message: 'REQUIRED_FIELD_MISSING' });
  }

  for (const c of candidates) {
    const r = c.sourceRef ?? {};
    const provenanceOk = Boolean(r.sourceDocumentId && (r.pageNumber !== undefined || r.tableReference || r.sheetName || r.cellRange || r.paragraphReference || r.sectionHeading));
    push(c, 'ING-V011', provenanceOk ? 'PASS' : 'FAIL', 'CRITICAL', provenanceOk ? 'Provenance locator present' : 'PROVENANCE_INCOMPLETE', undefined, 'source provenance locator is present', r);

    if (Object.values(c.confidence ?? {}).some((v) => v === 'LOW')) {
      push(c, 'ING-V014', 'WARNING', 'MAJOR', 'LOW_CONFIDENCE_EXTRACTION', undefined, 'no field has LOW confidence', c.confidence);
    }

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
    const course = candidates.find((x) => x.entityType === 'COURSE' && x.businessKey === c.fields.course_code);
    if (course) {
      const expectedCredits = Number(String(course.fields.credit_notation ?? '0').split('(')[0]);
      const actualCredits = Number(c.fields.credits);
      push(c, 'ING-V010', expectedCredits === actualCredits ? 'PASS' : 'FAIL', 'MAJOR', expectedCredits === actualCredits ? 'Study-plan credit matches' : 'STUDY_PLAN_CREDIT_MISMATCH', 'credits', 'study-plan credit equals course credit', actualCredits);
    }
  }
  return results;
}

export function detectPrototypeConflicts(candidates, canonicalSnapshot = []) {
  const conflicts = [];
  for (const c of candidates) {
    const existing = canonicalSnapshot.find((x) => x.entityType === c.entityType && x.businessKey === c.businessKey);
    if (!existing) continue;
    const existingFields = JSON.stringify(existing.fields ?? {});
    const incomingFields = JSON.stringify(c.fields ?? {});
    if (existingFields !== incomingFields) conflicts.push({ conflictId: `ING-C003:${c.candidateId}`, type: 'CONTENT_DIFFERENCE', candidateId: c.candidateId, severity: 'CRITICAL', details: 'Incoming candidate differs from controlled comparison snapshot', requiresHumanReview: true });
  }
  return conflicts;
}

export function buildReviewPackage(candidates, validations, conflicts = []) {
  const byCandidate = new Map();
  for (const v of validations) byCandidate.set(v.candidateId, [...(byCandidate.get(v.candidateId) ?? []), v]);
  const conflictCandidates = new Set(conflicts.map((c) => c.candidateId));
  return candidates.map((c) => {
    const issues = (byCandidate.get(c.candidateId) ?? []).filter((v) => v.result !== 'PASS');
    const critical = issues.some((i) => i.severity === 'CRITICAL');
    const lowConfidence = issues.some((i) => i.message === 'LOW_CONFIDENCE_EXTRACTION');
    return { candidate: c, issues, reviewStatus: critical || lowConfidence || conflictCandidates.has(c.candidateId) ? 'REVIEW_REQUIRED' : 'READY_FOR_HUMAN_VERIFICATION' };
  });
}

export function executeSyntheticPipeline(fixture, options = {}) {
  const sourceFormat = options.sourceFormat ?? 'XLSX';
  const candidates = buildSyntheticCandidates(fixture, options);
  const validations = validatePrototype(candidates, { ...options, sourceFormat });
  const conflicts = detectPrototypeConflicts(candidates, options.canonicalSnapshot ?? []);
  const review = buildReviewPackage(candidates, validations, conflicts);
  return {
    ingestionBatchId: candidates[0]?.ingestionBatchId ?? `BATCH-${fixture.fixture_id}-${sourceFormat}`,
    sourceDocumentId: options.sourceDocumentId ?? `${fixture.fixture_id}-${sourceFormat}`,
    sourceFormat,
    candidates,
    validations,
    conflicts,
    review,
    batchStatus: validations.some((v) => v.result === 'FAIL') ? 'PARTIAL_OR_BLOCKED' : 'EXTRACTED',
    canonicalWriteAttempted: false,
  };
}
