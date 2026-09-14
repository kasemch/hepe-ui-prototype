# HEPE RELEASE READINESS 07–08 — Release Integrity & Operations Readiness

Status: CONTROLLED DRAFT — NON-PRODUCTION ONLY

This document does not authorize Production deployment, merge, branch-rule mutation, IAM change, baseline promotion, or Audit Evidence admission.

## 1. Current Verified Release Integrity State

- Working branch: `feat/hepe-controlled-pilot-03`
- Branch protection: OFF in latest verified readback
- Unsigned commits observed
- Existing NON-PRODUCTION Operations Runbook: `docs/hepe-pilot/HEPE-OPERATIONS-RUNBOOK-NONPROD-v1.md`
- Existing NON-PRODUCTION Rollback Specification: `docs/hepe-pilot/HEPE-ROLLBACK-SPEC-NONPROD-v1.md`

## 2. Proposed Release Integrity Policy

Before Production authorization, require a controlled release ref with:
- pull request required,
- required CI checks,
- no force push,
- branch deletion restricted,
- exact-SHA Preview acceptance,
- controlled deployment source,
- commit provenance policy (signed commits or equivalent verified provenance),
- release SHA recorded in authorization packet,
- rollback target SHA recorded before deployment,
- human authority separation between preparation/review/approval.

No branch-protection or ruleset mutation is authorized by this document.

## 3. Operations Readiness Structure

Production-ready runbook should identify:
- system owner,
- operational owner,
- release approver,
- rollback owner,
- incident contact path,
- release preconditions,
- deployment verification,
- post-deployment health checks,
- database integrity checks,
- authority/IAM checks,
- evidence integrity checks,
- rollback triggers,
- rollback procedure,
- post-rollback verification,
- incident/support escalation.

## 4. Rollback Acceptance Test Specification

Required fields:
- Test ID
- Scope
- Exact source SHA
- Exact rollback SHA
- Preconditions
- Rollback trigger
- Expected result
- Actual result
- PASS/FAIL
- Cleanup
- Evidence reference

A rollback plan is not rollback evidence. PASS may only be recorded after actual test execution.

## 5. No Silent Remediation Rule

Any release-integrity or operations concern follows:
Observation/Finding → Proposed Control → Test Plan → Rollback Plan → Authorization → Execution → Regression Evidence.

## 6. Human Decision Boundaries

Human decision is required before:
- enabling branch protection/rulesets,
- mandating commit signing as an enforced repository rule,
- changing release branch policy,
- approving a Production Operations Runbook,
- authorizing Production deployment.