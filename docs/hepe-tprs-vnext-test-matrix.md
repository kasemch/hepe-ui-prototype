# HEPE-TPRS vNext Acceptance Matrix

| ID | Invariant | Expected |
|---|---|---|
| EVT-01 | xAPI-ready transform is pure/local | No network transmission |
| EVT-02 | duplicate idempotency key | Existing event returned; no second insert |
| EVT-03 | UPDATE learning event | Rejected |
| EVT-04 | DELETE learning event | Rejected |
| EVT-05 | unauthorized direct mutation | No application mutation grant introduced |
| EPLC-01 | [3,5,5,11] | 24-hour baseline preserved |
| PLC-01 | PLC cycles | Independent of E-PLC hours |
| FIN-01 | unverified authority | FINLIT_REQUIREMENT_UNVERIFIED / REVIEW |
| FIN-02 | synthetic activity | Allowed without official completion semantics |
| FIN-03 | officialCompletion in payload | Rejected by app and DB guard |
| EVD-01 | conflict | Existing EVIDENCE_CONFLICT semantics preserved |
| CLR-01 | System READY + no human clearance | Clearance remains PENDING |
| ANA-01 | analytics projections | Read-only views over event ledger |

No test in this matrix authorizes real student processing, certificate issuance, official Financial Literacy criteria, real-user grants, production deployment, or external LRS transmission.
