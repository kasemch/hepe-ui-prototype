# HEPE-IAM-09B/09C/09F Runtime Preparation Status

Status: NON-PRODUCTION / SYNTHETIC-ONLY / 09F PASS
Date: 2026-09-13
Branch: `feat/hepe-iam-09-user-access`

## Implemented source surfaces

- `/login` — controlled login UX preparation; email input and Magic Link/OTP action are intentionally disabled.
- `/user-access` — User & Access Center prototype for roles, scopes, authorities and governance rules.
- `/user-access/effective-access` — synthetic effective-access preview showing ALLOW/DENY examples.
- `/` — links to IAM preparation surfaces and states non-production boundaries.

## Governance preserved

- Authenticated ≠ Authorized.
- System Admin ≠ Academic Authority.
- Least privilege and scope-bound access remain required.
- RLS is the planned enforcement layer.
- No real user creation.
- No invitation or email delivery.
- No SMTP change.
- No database write.
- No schema migration.
- No RLS modification.
- No production authorization.

## 09F verification evidence

### EV-IAM-09F-01 — Initial Vercel preview build failure

- Evidence Type: Test / Regression Evidence.
- Source: Vercel deployment `dpl_BHAXgxzzuRpGXMRCX8nmacRZDnFe`.
- Version/Date: commit `d24e999ddbf3a0deca745a990d4b624ac123ad45`, 2026-09-13.
- Authority/Owner: HEPE non-production repository / Vercel project linked to `kasemch/hepe-ui-prototype`.
- Relevant assertion: Next.js source must build successfully before runtime acceptance.
- Expected: `npm run build` completes successfully.
- Actual: Next.js stopped because TypeScript build dependencies were absent.
- Result: FAIL.
- Remediation: added `typescript`, `@types/react`, and `@types/node` as development dependencies in commit `9cc3ad54b26e561bd46be0fa408de191b1259352`.
- Verification Status: VERIFIED historical failure; superseded by later successful controlled build evidence.

### EV-IAM-09F-02 — First controlled CI attempt

- Evidence Type: Test / Regression Evidence.
- Source: GitHub Actions run `34757752309`, job `103724981777`.
- Version/Date: branch state at commit `29e0abae97b3c87dab26bbc2bf19786df23e7caf`, 2026-09-13.
- Relevant assertion: controlled CI runner must reach dependency installation and build.
- Expected: dependency installation and `npm run build` execute.
- Actual: `actions/setup-node` stopped because npm caching was enabled while no dependency lock file existed.
- Result: FAIL (runner/workflow configuration; application build not executed).
- Remediation: removed npm cache requirement in commit `89d33f8b9099132633cf9c766db226b2db10b1ae`.
- Verification Status: VERIFIED historical workflow failure; superseded by later successful controlled CI evidence.

### EV-IAM-09F-03 — Independent controlled static build

- Evidence Type: Test / Regression Evidence.
- Source: GitHub Actions workflow `HEPE IAM Preview Build`, run `34757898361`, job `103725366315`.
- Version/Date: exact source commit `89d33f8b9099132633cf9c766db226b2db10b1ae`, 2026-09-13.
- Authority/Owner: HEPE repository GitHub Actions runner.
- Environment: GitHub-hosted Ubuntu 24.04; Node 20.20.2; synthetic Supabase URL/key placeholders only.
- Relevant assertion: source compiles, type checks and produces required route manifest.
- Expected: install succeeds; optimized Next.js build succeeds; IAM routes appear in route manifest.
- Actual: install SUCCESS; build SUCCESS; Next.js compile/type check/static generation SUCCESS; required routes present.
- Result: PASS.
- Verification Status: VERIFIED SYSTEM / TEST EVIDENCE.

### EV-IAM-09F-04 — Controlled synthetic runtime route regression

