# HEPE-SUPPORT-01 — Deferred Requirement Register

Status: QUEUED FOR NEXT GATE · NOT CURRENT EXECUTION SCOPE · NON-PRODUCTION

## Trigger
Open only after the current HEPE Controlled Pilot Closure.

## Candidate lifecycle
Open Ticket → automatic page/module context capture → problem description → screenshot/file attachment → category/severity → triage → assignment → status tracking → conversation/update history → resolution → verification → close/reopen → user notification → support analytics.

## Required links
Ticket may reference Programme, Curriculum Version, Module/Page, relevant entity and technical GitHub Issue/Commit/PR/Release.

## Governance firewall
Ticket must never directly change canonical curriculum data, authority, evidence admission, approval, activation or publication. Curriculum-data problems must enter Data Correction / Reconciliation and Human Authority workflows.

## Initial operating constraints
- NON-PRODUCTION ONLY
- No real email send until separately authorized
- No SMTP change
- No IAM/RLS semantic expansion within the current gate
- No Audit Evidence admission

## Current batch rule
Do not insert implementation changes for this support module into HEPE-ACADEMIC-WORKFLOW-03. This record exists only to prevent the requirement from being lost.
