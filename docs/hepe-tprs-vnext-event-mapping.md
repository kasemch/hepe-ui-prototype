# HEPE-TPRS vNext Domain → Event Mapping

| Domain transition | Event | Authority note |
|---|---|---|
| verified E-PLC hours persisted | `eplc.hours_recorded` | event follows source transaction |
| stage minimum becomes satisfied | `eplc.stage_minimum_reached` | does not replace evaluator |
| PLC cycle begins | `plc.cycle_started` | cycle remains independent of E-PLC hours |
| PLC evidence submitted | `plc.evidence_submitted` | submission ≠ verification |
| PLC cycle reviewed | `plc.cycle_reviewed` | review ≠ automatic clearance |
| evidence record created | `evidence.created` | lifecycle event only |
| evidence new version | `evidence.version_created` | prior version remains traceable |
| verification requested | `evidence.verification_requested` | pending state preserved |
| evidence verified | `evidence.verified` | event mirrors authoritative decision |
| evidence rejected | `evidence.rejected` | existing HOLD semantics preserved |
| contradiction detected | `evidence.conflict_detected` | existing EVIDENCE_CONFLICT preserved |
| synthetic FinLit practice begins | `finlit.activity_started` | practice only |
| synthetic practice interaction ends | `finlit.activity_completed_synthetic` | not programme completion |
| FinLit authority absent | `finlit.requirement_unverified` | explicitly non-authoritative |
| clearance requested | `clearance.requested` | request ≠ approval |
| human decision recorded | `clearance.decision_recorded` | must originate from authorized human workflow |

Events are downstream records of domain transitions. They must never be used to fabricate the source decision they describe.
