# HEPE-REC-INGEST-02D2-COURSE-COUNT-01

Status: **CLOSED — SOURCE-SECTION COUNT RECONCILED**
Environment: **NON-PRODUCTION**
Date: 2026-09-11

## Scope
Resolve the apparent ambiguity caused by repeated course codes across the 157-page Source-B PDF without treating global PDF code uniqueness as curriculum-course identity.

## Controlled source identity
- Source-B SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Physical pages: 157
- Programme code: `25510071103503`

## Section-aware result
The parser now limits the curriculum-course population to the controlled `กระบวนวิชาตามโครงสร้างของหลักสูตร / รายวิชาตามโครงสร้างหลักสูตร` source section on physical PDF pages 15–21.

Result:
- raw course-code occurrences in structural section through physical page 21: 114
- unique normalized course codes: **92**
- comparison reference COURSE dataset: **92**
- difference: **0**

The repeated codes after the structural section belong to study-plan, descriptions, prerequisites, mappings, appendices or comparison material and are not counted as additional curriculum courses.

## Disposition
`C03 course population reconciliation = PASS for controlled source count / namespace coverage`.

This does not by itself prove that all 92 records have completed database round-trip with every field and provenance assertion. Those remain part of HEPE-INGEST-02D.2 full round-trip validation.

Conversation is context only and is not Audit Evidence.