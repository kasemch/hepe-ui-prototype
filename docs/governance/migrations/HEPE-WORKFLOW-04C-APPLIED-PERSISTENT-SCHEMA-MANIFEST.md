# HEPE-WORKFLOW-04C — Applied Persistent Schema Manifest

Status: APPLIED TO NON-PRODUCTION / CONTROLLED PILOT FOUNDATION
Date: 2026-09-12
Supabase project: `lztxpjsuzqvtgyasfnyj`
Audit Evidence Admission: NOT PERFORMED
Production Authorization: NONE

## Authorized gate
HEPE-WORKFLOW-04C — Document & Improvement Persistent Schema Foundation.

## Applied migrations
- `hepe_workflow_04c_document_improvement_persistent_foundation`
- `hepe_workflow_04c_document_version_cleanup_guard`

## New persistent entities
### `public.improvement_items`
Programme-scoped curriculum/course improvement backlog separated from formal Findings and AI recommendations. Key controls:
- source_kind distinguishes FINDING / AI_RECOMMENDATION / HUMAN_RECOMMENDATION / STAKEHOLDER_FEEDBACK / OTHER;
- provenance status remains explicit;
- programme/course-offering linkage;
- human owner, priority, due date and lifecycle state;
- AI recommendation does not equal finding or approved action.

### `public.document_records`
Document identity and mutable workflow metadata for TQF3, TQF5, verification, reports and appendices. Export/record creation does not alter academic authority or Audit Evidence admission.

### `public.document_versions`
Append-only document snapshots with version number, status, content/file reference, source snapshot and provenance metadata.

## RLS foundation
- Anonymous access revoked for all three entities.
- Instructor may access document records/versions only when assigned to the linked course offering.
- Programme Chair A4 may access programme-scoped document records/versions.
- Programme-scoped A0/status visibility and linked assigned-instructor visibility are allowed for improvement items; write authority is Programme Chair A4 only.
- No DELETE policy is granted through authenticated RLS.
- `document_versions` are immutable to normal users after insert.

## Controlled cleanup path
The append-only trigger initially blocked deletion of synthetic document versions during mandatory NAT cleanup. This was treated as a test/cleanup defect, not as a reason to weaken the normal append-only contract. A second migration permits DELETE only when:
1. `session_user = postgres`; and
2. controlled session GUC `hepe.synthetic_cleanup = on`.

Authenticated runtime still cannot update or delete document versions.

## Synthetic NAT results
- Assigned instructor document record INSERT: PASS.
- Assigned instructor document version INSERT: PASS when executed as sequential runtime actions.
- No-authority direct document INSERT: DENY by RLS.
- Programme Chair A4 improvement item INSERT: PASS.
- Document version UPDATE: DENY with `document_versions are append-only`.
- Cleanup residual: synthetic actors 0; authority 0; offering 0; document 0; improvement item 0.

## Explicit exclusions
NO Production deployment; NO real-user provisioning; NO permanent authority grant; NO email/SMTP; NO secret changes; NO canonical curriculum activation/publication; NO Audit Evidence Admission; NO PR merge.
