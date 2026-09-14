# HEPE-WORKFLOW-04B — Applied Action RLS Manifest

Status: PARTIALLY APPLIED / EXCEPTION STOP AT 04B.5
Date: 2026-09-12
Environment: NON-PRODUCTION ONLY
Supabase project: `lztxpjsuzqvtgyasfnyj`
Audit Evidence Admission: NOT PERFORMED
Production Authorization: NONE

## Applied sub-gates

### 04B.1 — TQF5 + Result Snapshot RLS/Actions
Applied migration `hepe_workflow_04b1_04b3_action_rls_foundation`.

Implemented:
- offering-assigned instructor scoped TQF5 read/write;
- programme-chair scoped TQF5 read;
- result snapshot scoped read;
- result snapshot INSERT for assigned instructor;
- no UPDATE/DELETE policy for result snapshots (append-only in this gate).

Synthetic NAT:
- assigned instructor TQF5 read = PASS;
- no-authority TQF5 read deny = PASS;
- assigned instructor result-snapshot insert = PASS;
- no-authority result-snapshot insert = DENY as expected by RLS.

### 04B.2 — Calendar + Course Timeline Actions
Initial policy candidate used an invalid `COURSE` layer relative to the existing controlled check constraint. This was detected during synthetic execution and repaired with migration `hepe_workflow_04b2_calendar_constraint_alignment`.

Controlled three-layer calendar remains:
- UNIVERSITY
- PROGRAMME
- PERSONAL

Course-specific personal tasks may bind `course_offering_id` while remaining in the PERSONAL layer.

Timeline is append-only in this gate: SELECT + INSERT only; no UPDATE/DELETE policy.

Synthetic NAT after repair:
- assigned instructor personal/course-bound calendar insert = PASS;
- assigned instructor timeline append = PASS.

### 04B.3 — Verification Runtime & Reviewer Scope
Implemented reviewer-scoped INSERT/UPDATE using existing REVIEWER / QA_REVIEWER authority at A3 and offering/programme boundary. Programme chair and assigned instructor have scoped read according to the policy contract.

Synthetic NAT:
- authorised reviewer verification insert = PASS;
- no-authority verification insert = DENY as expected by RLS.

### 04B.4 — Improvement Action Authority
Applied migration `hepe_workflow_04b4_improvement_action_authority`.

Existing `improvement_actions` is bound to Finding → Review → Programme. Programme Chair A4 in the same programme may INSERT/UPDATE improvement actions. No DELETE policy was added. Existing scoped SELECT remains.

## Exception Stop — 04B.5 Document Record/Version Runtime
Verified schema discovery returned:
- `public.document_records` = NOT PRESENT
- `public.document_versions` = NOT PRESENT
- `public.improvement_items` = NOT PRESENT

Creating those persistent entities is a schema expansion beyond the currently applied 04A foundation and therefore triggers Exception Stop under the current 04B action-RLS/runtime batch. No document schema was fabricated or silently created.

## 04B.6 Integrated NAT / Cleanup
Synthetic personas used only in NON-PRODUCTION:
- WF04B_INSTRUCTOR_A
- WF04B_PROGRAMME_CHAIR
- WF04B_REVIEWER
- WF04B_NO_AUTH

All WF04B fixture actors, temporary authority assignments, offering, term and TQF5 records were removed after testing.

Verified residual:
- synthetic actors = 0
- temporary authority assignments = 0
- synthetic offerings = 0
- synthetic TQF5 records = 0

## Boundary
No real-user provisioning, no permanent authority grant, no email/SMTP/notification send, no secret change, no Production deployment, no canonical curriculum activation/publication, no PR merge, and no Audit Evidence Admission.
