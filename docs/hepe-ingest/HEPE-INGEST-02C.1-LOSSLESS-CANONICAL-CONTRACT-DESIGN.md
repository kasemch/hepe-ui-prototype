# HEPE-INGEST-02C.1 — Lossless Canonical Contract Gap Resolution Design

Status: **MATERIALIZED — DESIGN / SPECIFICATION ONLY**  
Environment: **NON-PRODUCTION ONLY**  
Parent: **HEPE-INGEST-02C — HOLD / CONTRACT GAPS IDENTIFIED**  
Canonical curriculum write/import: **NOT AUTHORIZED / NOT ATTEMPTED**  
Database mutation / DDL / migration: **NOT AUTHORIZED / NOT ATTEMPTED**  
Schema/RLS/IAM modification: **NOT AUTHORIZED / NOT ATTEMPTED**  
Authority change: **NOT AUTHORIZED / NOT ATTEMPTED**  
Production action: **NOT AUTHORIZED / NOT ATTEMPTED**  
PR merge: **NOT AUTHORIZED / NOT ATTEMPTED**

## Purpose

Define a lossless logical contract for the five material gaps found by HEPE-INGEST-02C, without changing the current database, canonical registry, RLS, IAM or production environment.

The design is constrained by the verified Source-B curriculum binary (157 pages; SHA-256 `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`) and the read-only comparison dataset. It must preserve source semantics rather than invent data solely to fit the current schema.

## Design principles

1. Source semantics are preserved before normalization convenience.
2. A source value must not be converted into a more precise value than the controlled source actually states.
3. Course→PLO mapping is a first-class curriculum relationship and must not be fabricated through synthetic CLOs.
4. Choice placeholders in study plans are curricular semantics, not missing course IDs.
5. Every admitted curricular relationship must remain traceable to source_document_id + source locator + verification state.
6. This document is a logical design record only; it does not authorize any schema implementation.

## Gap G1 — Course credit pattern

### Required semantics

Preserve both numeric credits and the official instructional-workload notation, e.g.:
- `3(3-0-6)`
- `3(2-2-5)`
- practicum/field patterns where hours cannot be safely reduced to lecture/practice/self-study assumptions.

### Logical contract

`CourseOfferingPattern`
- `course_offering_pattern_id` — system UUID
- `curriculum_course_id` — relationship to curriculum course
- `raw_credit_notation` — exact source text
- `credit_units` — numeric credits where explicitly parseable
- `lecture_hours` — nullable
- `practice_hours` — nullable
- `self_study_hours` — nullable
- `other_hour_pattern` — nullable structured/raw representation for exceptional patterns
- `source_ref`
- `verification_status`

Rule: `raw_credit_notation` is authoritative for lossless reconstruction; normalized hour fields are derived representations and may remain null when not explicitly supported.

## Gap G2 — Course groups / curriculum structure

### Required semantics

Preserve curriculum groups and subgroups, including mandatory/elective structure and nested grouping where present.

### Logical contract

`CurriculumCourseGroup`
- `course_group_id`
- `curriculum_version_id`
- `group_code` — nullable if source has no code
- `group_name_th`
- `group_name_en` — nullable
- `parent_group_id` — nullable self-reference
- `group_type` — e.g. REQUIRED / ELECTIVE / GENERAL / PROFESSIONAL / MAJOR / OTHER, but raw source wording remains preserved
- `required_credits` — nullable
- `source_ref`
- `verification_status`

`CurriculumCourseGroupMembership`
- `membership_id`
- `course_group_id`
- `curriculum_course_id`
- `membership_type` — DIRECT / CHOICE_POOL_MEMBER / OTHER
- `source_ref`
- `verification_status`

No course is silently assigned to a group solely from code patterns or AI inference.

## Gap G3 — Study-plan choice semantics

### Required semantics

A study plan row may represent:
- one concrete course;
- one-of-many elective pool;
- a placeholder such as “วิชาเลือก…”;
- a group-level requirement rather than a known course.

### Logical contract

