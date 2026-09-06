# HEPE Engineering Contract Templates

Environment: NON-PRODUCTION ONLY
Gate: HEPE-GOV-COPILOT-02A

## Agent Task Contract
- Gate ID
- Environment
- Objective
- In Scope
- Out of Scope
- Authority
- Affected Paths
- Allowed Operations
- Prohibited Operations
- Expected Tests
- Human Checkpoint
- Evidence Requirement
- Exception Stop Conditions

## Definition of Done Contract
- Scope implemented without unauthorized expansion.
- Applicable tests executed for the accepted revision.
- Required CI PASS.
- Security/data/authority boundaries preserved.
- Human Decision remains distinguishable from AI advisory review.
- Merge provenance recorded where applicable.
- Evidence metadata complete.

## Test Contract
For every material assertion record:
- Test ID
- Scope
- Expected
- Actual
- PASS/FAIL
- Source / run ID / revision
- Verification date

Negative tests must use static, mocked, or synthetic methods when executing the prohibited behavior would cross a security, authority, destructive, or Production boundary.

## Evidence Contract
Before admission identify:
Evidence ID → Evidence Type → Source → Version/Date → Authority/Owner → Relevant Contract/Assertion → Verification Status.

Conversation, AI output, AI memory, generated content and advisory review are not Audit Evidence by themselves.

## Exception Stop Contract
Stop the affected path and report: Exception ID; Gate; Verified State; Exact Human Action; Expected Result; Resume Point.

Mandatory stops include: explicit Production Authorization, secret/credential binding, real-user or SMTP operation, schema/data write outside authorized scope, academic/system authority grant, destructive operation, failed required CI that cannot be safely repaired, unresolved C1/C2 finding, or Controlled Baseline contradiction.
