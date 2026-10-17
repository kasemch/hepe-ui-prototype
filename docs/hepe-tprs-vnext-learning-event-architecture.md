# HEPE-TPRS vNext — Learning Event Architecture

Status: NON-PRODUCTION DESIGN BASELINE

## Governance

This design extends the merged HEPE-TPRS controlled-pilot baseline without changing existing academic acceptance semantics.

Locked invariants:
- E-PLC minima remain 3 + 5 + 5 + 11 = 24 hours.
- PLC Cycles 1–3 remain independent from E-PLC hour aggregation.
- Financial Literacy authoritative criteria remain PROVISIONAL and evidence-gated.
- Academic/system readiness does not equal Human Academic Clearance.
- No real student data, real-user authority grants, certificate issuance, production/public deployment, or destructive migration is authorized by this design.

## Architecture decision

HEPE-TPRS remains the system of record. A native append-only Learning Event Ledger is added as an interoperability and analytics boundary. External LRS infrastructure is optional and deferred.

Flow:

Participant / E-PLC / PLC / FinLit / Evidence / Verification
→ Learning Event Ledger
→ Audit + Analytics Read Models + xAPI Adapter
→ Optional external LRS in a future authorized phase

## Canonical event contract

Each event MUST contain:
- event_id: UUID
- event_type: controlled HEPE-TPRS event identifier
- actor_type: learner | verifier | system
- actor_ref: pseudonymous/internal subject reference
- object_type: eplc_stage | plc_cycle | evidence | verification | finlit_activity | clearance
- object_ref: internal immutable object reference
- occurred_at: timestamptz
- recorded_at: timestamptz
- source: HEPE-TPRS subsystem identifier
- schema_version: event contract version
- payload: JSONB containing event-specific non-authoritative attributes

Optional fields:
- context: JSONB
- result: JSONB
- correlation_id: UUID
- causation_id: UUID

## Initial event taxonomy

- eplc.hours_recorded
- eplc.stage_minimum_reached
- plc.cycle_started
- plc.evidence_submitted
- plc.cycle_reviewed
- evidence.created
- evidence.version_created
- evidence.verification_requested
- evidence.verified
- evidence.rejected
- evidence.conflict_detected
- finlit.activity_started
- finlit.activity_completed_synthetic
- finlit.requirement_unverified
- clearance.requested
- clearance.decision_recorded

`finlit.activity_completed_synthetic` MUST NOT imply regulatory or programme completion.

## xAPI-ready mapping

The native ledger remains canonical. An adapter MAY transform approved event types into xAPI-shaped statements:
- actor ← actor_ref through a privacy-preserving mapping
- verb ← controlled event_type-to-verb map
- object ← object_type/object_ref
- context ← context + programme/cycle metadata
- result ← event result where applicable
- timestamp ← occurred_at

No external transmission is authorized by this document.

## Additive schema delta

Proposed tables/views:

1. tprs.learning_events
   - append-only event ledger
   - immutable event identity
   - indexed by actor_ref, event_type, object_ref, occurred_at

2. tprs.learning_event_outbox
   - optional future delivery queue for adapters
   - disabled by default

3. tprs.analytics_participant_progress_v
   - read-only projection combining existing authoritative progress with event counts/timestamps

4. tprs.analytics_evidence_flow_v
   - read-only evidence/verification lifecycle projection

No existing table is dropped, renamed, or semantically redefined.

## Security model

- Deny by default.
- Learner role: no direct insert/update/delete access to canonical ledger.
- Authorized server workflow: append only.
- Verifier: reads only events within existing authorized scope.
- Admin/system audit: scoped read according to existing governance.
- UPDATE and DELETE on learning_events are denied to application roles.
- payload must not become a bypass for sensitive/authoritative fields.

## Financial Literacy Learning Lab boundary

Permitted synthetic learning activities:
- classify income and expenditure
- construct a simulated monthly budget
- establish a simulated savings/emergency-fund goal
- compare needs versus wants
- reflect on a simulated financial decision

Not permitted until authoritative criteria are supplied:
- official pass/fail threshold
- official completion rule
- regulatory readiness determination
- certificate eligibility derived from FinLit

## Acceptance tests

P0 invariants:
1. Existing E-PLC evaluator results remain unchanged after event-ledger introduction.
2. PLC cycle state remains independent from E-PLC hours.
3. FinLit PROVISIONAL status cannot be converted to authoritative completion by an event.
4. Event writes are append-only.
5. Duplicate idempotency key/correlation handling cannot double-count analytics.
6. Evidence conflict semantics remain visible.
7. Human Clearance remains independent from System READY.
8. Unauthorized roles cannot write canonical events.
9. Analytics views are read-only.
10. No external LRS transmission occurs by default.

## Rollback

Because the design is additive, rollback consists of disabling event emission/read models and removing only newly introduced non-authoritative objects in an isolated non-production environment. Existing HEPE-TPRS authoritative records are not modified as part of rollback.

## Implementation priority

P0:
- event contract and taxonomy
- additive migration draft
- append-only/RBAC tests
- evaluator regression tests
- FinLit authority-boundary tests

P1:
- analytics read models
- idempotent event emission service
- evidence lifecycle analytics
- synthetic FinLit Learning Lab events

P2:
- xAPI adapter implementation
- optional LRS integration evaluation
- richer analytics dashboards

## Human Gates retained

- authoritative Financial Literacy criteria
- real student data processing/import
- production/public deployment
- release/merge authority where required
- final Human Academic Clearance
- destructive/irreversible authoritative migration
- real-user role/permission assignment
- external LRS transmission involving real records
