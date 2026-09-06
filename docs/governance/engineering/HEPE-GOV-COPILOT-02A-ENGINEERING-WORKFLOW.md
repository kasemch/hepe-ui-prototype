# HEPE-GOV-COPILOT-02A — Engineering Workflow Integration

Environment: NON-PRODUCTION ONLY
Status: PROPOSED / PR VALIDATION REQUIRED

## Canonical lifecycle
Issue → Task Contract → Branch → Implementation → Test → Pull Request → CI → AI Advisory Review → Human Decision → Merge → Evidence Closure.

## Mandatory task fields
Gate ID; Environment; Objective; In Scope; Out of Scope; Authority; Affected Paths; Expected Tests; Security Impact; Data Impact; Human Checkpoint; Evidence Requirement.

## Authority boundaries
- Conversation ≠ Audit Evidence.
- AI/Copilot review is advisory only.
- AI consensus does not create Human Authority.
- Production deployment, Production configuration, schema/data writes outside an explicitly authorized gate, secrets, SMTP, real-user operations and academic/system authority grants require separate explicit authorization.
- A failed CI, unresolved C1/C2 finding or Controlled Baseline contradiction is an Exception Stop for the affected path.

## Definition of Done
A task is complete only when scope is satisfied, applicable tests have Expected/Actual/PASS-FAIL records, required CI succeeds for the accepted revision, Human Decision is separately identifiable, merge provenance exists where merge is required, and evidence admission metadata is complete.

## Synthetic lifecycle acceptance
Use a harmless governance-document change only. Verify that the workflow can proceed through issue/task contract, branch, implementation, test, PR and CI while preserving Human Decision as the merge checkpoint. Do not execute prohibited or Production-sensitive actions merely to test denial behavior.
