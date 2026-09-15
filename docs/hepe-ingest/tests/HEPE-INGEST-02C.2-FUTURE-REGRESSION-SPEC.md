# HEPE-INGEST-02C.2 — Future Regression Specification

Classification: **TEST SPECIFICATION — NOT TEST EVIDENCE**  
Environment target: **NON-PRODUCTION ONLY**  
Execution: **NOT AUTHORIZED IN THIS GATE**

## Purpose

Define mandatory acceptance assertions for a future authorized HEPE-INGEST-02D schema-extension and lossless-regression gate.

| ID | Expected assertion |
|---|---|
| C01 | Programme code `25510071103503` is preserved exactly. |
| C02 | Total programme credits remain `151`. |
| C03 | All 92 controlled courses are representable without semantic loss. |
| C04 | Raw credit patterns round-trip exactly, including patterns such as `3(3-0-6)` and `3(2-2-5)`. |
| C05 | All controlled course groups/subgroups are representable with hierarchy and rules preserved. |
| C06 | Concrete-course study-plan entries round-trip correctly. |
| C07 | Choice/elective/requirement slots round-trip without fake course creation. |
| C08 | PLO1–PLO7 exact controlled wording is preserved. |
| C09 | All approved Course→PLO I-R-M relationships are representable without CLO fabrication. |
| C10 | I/R/M value survives round-trip unchanged. |
| C11 | `ภาคการศึกษาที่ 2 ปีการศึกษา 2567` survives round-trip without invented Gregorian date. |
| C12 | Every canonical candidate retains Source-B provenance to document and source locator. |
| C13 | Source-B SHA-256 remains bound: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`. |
| C14 | No cross-programme contamination occurs. |
| C15 | No existing canonical record is silently overwritten. |
| C16 | Duplicate import/candidate replay is idempotent. |
| C17 | Conflicting source is classified CONFLICT / HUMAN REVIEW rather than silently resolved. |
| C18 | NOT_FOUND remains NOT_FOUND; parser/importer fabricates no value. |
| C19 | Unauthorized persona cannot write proposed canonical entities. |
| C20 | Cross-programme authority cannot mutate target-programme records without explicit assignment. |
| C21 | Evidence Admission remains a separate decision. |
| C22 | Canonical curriculum import does not automatically become Audit Evidence admission. |
| C23 | Rollback restores verified pre-migration schema/data state and leaves no residual test rows. |
| C24 | No Production resource is touched. |

## Test evidence requirement

When executed in a future gate, every assertion must record:
- test ID and scope;
- fixture/source identity;
- expected result;
- actual result;
- PASS/FAIL;
- timestamp;
- code/schema/migration SHA;
- environment proof;
- cleanup/rollback status where applicable.

Without actual execution, this document remains TEST SPECIFICATION only.

## Mandatory failure behavior

Any C01–C24 failure prevents schema/import gate closure. C12/C13/C14/C18/C19/C20/C21/C22/C23/C24 are governance/security critical and cannot be waived through AI recommendation or conversation-only approval.