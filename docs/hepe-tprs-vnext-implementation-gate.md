# HEPE-TPRS vNext Implementation Gate

Branch: `feature/hepe-tprs-vnext-learning-events-impl`

## Implemented in repository

- Typed controlled Learning Event taxonomy.
- Privacy-preserving xAPI-ready transformation contract; no network sender exists.
- Application-level FinLit authority-boundary assertion.
- Additive SQL migration draft for `tprs.learning_events`.
- Database FinLit authority guard.
- Append-only UPDATE/DELETE rejection trigger.
- Unique idempotency key and indexed event ledger.
- Read-only analytics view definitions.
- Server-only idempotent event append function.
- Regression/unit tests covering xAPI mapping, FinLit boundary, E-PLC 3+5+5+11, System READY versus Human Clearance, and unverified FinLit semantics.

## Deliberately not executed

The SQL migration is committed as a reviewed implementation artifact but has not been applied to Neon by this change. Applying it changes an external database and therefore remains separated from repository implementation and verification.

No real student data, certificate issuance, external LRS transmission, production/public deployment, real-user authority assignment, or authoritative Financial Literacy completion rule is introduced.

## Required verification before any database apply

1. TypeScript check.
2. Unit tests.
3. Next.js production build.
4. Existing TPRS evaluator/acceptance regression.
5. SQL review against the isolated target branch/schema.
6. Confirm rollback target is non-production and contains no authoritative real records.

## Rollback design

Repository rollback: revert vNext commits/branch.

Database rollback in an isolated non-production environment only:
- disable event emission first;
- drop the two vNext analytics views;
- drop append-only trigger;
- drop `tprs.learning_events` only after confirming it contains synthetic/non-authoritative records exclusively;
- do not modify any pre-existing TPRS table or authoritative record.

## Human Gates retained

- Apply/migrate an authoritative or production database.
- Process/import real student records.
- Establish official Financial Literacy criteria.
- Grant real-user roles/authority.
- Issue certificates or final academic clearance.
- External transmission of real learning records.
- Production/public deployment or release merge where authorization is required.
