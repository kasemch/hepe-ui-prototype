# HEPE-INGEST-02C — Canonical Admission Review Record

Environment: **NON-PRODUCTION ONLY**  
Execution mode: **READ-ONLY / EVIDENCE-FIRST / NO CANONICAL WRITE**  
Date: 2026-09-11

## Gate classification

**HEPE-INGEST-02C = HOLD — CANONICAL CONTRACT GAPS IDENTIFIED / LOSSLESS IMPORT NOT YET REPRESENTABLE**

This record does not authorize schema change, database write, RLS/IAM change, Production action or PR merge.

## Evidence register

| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant assertion | Expected | Actual | Verification Status |
|---|---|---|---|---|---|---|---|---|
| HEPE-EV-INGEST-02C-01 | Controlled Document / Record + Test Evidence | Source B binary / HEPE-INGEST-02B.3 | 2026-09-11 | Project Owner / Human Authority | authoritative candidate source identity | exact controlled binary available | 157 pages; 6,796,526 bytes; SHA-256 `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557` | PASS |
| HEPE-EV-INGEST-02C-02 | Controlled Document / Record | `QMS_Master_Data_BEd_HPE_2567_v1.1_IRM_Approved.xlsx` | file version 1.1 | curriculum/QMS controlled comparison record | candidate reference counts and provenance | reference available without overriding PDF | PROGRAM 1; PLO 7; COURSE_GROUP 16; COURSE 92; STUDY_PLAN 54; I-R-M 99 pairs/78 courses with review-state qualifications | PASS AS COMPARISON REFERENCE |
| HEPE-EV-INGEST-02C-03 | Verified System Evidence | Supabase information schema + constraints, project `lztxpjsuzqvtgyasfnyj` | 2026-09-11 | HEPE NON-PRODUCTION database | existing canonical curriculum contract | lossless representation of controlled candidates | core contracts inspected; gaps documented below | PASS — INSPECTION |
| HEPE-EV-INGEST-02C-04 | Verified System Evidence | Supabase read-only collision queries | 2026-09-11 | HEPE NON-PRODUCTION database | target namespace collision | no conflicting canonical rows | programme/curriculum/sample+full candidate course namespace/PLO namespace inspections found no candidate collisions | PASS |
| HEPE-EV-INGEST-02C-05 | Formal Finding | this review | 2026-09-11 | HEPE governance | Course→PLO I-R-M representation | represent 99 approved course–PLO pairs without invention | current mapping contract requires outcome→outcome | OPEN / BLOCKS LOSSLESS IMPORT |
| HEPE-EV-INGEST-02C-06 | Formal Finding | this review | 2026-09-11 | HEPE governance | course structure fidelity | preserve credit pattern/course groups | no equivalent canonical fields/entities | OPEN / BLOCKS LOSSLESS IMPORT |
| HEPE-EV-INGEST-02C-07 | Formal Finding | this review | 2026-09-11 | HEPE governance | study-plan fidelity | preserve concrete courses and choice placeholders | concrete FK model cannot represent choice placeholders/groups losslessly | OPEN / BLOCKS LOSSLESS IMPORT |
| HEPE-EV-INGEST-02C-08 | Formal Reconciliation Item | workbook status review | 2026-09-11 | HEPE governance | row-level verification state | consistent status semantics | STUDY_PLAN rows observed as `Pending Review` while dashboard summary represents `I/R/M Approved` | OPEN / HUMAN RECONCILIATION |

## Candidate-to-contract findings

### HEPE-INGEST-02C-F01 — Course→PLO I-R-M semantic mismatch

Controlled sources represent Course→PLO I-R-M relationships. The current `outcome_mappings` contract requires `source_outcome_id` and `target_outcome_id`, both foreign keys to `outcomes`; its mapping kinds are `CLO_TO_PLO`, `PLO_TO_PLO`, or `OTHER`. A Course is not an Outcome. Therefore the 99 approved Course→PLO pairs cannot be inserted faithfully into this relation without creating a different semantic object or fabricating CLOs. Creating synthetic CLOs to make the foreign key fit is prohibited by the No-Fabrication rule.

Status: **OPEN / BLOCKS LOSSLESS CANONICAL IMPORT**.

### HEPE-INGEST-02C-F02 — Course structure fidelity gap

Source/reference candidates preserve attributes including course group/subgroup and credit pattern such as `3-0-6`, `2-2-5`, and practicum hour patterns. Current `courses` stores numeric `credit_value` but has no equivalent `credit_pattern`; there is no current canonical course-group relation identified in the inspected curriculum core.

Status: **OPEN / BLOCKS FULL-FIDELITY IMPORT**.

### HEPE-INGEST-02C-F03 — Study-plan choice semantics gap

The controlled study plan includes concrete course rows and choice placeholders such as `HED_ELECTIVE` and `FREE_ELECTIVE`. Current `curriculum_courses` requires a concrete `course_id` and uses a unique `(curriculum_version_id, course_id)` identity. It can preserve recommended year/term for a concrete course but does not encode a choice placeholder/group as a first-class study-plan entry.

Status: **OPEN / BLOCKS LOSSLESS STUDY-PLAN IMPORT**.

### HEPE-INGEST-02C-F04 — Effective-term temporal semantics gap

Source B states `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`. `curriculum_versions.effective_from` is a Gregorian date. No exact start date was admitted by the controlled curriculum source in this review. Inventing a date would violate Evidence-First / No-Fabrication. The date may remain NULL, but the semester/year semantics still require a controlled representation if they are to be retained canonically.

Status: **OPEN / DESIGN RESOLUTION REQUIRED**.

### HEPE-INGEST-02C-F05 — Comparison-workbook verification-state discrepancy

The comparison workbook's row-level STUDY_PLAN records inspected through the controlled file source are `Pending Review`, while its dashboard summary represents the 54-row study plan as `I/R/M Approved`. The summary does not automatically elevate each study-plan row to Verified/Approved. This is retained as a reconciliation item rather than silently resolved.

Status: **OPEN / HUMAN RECONCILIATION; DOES NOT AUTHORIZE WRITE**.

## Non-blocking verified capabilities

Current contracts can represent programme identity, curriculum-version identity/status, basic course code/title/numeric credits, programme-scoped PLOs and versioned PLO statements. The evidence subsystem can retain `source_reference` and `integrity_sha256` and link evidence to governed objects. These capabilities are useful but do not remove the blockers above.

## Collision inspection

Read-only database checks found no existing canonical row for programme code `25510071103503` / candidate programme namespace, no curriculum version for that programme, no rows among the controlled 92 current-curriculum course-code set, and no PLO1–PLO7 collision in the inspected candidate namespace. No insert/update/delete was attempted.

## Gate decision

Expected for HEPE-INGEST-02C closure: all authoritative candidate semantics have a non-fabricated canonical representation and any verification-state conflicts are reconciled.

Actual: core programme/PLO/course identity is representable, but Course→PLO I-R-M, course-group/credit-pattern, study-plan choice semantics and exact temporal semantics are not losslessly represented; an additional workbook verification-state reconciliation remains open.

**Result: HOLD.**

The next permissible step under the current no-write boundary is contract-gap design only. Applying DDL/migrations or importing curriculum rows requires separate explicit authorization.

Conversation is not audit evidence.