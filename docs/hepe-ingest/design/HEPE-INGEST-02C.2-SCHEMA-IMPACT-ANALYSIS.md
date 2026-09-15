# HEPE-INGEST-02C.2 — Schema Impact Analysis

Classification: **DESIGN / SPECIFICATION**  
Environment: **NON-PRODUCTION ONLY**  
Database changes: **NOT EXECUTED**

## Verified current contracts

Read-only inspection of NON-PRODUCTION Supabase project `lztxpjsuzqvtgyasfnyj` confirms:

- `programmes`: programme identity, code, titles, lifecycle status.
- `curriculum_versions`: programme version, version code/label, calendar `effective_from/effective_to`, approval/activation timestamps.
- `courses`: globally unique course code, titles, numeric `credit_value` only.
- `curriculum_courses`: concrete course FK, role, recommended year/term, order.
- `outcomes`: PLO/CLO only.
- `outcome_versions`: exact outcome statements and versioning.
- `outcome_mappings`: outcome→outcome only.
- `mapping_versions`: versioned mapping with optional I/R/M.
- `evidence_objects/evidence_versions/evidence_links`: document/evidence identity, SHA-256, source reference and governed-object linking.
- RLS is enabled on all relevant canonical contracts.

## Proposed impact by gap

| Gap | Current limitation | Proposed impact | Change class |
|---|---|---|---|
| Academic period | calendar dates cannot represent `ภาค 2/2567` directly | add academic-period entity + optional curriculum-version FK | ADDITIVE + nullable reference |
| Credit pattern | only numeric `credit_value` | add curriculum-specific offering-pattern entity | ADDITIVE |
| Course groups | no hierarchy/membership | add group + membership entities | ADDITIVE |
| Study-plan semantics | concrete course required | add study-plan entry/choice-pool entities | ADDITIVE |
| Course→PLO I-R-M | outcome→outcome only | add dedicated Course→PLO mapping contract | ADDITIVE |
| Provenance | evidence plane not field/row-level curriculum lineage | add mandatory curricular provenance binding | ADDITIVE |

## Existing semantic modifications

No existing table needs to change meaning. The design explicitly avoids redefining `outcome_mappings` or coercing study-plan placeholders into `curriculum_courses`.

Potential nullable extension to `curriculum_versions`:
- `effective_academic_period_id` reference.

This is a proposed design only, not DDL.

## Deprecated paths

No current contract is proposed for immediate deprecation. However, future import logic must stop using these shortcuts for Source-B-like curricula:

- inferring academic calendar dates from semester text;
- flattening groups into `course_role` alone;
- representing elective placeholders as fake courses;
- fabricating CLOs to achieve Course→PLO mapping.

These are prohibited future-import behaviors, not schema deletions.

## Backward compatibility risks

1. Existing read models may assume every study-plan row maps to `curriculum_courses`.
2. Existing UI may display only numeric credit values and lose raw notation.
3. Existing mapping screens may assume all mappings are outcome-to-outcome.
4. Reporting logic may derive semester from `recommended_term` without an academic-period entity.
5. Governance commands currently registered may not include create/update/verify operations for new curriculum-specific entities.

Mitigation: additive rollout, read-model versioning, synthetic compatibility regression, and no replacement of existing relations until dependent consumers are updated.

## API / read-model impact

Future APIs/read models will need projections for:
- curriculum academic period;
- raw and parsed credit pattern;
- group hierarchy and group memberships;
- study-plan entry type and choice semantics;
- Course→PLO I-R-M direct mapping;
- source provenance status.

`read_model_registry` currently supports programme/readiness/provenance families; new read models should remain SECURITY INVOKER and inherit RLS-filtered semantics.

## UI impact

Expected future UI additions:
- curriculum structure tree;
- credit notation display with raw-source toggle;
- study-plan rows capable of course/group/slot rendering;
- Course×PLO I-R-M matrix sourced from dedicated relationship;
- provenance drawer/page locator for every imported academic record;
- conflict/verification status presentation.

## RLS / security impact

New tables must not rely on authentication alone. Existing HEPE authority model separates role, authority level and scope. Proposed new entities should inherit programme and/or course scope and follow explicit authority assignments.

## Governance impact

New canonical entities would require future command contracts for prepare/review/decide/activate or import where appropriate. No authority should be inferred from ownership, authentication, AI extraction, or queue presence.

## Evidence / provenance impact

`evidence_versions.integrity_sha256` can retain document fingerprinting but does not by itself provide field-level source lineage. Curricular provenance should bind source identity + locator + candidate/verification state. Audit Evidence Admission remains separate from curriculum canonical admission.

## Reporting / AUN-QA / CPRR impact

The additive contract improves traceability for curriculum mapping, study-plan compliance and I-R-M reporting. Existing reports must not assume a source is admitted to Audit Evidence merely because curriculum data is canonical.

## Overall impact assessment

`HEPE-INGEST-02C.2 SCHEMA IMPACT = ADDITIVE-DOMINANT / CONTROLLED COMPATIBILITY WORK REQUIRED / NO CURRENT OBJECT MODIFICATION EXECUTED`