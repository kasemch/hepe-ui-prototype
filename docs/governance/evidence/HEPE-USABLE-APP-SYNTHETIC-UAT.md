# HEPE USABLE-APP — SYNTHETIC UAT EXECUTION MATRIX

Mode: NON-PRODUCTION ONLY / SYNTHETIC ONLY
Date: 2026-09-12
Branch: `feat/hepe-usable-app-closure-batch`

This matrix records verified execution state only. Conversation, assumptions, screenshots without provenance, and unverified observations are not PASS evidence.

| Scenario | Persona | Expected result | Verified system result | Status |
|---|---|---|---|---|
| UAT-01 My Courses / Course Workspace | PREPARER_A | Assigned synthetic course visible; user can enter Course Workspace; course context preserved | GitHub run `34673967798` exact-SHA attempt on `48716d4d1899f5d97d279781443afc16ba98a5c2`: `UAT01_MY_COURSES_COURSE_WORKSPACE_PASS` | PASS |
| UAT-02 Quick Entry — Teaching | PREPARER_A | Course-scoped activity options; POST creates synthetic delivery; Teaching read sees it | GitHub run `34673814280`, SHA `5c3f317094888946d11b43e0d963f79307f5cf77`: `PREPARER_PILOT_ENTRY_VERIFIED_PASS`, `PREPARER_DELIVERY_BROWSER_WRITE_READ_PASS` | PASS |
| UAT-03 Quick Entry — Assessment Evidence | PREPARER_A | Course-scoped assessment options; POST creates synthetic evidence; Evidence read sees it | GitHub run `34673814280`: `PREPARER_EVIDENCE_BROWSER_WRITE_READ_PASS` | PASS |
| UAT-04 Plan vs Actual | PREPARER_A | Delivered activity represented conservatively; missing activity remains `NO EVIDENCE`; no fabricated ALIGNED state | GitHub run `34673967798`: `UAT04_PLAN_VS_ACTUAL_PASS` | PASS |
| UAT-05 Programme / Command Center continuity | PREPARER_A | Work-first teacher path and programme context remain reachable | GitHub run `34673967798`: `UAT05_WORK_FIRST_PROGRAMME_CONTINUITY_PASS` | PASS |
| UAT-06 Finding → Improvement continuity | REVIEWER_A / APPROVER_A | Existing synthetic finding/improvement traceable under programme RLS; findings surface available; AI remains advisory with human authority preserved | Initial run exposed default-deny RLS gap. Migration `hepe_usable_app_finding_improvement_read_rls` added SELECT-only programme-scoped policies. Rerun `34673967798` verified `UAT06_TRACEABILITY_RLS_PASS persona=REVIEWER_A` and `persona=APPROVER_A`; cleanup PASS. Exact Preview deployment `dpl_J6YKDPSNYKQwNkaKLP7vbFGrkbdM` `/findings` returned HTTP 200 and rendered Findings & Improvement. Built source contract for `/ai` remains `AI ADVISORY ONLY` and states no decision/write/evidence-admission authority; human academic authority preserved. The rerun's final browser-title assertion failed only because raw HTML encoded `&` as `&amp;`, not because the surface or RLS read failed. | PASS WITH TEST-HARNESS NOTE |
| UAT-07 Negative access / fail-closed | NO_AUTHORITY / unauthenticated | unauthenticated routes require auth; NO_AUTHORITY writes denied; no residual | GitHub run `34673814280`: `UNAUTH_PILOT_ENTRY_AUTH_REQUIRED_PASS`, `NOAUTH_DELIVERY_DENY_PASS`, `NOAUTH_EVIDENCE_DENY_PASS`, `NOAUTH_BROWSER_RLS_EMPTY_PASS`, auth/delivery residual 0, identity restore and cleanup PASS | PASS |

## RLS reconciliation item resolved during UAT

- Finding: `findings` and `improvement_actions` had RLS enabled with no SELECT policies, producing default-deny for valid REVIEWER_A / APPROVER_A programme authority.
- Verified authority: REVIEWER_A = A3 REVIEWER; APPROVER_A = A4 APPROVER; both scoped to synthetic programme `31841af6-15c0-4c67-b828-522a512d8fdb`.
- Resolution: NON-PRODUCTION additive migration `hepe_usable_app_finding_improvement_read_rls`.
- Change: SELECT-only policies `hepe_findings_select_scoped` and `hepe_improvement_actions_select_scoped`, using the existing `private.hepe_current_actor_has_authority('A0', programme_id, ..., true)` programme-scope pattern.
- No INSERT/UPDATE/DELETE policy added. Human authority level was not reduced.
- Verification: authenticated synthetic REVIEWER_A and APPROVER_A both read the finding→improvement chain after the migration.

## Cleanup / boundary evidence

- Write-read E2E run `34673814280`: synthetic auth residual = 0; delivery residual = 0; identity restore PASS; cleanup PASS.
- Integrated UAT run `34673967798`, both attempts: synthetic auth residual = 0; identity restore PASS; cleanup PASS.
- No real institutional/student/staff data was used.
- No Production target or Production authorization was used.
- No PR merge was attempted.

## UAT conclusion

`SYNTHETIC_UAT = PASS_WITH_TEST_HARNESS_NOTE`

The note is limited to an HTML-encoding assertion (`&` versus `&amp;`) in the integrated UAT harness after the underlying RLS traceability and exact Preview route were independently verified. It does not represent an application, authority, or data-integrity failure.

`PRODUCTION_AUTHORIZATION = NOT GRANTED`
