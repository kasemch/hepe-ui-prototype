# HEPE-WEB-02A / 02C.1 / 02C.2 — Controlled Data Inventory & Read-Model Mapping

Environment: **NON-PRODUCTION ONLY**  
Status: **CONTROLLED SYSTEM INVENTORY — READ SURFACE + POSITIVE SYNTHETIC RLS ASSERTION PASS**  
Production Authorization: **NOT GRANTED**

## Evidence admission
This record is based on direct Supabase system inspection and regression execution against project `lztxpjsuzqvtgyasfnyj`. Conversation text is not used as Audit Evidence.

## Active controlled read models
The controlled registry contains the original five HEPE read models plus four academic SECURITY_INVOKER surfaces created under HEPE-WEB-02C.1:

- RM_PROGRAMME_DASHBOARD → `v_hepe_programme_dashboard_v1`
- RM_REVIEW_QUEUE → `v_hepe_review_queue_v1`
- RM_EVIDENCE_HEALTH → `v_hepe_evidence_projection_v1`
- RM_CPRR → `v_hepe_cprr_projection_v1`
- RM_COMMAND_AVAILABILITY → `hepe_get_command_availability`
- RM_CURRICULUM_CONTEXT → `v_hepe_curriculum_context_v1`
- RM_COURSE_REGISTRY → `v_hepe_course_registry_v1`
- RM_OUTCOME_REGISTRY → `v_hepe_outcome_registry_v1`
- RM_OUTCOME_MAPPING → `v_hepe_outcome_mapping_v1`

The four WEB-02C.1 views are verified with `security_invoker=true`. `authenticated` has SELECT; `anon` SELECT is absent.

## C.2 controlled synthetic positive regression
HEPE-WEB-02C.2 temporarily created only visibly synthetic records under `SYN-HEPE-A`: one curriculum version, two courses, two PLOs, two CLOs, two CLO→PLO mappings and mapping versions carrying I/R semantics.

Expected result: PREPARER_A can read only same-programme synthetic academic rows; NO_AUTHORITY sees zero governed rows; cross-programme exposure is zero; all fixtures are removed after the assertion.

Actual result:
- PREPARER_A curriculum context = 1 row, `SYN-HEPE-A` only.
- PREPARER_A course registry = 2 rows.
- PREPARER_A PLO registry = 2 rows.
- PREPARER_A CLO registry = 2 rows.
- PREPARER_A mapping projection = 2 rows, `CLO_TO_PLO:I` and `CLO_TO_PLO:R`.
- PREPARER_A cross-programme mapping rows = 0.
- NO_AUTHORITY curriculum/course/outcome/mapping rows = 0.
- `anon` SELECT on new curriculum/mapping views = false.
- Post-test synthetic curriculum/course/PLO/CLO/mapping residual = 0.
- PREPARER_A subject restored exactly; active authority count = 1.
- NO_AUTHORITY subject restored exactly; active authority count = 0.

Result: **PASS**.

## WEB-02 controlled source map
- Programme Overview: programme dashboard + curriculum context + course registry + outcome registry.
- PLO/CLO/I-R-M: outcome registry + outcome mapping projection.
- Evidence Explorer: evidence projection; fields not exposed by the projection must remain `NOT_YET_VERIFIED` rather than inferred.
- QA / CPRR: CPRR projection only; no inferred readiness percentage.
- Tasks / Approval: review queue / controlled authority context; no autonomous approval.
- AI Advisory: the same authenticated RLS-visible evidence context only; no write, approval, authority-elevation, baseline-mutation or Audit-Evidence-admission authority.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant assertion | Expected | Actual | Verification Status |
|---|---|---|---|---|---|---|---|---|
| HEPE-WEB02-EVD-C101 | Verified System Evidence | Migration `hepe_web_02c1_controlled_academic_read_surface` | 2026-09-11 | Supabase | Controlled academic read foundation exists | scoped SECURITY_INVOKER views | four active academic views | PASS |
| HEPE-WEB02-EVD-C102 | Verified System Evidence | PostgreSQL `pg_class.reloptions` | 2026-09-11 | Supabase | View security mode | `security_invoker=true` | true on all four views | PASS |
| HEPE-WEB02-EVD-C103 | Verified System Evidence | `read_model_registry` | 2026-09-11 | Supabase | Registry activation | active SECURITY_INVOKER models | four models active | PASS |
| HEPE-WEB02-EVD-C201 | Test / Regression Evidence | C.2 authenticated SQL regression | 2026-09-11 | HEPE non-production test | PREPARER_A positive same-programme reads | curriculum/course/PLO/CLO/mapping visible only in scope | 1/2/2/2/2 rows; cross-programme 0 | PASS |
| HEPE-WEB02-EVD-C202 | Test / Regression Evidence | C.2 authenticated SQL regression | 2026-09-11 | HEPE non-production test | NO_AUTHORITY denial | zero governed academic rows | zero across all tested surfaces | PASS |
| HEPE-WEB02-EVD-C203 | Test / Regression Evidence | C.2 post-cleanup system query | 2026-09-11 | Supabase | Mandatory cleanup | zero fixture residual; personas unchanged | all residuals 0; authority 1/0; subjects restored | PASS |

## Controlled classification
**HEPE-WEB-02C.2 = PASS — CONTROLLED SYNTHETIC ACADEMIC READ ASSERTION.**  
**HEPE-WEB-02C.1 = CONTROLLED / RECONCILED — PASS.**

The prior positive-fixture reconciliation item is closed by verified C.2 regression evidence. This does not authorize real curriculum writes, Production, or PR merge.