- Evidence Type: Test / Regression Evidence.
- Source: GitHub Actions workflow `HEPE IAM Preview Build`, run `34758110387`, job `103725947535`.
- Version/Date: exact source commit `6a5ba691f5e6b410d28e4c0ec47cd370dc455906`, 2026-09-13.
- Authority/Owner: HEPE repository GitHub Actions runner.
- Environment: local Next.js runtime bound to `127.0.0.1:3000` inside the controlled GitHub-hosted runner; synthetic Supabase placeholders only.
- Relevant assertion: application shell and IAM surfaces must render over HTTP; missing-code callback must fail closed.
- Expected: `/`, `/login`, `/user-access`, `/user-access/effective-access` return HTTP 200; `/auth/callback` without code returns HTTP 400 with `HEPE_AUTH_CALLBACK_CODE_MISSING`.
- Actual: all runtime startup and smoke-test steps completed SUCCESS.
- Result: PASS.
- Verification Status: VERIFIED SYSTEM / TEST EVIDENCE.

### EV-IAM-09F-05 — Controlled negative-auth-path regression

- Evidence Type: Test / Regression Evidence.
- Source: GitHub Actions workflow `HEPE IAM Preview Build`, run `34758159564`, job `103726083030`.
- Version/Date: exact source commit `28ae66f6388761c2f964a7a41cce097d100874b4`, 2026-09-13.
- Authority/Owner: HEPE repository GitHub Actions runner.
- Environment: local Next.js runtime bound to `127.0.0.1:3000`; synthetic Supabase placeholders only.
- Relevant assertions:
  - standard IAM pages must remain reachable;
  - missing authorization code must fail closed;
  - controlled provider error must redirect to the callback status surface;
  - callback status surface must render successfully.
- Expected:
  - `/`, `/login`, `/user-access`, `/user-access/effective-access` = HTTP 200;
  - `/auth/callback` without code = HTTP 400 and `HEPE_AUTH_CALLBACK_CODE_MISSING`;
  - `/auth/callback?error=access_denied&error_description=synthetic` = HTTP 307 with redirect to `/auth/callback/status?status=error...reason=access_denied`;
  - callback status route = HTTP 200.
- Actual: Build, runtime startup, route checks, missing-code check, controlled-error redirect check, callback-status check and runtime cleanup all completed SUCCESS.
- Result: PASS.
- Verification Status: VERIFIED SYSTEM / TEST EVIDENCE.

### FI-IAM-09F-01 — Vercel fresh-preview constraint

- Source: Vercel deployment inventory.
- Current condition: no fresh Vercel deployment for the corrected branch head was available during this gate; earlier checks indicated a build-rate-limit condition.
- Reconciliation: the gate's previously documented admissible closure path allowed either a fresh Vercel Preview **or another controlled rendered non-production runtime**. EV-IAM-09F-04 and EV-IAM-09F-05 satisfy the latter with exact-commit controlled runtime evidence.
- Status: CLOSED FOR 09F. A later Vercel visual acceptance may still be performed as an additional UI/preview check but is not required to claim the controlled runtime smoke assertions proven here.

## Gate decision

- `HEPE-IAM-09F-STATIC-BUILD = PASS`
- `HEPE-IAM-09F-CONTROLLED-RUNTIME = PASS`
- `HEPE-IAM-09F-NEGATIVE-AUTH-PATHS = PASS`
- Overall `HEPE-IAM-09F = PASS FOR READY-FOR-REVIEW CONSIDERATION`

This PASS applies only to the tested NON-PRODUCTION / SYNTHETIC-ONLY scope. It does not authorize real users, real invitation/email delivery, SMTP change, authority grants, schema/RLS/data writes, production deployment, or production use.

## Next gate

`HEPE-IAM-09G — Controlled Real-User Pilot Authorization Gate` remains separate and is **not authorized by this document**. Before any 09G execution, explicit scope must identify allowed identities, invitation/email behavior, authority assignments, environment, rollback/cleanup requirements, and whether any schema/RLS/data write is authorized.
