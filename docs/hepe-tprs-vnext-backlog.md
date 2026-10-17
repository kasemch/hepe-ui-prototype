# HEPE-TPRS vNext Backlog

## P0 — Technical acceptance
- Run CI TypeScript, unit tests, and production build on implementation branch.
- Review SQL against isolated `tprs` schema and database roles.
- Add runtime integration tests for INSERT/DUPLICATE/UPDATE/DELETE behavior.
- Confirm existing evaluator acceptance matrix remains unchanged.

## P1 — Controlled-pilot integration
- Wire E-PLC recording workflow to append `eplc.hours_recorded` after successful authoritative transaction.
- Wire evidence/version/verification workflows to append corresponding events.
- Build read-only analytics queries/pages from the vNext views.
- Add synthetic Financial Literacy Learning Lab scenarios without official pass/fail semantics.

## P2 — Interoperability
- Define versioned event-to-xAPI profile mapping.
- Evaluate an external LRS only after privacy, licensing, operations, and authority review.
- Keep outbound transport disabled by default.

## Deferred Human Gates
Authoritative Financial Literacy criteria; real student import/processing; real-user role grants; final academic clearance; certificate issuance; production/public deployment; destructive migration; external transmission of real learning records.
