# HEPE-INGEST-02D — Executed Migration Manifest

Status: EXECUTED / NON-PRODUCTION ONLY
Date: 2026-09-11
Supabase project: `lztxpjsuzqvtgyasfnyj`
Authorization: Explicit Human Schema Modification Authorization for HEPE-INGEST-02D.

## Applied migrations

1. `20260911111102_hepe_ingest_02d_lossless_curriculum_contract`
2. `20260911111230_hepe_ingest_02d_academic_period_scope_repair`

## Additive canonical structures

- `academic_periods`
- `course_credit_patterns`
- `curriculum_course_groups`
- `curriculum_course_group_memberships`
- `study_plan_choice_pools`
- `study_plan_entries`
- `curriculum_course_plo_mappings`
- `curriculum_versions.effective_academic_period_id`

All seven new tables have RLS enabled and two policies each: scoped SELECT and scoped WRITE.

## Controlled repair

The first synthetic regression attempt exposed a valid RLS design defect: `academic_periods` had no programme scope, causing PREPARER_A insertion to be denied. Execution stopped at that exception. Within the authorized 02D schema/RLS scope, a repair migration added mandatory `programme_id` and replaced the academic-period policies with programme-scoped A0/A1 authority checks. No production or IAM action occurred.

## Prohibited actions not performed

- no Production action
- no IAM change
- no authority grant/revoke
- no canonical Source-B activation/publication
- no automatic Audit Evidence admission
- no PR merge

This file is a Controlled Execution Record candidate. Audit Evidence admission remains a separate governance action.