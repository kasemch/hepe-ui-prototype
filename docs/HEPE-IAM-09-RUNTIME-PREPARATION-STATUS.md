# HEPE-IAM-09B/09C/09F Runtime Preparation Status

Status: NON-PRODUCTION / SYNTHETIC-ONLY / 09F PARTIAL PASS — PREVIEW HOLD
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

- Source: Vercel deployment `dpl_BHAXgxzzuRpGXMRCX8nmacRZDnFe`.
- Branch: `feat/hepe-iam-09-user-access`.
- Commit: `d24e999ddbf3a0deca745a990d4b624ac123ad45`.
- Expected: `npm run build` completes successfully.
- Actual: Next.js stopped because TypeScript build dependencies were absent.
- Result: FAIL.
- Remediation: `typescript`, `@types/react`, and `@types/node` were added as development dependencies in commit `9cc3ad54b26e561bd46be0fa408de191b1259352`.

### EV-IAM-09F-02 — First controlled CI attempt

- Source: GitHub Actions run `34757752309`, job `103724981777`.
- Expected: dependency installation and `npm run build` execute.
- Actual: `actions/setup-node` failed before dependency installation because npm caching was enabled but no lock file existed.
- Result: FAIL (runner/workflow configuration; application build not executed).
- Remediation: removed npm cache requirement in commit `89d33f8b9099132633cf9c766db226b2db10b1ae`.

### EV-IAM-09F-03 — Independent controlled static build

- Evidence Type: Test / Regression Evidence.
- Source: GitHub Actions workflow `HEPE IAM Preview Build`.
- Run ID: `34757898361`.
- Job ID: `103725366315`.
- Exact source commit: `89d33f8b9099132633cf9c766db226b2db10b1ae`.
- Environment: GitHub-hosted Ubuntu 24.04 runner; Node 20.20.2; synthetic Supabase URL/key placeholders only.
- Test scope: checkout → Node setup → `npm install --no-audit --no-fund` → `npm run build`.
- Expected: dependencies install; Next.js optimized build completes; IAM routes are included in generated route manifest.
- Actual: Install dependencies = SUCCESS; Build = SUCCESS; workflow job = SUCCESS.
- Build output: Next.js 15.5.25 compiled successfully, type checking completed, 9 static pages generated.
- Verified route manifest includes `/`, `/auth/callback`, `/auth/callback/status`, `/login`, `/user-access`, `/user-access/effective-access`.
- Result: PASS.
- Verification Status: VERIFIED SYSTEM / TEST EVIDENCE for static build only.

### FI-IAM-09F-01 — Vercel preview verification still blocked

- Source: Vercel project deployment inventory and GitHub/Vercel status.
- Latest available deployment for this IAM branch remains `dpl_BHAXgxzzuRpGXMRCX8nmacRZDnFe` from the earlier commit; no fresh deployment for the corrected head is available in the checked deployment inventory.
- Prior status also indicated Vercel build-rate-limit / upgrade-to-Pro condition.
- Interpretation: a current rendered Preview cannot yet be used for HTTP/visual/runtime regression.
- Gate effect: static build sub-gate passes; rendered-preview/runtime acceptance remains HOLD.

## Gate decision

- `HEPE-IAM-09F-STATIC-BUILD = PASS`
- `HEPE-IAM-09F-PREVIEW-RUNTIME = HOLD`
- Overall `HEPE-IAM-09F = PARTIAL PASS / EXCEPTION STOP`

PR #40 must remain Draft until the current branch head is available in a non-production rendered Preview and the required route/runtime checks have PASS evidence. Static build PASS does not authorize real users, email delivery, authority grants, RLS/schema/data changes, merge, deployment to production, or production use.

## Remaining closure path

1. Obtain a fresh Vercel Preview or another controlled rendered non-production runtime from the current branch head.
2. Verify HTTP/render behavior for `/`, `/login`, `/user-access`, `/user-access/effective-access`.
3. Verify negative auth callback behavior, including missing-code and controlled error paths.
4. Record test scope, expected result, actual result and PASS/FAIL.
5. Only after those checks pass may 09F be closed and PR #40 be considered for Ready-for-Review status.
