# HEPE-EV-INGEST-02F-AUTHZ-POSITIVE-20260912

## Evidence classification

- Evidence ID: `HEPE-EV-INGEST-02F-AUTHZ-POSITIVE-20260912`
- Evidence Type: Test / Regression Evidence
- Evidence Admission Status: **EVIDENCE CANDIDATE — NOT AUTOMATICALLY ADMITTED TO AUDIT EVIDENCE SET**
- Environment: **NON-PRODUCTION ONLY**
- Date: 2026-09-12
- Authority / Owner: Project Owner authorization `HEPE-INGEST-MASTER-CONTINUATION-02F-AUTHZ-POSITIVE-CLOSURE`
- Relevant Contract / Assertion: HEPE-INGEST-02F authenticated positive/negative acceptance; Human Authority Preservation; programme-scoped RLS; Source-B validation read model; mandatory rollback.

## Controlled target

- Supabase project: `lztxpjsuzqvtgyasfnyj`
- Programme code: `25510071103503`
- Validation version: `2567-SOURCEB-VALIDATION`
- Source-B SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Validation state: `DRAFT / VALIDATION_ONLY / NOT_ACTIVE / NOT_PUBLISHED`

## System / test sources

1. GitHub Actions run `34640939914` — authenticated negative acceptance — PASS.
2. GitHub Actions run `34641732366` — temporary A0 positive acceptance attempt — partial execution; direct RLS, API and A0 write denial PASS; UI raw HTML marker assertion FAIL; mandatory cleanup PASS.
3. Vercel exact Preview deployment `dpl_DDHMZg22Wi4NCAKWGvaTNucM3gtr` — application SHA `5043b47a134ce7b81194b8236ae9fc92a904f62a` — READY.
4. GitHub Actions UI quality gate run `34642029562` for application SHA `5043b47a134ce7b81194b8236ae9fc92a904f62a` — PASS.
5. GitHub Actions run `34642139383` — authenticated UI positive retest against exact application SHA `5043b47a134ce7b81194b8236ae9fc92a904f62a` — PASS.
6. NON-PRODUCTION Supabase post-cleanup read-only verification — actor subjects restored; target active authority count 0 for PREPARER_A, NO_AUTHORITY and REVIEWER_B; synthetic auth residual 0; Source-B validation summary remains 92 / 16 / 54 / 151 / 7 / 99, DRAFT, is_current=false, approved_at=NULL, activated_at=NULL.

## Pre-state and temporary authority

Before the positive test, PREPARER_A, NO_AUTHORITY and REVIEWER_B each had zero active authority assignments for programme `25510071103503`.

Run `34641732366` created exactly one temporary programme-scoped A0 assignment for PREPARER_A:

- Temporary authority assignment ID: `c5b35672-5205-4896-85d0-5d18a4e19d41`
- Authority level: `A0`
- Scope: `PROGRAMME`
- Programme: `25510071103503`
- Purpose: NON-PRODUCTION Source-B validation read acceptance only
- Permanent authority: **NO**

The assignment was deleted during mandatory cleanup. No A1/A2/A3/A4 Source-B authority was created.

## Test results

| Assertion | Expected | Actual | Result |
|---|---|---|---|
| Genuine PREPARER_A Supabase session | Authenticated | Authenticated | PASS |
| PREPARER_A direct programme-scoped RLS | ALLOW Source-B validation read | ALLOW | PASS |
| Courses | 92 | 92 | PASS |
| Course groups | 16 | 16 | PASS |
| Study-plan rows | 54 | 54 | PASS |
| Study-plan credits | 151 | 151 | PASS |
| PLO | 7 | 7 | PASS |
| Course→PLO I-R-M | 99 | 99 | PASS |
| Source-B provenance SHA visible | Exact SHA | Exact SHA | PASS |
| A0 programme write | DENY | PostgreSQL/RLS error `42501` | PASS |
| Authenticated API `/api/curriculum-import` | HTTP 200 / VALIDATION_MODE | HTTP 200 / VALIDATION_MODE | PASS |
| Curriculum Import Studio authenticated state | AUTHENTICATED_VALIDATION_READ | AUTHENTICATED_VALIDATION_READ | PASS |
| Curriculum Import Studio metrics | 92 / 16 / 54 / 151 / 7 / 99 | 92 / 16 / 54 / 151 / 7 / 99 | PASS |
| NO_AUTHORITY Source-B read | DENY | DENY / API 403 | PASS |
| REVIEWER_B Source-B cross-programme read | DENY | DENY / API 403 | PASS |
| Unauthenticated API | 401 AUTH_REQUIRED | 401 AUTH_REQUIRED | PASS |
| Actor restoration | Exact pre-state | Restored | PASS |
| Temporary A0 cleanup | residual 0 | residual 0 | PASS |
| Temporary auth-user cleanup | residual 0 | residual 0 | PASS |
| Existing authority baseline | unchanged | unchanged | PASS |
| Production touched | NO | NO | PASS |
| Canonical activation | NOT ATTEMPTED | NOT ATTEMPTED | PASS |
| Curriculum publication | NOT ATTEMPTED | NOT ATTEMPTED | PASS |
| Audit Evidence admission | NOT ATTEMPTED | NOT ATTEMPTED | PASS |
| PR merge | NOT ATTEMPTED | NOT ATTEMPTED | PASS |

## Controlled repair / regression history

The first positive run (`34641732366`) reached PASS for genuine authentication, direct Source-B RLS, expected read-model values, A0 write denial and authenticated API, but failed only because the raw React HTML did not contain the literal contiguous string `Courses · 92`. Cleanup still passed with residual 0.

The NON-PRODUCTION UI was then repaired to render each metric label as deterministic text at application commit `5043b47a134ce7b81194b8236ae9fc92a904f62a`. The exact Vercel Preview became READY and the UI quality gate passed. Run `34642139383` then verified the authenticated UI state and all six expected metric values and completed mandatory cleanup with residual 0.

## Post-cleanup system state

Read-only Supabase verification after the test confirmed:

- PREPARER_A Source-B active authority count: `0`
- NO_AUTHORITY Source-B active authority count: `0`
- REVIEWER_B Source-B active authority count: `0`
- Actor identity subjects restored: `true` for all three personas
- Synthetic test auth-user residual: `0`
- Source-B validation state: `DRAFT`
- `is_current = false`
- `approved_at = NULL`
- `activated_at = NULL`
- Source-B validation metrics: courses `92`, course groups `16`, study plan `54`, credits `151`, PLO `7`, I-R-M pairs `99`

## Verification status

**PASS — HEPE-INGEST-02F authenticated positive/negative acceptance closure requirements satisfied within the authorized NON-PRODUCTION scope.**

This record does **not** authorize or perform Production deployment, canonical curriculum activation/publication, institutional adoption, Audit Evidence admission, authority persistence, IAM/RLS semantic expansion, or PR merge.
