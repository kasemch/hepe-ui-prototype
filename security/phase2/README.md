# HEPE Phase 2B — Controlled Security Remediation

Status: PREPARED / NOT APPLIED

## Scope
This branch contains the reversible implementation artifacts for:
- SEC-01 — harden Data API security-administration views.
- SEC-02 — revoke anonymous EXECUTE from Fast TQF administrative RPCs.

SEC-03 (HED3505 anonymous progress identity binding) is deliberately excluded and remains under separate threat-model review.

## Safety boundary
Nothing in this branch authorizes:
- applying SQL to Supabase,
- production deployment,
- production merge,
- authority changes outside the reviewed SQL,
- changing HED3505 progress behavior.

## Apply order
1. Capture pre-remediation snapshot.
2. Apply SEC-01 + SEC-02 in HEPE Sandbox only.
3. Run functional and authorization regression tests.
4. Run Supabase Security Advisor.
5. Compare before/after evidence.
6. Repair and retest if needed.
7. Stop at Human Gate before any merge/release.

## Acceptance
SEC-01:
- target security_definer_view findings resolved,
- anon/authenticated cannot read security-administration metadata,
- service-side audit path remains usable.

SEC-02:
- anon cannot execute Fast TQF administrative RPCs,
- authenticated users still hit internal authority checks,
- properly authorized flows retain prior behavior,
- no cross-programme privilege escalation.

## Rollback
Restore only the grants/options captured in the pre-change snapshot. Never use a broad GRANT ALL rollback.
