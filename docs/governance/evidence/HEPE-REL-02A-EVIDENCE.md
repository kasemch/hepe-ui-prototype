# HEPE-REL-02A — Durable Outbox Schema, RLS & NAT Evidence

Environment: **NON-PRODUCTION ONLY**  
Target Supabase project: `lztxpjsuzqvtgyasfnyj`  
Record status: **PROPOSED CONTROLLED EVIDENCE RECORD — repository merge pending**  
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
- `NAT-14` identified a genuine exact-authority-binding defect: an actor with both programme-A and CROSS_PROGRAMME-B assignments could submit a row referencing the B assignment while another A assignment satisfied the generic authority helper. This was auto-repaired within authorized scope by adding exact assignment-to-scope validation, then retested PASS.

Final verified NAT results:

| Test | Assertion | Actual | Status |
|---|---|---|---|
| NAT-01 | anonymous read denied | `DENY:42501` | PASS |
| NAT-02 | no-authority create denied | `DENY:42501` | PASS |
| NAT-03 | same-programme authorized create allowed | ALLOW | PASS |
| NAT-04 | wrong-programme create denied | `DENY:42501` | PASS |
| NAT-05 | wrong-course create denied | `DENY:42501` | PASS |
| NAT-06 | unauthorized attempt read returns zero rows | `ROWS:0` | PASS |
| NAT-07 | ordinary actor cannot mutate prior attempt | `ROWS:0` | PASS |
| NAT-08 | authorized HUMAN reviewer resolves reconciliation | `ROWS:1` | PASS |
| NAT-09 | SYSTEM technical identity cannot resolve academic reconciliation | `DENY:P0001` | PASS |
| NAT-10 | expired authority replay denied | `DENY:P0001` | PASS |
| NAT-11 | revoked/stale authority replay denied | `DENY:P0001` | PASS |
| NAT-12 | Production-sensitive command denied | `DENY:42501` | PASS |
| NAT-13 | exact CROSS_PROGRAMME authority allowed for its exact programme | ALLOW | PASS |
| NAT-14 | CROSS_PROGRAMME assignment cannot be reused for unrelated programme | `DENY:42501` | PASS |

Final NAT matrix: **14/14 PASS after controlled repair and retest**.

## Idempotency / state-machine regression

| Test | Assertion | Actual | Status |
|---|---|---|---|
| IDEM-01 | completed matching idempotency record is detectable for no-op handling | `ROWS:1/ALLOW` | PASS |
| IDEM-02 | duplicate key with different payload is blocked | `DENY:23505` | PASS |
| IDEM-03 | duplicate attempt number is blocked | `DENY:23505` | PASS |
| EXP-01 | already-expired command insert is denied | `DENY:42501` | PASS |
| STATE-01 | valid `VALIDATED → AUTHORIZED` transition allowed | `ROWS:1/ALLOW` | PASS |
| STATE-02 | invalid `VALIDATED → COMPLETED` transition denied | `DENY:P0001` | PASS |
| STATE-03 | `RETRYABLE_FAILURE → READY` without revalidation denied | `DENY:P0001` | PASS |
| STATE-04 | `RETRYABLE_FAILURE → READY` after `last_verified_at` allowed | `ROWS:1/ALLOW` | PASS |
| HEALTH-01 | SYSTEM technical identity may write non-secret health snapshot | `ROWS:1/ALLOW` | PASS |

## Synthetic fixture cleanup
Temporary synthetic curriculum/course and REL-02A transactional fixtures were removed after testing. Post-cleanup verification returned:

- REL-02A synthetic outbox rows remaining = `0`
- REL-02A synthetic courses remaining = `0`
- REL-02A synthetic curriculum versions remaining = `0`

No real user, real academic authority, SMTP, secret, Production data, or Production deployment was modified.

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

## Current classification
HEPE-REL-02A: **PASS WITH DOCUMENTED REPAIR — SCHEMA/RLS FOUNDATION VERIFIED, REPOSITORY CLOSURE PENDING**  
Schema: **APPLIED — NON-PRODUCTION**  
RLS: **VERIFIED**  
NAT: **14/14 PASS after controlled repair**  
Idempotency Persistence: **VERIFIED FOUNDATION**  
Authority Revalidation: **VERIFIED FOUNDATION**  
Durable Outbox Runtime Foundation: **READY FOR APPLICATION BINDING**  
Reviewer: **UNAVAILABLE / DEFERRED**  
Separation-of-Duties: **UNVERIFIED**  
Production Authorization: **NOT GRANTED**

Repository PR and final post-merge reconciliation remain required before this record becomes a controlled repository baseline.

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
