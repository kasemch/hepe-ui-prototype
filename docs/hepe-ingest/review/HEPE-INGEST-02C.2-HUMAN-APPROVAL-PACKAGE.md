# HEPE-INGEST-02C.2 — Canonical Contract Change Review Package

Classification: **CONTROLLED REVIEW RECORD CANDIDATE / DESIGN PACKAGE**  
Environment: **NON-PRODUCTION ONLY**  
Schema/data execution: **NOT AUTHORIZED / NOT ATTEMPTED**

## 1. Executive summary

Source-B has been binary-verified and same-parser reconciliation is closed. Current HEPE canonical contracts cannot represent the curriculum losslessly. HEPE-INGEST-02C.2 therefore develops an additive canonical contract design, schema-impact analysis, non-executable migration design, RLS impact design and future regression specification. No database/schema/RLS/IAM/production write was performed.

Recommendation: proceed only through a separately authorized **HEPE-INGEST-02D — NON-PRODUCTION Schema Extension, RLS Implementation, Synthetic Migration & Lossless Regression Gate**.

## 2. Current verified state

- PR #30: open, draft, not merged.
- Target branch: `feat/hepe-ingest-02b-real-readonly`.
- NON-PRODUCTION Supabase schema inspected read-only.
- Existing relevant tables are RLS-enabled.
- `curriculum_versions`, `courses`, `curriculum_courses`, `outcomes`, `outcome_versions`, `outcome_mappings`, `mapping_versions`, `evidence_objects`, `evidence_versions`, `evidence_links` retain the limitations documented in HEPE-INGEST-02C.

## 3. Source-B identity

- Google Drive file ID: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- 157 physical pages
- 6,796,526 bytes
- SHA-256 `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Programme code `25510071103503`
- 151 credits
- Effective period: `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`
- University Council meeting 6/2567, agenda 5.13, 13 May 2567

## 4. Current contract gaps

1. raw credit patterns are not canonical;
2. curriculum group/subgroup hierarchy is absent;
3. study-plan choice/elective/requirement placeholders cannot be represented losslessly by concrete course FK;
4. Course→PLO I-R-M has no first-class relationship;
5. academic-semester effectiveness is not equivalent to calendar date;
6. field/row-level curricular provenance is not fully modeled.

## 5. Proposed entities / relationships

- CurriculumAcademicPeriod
- CourseOfferingPattern
- CurriculumCourseGroup
- CurriculumCourseGroupMembership
- StudyPlanChoicePool
- StudyPlanEntry
- CurriculumCoursePloMapping
- CurricularProvenanceBinding

All are additive by design. Existing `outcome_mappings` remains outcome→outcome.

## 6. Existing vs proposed contract comparison

Current HEPE supports programme/course identities, outcome versioning, outcome-to-outcome mappings and evidence document integrity. Proposed additions preserve missing curriculum-specific semantics without redefining those existing contracts.

## 7. Schema impact

Impact is additive-dominant. A nullable academic-period reference on curriculum version may be required. No current table meaning should be changed. Compatibility work is required for read models, APIs and UI that currently assume concrete-course-only study plans or outcome-only mappings.

## 8. API / read-model impact

Future versioned read contracts should expose academic period, raw credit notation, curriculum group tree, study-plan entry kind, Course→PLO I-R-M and curricular provenance. Security-invoker behavior and RLS filtering must be preserved.

## 9. RLS / security impact

New entities must derive programme/course scope and use explicit active authority assignments. Authentication alone grants no write authority. Course preparers are limited to authorized course scope; programme-structure entities require programme-level preparation authority; reviewers need independent assignments and COI clearance; cross-programme access denies unless explicitly assigned.

## 10. UI impact

Future UI should support:
- hierarchical curriculum structure;
- raw/normalized credit notation;
- mixed study-plan entries (course/group/slot);
- dedicated Course×PLO I-R-M matrix;
- provenance/source locator inspection;
- conflict and verification status.

## 11. Evidence / provenance impact

Document SHA-256 may be retained in the evidence plane, but canonical curricular rows require source locator + candidate + verification lineage. Canonical curriculum admission and Audit Evidence Admission remain separate decisions.

## 12. Migration design

Planned sequence:
`PRECHECK → ADDITIVE STRUCTURES → INDEX/CONSTRAINT DESIGN → RLS DESIGN → EXISTING-DATA COMPATIBILITY → SYNTHETIC BACKFILL TEST → REAL SOURCE DRY-RUN → REGRESSION → ROLLBACK → HUMAN APPROVAL → FUTURE EXECUTION`.

No executable migration SQL was created or sent to Supabase.

## 13. Rollback design

A future implementation must snapshot schema/row state before change, create additive structures in dependency order, tag all synthetic/import-test records, remove only gate-created artifacts on rollback, reverse new structures in FK-safe order, and verify exact pre-gate schema/data/authority state. Rollback that would destroy pre-existing data is a stop condition.

## 14. Future regression matrix

C01–C24 is maintained in `docs/hepe-ingest/tests/HEPE-INGEST-02C.2-FUTURE-REGRESSION-SPEC.md`. These are unexecuted test specifications and are not Test Evidence.

## 15. Risks

- semantic duplication between old and new read paths;
- incomplete RLS propagation to new entities;
- UI/API assumptions tied to concrete course rows;
- accidental conflation of canonical admission with evidence admission;
- provenance binding that is document-level but insufficiently field-level;
- unsafe backfill through inference.

## 16. Unresolved questions requiring implementation-gate resolution

- exact physical table names and whether some entities should be grouped under a versioned curriculum-structure aggregate;
- exact command registry entries for prepare/review/activate/import operations;
- read-model versioning strategy;
- whether provenance is polymorphic binding vs entity-specific columns;
- query/index choices based on measured query plans;
- exact RLS predicates/RPC boundary after synthetic NAT tests.

These are implementation design decisions, not source-content conflicts.

## 17. Explicit authorization boundaries

This package does **not** authorize:
- Supabase DDL/migration;
- canonical curriculum write/import;
- RLS/IAM modification;
- authority grant/revoke;
- production action;
- secret handling changes;
- Audit Evidence admission;
- PR ready/merge/retarget.

## 18. Recommendation for next gate

Recommended next human decision:

`AUTHORIZE / HOLD HEPE-INGEST-02D — NON-PRODUCTION SCHEMA EXTENSION, RLS IMPLEMENTATION, SYNTHETIC MIGRATION & LOSSLESS REGRESSION GATE`

If authorized, the decision must explicitly name the NON-PRODUCTION Supabase project, exact migration/design artifact revision, RLS scope, synthetic-only write scope, rollback requirement, and no-production boundary.

## Gate disposition

`HEPE-INGEST-02C.2 — DESIGN / CONTRACT REVIEW COMPLETE / READY FOR HUMAN SCHEMA MODIFICATION DECISION`

`HEPE-INGEST-02C — REMAINS HOLD FOR CANONICAL IMPORT`

Conversation remains CONTEXT and is not Audit Evidence.