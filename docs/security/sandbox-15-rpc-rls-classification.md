# HEPE SANDBOX-15 — RPC / RLS Security Classification Register

Status: NON-PRODUCTION / REAL-USER PILOT PREPARATION

## 1. RPC Classification

### Safe Search / Invoker
- hepe_department_search
- hepe_ask_context_bundle
- hepe_quick_capture_candidate

These use SECURITY INVOKER and rely on source RLS / permission-safe RPCs.

### Guarded Governance Commands
- hepe_create_work_item_draft
- hepe_assign_work_item
- hepe_open_work_item
- hepe_cancel_work_item
- hepe_create_meeting_draft
- hepe_add_meeting_participant
- hepe_meeting_transition
- hepe_add_agenda_item
- hepe_record_meeting_resolution
- hepe_verify_resolution_rule
- hepe_create_course_request_draft
- hepe_submit_course_request
- hepe_decide_course_request
- hepe_implement_course_request
- hepe_confirm_document_classification
- hepe_dispatch_document

These are intentional SECURITY DEFINER endpoints for authenticated users with explicit authority/scope/state checks.

### Self-Scoped / Eligibility-Scoped
- hepe_work_item_self_state
- hepe_record_resolution_vote
- hepe_notification_mark_read
- hepe_notification_dismiss
- hepe_research_transition_stage

These are intentional SECURITY DEFINER endpoints. Authority is not inferred; execution is limited to assignee/eligible voter/recipient/lead or separately verified governance authority.

### Safe Metadata Search
- hepe_evidence_search_safe
- hepe_resolution_rule_status

These expose restricted metadata/results only after explicit scope checks.

## 2. Anonymous Boundary

All SANDBOX-12/13/14 exposed RPCs reviewed here:
- anon EXECUTE = false
- authenticated EXECUTE only where intentionally exposed

## 3. RLS No-Policy Classification

Intentional fail-closed tables:
- department_meeting_rule_profiles
- department_resolution_rule_snapshots
- document_classifications
- document_routing_rules
- document_dispatches

Verified:
- authenticated SELECT = false
- authenticated INSERT = false
- anon SELECT = false

These tables are accessed only through guarded/private contracts at the current phase.

## 4. Ask HEPE Negative Retrieval Regression

Expected and verified:
- Student A -> 0 departmental context
- Lecturer B -> 0 unrelated departmental context
- System Admin -> 0 academic operational context
- Programme Chair A -> Programme A scoped Meeting / Work Item context
- Department Head -> authorised department + programme context

## 5. Remaining Security Gates

Before any real-user activation:
1. Enable and verify leaked-password protection.
2. Confirm auth redirect/recovery/session configuration.
3. Complete real-device authenticated acceptance.
4. Complete incident/support/offboarding procedures.
5. Re-run security advisors and classify any new findings.
6. Keep real student/grade data excluded from first pilot.

## 6. Decision

Current RPC/RLS architecture is acceptable for continued synthetic pilot preparation.
This register does NOT authorise real users or Production.
