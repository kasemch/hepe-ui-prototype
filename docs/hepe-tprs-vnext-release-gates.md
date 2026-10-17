# HEPE-TPRS vNext Release Gates

Technical gates before implementation PR may leave Draft:
- TypeScript PASS
- unit/security tests PASS
- Next.js production build PASS
- existing controlled-pilot evaluator acceptance PASS
- SQL migration review PASS

Controlled-pilot runtime gates before event emission may be enabled:
- isolated non-production database target verified
- synthetic records only
- append-only/idempotency integration tests PASS
- existing READY/REVIEW/HOLD/INCOMPLETE matrix unchanged except where explicitly caused by pre-existing source transactions

Human gates remain separate from technical readiness: authoritative FinLit criteria, real-student processing, real-user authority, final academic clearance, certificate issuance, production/public deployment, destructive authoritative migration, and external transmission of real learning records.
