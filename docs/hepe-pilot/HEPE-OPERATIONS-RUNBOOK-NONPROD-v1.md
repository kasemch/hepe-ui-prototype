# HEPE Operations Runbook — NON-PRODUCTION v1

Status: CONTROLLED DRAFT / NON-PRODUCTION ONLY
Project: HEPE Curriculum Governance & Development
Scope: Controlled Pilot / Release Readiness

## 1. Operating boundary
- NON-PRODUCTION only.
- No Production deployment, Production data write, IAM escalation, authority creation, baseline promotion, or automatic Audit Evidence Admission.
- Programme/curriculum validation state must remain DRAFT / VALIDATION ONLY / not current unless a separate authorized gate changes it.

## 2. Pre-run checks
1. Confirm target Supabase project is the HEPE sandbox.
2. Confirm Vercel target is Preview, not Production.
3. Confirm current authority assignment count before any authorized change.
4. Confirm Evidence Candidates remain NOT_ADMITTED unless a formal Evidence Admission Gate exists.
5. Confirm no current exception requires Production action.

## 3. Health checks
- Vercel latest Preview deployment state.
- Preview runtime HTTP error trend.
- Supabase security advisor review state.
- Command Center read model availability.
- Course Registry, PEOPLE read model, Evidence projection/health, Governance queue, Review queue.
- Authority-aware fail-closed behavior for no-actor / wrong-scope sessions.

## 4. Controlled pilot operating rules
- Prefer read-only operations.
- Do not impersonate an authorized HUMAN persona.
- Do not create or modify authority merely to make a test pass.
- Any command that writes governed data must use the existing controlled command/review workflow and an authorized actor.
- Temporary test identities or bindings require a separate explicit authorization and mandatory cleanup/readback.

## 5. Incident handling
If a security, authority, baseline, or provenance inconsistency is detected:
1. Stop the affected substep.
2. Preserve current state.
3. Capture system evidence and exact scope.
4. Open a reconciliation/finding item where supported.
5. Do not modify the baseline automatically.

## 6. Release-readiness blockers currently requiring closure before Production
- Authorized HUMAN persona runtime acceptance.
- SECURITY DEFINER exposure review/remediation decision.
- RLS-no-policy intent classification.
- Leaked-password protection decision.
- Release branch/commit integrity policy.
- Controlled rollback verification.
- Explicit baseline decision where applicable.
- Separate Explicit Production Authorization.

## 7. Evidence rule
Conversation is not Audit Evidence. System evidence and controlled records remain candidates until formally admitted.

## 8. End-of-run readback
Record at minimum:
- deployment state
- authority assignment count
- programme/curriculum status
- IAM mutation count
- Production mutation count
- Evidence admission state
- unresolved blockers

Owner/authority for this document must be assigned through the project governance process before Production use.
