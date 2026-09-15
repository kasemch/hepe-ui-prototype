# HEPE-INGEST-02C — Controlled Canonical Admission Review & Candidate-to-Contract Validation

Status: **EXECUTED READ-ONLY / HOLD — CONTRACT GAPS IDENTIFIED**  
Environment: **NON-PRODUCTION ONLY**  
Canonical curriculum write/import: **NOT AUTHORIZED / NOT ATTEMPTED**  
Database mutation: **NOT AUTHORIZED / NOT ATTEMPTED**  
Schema/RLS/IAM modification: **NOT AUTHORIZED / NOT ATTEMPTED**  
Authority grant/revoke: **NOT AUTHORIZED / NOT ATTEMPTED**  
Production action: **NOT AUTHORIZED / NOT ATTEMPTED**  
PR merge: **NOT AUTHORIZED / NOT ATTEMPTED**

## Purpose

Validate whether the binary-verified Source B curriculum candidates can be represented losslessly by the current HEPE canonical curriculum contracts before any import authorization is considered.

Source B controlled binary identity:
- Google Drive file ID: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- PDF pages: `157`
- Byte length: `6,796,526`
- SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Programme code: `25510071103503`
- Total credits: `151`
- Effective term: ภาคการศึกษาที่ 2 ปีการศึกษา 2567
- University Council: ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567

Controlled comparison reference:
- `QMS_Master_Data_BEd_HPE_2567_v1.1_IRM_Approved.xlsx`
- PROGRAM: 1 record
- PLO: 7 records
- COURSE_GROUP: 16 records
- COURSE: 92 records
- STUDY_PLAN: 54 records
- approved Course–PLO I-R-M: 99 pairs covering 78 courses, subject to the source/verification-state qualifications recorded in the review package.

## Current canonical contracts inspected

Read-only inspection was performed against the NON-PRODUCTION Supabase project `lztxpjsuzqvtgyasfnyj` for:
- `programmes`
- `curriculum_versions`
- `courses`
- `curriculum_courses`
- `outcomes`
- `outcome_versions`
- `outcome_mappings`
- `mapping_versions`
- `evidence_objects`
- `evidence_versions`
- `evidence_links`

No row, schema, policy, authority or environment mutation occurred.

## Admission assertions

| Assertion | Expected for lossless admission | Actual current contract | Result |
|---|---|---|---|
| Programme identity | representable | `programmes` supports code/canonical identifier/titles | PASS |
| Curriculum version | representable without invention | version/status fields exist; exact semester semantics are not a date | PARTIAL / HOLD |
| 92 courses | code/title/credit representable | core course identity and numeric credits are supported | PARTIAL / HOLD |
| Course credit pattern | preserve `3-0-6`, `2-2-5`, practicum-hour patterns | no canonical `credit_pattern` field | FAIL / CONTRACT GAP |
| Course groups | preserve 16 curriculum groups/subgroups | no canonical course-group entity/link | FAIL / CONTRACT GAP |
| Study plan | preserve 54 rows including choice placeholders | `curriculum_courses` requires concrete course FK and does not model choice placeholders/groups | FAIL / CONTRACT GAP |
| PLO1–PLO7 | preserve exact statements/version | PLO + outcome version contract supports programme-scoped PLO | PASS IN PRINCIPLE |
| Course→PLO I-R-M | preserve approved 99 pairs without fabrication | `outcome_mappings` is outcome→outcome only; Course is not an outcome | FAIL / CONTRACT GAP |
| Source hash/reference | retain controlled provenance | evidence version contract supports SHA-256 and source reference | PASS IN PRINCIPLE |
| Namespace collision | no collision before admission | target programme/course/PLO namespace inspection returned zero collisions for inspected candidate namespace | PASS |

## Mandatory stop condition

A canonical write would currently require at least one of:
- loss of controlled source semantics;
- invention of CLO records solely to satisfy outcome-to-outcome mapping structure;
- collapse of course groups or choice placeholders;
- inference of a Gregorian `effective_from` date not explicitly stated in the source; or
- schema/contract modification.

All of those exceed this gate. Therefore:

**HEPE-INGEST-02C = HOLD — CANONICAL CONTRACT GAPS IDENTIFIED / LOSSLESS IMPORT NOT YET REPRESENTABLE.**

## Boundary

This gate authorizes no migration, DDL, RLS change, data import, evidence admission, authority action, Production action or PR merge. Any schema/contract design or modification requires a separately scoped authorization.

Conversation is context only and is not admitted as audit evidence.