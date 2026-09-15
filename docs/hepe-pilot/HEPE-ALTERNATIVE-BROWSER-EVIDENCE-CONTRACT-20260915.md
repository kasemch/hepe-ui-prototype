# HEPE Alternative Browser Evidence Contract — 2026-09-15

Status: CONTROLLED DRAFT / NON-PRODUCTION ONLY / NOT PRODUCTION AUTHORIZATION / NOT AUDIT EVIDENCE

## Purpose
Provide an explicitly bounded alternative acceptance method when the current execution channel cannot establish an end-to-end protected Vercel browser session because protected subroutes redirect through Vercel SSO.

This contract does **not** claim real-human browser-session correlation. It may be used only for technical pre-production release-readiness acceptance of an exact application SHA.

## Exact release candidate
- Repository: `kasemch/hepe-ui-prototype`
- RC branch: `rc/hepe-preprod-20260915`
- Exact SHA: `435dbdd6786663d9cd9523bea2fc0bbeae509152`
- Vercel exact-SHA deployment: `dpl_89oCUBCfJ6WdjDA5y3siRFMfo7Vj`
- Deployment state: READY

## Alternative acceptance evidence contract
Acceptance requires all of the following to be true for the same exact SHA:

1. **Source identity** — GitHub commit SHA is fixed and traceable.
2. **CI integrity** — TypeScript check, build, governance/no-fabrication assertions and boundary summary pass for that SHA.
3. **Deployment identity** — Vercel deployment metadata identifies the same GitHub commit SHA and is READY.
4. **Runtime reachability** — exact-SHA root route returns HTTP 200 through Vercel protected-deployment access tooling.
5. **Protected-route existence and boundary** — route source exists at the same SHA and explicitly preserves NON-PRODUCTION/read-only/not-active/not-published controls.
6. **Security state readback** — critical S5 authority/identity mutation RPC is not generically executable by `authenticated`; M.Kor workspace view is security-invoker; project remains DRAFT/not-current.
7. **No runtime error signal** — no runtime errors are observed in the defined release-readiness observation window.
8. **Known limitation recorded** — inability to prove end-to-end real-human browser-session correlation is explicitly retained and is never relabeled as PASS.

## Current execution result
- Exact SHA identity: PASS
- CI: PASS (`HEPE Controlled Pilot 03 Quality`, run 147)
- Build: PASS
- Governance/static boundary assertions: PASS
- Vercel exact-SHA deployment READY: PASS
- Exact-SHA root HTTP 200: PASS
- `/curriculum` protected browser route through current execution channel: REDIRECTED TO VERCEL SSO / REAL-HUMAN SESSION NOT PROVEN
- Exact-SHA `/curriculum` source: VERIFIED PRESENT and explicitly NON-PRODUCTION / READ ONLY / NOT ACTIVE / NOT PUBLISHED
- Production deployment performed: NO
- Baseline promotion performed: NO
- Audit Evidence admission performed: NO

## Acceptance interpretation
**ALTERNATIVE EXACT-SHA TECHNICAL ACCEPTANCE = PASS WITH EVIDENCE LIMITATION**

This closes the technical release-readiness dependency that required an exact-SHA browser-equivalent acceptance method, but it does **not** close or overwrite the separate statement:

`REAL HUMAN PROTECTED-PREVIEW BROWSER SESSION = NOT PROVEN`

## Governance firewall
This contract does not authorize:
- Production deployment
- Production release
- baseline activation or `is_current=true`
- IAM/authority expansion
- security-control weakening
- automatic Audit Evidence admission

Any Production GO remains a separate Human Authority decision after baseline and release-governance review.
