# HEPE RELEASE READINESS 05–06 — Security Function Registry & RLS Intent Matrix

Status: CONTROLLED DRAFT — NON-PRODUCTION ONLY

This document is not Production Authorization, not a baseline promotion, and not Audit Evidence admission.

## 1. Security Function Review Population

Current verified review population: 75 SECURITY DEFINER functions executable by role `authenticated` in schemas with authenticated USAGE.

This number is a **review population**, not 75 vulnerabilities.

Current provisional classes:
- S0 Internal/helper/review: 28
- S1 Self-scoped read: 8
- S2 Role-scoped read or guarded: 24
- S3 Controlled workflow write: 14
- S5 Authority/identity mutation: 1

S5 function:
- `public.hepe_people_01b2h_bind_current_programme_chair()`

No silent remediation is authorized. For each function, final disposition must follow: Finding/Observation → Proposed Remediation → Test Plan → Rollback Plan → Authorization → Execution → Regression Evidence.

## 2. Exposure Review Principles

- Retain fail-closed behavior.
- Do not revoke solely because a function is SECURITY DEFINER.
- Do not retain solely because a guard exists; validate business necessity and least privilege.
- Private/helper functions directly executable by `authenticated` require necessity review even if only called internally today.
- S5/S6 exposure requires Human Security Decision before Production.

## 3. RLS Policy Intent Review Population

Project-domain RLS-enabled tables with no policies:
- public: 50
- hed3505_live: 14
- total: 64

This is a **policy-intent review population**, not 64 confirmed defects.

### hed3505_live
All 14 tables currently have no direct anon/auth table privileges in the verified readback. They are candidates for:
- RLS-A INTENTIONAL DENY BY DEFAULT, or
- RLS-B SECURITY DEFINER MEDIATED ACCESS.

### public
47 of 50 have direct anon/auth table privileges while RLS remains enabled with no allow policies. Current posture remains fail-closed at row level, but this is configuration debt because later permissive policies could expose a broad privilege surface.

Candidate classes:
- RLS-A INTENTIONAL DENY BY DEFAULT
- RLS-B SECURITY DEFINER MEDIATED ACCESS
- RLS-C AUTHENTICATED READ POLICY REQUIRED
- RLS-D ROLE-SCOPED WRITE POLICY REQUIRED
- RLS-E REFERENCE READ ONLY
- RLS-F REVOKE DIRECT GRANTS
- RLS-G LEGACY / TEST FIXTURE
- RLS-H HUMAN DECISION REQUIRED

## 4. Human Decision Boundaries

Human decision is required before:
- changing EXECUTE grants,
- changing schema USAGE,
- changing table privileges,
- creating or changing RLS policies,
- changing SECURITY DEFINER functions,
- changing authority-creating RPC exposure,
- applying any DDL/GRANT/REVOKE security migration.

## 5. Recommended Next Safe Work

Continue read-only analysis through caller inventory, business-necessity mapping, proposed remediation SQL, regression plans, and rollback plans. Stop before applying security mutations.