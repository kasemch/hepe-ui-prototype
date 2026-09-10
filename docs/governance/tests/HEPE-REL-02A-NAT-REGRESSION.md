# HEPE-REL-02A — NAT / RLS Regression Record

Environment: **NON-PRODUCTION ONLY**  
Target: Supabase `lztxpjsuzqvtgyasfnyj`

## Final policy inventory

Verified PostgreSQL `pg_policies` inventory after controlled repair:

- `connector_outbox_insert_scoped` — INSERT / authenticated
- `connector_outbox_select_scoped` — SELECT / authenticated
- `connector_outbox_update_owner_scoped` — UPDATE / authenticated
- `connector_attempt_insert_scoped` — INSERT / authenticated
- `connector_attempt_select_scoped` — SELECT / authenticated
- `idempotency_record_insert_scoped` — INSERT / authenticated
- `idempotency_record_select_scoped` — SELECT / authenticated
- `reconciliation_item_insert_scoped` — INSERT / authenticated
- `reconciliation_item_select_scoped` — SELECT / authenticated
- `reconciliation_item_update_human_authority` — UPDATE / authenticated
- `connector_health_snapshot_insert_system` — INSERT / authenticated
- `connector_health_snapshot_select_authenticated` — SELECT / authenticated

RLS is enabled on all five REL-02A tables.

## Persona NAT matrix

Final results after controlled repair/retest:

| ID | Expected | Actual | Result |
|---|---|---|---|
| NAT-01 | anonymous read DENY | SQLSTATE 42501 | PASS |
| NAT-02 | no-authority create DENY | SQLSTATE 42501 | PASS |
| NAT-03 | same-programme authorized create ALLOW | ALLOW | PASS |
| NAT-04 | wrong-programme create DENY | SQLSTATE 42501 | PASS |
| NAT-05 | wrong-course create DENY | SQLSTATE 42501 | PASS |
| NAT-06 | unauthorized attempt read DENY | 0 rows | PASS |
| NAT-07 | ordinary actor cannot mutate prior attempt | 0 rows | PASS |
| NAT-08 | authorized HUMAN reconciliation ALLOW | 1 row | PASS |
| NAT-09 | SYSTEM technical identity academic reconciliation DENY | SQLSTATE P0001 | PASS |
| NAT-10 | expired authority replay DENY | SQLSTATE P0001 | PASS |
| NAT-11 | revoked/stale authority replay DENY | SQLSTATE P0001 | PASS |
| NAT-12 | Production-sensitive command DENY | SQLSTATE 42501 | PASS |
| NAT-13 | exact CROSS_PROGRAMME authorized scope ALLOW | ALLOW | PASS |
| NAT-14 | unrelated programme using different assignment DENY | SQLSTATE 42501 | PASS |

Final NAT: **14/14 PASS**.

## Controlled repair history

Initial NAT-14 exposed that generic actor authority could be satisfied by a different active assignment than the `authority_assignment_id` persisted on the outbox record. Migration `20260910100232_hepe_rel_02a_exact_authority_binding` repaired this by requiring the referenced assignment itself to authorize the exact row scope. NAT-14 was then repeated and passed.

Initial NAT-07 was a harness-observation defect: UPDATE affected zero rows under RLS, but the first harness did not inspect row count and labeled the statement ALLOW. The corrected test checks `row_count`; actual result was zero rows and PASS. No policy change was required for NAT-07.

## Core persistence/state tests

IDEM-01 PASS — matching completed idempotency record detectable for no-op handling.  
IDEM-02 PASS — duplicate connector-scoped key blocked with SQLSTATE 23505.  
IDEM-03 PASS — duplicate attempt number blocked with SQLSTATE 23505.  
EXP-01 PASS — already-expired command insert denied.  
STATE-01 PASS — VALIDATED → AUTHORIZED allowed.  
STATE-02 PASS — VALIDATED → COMPLETED denied.  
STATE-03 PASS — RETRYABLE_FAILURE → READY without revalidation denied.  
STATE-04 PASS — RETRYABLE_FAILURE → READY after verification allowed.  
HEALTH-01 PASS — SYSTEM technical actor may write non-secret connector health snapshot without gaining academic reconciliation authority.

## Cleanup

Synthetic test fixtures created specifically for REL-02A were removed. Verified remaining counts for REL-02A outbox/course/curriculum-version fixtures were all zero.

Conversation ≠ Audit Evidence. This record becomes controlled only after repository PR merge; verified Supabase system evidence remains authoritative for the executed schema state.
