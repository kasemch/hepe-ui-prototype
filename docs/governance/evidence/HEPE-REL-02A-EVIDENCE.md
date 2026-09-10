# HEPE-REL-02A — Durable Outbox Schema, RLS & NAT Evidence

Environment: **NON-PRODUCTION ONLY**  
Target Supabase project: `lztxpjsuzqvtgyasfnyj`  
Record status: **CONTROLLED / MERGED — PR #22 human-approved and merged to `non-production` at `0c1688620e1ff0965cc2cbfe537e246fd303bc7e`**  
Production Authorization: **NOT GRANTED**

## Scope and authority
This gate was executed only after explicit Human Authorization for NON-PRODUCTION schema modification, RLS application, synthetic NAT testing, minimal synthetic fixtures, cleanup, and evidence capture. Authorization did not include Production, real-user authority change, SMTP, secrets, Production data, unrelated destructive schema change, ruleset mutation, or Production deployment.

## Verified starting state
Before mutation, read-only schema inspection confirmed the existing HEPE authority/runtime structures including `actors`, `authority_assignments`, `programmes`, `courses`, `governed_objects`, `command_registry`, `command_requests`, `audit_events`, and synthetic persona fixtures. The five REL-02 durable persistence tables were absent.

## Applied migrations
Supabase migration history records the following applied NON-PRODUCTION migrations:

- `20260910095843_hepe_rel_02a_durable_outbox_rls`
- `20260910095950_hepe_rel_02a_scope_coherence_and_state_guard`
- `20260910100232_hepe_rel_02a_exact_authority_binding`
- `20260910100317_hepe_rel_02a_expiry_guard`

These created/hardened only the REL-02A durable persistence foundation and supporting policy/guard functions.

## Resulting schema
Verified after migration:

- `connector_outbox` — RLS enabled, 3 policies
- `connector_attempt` — RLS enabled, 2 policies
- `idempotency_record` — RLS enabled, 2 policies
- `reconciliation_item` — RLS enabled, 3 policies
- `connector_health_snapshot` — RLS enabled, 2 policies

Additional controlled safeguards include exact authority-assignment binding, programme/course/object scope-coherence checks, immutable outbox envelope fields, guarded state transitions, revalidation-before-retry-to-READY, expiry enforcement, and a NON-PRODUCTION check denying `PRODUCTION-SENSITIVE` rows.

## NAT / RLS regression
Initial NAT execution identified two apparent failures:

- `NAT-07` initially reported ALLOW because the test harness did not inspect `row_count`; corrected retest showed zero rows affected, therefore policy behavior was DENY as intended.
- `NAT-14` identified a genuine exact-authority-binding defect: an actor with both programme-A and CROSS_PROGRAMME-B assignments could submit a row referencing the B assignment while another A assignment satisfied the generic authority helper. This was repaired within authorized scope by adding exact assignment-to-scope validation, then retested PASS.

Final NAT matrix: **14/14 PASS after controlled repair and retest**.

## Idempotency / state-machine regression
Verified final results: **9/9 PASS** covering completed-record detection for no-op handling, duplicate idempotency conflict, duplicate attempt constraint, expiry denial, valid and invalid state transitions, retry revalidation, and SYSTEM health snapshot insertion.

## Synthetic fixture cleanup
Temporary synthetic curriculum/course and REL-02A transactional fixtures were removed after testing. Post-cleanup verification returned:

- REL-02A synthetic outbox rows remaining = `0`
- REL-02A synthetic courses remaining = `0`
- REL-02A synthetic curriculum versions remaining = `0`

No real user, real academic authority, SMTP, secret, Production data, or Production deployment was modified.

## Repository closure provenance
PR #22 final head `3f6119d6f9e366fca8743f1fb88e2af22e941b01` passed required `governance-policy` check `102829208169` with conclusion `success`, and no unresolved review threads were present before merge.

PR #22 was explicitly human-approved and merged to `non-production`. GitHub reports `merged=true` with merge SHA `0c1688620e1ff0965cc2cbfe537e246fd303bc7e`. Post-merge branch verification showed `non-production` at the same SHA and the merge commit signature verified as valid.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Assertion | Verification |
|---|---|---|---|---|---|---|
| HEPE-REL02A-EVD-001 | Approved Decision | explicit gate-scoped Human Authorization | 2026-09-10 | Human Authority | NON-PRODUCTION schema/RLS/NAT scope only | ADMITTED |
| HEPE-REL02A-EVD-002 | Verified System Evidence | Supabase preflight schema | 2026-09-10 | Supabase project | predecessor schema present; five durable tables absent | PASS |
| HEPE-REL02A-EVD-003 | Verified System Evidence | Supabase migration history | 2026-09-10 | Supabase project | four REL-02A migrations applied | PASS |
| HEPE-REL02A-EVD-004 | Verified System Evidence | PostgreSQL catalog/RLS inspection | 2026-09-10 | Supabase project | five tables exist with RLS/policies | PASS |
| HEPE-REL02A-EVD-005 | Test / Regression Evidence | synthetic NAT runs | 2026-09-10 | authorized test harness | persona/RLS matrix | 14/14 PASS after repair |
| HEPE-REL02A-EVD-006 | Test / Regression Evidence | idempotency/state tests | 2026-09-10 | authorized test harness | persistence and state invariants | 9/9 PASS |
| HEPE-REL02A-EVD-007 | Test / Regression Evidence | cleanup verification | 2026-09-10 | Supabase project | synthetic fixture removal | PASS |
| HEPE-REL02A-EVD-008 | Test / Regression Evidence | GitHub Actions PR #22 check `102829208169` | 2026-09-10 | GitHub Actions / repository | final-head governance policy | SUCCESS / PASS |
| HEPE-REL02A-EVD-009 | Verified System Evidence | GitHub PR #22 | merged 2026-09-10 | repository / gate-scoped Human Approval | exact approved evidence PR merged | merged=true; merge SHA `0c1688620e1ff0965cc2cbfe537e246fd303bc7e` / PASS |
| HEPE-REL02A-EVD-010 | Verified System Evidence | GitHub `non-production` branch | post-merge 2026-09-10 | repository | branch advanced to approved merge | HEAD `0c1688620e1ff0965cc2cbfe537e246fd303bc7e`; signature verified / PASS |

## Final classification
HEPE-REL-02A: **PASS WITH DOCUMENTED REPAIR — CONTROLLED / RECONCILED — NON-PRODUCTION**  
Schema: **APPLIED — NON-PRODUCTION**  
RLS: **VERIFIED**  
NAT: **14/14 PASS after controlled repair**  
Idempotency Persistence: **VERIFIED FOUNDATION**  
Authority Revalidation: **VERIFIED FOUNDATION**  
Durable Outbox Runtime Foundation: **READY FOR APPLICATION BINDING**  
Live Remote Connector Execution: **NOT VERIFIED BY THIS GATE**  
Reviewer: **UNAVAILABLE / DEFERRED**  
Separation-of-Duties: **UNVERIFIED**  
Production Authorization: **NOT GRANTED**

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
