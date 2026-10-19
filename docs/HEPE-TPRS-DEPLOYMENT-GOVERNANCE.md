# HEPE-TPRS Deployment Governance

Status: Controlled production governance baseline

## Release invariant

A Git merge is not a production authorization.

The release path is:

Feature branch → Preview → Automated QA → Acceptance → Merge → Release candidate → Human production gate → Explicit Vercel promotion → Post-release verification.

## Vercel policy

`vercel.json` disables automatic deployments from `main`. This prevents an ordinary merge to `main` from being interpreted as authority to change Production.

Feature branches remain eligible for Preview deployments unless separately disabled.

A future Production release requires an explicit human production authorization and an explicit promotion/deployment action. After promotion, verify deployment state, critical routes, runtime errors, and release evidence.

## Academic and data boundaries

Production deployment authority does not authorize any of the following:

- activating an authoritative Financial Literacy rule without authoritative evidence;
- importing or processing real student data;
- assigning real people to authorization roles;
- substituting system READY for Human Academic Clearance;
- destructive or irreversible database operations.

## Evidence semantics

Do not report a GitHub Actions run as PASS for a merge SHA unless a workflow actually ran for that SHA. Preserve exact commit/deployment identifiers in release evidence.

## HEPE-TPRS invariants

Academic Progress is not Professional Readiness.

Year Level is not automatic requirement completion.

System READY is not Human Academic Clearance.