`StudyPlanEntry`
- `study_plan_entry_id`
- `curriculum_version_id`
- `academic_year_no`
- `term_code`
- `sequence_no`
- `entry_kind` — COURSE / CHOICE_POOL / PLACEHOLDER / GROUP_REQUIREMENT
- `curriculum_course_id` — nullable
- `course_group_id` — nullable
- `choice_pool_id` — nullable
- `raw_entry_text`
- `credit_value` — nullable
- `source_ref`
- `verification_status`

`StudyPlanChoicePool`
- `choice_pool_id`
- `curriculum_version_id`
- `pool_name`
- `selection_rule_raw`
- `minimum_courses` — nullable
- `maximum_courses` — nullable
- `required_credits` — nullable
- `source_ref`
- `verification_status`

Rule: a placeholder must never be coerced to a concrete course FK.

## Gap G4 — Course→PLO I-R-M mapping

### Required semantics

Represent direct curriculum-approved relationships between a Course and a PLO, with I/R/M semantics, without creating synthetic CLO records.

### Logical contract

`CourseOutcomeMapping`
- `course_outcome_mapping_id`
- `curriculum_version_id`
- `curriculum_course_id`
- `outcome_id` — PLO target
- `mapping_level` — I / R / M
- `mapping_raw_value` — exact source value
- `source_ref`
- `verification_status`
- `effective_from` — nullable only if explicitly provided by controlled source/decision
- `effective_to` — nullable

Logical uniqueness:
`curriculum_version_id + curriculum_course_id + outcome_id`

Rule: Course→PLO is distinct from Outcome→Outcome mapping. The two relationship types must not share semantics merely for implementation convenience.

## Gap G5 — Academic-term effective semantics

### Required semantics

Source B states effectiveness as `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`. This is an academic period, not an inferred Gregorian date.

### Logical contract

`AcademicEffectivePeriod`
- `academic_period_id`
- `academic_year_be`
- `term_code` — SEMESTER_1 / SEMESTER_2 / SUMMER / CUSTOM
- `term_label_raw`
- `calendar_start_date` — nullable
- `calendar_end_date` — nullable
- `calendar_date_source_ref` — nullable

`CurriculumVersion` references `effective_academic_period_id`.

Rule: calendar dates remain null unless supported by an authoritative academic calendar or controlled decision. Never invent `effective_from` from semester text.

## Provenance binding — mandatory across all gap resolutions

Every new logical entity/relationship above must support:
- `source_document_id`
- `page_number` and/or table/row/section locator
- `raw_excerpt_hash` where available
- `ingestion_batch_id`
- `candidate_record_id`
- `verification_status`
- `verified_by`
- `verified_at`
- future `import_batch_id` only after a separately authorized import gate

The verified Source-B SHA-256 is document identity, not a substitute for row/field-level provenance.

## Lossless admission test matrix for a future implementation gate

A future implementation must prove, at minimum:
1. all 92 courses can retain exact code/title/credits/raw credit notation;
2. all controlled curriculum groups/subgroups can be represented without flattening semantic hierarchy;
3. all 54 study-plan rows can round-trip, including placeholders/choice pools;
4. all approved Course→PLO I-R-M pairs can be represented directly without synthetic CLO invention;
5. PLO1–PLO7 retain exact statements and version/provenance;
6. effective semester remains academic-period semantics and does not require an invented date;
7. source/page provenance survives candidate→canonical round-trip;
8. no canonical write occurs when an unresolved conflict or unsupported semantic remains.

## Decision boundary

This design resolves the logical representation problem only. It does **not** authorize:
- creation of tables/columns;
- migration/DDL;
- modification of existing contracts;
- data import/write;
- evidence admission;
- RLS/IAM changes;
- merge of PR #30;
- production deployment.

A separately scoped Human Architecture / Schema Contract gate is required before any implementation.

## Current disposition

`HEPE-INGEST-02C.1 — LOGICAL CONTRACT DESIGN MATERIALIZED / READY FOR HUMAN SCHEMA-CONTRACT REVIEW`

`HEPE-INGEST-02C — REMAINS HOLD FOR CANONICAL IMPORT UNTIL A SEPARATELY AUTHORIZED CONTRACT IMPLEMENTATION AND REGRESSION GATE PASSES`

Conversation remains context only and is not Audit Evidence.