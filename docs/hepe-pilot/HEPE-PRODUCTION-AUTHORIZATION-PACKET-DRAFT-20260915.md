# HEPE Production Authorization Packet — DRAFT

Status: NON-PRODUCTION / PREPARATION ONLY / NOT AN AUTHORIZATION
Project: HEPE Curriculum Governance & Development
Prepared date: 2026-09-15

## 1. Purpose
This packet consolidates current release-readiness evidence for a future Human Production Authorization decision. It does not authorize Production deployment, baseline promotion, curriculum activation, authority expansion, IAM changes, or Audit Evidence admission.

## 2. Current governance state
- Programme status: DRAFT
- Curriculum status: DRAFT
- Curriculum is_current: false
- Authority assignments: 13
- Production authorization: NO
- Baseline promotion: NO
- Audit Evidence admission: NO

## 3. Security package status
NON-PRODUCTION Security Package HD-01 through HD-06 has been executed within approved scope.

Verified system state:
- critical authority/identity mutation RPC `public.hepe_people_01b2h_bind_current_programme_chair()` is not executable by `authenticated`.
- `public.v_hepe_mkor_workspace_v1` is `security_invoker=true`.
- public RLS/no-policy tables previously carrying direct anon/authenticated privileges were reduced to zero direct privileges in the approved remediation scope.
- private helper access was reconciled after regression and restricted to required wrapper dependencies.
- rollback acceptance `HEPE-ROLLBACK-SECURITY-PRIV-02` = PASS.
- Security Definer View ERROR was remediated and disappeared from the Supabase Security Advisor.

Residual review populations:
- Supabase Security Advisor: RLS enabled/no-policy = 62 informational review items.
- authenticated-callable public SECURITY DEFINER functions = 23 warning review items.
These counts are review populations, not automatically 62/23 confirmed vulnerabilities.

## 4. Password-security residual risk
Leaked-password protection remains unavailable on the current Supabase plan. Human-approved NON-PRODUCTION compensating controls were configured by the user:
- minimum password length = 8
- password complexity = lowercase + uppercase + digit + symbol

Verification classification:
- user-confirmed configuration
- not independently system-read-back by the currently available connector
- leaked-password protection remains a known platform-plan residual risk

This residual risk must be reconsidered separately before Production authorization.

## 5. Repository / release integrity
Controlled release lane: `non-production`.

Verified repository controls previously observed on this lane:
- active repository ruleset
- pull request requirement
- required `governance-policy` status check
- no non-fast-forward updates / force-push behavior
- no deletion
- no bypass actors
- latest observed controlled-lane commit had verified signature provenance

Development/security branch:
- `feat/hepe-controlled-pilot-03`
- current security-package head observed at `4452fd062afaf9f8ae60270b4a3a7169923f07a3`
- PR #34 is OPEN, DRAFT, mergeable, and explicitly states that merge is not authorized under its current gate.
- HEPE Controlled Pilot 03 Quality workflow for SHA `4452fd062afaf9f8ae60270b4a3a7169923f07a3` completed successfully.

## 6. Runtime state
Supabase project `lztxpjsuzqvtgyasfnyj` is ACTIVE_HEALTHY.
Vercel project `hepe-ui-prototype` has READY preview deployments.
No Vercel runtime errors were found in the latest 12-hour runtime-error query at preparation time.

Important limitation:
The latest Vercel deployment belongs to another active feature branch (`feat/hepe-people-01b2h-decision-ui`), not the security-package branch. Therefore this packet does not claim exact-SHA browser acceptance of the final security-package database posture.

## 7. Human runtime evidence
- real HUMAN authentication session: previously verified
- A4 Programme Chair binding: verified
- authenticated HUMAN governance action: verified
- protected-preview browser-session correlation: not proven end-to-end

This remains an evidence limitation, not a fabricated PASS.

## 8. Operations / rollback
Prepared controlled NON-PRODUCTION documents include:
- `docs/hepe-pilot/HEPE-OPERATIONS-RUNBOOK-NONPROD-v1.md`
- `docs/hepe-pilot/HEPE-ROLLBACK-SPEC-NONPROD-v1.md`

Database rollback acceptance for the reconciled security privilege posture passed.
These documents are not Production-approved runbooks unless separately authorized.

## 9. Current decision status
Technical NON-PRODUCTION security remediation: PASS WITH ACCEPTED RESIDUAL PLATFORM RISK.
Release-readiness consolidation: READY FOR HUMAN GOVERNANCE REVIEW, NOT FOR AUTOMATIC PRODUCTION.

## 10. Decisions that remain separate
The following must not be bundled implicitly:

### HD-07 — Baseline Promotion
Current recommendation: DEFER.
Programme and curriculum remain DRAFT / validation state / not current.

### HD-08 — Production Authorization
Current status: NOT AUTHORIZED.
An explicit Production authorization is required before any Production deployment or mutation.

### HD-09 — Audit Evidence Admission
Current status: NOT_ADMITTED.
Evidence candidates remain candidates until formally admitted under the HEPE Audit Evidence Admission Rule.

## 11. Production preconditions still requiring explicit review
Before Production authorization, Human Authority should explicitly accept or close at least:
1. current 23 public SECURITY DEFINER review items by intended exposure/guard classification;
2. current 62 RLS-no-policy review items by intended deny/mediated/read-policy classification;
3. leaked-password protection platform limitation and whether compensating controls are sufficient for Production or a plan upgrade is required;
4. browser-session correlation limitation;
5. exact release ref/SHA to be promoted through the controlled `non-production` lane;
6. final Production rollback owner and release window;
7. baseline promotion decision, if Production requires an active/current curriculum baseline.

## 12. Packet verdict
`READY_FOR_HUMAN_PRODUCTION_DECISION_PREPARATION_ONLY`

This packet is NOT a Production Authorization.
This packet is NOT a Baseline Promotion.
This packet is NOT an Audit Evidence Admission.
