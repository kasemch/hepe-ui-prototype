# HEPE-TPRS vNext Learning Event Security Threat Matrix

| Threat | Control | Verification |
|---|---|---|
| Event tampering | UPDATE/DELETE rejection trigger | SQL/security contract test |
| Duplicate event/retry | UNIQUE idempotency_key + ON CONFLICT | persistence test/runtime integration |
| Client-forged canonical event | server-only persistence module; no client writer | source/architecture review |
| FinLit authority fabrication | application assertion + DB CHECK | unit/security test |
| Payload privilege bypass | controlled event contract; no authoritative FinLit keys | review + tests |
| Cross-domain double counting | event types separated; existing E-PLC/PLC evaluator unchanged | regression matrix |
| Human clearance automation | evaluator separation preserved | CLR-01 |
| External privacy leakage | no LRS sender/network transport implemented | EVT-01 |
| Real-data contamination | synthetic=true default; controlled-pilot governance | runtime gate before DB apply |
| Analytics mutation | projections implemented as views | SQL review |

Residual risks before runtime activation: database role grants must be inspected on the isolated Neon target; event emitter integration points require end-to-end tests; pseudonymous actor mapping must be reviewed before any external interoperability is enabled.
