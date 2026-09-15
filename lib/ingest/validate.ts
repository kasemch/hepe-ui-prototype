import type { CandidateRecord, ValidationResult } from './types';

const IRM_VALUES = new Set(['I', 'R', 'M']);

export function validateCandidates(candidates: CandidateRecord[]): ValidationResult[] {
  const results: ValidationResult[] = [];

  const push = (result: ValidationResult) => results.push(result);

  for (const c of candidates) {
    push({
      ruleId: 'ING-V011',
      candidateId: c.candidateId,
      expectedCondition: 'source provenance locator is present',
      actualValue: c.sourceRef,
      severity: 'CRITICAL',
      result: hasSourceLocator(c) ? 'PASS' : 'FAIL',
      message: hasSourceLocator(c) ? 'Provenance locator present' : 'PROVENANCE_INCOMPLETE',
    });

    if (c.entityType === 'COURSE') {
      const code = String(c.fields.course_code ?? c.businessKey ?? '');
      const notation = String(c.fields.credit_notation ?? '');
      push({
        ruleId: 'ING-V003',
        candidateId: c.candidateId,
        fieldName: 'course_code',
        expectedCondition: 'course code matches /^[A-Z]{2,6}\\d{4}$/',
        actualValue: code,
        severity: 'MAJOR',
        result: /^[A-Z]{2,6}\d{4}$/.test(code) ? 'PASS' : 'FAIL',
        message: /^[A-Z]{2,6}\d{4}$/.test(code) ? 'Course code valid' : 'INVALID_COURSE_CODE',
      });
      push({
        ruleId: 'ING-V004',
        candidateId: c.candidateId,
        fieldName: 'credit_notation',
        expectedCondition: 'credit notation matches N(L-P-S)',
        actualValue: notation,
        severity: 'MAJOR',
        result: /^\d+(?:\.\d+)?\(\d+(?:\.\d+)?-\d+(?:\.\d+)?-\d+(?:\.\d+)?\)$/.test(notation) ? 'PASS' : 'FAIL',
        message: /^\d+(?:\.\d+)?\(\d+(?:\.\d+)?-\d+(?:\.\d+)?-\d+(?:\.\d+)?\)$/.test(notation)
          ? 'Credit notation valid'
          : 'INVALID_CREDIT_NOTATION',
      });
    }

    if (c.entityType === 'IRM') {
      const value = String(c.fields.irm_level ?? '');
      push({
        ruleId: 'ING-V008',
        candidateId: c.candidateId,
        fieldName: 'irm_level',
        expectedCondition: 'I, R or M',
        actualValue: value,
        severity: 'CRITICAL',
        result: IRM_VALUES.has(value) ? 'PASS' : 'FAIL',
        message: IRM_VALUES.has(value) ? 'I-R-M value valid' : 'INVALID_IRM_VALUE',
      });
    }
  }

  const scopedKeys = new Map<string, CandidateRecord[]>();
  for (const c of candidates.filter((x) => ['PLO', 'COURSE'].includes(x.entityType))) {
    const scope = String(c.fields.curriculum_version_ref ?? 'UNSCOPED');
    const key = `${scope}:${c.entityType}:${c.businessKey}`;
    const list = scopedKeys.get(key) ?? [];
    list.push(c);
    scopedKeys.set(key, list);
  }

  for (const [key, list] of scopedKeys) {
    if (list.length < 2) continue;
    for (const c of list) {
      push({
        ruleId: 'ING-V002',
        candidateId: c.candidateId,
        expectedCondition: 'business key unique within curriculum version',
        actualValue: key,
        severity: 'CRITICAL',
        result: 'FAIL',
        message: 'DUPLICATE_BUSINESS_KEY',
      });
    }
  }

  return results;
}

function hasSourceLocator(c: CandidateRecord): boolean {
  const r = c.sourceRef;
  return Boolean(
    r.sourceDocumentId &&
      (r.pageNumber !== undefined ||
        r.tableReference ||
        r.sheetName ||
        r.cellRange ||
        r.paragraphReference ||
        r.sectionHeading),
  );
}
