# HEPE USABLE-APP — SYNTHETIC UAT EXECUTION MATRIX

Mode: NON-PRODUCTION ONLY / SYNTHETIC ONLY
Date: 2026-09-12
Branch: `feat/hepe-usable-app-closure-batch`

This matrix records execution state only. Conversation, assumptions, screenshots without provenance, and unverified observations are not PASS evidence.

| Scenario | Persona | Expected result | Current verified result | Status |
|---|---|---|---|---|
| UAT-01 My Courses / Course Workspace | PREPARER_A | Assigned synthetic course visible; user can enter Course Workspace; course context preserved | Source/build/Preview path materialized; authenticated exact-head browser persona rendering not re-run on closure HEAD | HOLD |
| UAT-02 Quick Entry — Teaching | PREPARER_A | Course-scoped activity options; POST creates synthetic delivery; subsequent Teaching/Plan-vs-Actual read sees it | DB RPC positive authority regression PASS; exact-head browser POST→read propagation not yet independently verified | HOLD |
| UAT-03 Quick Entry — Assessment Evidence | PREPARER_A | Course-scoped assessment options; POST creates synthetic evidence; Evidence read sees it | DB RPC positive authority regression PASS; exact-head browser POST→Evidence read not yet independently verified | HOLD |
| UAT-04 Plan vs Actual | PREPARER_A / REVIEWER_A | Existing delivered activity represented conservatively; intentional missing activity remains `NO EVIDENCE`; no fabricated ALIGNED state | Earlier authenticated read E2E PASS on pilot lineage; exact closure-head authenticated rerun pending | HOLD |
| UAT-05 Programme / Command Center continuity | authorized programme persona | Teacher-work outputs remain reachable without forcing governance-first navigation | Work-first homepage / My Courses / Course Workspace materialized and build verified; persona-specific programme browser UAT not re-run | HOLD |
| UAT-06 Finding → Improvement continuity | REVIEWER_A / APPROVER_A where supported | Existing synthetic finding/improvement remains traceable; no AI approval | Synthetic data foundation already exists; closure branch did not mutate governance data; exact-head integrated persona browser UAT pending | HOLD |
| UAT-07 Negative access / fail-closed | NO_AUTHORITY / unauthenticated | unauthenticated routes require auth; NO_AUTHORITY writes denied; no test residual | `/my-courses` exact-head unauthenticated = `AUTH_REQUIRED`; delivery and assessment-evidence RPCs return `PREPARER_AUTHORITY_REQUIRED`; residual delivery/evidence = 0 | PASS |

## Supporting verified assertions

- Exact closure build regression: PASS on SHA `a21c3477a5b7c9db22302c7d239a9a5daa9842b7`.
- Exact closure Vercel Preview: READY on deployment `dpl_G1c9rSHiscCGXUiuqLj9GY1LNuNG`.
- Exact-head `/my-courses` unauthenticated browser smoke: HTTP 200 application shell, state `AUTH_REQUIRED`, NON-PRODUCTION boundary visible.
- Synthetic PREPARER delivery RPC: PASS, transaction rolled back.
- Synthetic NO_AUTHORITY delivery RPC: DENY as expected.
- Synthetic PREPARER assessment-evidence RPC: PASS, transaction rolled back.
- Synthetic NO_AUTHORITY assessment-evidence RPC: DENY as expected.
- Post-regression residual: delivery 0; evidence 0.

## UAT closure rule

Do not convert UAT-01 through UAT-06 to PASS from source inspection, conversation, DB-only tests, or prior-SHA tests alone. PASS requires exact-head authenticated browser/runtime evidence appropriate to the assertion.

Current decision:

`SYNTHETIC_UAT = PARTIAL_PASS_WITH_HOLD`

`CONTROLLED_PILOT_READY = NOT DECLARED`

`PRODUCTION_AUTHORIZATION = NOT GRANTED`
