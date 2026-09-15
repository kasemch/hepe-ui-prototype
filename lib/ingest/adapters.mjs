function baseLocator(sourceFormat, index, entity) {
  if (sourceFormat === 'PDF') {
    return { pageNumber: Math.floor(index / 20) + 1, tableReference: `${entity}-TABLE`, rowReference: String(index + 1) };
  }
  if (sourceFormat === 'DOCX') {
    return { sectionHeading: `${entity} Section`, tableReference: `${entity}-TABLE`, rowReference: String(index + 1), paragraphReference: `P${index + 1}` };
  }
  return { sheetName: entity, cellRange: `A${index + 2}:F${index + 2}` };
}

export function adaptSyntheticSource(fixture, sourceFormat) {
  if (!['PDF', 'DOCX', 'XLSX'].includes(sourceFormat)) throw new Error('UNSUPPORTED_SOURCE_FORMAT');
  const sourceDocumentId = `${fixture.fixture_id}-${sourceFormat}`;
  const records = [];
  const push = (entityType, businessKey, fields, index = 0) => {
    records.push({ entityType, businessKey, fields: structuredClone(fields), locator: baseLocator(sourceFormat, index, entityType) });
  };

  push('PROGRAMME', fixture.programme.programme_code, fixture.programme);
  push('CURRICULUM_VERSION', fixture.programme.curriculum_version, { version_label: fixture.programme.curriculum_version });
  fixture.plos.forEach((p, i) => push('PLO', p.plo_code, p, i));
  fixture.courses.forEach((c, i) => push('COURSE', c.course_code, c, i));
  fixture.irm.forEach((m, i) => push('IRM', `${m.course_code}:${m.plo_code}`, { course_code: m.course_code, plo_code: m.plo_code, irm_level: m.level }, i));
  fixture.study_plan.forEach((s, i) => push('STUDY_PLAN_ITEM', `${s.year}:${s.semester}:${s.course_code}`, s, i));

  return { sourceDocumentId, sourceFormat, records };
}

export function semanticProjection(batch) {
  return batch.candidates.map((c) => ({
    entityType: c.entityType,
    businessKey: c.businessKey,
    fields: c.fields,
  }));
}
