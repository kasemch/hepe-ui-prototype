# HEPE-WEB-01 — Non-Production Preview Readiness & First Integrated Website Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **PROPOSED CONTROLLED EVIDENCE RECORD — preview/browser verification pending**  
Production Authorization: **NOT GRANTED**

## Controlled starting state
- Authoritative branch before WEB-01: `non-production`
- Starting SHA: `84148e8e91a4d1fa3566146133dc23995ff189e9`
- HEPE-REL-02A: controlled/reconciled; durable persistence and RLS foundation verified.
- HEPE-REL-03 application runtime binding: not yet verified; WEB-01 must not present runtime E2E as complete.

## Repository discovery
Verified repository inspection showed a deployable Next.js application using Next 15 / React 19 with existing root application shell, authentication callback paths and NON-PRODUCTION runtime-binding controls. The pre-WEB-01 home page was a minimal prototype page rather than an integrated command center.

## WEB-01 implementation
This branch introduces the first integrated browser-facing academic command center without changing schema/RLS, secrets, SMTP, academic authority or Production configuration.

Implemented:
- Academic Command Center homepage
- persistent NON-PRODUCTION environment indicator
- Academic Year / Programme / Curriculum context display
- controlled gate and readiness status panels
- explicit `Not yet verified` empty states instead of fabricated metrics
- 14 internal module routes plus homepage, yielding 15 browser-visible HEPE views
- core modules: Curriculum, Traceability, Mapping, Review, Decision, Evidence, Findings, QA, Calendar, Audit, Runtime Health, Outbox, Reconciliation, Governance
- explicit REL-03 runtime-pending status where application binding is not verified
- environment firewall language prohibiting Production and real external connector writes.

## Data truth rule
No unverified numeric programme-health, QA-readiness, evidence-completeness or pending-review metric is represented as fact. Where authoritative runtime data is not yet bound, the UI displays `Not yet verified`, `Foundation ready`, or `Application binding pending`.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-WEB01-EVD-001 | Verified System Evidence | GitHub `non-production` repository inspection | 2026-09-10 | Repository | deployable Next.js source exists; old homepage minimal | Next.js app / minimal shell | verified | PASS |
| HEPE-WEB01-EVD-002 | Controlled Implementation Record | WEB-01 branch | 2026-09-10 | Repository | first integrated academic command center and module routes | 15 visible views | implemented | PASS — repository state |
| HEPE-WEB01-EVD-003 | Test / Regression Evidence | GitHub Actions on final PR head | 2026-09-10 | GitHub Actions | governance policy / build controls | SUCCESS | PENDING | PENDING |
| HEPE-WEB01-EVD-004 | Verified System Evidence | Vercel Preview deployment | 2026-09-10 | Vercel project `hepe-ui-prototype` | preview deploy only | READY | PENDING | PENDING |
| HEPE-WEB01-EVD-005 | Test / Regression Evidence | Browser acceptance against Vercel Preview | 2026-09-10 | controlled preview | homepage/modules/environment firewall | PASS | PENDING | PENDING |

## Current classification
HEPE-WEB-01: **IMPLEMENTATION COMPLETE — PREVIEW/CI VERIFICATION PENDING**  
Application Shell: **IMPLEMENTED**  
Integrated Command Center: **IMPLEMENTED**  
Core Views: **15 browser routes/views implemented**  
Verified-data labeling: **IMPLEMENTED**  
Runtime Integration: **PARTIAL — REL-03 NOT YET VERIFIED**  
Environment: **NON-PRODUCTION**  
Production Authorization: **NOT GRANTED**

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
