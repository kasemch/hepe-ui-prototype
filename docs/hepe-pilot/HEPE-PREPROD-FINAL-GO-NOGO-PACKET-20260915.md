# HEPE PRE-PRODUCTION FINAL GO / NO-GO PACKET — 2026-09-15

Status: CONTROLLED DRAFT / NON-PRODUCTION ONLY / NOT PRODUCTION AUTHORIZATION / NOT AUDIT EVIDENCE

## Exact release candidate
- Branch: `rc/hepe-preprod-20260915`
- SHA: `435dbdd6786663d9cd9523bea2fc0bbeae509152`
- Vercel exact-SHA Preview deployment: `dpl_89oCUBCfJ6WdjDA5y3siRFMfo7Vj`
- Preview state: READY
- Exact-SHA root route: HTTP 200
- Exact-SHA protected subroute browser acceptance: NOT PROVEN; `/curriculum` redirected to Vercel SSO in current execution channel
- GitHub workflow on exact SHA: `HEPE Controlled Pilot 03 Quality` run 147 = SUCCESS

## Governance state readback
- Supabase project: ACTIVE_HEALTHY
- Authority assignments: 13
- Programme status: DRAFT
- Curriculum status: DRAFT
- Curriculum is_current: false
- Production authorization: NO
- Baseline promotion: NO
- Audit Evidence admission: NO

## Security closure
- Critical authority/identity mutation RPC generic authenticated EXECUTE: REVOKED
- `v_hepe_mkor_workspace_v1`: security_invoker=true
- Security Definer View ERROR: CLOSED
- RLS/no-policy advisor population: 62 (review population, not 62 proven vulnerabilities)
- Public authenticated SECURITY DEFINER advisor population: 23

### Residual 23 SECURITY DEFINER classification
The 23 remaining functions are not classified as vulnerabilities solely because the advisor lists them. Current verified code review groups them as:
- learner self-scoped reads guarded by `auth.uid()`
- instructor-scoped reads/writes with instructor guard logic
- synthetic-only HEPE pilot write functions with auth + synthetic-programme + authority/binding guards
- support workflow functions requiring actor binding; transition paths additionally enforce support-role / ticket-owner guards

Production exposure remains subject to least-privilege policy acceptance and regression evidence; no blanket revoke is recommended without caller-impact testing.

## Password security residual risk
- Supabase leaked-password protection: unavailable on current plan; advisor remains WARN
- Human-approved compensating controls: minimum length 8; lowercase + uppercase + digit + symbol
- Compensating controls status: USER_CONFIRMED / NOT CONNECTOR-READBACK VERIFIED

## Release lane
- Protected lane: `non-production`
- Draft PR: #54 from `rc/hepe-preprod-20260915` → `non-production`
- PR is intentionally DRAFT
- Current PR mergeability reported false; do not merge until conflicts/checks are reconciled and exact-SHA acceptance is repeated if SHA changes

## Runtime
- Vercel project runtime-error check in preceding final regression: no runtime errors in selected 12-hour range
- No Production deployment performed

## GO / NO-GO assessment
### Technical NON-PRODUCTION
PASS WITH KNOWN LIMITATIONS

### Production
NO-GO at this time.

Blocking reasons:
1. Protected Preview browser-session/subroute acceptance for the exact RC SHA is not proven end-to-end in the current execution channel.
2. Draft PR #54 is currently not mergeable and must be reconciled before using the protected `non-production` lane.
3. Programme/Curriculum remain DRAFT and curriculum `is_current=false`; baseline promotion is a separate Human Authority decision.
4. Production Authorization has not been explicitly granted.

Residual / accepted non-production risks:
- leaked-password protection unavailable by plan, with user-approved password-strength compensating controls
- 23 public SECURITY DEFINER functions remain intentional review population, requiring least-privilege preservation and regression if changed
- 62 RLS-enabled/no-policy tables remain review population; fail-closed posture must not be weakened merely to silence advisor notices

## Human decisions still separate
- HD-07 Baseline Promotion: DEFER / separate authorization
- HD-08 Production Authorization: NO-GO / NOT AUTHORIZED
- HD-09 Audit Evidence Admission: DEFER / NOT_ADMITTED

## Required next closure before another Production GO decision
1. Reconcile PR #54 mergeability without merging to Production.
2. Establish an exact-SHA protected Preview browser acceptance path or document an explicitly accepted alternative evidence contract.
3. Re-run exact-SHA CI/runtime/security regression after any SHA-changing reconciliation.
4. Present final Production GO/NO-GO packet to Human Authority.

This document does not itself authorize Production, baseline activation, schema/IAM/authority changes, or Audit Evidence admission.
