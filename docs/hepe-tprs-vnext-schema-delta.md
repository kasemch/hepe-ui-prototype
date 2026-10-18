# HEPE-TPRS vNext Schema Delta

Delta type: additive only.

New canonical object:
- `tprs.learning_events`: append-only technical learning-event ledger.

New projections:
- `tprs.analytics_participant_event_summary_v`
- `tprs.analytics_evidence_flow_v`

No pre-existing HEPE-TPRS table is dropped, renamed, or redefined. The current readiness evaluator remains the acceptance source of truth; the event ledger is not permitted to override academic-rule applicability, Financial Literacy authority status, evidence verification, or Human Academic Clearance.

Key integrity controls:
- UUID primary key.
- UNIQUE idempotency key.
- constrained actor/object types.
- schema version fixed to v1 for this migration.
- FinLit authoritative-key CHECK guard.
- UPDATE/DELETE trigger rejection.
- indexes for actor/type/object/correlation retrieval.

The SQL artifact is `db/tprs-vnext-learning-events.sql` and remains unapplied by this repository-only implementation batch.
