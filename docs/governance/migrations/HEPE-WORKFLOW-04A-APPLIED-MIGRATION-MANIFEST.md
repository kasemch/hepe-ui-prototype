# HEPE-WORKFLOW-04A — Applied Migration Manifest

Status: APPLIED TO NON-PRODUCTION / CONTROLLED PILOT FOUNDATION
Date: 2026-09-12
Supabase project: `lztxpjsuzqvtgyasfnyj`
Migration: `hepe_workflow_04a_academic_workflow_foundation_v2`
Audit Evidence Admission: NOT PERFORMED
Production Authorization: NONE

## Scope applied
Additive academic-workflow foundation for:
- academic_terms
- course_offerings
- instructor_assignments
- tqf3_records / tqf3_versions
- academic_calendar_events
- course_timeline_events
- tqf5_records / result_snapshots
- verification_methods / verification_records
- status read model `v_hepe_course_offering_status_v1`
- private offering-assignment helpers
- RLS foundation for course offering, instructor assignment and TQF3 visibility/write boundaries

Role registry additions only; no holder grants were left behind:
- COURSE_ASSIGNMENT_MANAGER
- DEPARTMENT_HEAD
- PILOT_SUPER_USER

## Authority boundary
Instructor assignment and TQF academic content use separate predicates. Assignment-manager role does not automatically confer TQF academic-content edit or approval. Programme-chair read scope is programme-bound. Department-wide semantics remain fail-closed until a controlled department binding exists. No authority is inferred from course prefix.

## Explicit exclusions
No real user provisioning, no permanent authority assignment, no email/SMTP, no secret changes, no Production deployment, no canonical curriculum activation/publication, no Audit Evidence Admission, no PR merge.

## Cleanup
Synthetic NAT fixture actors, authority assignments, course offering, instructor assignment and TQF3 records were deleted after test execution. Residual counts verified as zero for WF04A fixture markers.
