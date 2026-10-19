# RU OBE Copilot v2 — Master Continuation State

## Current state
Controlled Pilot Release Candidate evidence package prepared in NON-PRODUCTION.

## Approved decisions
- A5_HUMAN approved RU OBE Copilot Module v2 isolated in HEPE Curriculum Command Center Sandbox.
- Use schema ru_obe.
- Synthetic/read-only controlled pilot authorized.
- Production remains unauthorized.

## Locked baselines
- Supabase host: lztxpjsuzqvtgyasfnyj
- Schema: ru_obe
- Frontend branch: feat/ruobe-v2-controlled-pilot
- Draft PR: #60
- RC head: a51ff631dc39b705bf1e7c1a09786288ea9cfc9f

## Technical status
- Synthetic E2E: PASS
- Visual acceptance: PASS
- Synthetic API acceptance: PASS
- Readiness: PASS_WITH_HUMAN_GATES

## Open human gates
1. REAL_DATA_ACTIVATION
2. PRODUCTION_PUBLIC_RELEASE / MAIN_MERGE

## Next authorized actions
- Maintain RC evidence and regression checks in sandbox.
- Prepare real-data activation decision brief without ingesting real data.
- Prepare production/main-merge decision brief without executing merge or production deploy.
- Continue only reversible non-production QA automatically.

## Prohibited actions
- Do not merge main.
- Do not deploy production.
- Do not ingest real student/person-level data.
- Do not publish official academic output.
- Do not promote AI evidence to VERIFIED/AUTHORITATIVE.
- Do not overwrite HEPE canonical tables.

## Systems
- Supabase: lztxpjsuzqvtgyasfnyj
- AWOS/WPOS control plane: etsllqjphpeyijfpboee
- GitHub: kasemch/hepe-ui-prototype
- Branch: feat/ruobe-v2-controlled-pilot
- PR: #60

## Evidence dependencies
- ru_obe.pilot_readiness_checks
- ru_obe.audit_events
- ru_obe.change_log
- Vercel deployments dpl_5pERdw56mMqEvPSFhMpUggM9oVUD and dpl_4LjM2aJXSzCxF6cTzEACquRwecTi
- GitHub PR #60 and head commit a51ff631dc39b705bf1e7c1a09786288ea9cfc9f
