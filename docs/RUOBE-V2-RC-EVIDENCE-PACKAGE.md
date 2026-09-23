# RU OBE Copilot v2 — Controlled Pilot Acceptance & Release Candidate Evidence Package

Status: RELEASE CANDIDATE FOR CONTROLLED PILOT REVIEW
Environment: NON-PRODUCTION
Production authorized: NO
Real student/person-level data authorized: NO
Public/official release authorized: NO

## 1. Identity
- Module: RU-OBE-COPILOT-V2
- Host Supabase project: lztxpjsuzqvtgyasfnyj
- Isolated schema: ru_obe
- Frontend repository: kasemch/hepe-ui-prototype
- Branch: feat/ruobe-v2-controlled-pilot
- Draft PR: #60
- RC head commit: a51ff631dc39b705bf1e7c1a09786288ea9cfc9f

## 2. Technical acceptance evidence
- Foundation schema audit/hardening: PASS
- HEPE reuse/isolation crosswalk: PASS
- Candidate import layer: PASS
- Assessment/rubric primitives: PASS
- Calculation snapshots/results: PASS
- Structural QA/verification primitives: PASS
- Command/API contracts: PASS
- Synthetic E2E: PASS
- TQF candidate layer: PASS
- UI baseline: PASS
- Visual acceptance: PASS
- Synthetic read-only API acceptance: PASS

## 3. Synthetic acceptance facts
- Structural findings: 0
- Achievement result: 80%
- Criterion evaluation: MET
- Evidence status: CANDIDATE
- Data class: SYNTHETIC
- Real student/person-level records loaded: NO
- Academic verification claimed: NO

## 4. Preview evidence
Visual preview deployment:
- Deployment: dpl_5pERdw56mMqEvPSFhMpUggM9oVUD
- Route: /ru-obe
- HTTP: 200
- State: READY
- Rendered controls: NON-PRODUCTION, Production LOCKED, SYNTHETIC_FIXTURE, CANDIDATE, Human Gates = 2

Synthetic API deployment:
- Deployment: dpl_4LjM2aJXSzCxF6cTzEACquRwecTi
- Endpoint: /ru-obe/api/summary
- HTTP: 200
- State: READY
- environment: NON_PRODUCTION
- dataClass: SYNTHETIC
- evidenceStatus: CANDIDATE
- productionAuthorized: false
- x-robots-tag: noindex

## 5. Readiness checks
PASS:
- PR-ARCH-01
- PR-AUTH-01
- PR-CALC-01
- PR-EVID-01
- PR-QA-01
- PR-TQF-01
- PR-UI-01

HUMAN GATE:
- PR-REALDATA-01 — real student/person-level data activation
- PR-PROD-01 — production/public release

## 6. Repository state
- Base: main @ 835922bf17d0d21a69f2696490ecb8535b6d8989
- Head: feat/ruobe-v2-controlled-pilot @ a51ff631dc39b705bf1e7c1a09786288ea9cfc9f
- Ahead by: 5 commits
- Behind by: 0 commits
- PR #60: OPEN / DRAFT / NOT MERGED

## 7. Files introduced
- app/ru-obe/page.tsx
- app/ru-obe/pilot-adapter.ts
- app/ru-obe/api/summary/route.ts
- docs/RUOBE-V2-CONTROLLED-PILOT.md

## 8. Governance boundaries
PROHIBITED without explicit A5 human authorization:
- merge to main
- production deployment
- public/official release
- real student/person-level data ingestion
- promotion of AI-generated evidence to VERIFIED/AUTHORITATIVE
- overwrite of HEPE canonical tables

## 9. Rollback
Frontend rollback: close PR #60 or delete isolated branch.
Backend rollback: remove only ru_obe module additions created by RUOBE migrations; do not alter public HEPE canonical tables.
Synthetic fixture reset: delete only SYN-* fixture records and synthetic snapshots.

## 10. Release status
PASS_WITH_HUMAN_GATES

This package supports controlled-pilot review only. It is not production approval, public release approval, or academic verification.
