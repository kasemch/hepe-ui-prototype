# HEPE-INGEST-02D — Source-B Read-Only Lossless Dry-Run

Status: PASS WITH CONDITIONS / READ-ONLY / NO CANONICAL WRITE
Date: 2026-09-11
Source-B SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
Programme code: `25510071103503`
Total credits: `151`
Effective academic period: `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`

## Purpose

After synthetic schema/RLS regression PASS, validate that the new 02D contract can represent the verified Source-B semantic classes without writing Source-B canonical rows.

## Contract representability check

| Source-B semantic class | 02D canonical structure | Dry-run result |
|---|---|---|
| Programme identity | existing `programmes` | REPRESENTABLE |
| Curriculum version | existing `curriculum_versions` + `effective_academic_period_id` | REPRESENTABLE |
| Academic term wording | `academic_periods.term_label_raw` | REPRESENTABLE WITHOUT DATE INVENTION |
| Numeric + raw course credit notation | `courses.credit_value` + `course_credit_patterns.raw_credit_notation` | REPRESENTABLE |
| Course groups/subgroups | `curriculum_course_groups` + memberships | REPRESENTABLE |
| Study-plan concrete course | `study_plan_entries.CONCRETE_COURSE` | REPRESENTABLE |
| Choice/elective placeholder | `study_plan_entries` + `study_plan_choice_pools` | REPRESENTABLE WITHOUT FAKE COURSE |
| PLO identity/version | existing `outcomes` / `outcome_versions` | REPRESENTABLE |
| Course→PLO I-R-M | `curriculum_course_plo_mappings` | REPRESENTABLE WITHOUT SYNTHETIC CLO |
| Source page/locator/hash provenance | provenance columns on new structures | REPRESENTABLE |

## Controlled limitations

This is a semantic/contract dry-run, not a Source-B data import. It does not claim that all 92 courses, all source groups, all study-plan rows, or every approved I-R-M pair have been inserted and round-tripped in canonical storage. Those assertions remain pending a separately controlled real-candidate import validation step if authorized within the 02D boundary.

No Source-B row was inserted, activated, published or admitted to the Audit Evidence Set.