# HEPE-UI-MASTER-01 — Master UI Prototype

**Status:** MASTER UI PROTOTYPE — NON-PRODUCTION DESIGN BASELINE  
**Evidence Type:** Approved Decision / Controlled Design Record  
**Source:** HEPE Curriculum Governance & Development design authority directive  
**Version/Date:** v1.0 / 2026-09-11  
**Authority/Owner:** Project Design Authority  
**Production Authorization:** NOT GRANTED

## Scope
This baseline prescribes the HEPE presentation and application-experience layer only. It does not modify or supersede the HEPE Logical Architecture Baseline, academic domain contracts, Evidence Admission rules, Human Authority model, IAM/RLS contracts, database schema, runtime security boundaries, or controlled governance baselines.

## Master screen families
1. Modern Academic Command Center / Hero Dashboard
2. Executive Academic Command Center
3. Programme Overview
4. PLO/CLO Interactive Mapping
5. Evidence Management + AI Assistance
6. QA / CPRR Workflow
7. AI Advisory / Academic Intelligence
8. Analytics & Insights
9. Modern Task / Approval Center
10. Programme Landing / Presentation View
11. Modern Login / Welcome
12. Mobile Responsive Experience

## Design direction
- contemporary international higher-education SaaS experience;
- modern institutional identity with clear academic hierarchy;
- generous whitespace, modern cards and evidence-aware data presentation;
- responsive and accessible navigation;
- consistent HEPE design tokens and semantic status language;
- Academic Command Center, not a commercial/business dashboard;
- AI embedded as advisory capability inside academic workflows, never as autonomous academic authority.

## Asset rule
Campus photographs, hero illustrations, background graphics, decorative artwork and other visual assets are replaceable placeholders. They are not frozen by this baseline.

The controlled design characteristics are:
- information architecture;
- navigation structure;
- screen hierarchy;
- interaction patterns;
- component system;
- status semantics;
- academic workflow representation;
- responsive behaviour.

## Preservation and precedence
Existing verified academic, evidence, authority, IAM/RLS and runtime functionality takes precedence over cosmetic redesign. No functioning academic logic may be rewritten solely to match the prototype.

If a proposed UI change conflicts with a controlled academic, security, authority, evidence or runtime contract, the conflicting UI change must stop, the controlled contract must remain intact, and a reconciliation item must be recorded rather than silently changing the baseline.

## Implementation sequence
Design Tokens → Application Shell → Navigation → Academic Command Center → Core Academic Screens → Evidence/QA → Tasks/Approval → AI Advisory → Analytics → Responsive/Mobile → Accessibility → Integrated Preview Regression.

## Environment boundary
HEPE-UI-MASTER-01 may reach NON-PRODUCTION Preview acceptance only. Persistent preview semantics must include `NON-PRODUCTION` and `TEST DATA ONLY`. This baseline does not authorize Production deployment, database migration, schema/RLS changes, IAM changes, real-user authority changes, or PR merge.

Conversation ≠ Audit Evidence. Controlled baselines and verified system evidence take precedence.
