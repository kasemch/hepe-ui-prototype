# HEPE Rollback Specification — NON-PRODUCTION v1

Status: CONTROLLED DRAFT / NON-PRODUCTION ONLY
Project: HEPE Curriculum Governance & Development

## 1. Purpose
Define the minimum rollback contract for controlled pilot and release-readiness work without granting Production authority.

## 2. Rollback triggers
Rollback or restore must be considered when any of the following occurs:
- unauthorized authority or IAM mutation
- baseline state changes unexpectedly
- Preview regression affecting mandatory controlled-pilot paths
- evidence admission state changes without formal authorization
- provenance or temporal history corruption
- security change causes broader access than intended

## 3. Required before-state capture
Before any separately authorized mutable operation, record:
- exact repository SHA / branch
- Vercel deployment identifier
- Supabase target project
- authority assignment count
- relevant governed row identifiers and current versions
- programme/curriculum lifecycle state
- Evidence Candidate admission state

## 4. Rollback strategy
### Application
- Restore the last verified Preview commit/deployment.
- Do not promote a rollback deployment to Production under this document.

### Database
- Prefer append-only correction/supersession when domain history requires preservation.
- Do not use destructive UPDATE/DELETE on append-only governed history.
- Security or schema rollback requires an authorized migration plan; this document does not authorize DDL.

### IAM / authority
- Any temporary test binding must be removed/restored to the recorded before-state.
- Authority assignment rollback must be separately authorized and verified by final readback.

## 5. Rollback verification
After rollback, confirm:
- intended Preview SHA/deployment restored
- authority assignment count matches approved expected state
- no unexpected IAM binding remains
- programme/curriculum lifecycle state unchanged unless separately authorized
- Evidence Candidates remain NOT_ADMITTED unless formally admitted
- no Production mutation occurred

## 6. Evidence package
A rollback test/incident record should contain:
- scope
- trigger
- expected result
- actual result
- affected identifiers
- before-state
- rollback action
- after-state
- PASS/FAIL
- verifier/authority

## 7. Production boundary
This specification is not a Production rollback authorization. A Production-specific rollback plan must be approved as part of a separate Production Authorization gate.
