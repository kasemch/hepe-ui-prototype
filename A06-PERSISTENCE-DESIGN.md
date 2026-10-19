# HEPE Fast TQF Portal — A06 Controlled Persistence Design

Status: DESIGN ONLY · NON-PRODUCTION · NO DATABASE WRITE PATH

## 1. Purpose
Define the persistence, authority, audit, idempotency, concurrency, rollback, and migration model required before any real database write path is enabled.

## 2. Data classification
| Entity | Canonical | Derived / Read Model | User Editable | System Generated | Immutable Audit |
|---|---|---|---|---|---|
| course_offerings | yes | yes | scoped | yes | no |
| tqf_documents | yes | yes | scoped | yes | no |
| document_versions | versioned canonical snapshot | yes | no direct overwrite | yes | no |
| evidence_items | yes | yes | scoped | yes | no |
| evidence_links | yes | yes | scoped | yes | no |
| mappings | yes | yes | scoped | yes | no |
| validation_results | no | yes | no | yes | no |
| review_requests | yes | yes | limited | yes | no |
| review_findings | yes | yes | reviewer scoped | yes | no |
| approval_records | yes | yes | authorized approver only | yes | no |
| notifications | no | yes | acknowledgement state only | yes | no |
| audit_events | no | yes | no | yes | yes |
| export_manifests | controlled record | yes | no | yes | no |
| workflow_states | yes | yes | transition only | yes | no |

## 3. Core entity contract
Every persisted business entity should include, as applicable:
- id: UUID
- programme_id / course_offering_id / document_id foreign keys
- lifecycle_state
- version_number
- source_provenance
- authority_scope
- created_at / created_by
- updated_at / updated_by
- archived_at
- row_version for optimistic concurrency

No hard delete for academic records. Default lifecycle is archive / supersede.

## 4. Workflow states
### TQF document
Draft → In Progress → Ready for Review → Under Review → Needs Revision → Resubmitted → Approved → Archived

### Evidence
Uploaded → Linked → Reviewed → Verified

### Review request
Prepared → Submitted → Under Review → Revision Requested → Resubmitted → Approved / Closed

## 5. Transition authority matrix
| Transition | Lecturer | Programme Chair | Reviewer / QA | Admin |
|---|---:|---:|---:|---:|
| Draft → In Progress | yes | scoped | no | support only |
| In Progress → Ready for Review | yes | scoped | no | no |
| Ready for Review → Under Review | submit only | yes | yes | no |
| Under Review → Needs Revision | no | yes | yes | no |
| Needs Revision → Resubmitted | yes | scoped | no | no |
| Resubmitted → Approved | no | authorized only | authorized only | no |
| Approved → Archived | no | authorized only | no | controlled |

UI visibility is never the security boundary. Every sensitive transition must be checked by the server/data layer.

## 6. Authority principles
- No user self-elevation.
- Role selection in UI does not grant authority.
- Business authority must be resolved from identity + programme/course scope + active assignment.
- Approval requires server-side authority verification.
- Admin does not automatically inherit academic approval authority.
- Executive/Dean view, if enabled, is read-only unless separately assigned authority.

## 7. Proposed RLS design (not deployed)
### Lecturer
- SELECT: assigned programmes/courses/documents/evidence
- INSERT/UPDATE: own scoped drafts, evidence, responses
- no approval writes

### Programme Chair
- SELECT: programme-wide
- UPDATE: programme-level review metadata and allowed workflow transitions
- no system-admin mutation

### Reviewer / QA
- SELECT: assigned review scope
- INSERT/UPDATE: findings, review state
- no author-content overwrite unless explicit policy permits

### Admin
- system/master data only
- no implicit academic approval authority

## 8. Audit event model
Append-only table concept: audit_events

Fields:
- id
- actor_id
- actor_role
- action
- object_type
- object_id
- before_state
- after_state
- reason
- source
- correlation_id
- request_id
- created_at

Required event types:
DOCUMENT_CREATED
DOCUMENT_UPDATED
VALIDATION_RUN
EVIDENCE_LINKED
EVIDENCE_VERIFIED
REVIEW_SUBMITTED
REVIEW_OPENED
REVISION_REQUESTED
RESUBMITTED
APPROVED
EXPORT_REQUESTED
EXPORT_BLOCKED
EXPORT_GENERATED

Audit events are not ordinary activity-feed rows and must not be mutable by business users.

## 9. Idempotency
Idempotency key required for:
- review submission
- approval
- export generation
- evidence link creation

Recommended uniqueness:
(actor_id, action, object_id, idempotency_key)

Repeated requests with the same key must return the prior result rather than duplicate the action.

## 10. Concurrency
Use optimistic concurrency via row_version or updated_at precondition.

Document update contract:
1. client reads version N
2. client submits update with expected_version=N
3. server updates only when current version=N
4. otherwise return CONFLICT and preserve both states

Never silently overwrite concurrent academic edits.

## 11. Versioning
A new document version is created only on meaningful save / submit / revision events, not on every keystroke.

Version record:
- id
- document_id
- version_number
- author_id
- created_at
- change_summary
- workflow_state
- source_version_id
- snapshot / structured payload hash

## 12. Controlled export
Export package candidate may contain:
- TQF document
- evidence index
- mapping summary
- validation report
- review record
- approval record (when available)
- manifest with hashes

If readiness != Approved or required human gate is incomplete:
OFFICIAL EXPORT = LOCKED

Preview export must carry:
NON-PRODUCTION
UNOFFICIAL
NOT FOR INSTITUTIONAL SUBMISSION

## 13. Rollback strategy
- schema changes: forward-fix preferred; reversible migrations mandatory where practical
- workflow transitions: compensating transition only; never delete audit history
- document content: restore through a new version, never destructive overwrite
- evidence link: supersede/unlink with audit event
- export manifest: immutable candidate record; new manifest for retry

## 14. Migration strategy
Phase 1: interfaces + synthetic adapter
Phase 2: read-only Supabase adapter
Phase 3: shadow writes to non-canonical sandbox tables only after explicit approval
Phase 4: controlled write path with RLS + audit + idempotency
Phase 5: pre-production acceptance
Phase 6: production only after explicit release authorization

## 15. Human gates
Explicit approval required before:
- CREATE/ALTER/DROP table
- RLS deployment
- enabling real write path
- identity/authority binding
- canonical academic migration
- official export
- merge to main / production release

## 16. Known risks
- duplicated state between UI and DB
- stale authority assignment
- partial writes across document/evidence/review
- duplicate submissions without idempotency
- silent overwrite without concurrency control
- export generated from stale approval state
- UI role hiding mistaken for authorization
- audit gaps from client-side-only actions

## 17. A06 exit criteria
PASS only when:
- persistence model documented
- authority matrix documented
- RLS plan documented
- audit model documented
- idempotency/concurrency/rollback documented
- no real DB write path opened
- PR records A06 as DESIGN ONLY
