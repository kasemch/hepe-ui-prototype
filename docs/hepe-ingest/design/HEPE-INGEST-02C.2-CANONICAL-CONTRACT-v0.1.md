# HEPE-INGEST-02C.2 — Canonical Contract v0.1

Classification: **DESIGN / SPECIFICATION**  
Environment: **NON-PRODUCTION ONLY**  
Implementation: **NOT AUTHORIZED**

## Design objective

Provide a lossless canonical representation for Source-B curriculum semantics while preserving current HEPE governance boundaries and avoiding fabricated precision.

## 1. CurriculumAcademicPeriod

Fields:
- `academic_period_id` UUID
- `academic_year_be` integer/text preserving source year semantics
- `term_code` controlled value: `SEMESTER_1 | SEMESTER_2 | SUMMER | CUSTOM`
- `term_label_raw` exact source wording
- `calendar_start_date` nullable
- `calendar_end_date` nullable
- `calendar_date_source_ref` nullable
- mandatory provenance binding

Rule: semester/year text is canonical academic-period meaning. Gregorian dates may be bound only from a controlled academic-calendar source. No date inference is permitted.

Proposed relationship: `curriculum_versions.effective_academic_period_id -> CurriculumAcademicPeriod` while existing `effective_from/effective_to` remain optional calendar semantics.

## 2. CourseOfferingPattern

Fields:
- `course_offering_pattern_id` UUID
- `curriculum_course_id` FK
- `raw_credit_notation` exact source text, required when provided
- `credit_units` numeric nullable/derived
- `lecture_hours` numeric nullable
- `practice_hours` numeric nullable
- `self_study_hours` numeric nullable
- `other_hour_pattern` JSON/text nullable
- `parse_status` controlled value: `EXACT | PARTIAL | UNPARSED | NOT_PROVIDED`
- mandatory provenance binding
- verification status

Invariant: `raw_credit_notation` must round-trip byte/character-equivalently after normalization rules explicitly defined by the import contract. Normalized components never replace raw controlled notation.

## 3. CurriculumCourseGroup

Fields:
- `course_group_id` UUID
- `curriculum_version_id` FK
- `group_code` nullable
- `group_name_th` required when source provides Thai title
- `group_name_en` nullable
- `parent_group_id` nullable self-FK
- `group_type` controlled semantic class
- `source_group_type_raw` exact source wording
- `sequence_no`
- `required_credits` nullable
- `minimum_credits` nullable
- `selection_rule_raw` nullable
- mandatory provenance binding
- verification status

## 4. CurriculumCourseGroupMembership

Fields:
- `membership_id` UUID
- `course_group_id` FK
- `curriculum_course_id` FK
- `membership_type`: `DIRECT | CHOICE_POOL_MEMBER | OTHER`
- `sequence_no` nullable
- mandatory provenance binding
- verification status

No grouping may be inferred from course-code prefixes without controlled source support.

## 5. StudyPlanChoicePool

Fields:
- `choice_pool_id` UUID
- `curriculum_version_id` FK
- `course_group_id` nullable FK
- `pool_name`
- `selection_rule_raw`
- `minimum_courses` nullable
- `maximum_courses` nullable
- `required_credits` nullable
- mandatory provenance binding
- verification status

## 6. StudyPlanEntry

Fields:
- `study_plan_entry_id` UUID
- `curriculum_version_id` FK
- `academic_year_no`
- `academic_period_id` FK or source term binding
- `sequence_no`
- `entry_kind`: `CONCRETE_COURSE | CHOICE_GROUP | ELECTIVE_SLOT | REQUIREMENT_SLOT`
- `curriculum_course_id` nullable
- `course_group_id` nullable
- `choice_pool_id` nullable
- `required_credits` nullable
- `raw_entry_text` required
- mandatory provenance binding
- verification status

Constraint intent:
- `CONCRETE_COURSE` requires concrete course reference.
- Other kinds must not require a fake course.
- Exactly those references supported by the source semantics should be populated.

## 7. CurriculumCoursePloMapping

Fields:
- `course_plo_mapping_id` UUID
- `curriculum_version_id` FK
- `curriculum_course_id` FK
- `plo_id` FK to a PLO outcome
- `irm_level`: controlled `I | R | M`
- `mapping_raw_value` exact source value
- `status_code` / verification status
- `version_no` or controlled-version semantics
- `supersedes_mapping_id` nullable
- `effective_academic_period_id` nullable
- mandatory provenance binding

Logical uniqueness for a current version:
`curriculum_version_id + curriculum_course_id + plo_id`.

Invariant: Course→PLO is not Outcome→Outcome. A synthetic CLO must never be created simply to route the mapping through `outcome_mappings`.

## 8. CurricularProvenanceBinding

Mandatory provenance contract for every new canonical curricular entity/relationship:
- `source_document_id`
- `source_document_sha256`
- `source_version_reference`
- `page_number` nullable when another locator is authoritative
- `section_heading` nullable
- `table_number` nullable
- `row_reference` nullable
- `column_reference` nullable
- `paragraph_reference` nullable
- `raw_excerpt_hash` nullable
- `ingestion_batch_id`
- `candidate_record_id`
- `validation_status`
- `verification_status`
- `verified_by_actor_id` nullable until verified
- `verified_at` nullable
- `import_batch_id` only after separately authorized import

Source-B binding for the future pilot must retain document SHA-256 `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`.

## Compatibility principle

The preferred future implementation is additive. Existing programme/course/outcome contracts should remain usable while the new curriculum-specific semantics are introduced. Existing `outcome_mappings` continues to represent outcome-to-outcome relationships. Existing evidence objects remain an evidence plane and must not be silently repurposed as the sole field-level curriculum provenance store.

## Decision boundary

This contract is design only. It does not authorize SQL, migration, canonical import, RLS/IAM changes, data backfill, evidence admission, production action, or PR merge.