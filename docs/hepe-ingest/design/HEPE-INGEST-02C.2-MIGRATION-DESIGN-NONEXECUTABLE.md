# HEPE-INGEST-02C.2 — Migration Design

**DO NOT EXECUTE**  
**NON-PRODUCTION DESIGN ONLY**  
**SCHEMA MODIFICATION NOT AUTHORIZED**

Classification: **DESIGN / SPECIFICATION**

## Objective

Define a future migration sequence that can extend HEPE losslessly while preserving current data, RLS, authority boundaries and rollback capability. This document intentionally contains no executable SQL.

## Stage 0 — PRECHECK

Future gate must capture:
- target branch/commit SHA;
- Supabase project ID and environment proof;
- current schema fingerprint/migration version;
- row counts for affected contracts;
- existing RLS-policy inventory;
- current authority-assignment counts;
- synthetic fixture identity;
- Source-B SHA-256 and candidate manifest.

Abort on production target, unresolved schema drift, unknown migration ancestry or missing rollback snapshot.

## Stage 1 — ADDITIVE STRUCTURES

Proposed future structures, subject to explicit authorization:
- curriculum academic periods;
- curriculum course offering/credit patterns;
- curriculum course groups;
- curriculum course-group memberships;
- study-plan choice pools;
- study-plan entries;
- curriculum Course→PLO mappings;
- curricular provenance bindings;
- nullable academic-period binding on curriculum version if approved.

No destructive rename/drop is required for the first implementation.

## Stage 2 — INDEX / CONSTRAINT DESIGN

Future constraints should cover:
- programme/curriculum version scoping;
- current Course→PLO uniqueness;
- I/R/M controlled values;
- study-plan entry-kind/reference consistency;
- group parent same-curriculum invariant;
- source SHA-256 format where supplied;
- required source locator/provenance for imported records;
- choice-pool references remaining within one curriculum version.

Indexes should prioritize programme/curriculum/course/PLO lookup and provenance lookup. Exact index choice requires query-plan evidence in the implementation gate.

## Stage 3 — RLS POLICY DESIGN

New entities must be RLS-enabled before any non-service client access. Proposed policy matrix is maintained separately in `HEPE-INGEST-02C.2-RLS-IMPACT-DESIGN.md`.

No policy is created in this gate.

## Stage 4 — EXISTING-DATA COMPATIBILITY

Because the proposed design is additive, existing canonical rows should remain unchanged. Future tests must verify:
- existing read models continue to operate;
- existing outcome mappings retain meaning;
- existing curriculum_courses remain valid;
- no historical record is silently backfilled with inferred values.

Any backfill must be a separate controlled operation with provenance and expected/actual results.

## Stage 5 — SYNTHETIC BACKFILL TEST

On a future authorized non-production schema branch:
1. load synthetic curriculum fixture;
2. populate new structures only from explicit synthetic source values;
3. round-trip raw credit notation, group hierarchy, choice slots and I-R-M;
4. exercise duplicate/idempotency behavior;
5. exercise conflict and NOT_FOUND behavior;
6. verify rollback.

Synthetic test results become Test / Regression Evidence only when expected, actual and PASS/FAIL are recorded.

## Stage 6 — REAL SOURCE DRY-RUN

Source-B may be processed in **dry-run/candidate mode only** until a separate canonical-write authorization exists. Required comparison:
- 92 course representation;
- 7 PLO statements;
- controlled Course→PLO pairs;
- curriculum groups/subgroups;
- 54 study-plan rows;
- academic period;
- source/page provenance.

No canonical row write is implied by successful dry-run.

## Stage 7 — REGRESSION

Execute future C01–C24 acceptance specification. Mandatory categories:
- lossless semantics;
- provenance integrity;
- scope/RLS negative tests;
- idempotency/conflict handling;
- rollback;
- production exclusion.

## Stage 8 — ROLLBACK PLAN

Future migration must be reversible without deleting pre-existing canonical data. Rollback design must specify:
- schema rollback order respecting FKs;
- pre-migration snapshot/fingerprint;
- cleanup of only test/import-batch records created by the gate;
- post-rollback row/schema verification;
- explicit residual check.

If rollback requires destructive treatment of pre-existing rows, STOP and reopen design review.

## Stage 9 — HUMAN APPROVAL

Before execution, a human authority decision must explicitly authorize:
- non-production schema modification;
- exact migration artifact/hash;
- RLS policy artifact/hash;
- target project/environment;
- synthetic migration test;
- rollback scope.

Approval of this design document alone is not execution authorization.

## Stage 10 — FUTURE EXECUTION

Only after separate HEPE-INGEST-02D authorization may DDL/migration/RLS be executed. Production remains excluded unless separately and explicitly authorized.

## Current disposition

`MIGRATION DESIGN = COMPLETE FOR HUMAN REVIEW / NON-EXECUTABLE / NOT TEST EVIDENCE`