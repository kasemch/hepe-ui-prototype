# HEPE-MANUAL-04 — Help Center + In-app Guided Tour Implementation Blueprint v1.0

Project: HEPE Curriculum Governance & Development
Environment: NON-PRODUCTION ONLY
Data Scope: SYNTHETIC / TEST DATA ONLY
Status: DRAFT IMPLEMENTATION BLUEPRINT
Parent: HEPE-MANUAL-03A
Base runtime SHA: 259baf896a34c89d0e974520f564bbec2e9269f3

## 1. Objective

Implement one documentation system that binds each runtime screen to one screenshot ID, one manual page, one guided-tour step set, one help article, and one training exercise.

Binding model:

Runtime Screen -> Screen ID -> Screenshot ID -> Manual Page -> Guided Tour -> Help Article -> Training Exercise

No item in this document grants production authorization, database-write authorization, schema-modification authorization, or user-authority elevation.

## 2. Help Center Route Architecture

Recommended routes:

- /help — Help Center home
- /help/start — Start Here
- /help/quick-start — Quick Start
- /help/my-workspace — My Academic Workspace
- /help/my-courses — My Courses
- /help/course-workspace — Course Workspace
- /help/quick-entry — Quick Entry
- /help/learning-teaching — Learning & Teaching
- /help/assessment — Assessment
- /help/evidence — Evidence
- /help/plan-actual — Plan vs Actual
- /help/traceability — PLO / CLO Traceability
- /help/troubleshooting — Troubleshooting index
- /help/reference/status — Status Dictionary
- /help/reference/evidence — Evidence Admission
- /help/reference/roles — Roles & Authority

## 3. Contextual Help Entry Points

Every P0 runtime page should expose a `? Help` action. The action must deep-link directly to the related help article rather than the Help Center home.

Mapping:

| Runtime route | Help route | Guided tour |
|---|---|---|
| / | /help/my-workspace | GT-02 |
| /my-courses | /help/my-courses | GT-03 |
| /course-workspace/[id] | /help/course-workspace | GT-04 |
| /pilot-entry | /help/quick-entry | GT-06 |
| /teaching | /help/learning-teaching | GT-05 |
| /assessment | /help/assessment | GT-07 |
| /evidence | /help/evidence | GT-08 |
| /plan-actual | /help/plan-actual | GT-09 |
| /traceability | /help/traceability | GT-10 |

## 4. Help Button UX Contract

The `? Help` control should:

1. Be visible but visually secondary to the primary task action.
2. Open the context-specific help article.
3. Offer `Start guided tour` where a tour is registered for that screen.
4. Preserve the current course context where relevant.
5. Never alter records, roles, authority, or approval state.

Recommended placement:

- desktop: top-right of page header or module hero
- mobile: overflow/help action near page title

## 5. Guided Tour Data Contract

Recommended TypeScript shape:

```ts
export type HepeTourStep = {
  id: string;
  route: string;
  target: string;
  title: string;
  body: string;
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  helpArticle: string;
  screenshotId: string;
  trainingExercise?: string;
  environment: 'NON_PRODUCTION';
};
```

Required rules:

- target should use stable `data-tour` selectors rather than CSS layout classes.
- no tour step may imply approval, compliance, or evidence admission beyond verified system state.
- no tour step may trigger a write automatically.
- write actions such as Quick Entry remain explicit human actions.

## 6. Stable UI Selectors

Recommended selectors:

- data-tour="workspace-header"
- data-tour="my-courses"
- data-tour="quick-entry"
- data-tour="learning-teaching"
- data-tour="assessment"
- data-tour="evidence"
- data-tour="plan-actual"
- data-tour="programme-governance"
- data-tour="runtime-state"
- data-tour="course-actions"
- data-tour="teaching-form"
- data-tour="evidence-form"
- data-tour="traceability-registry"

Guided-tour code must not depend on fragile nth-child selectors.

## 7. Screen Binding Registry

| Screen ID | Route | Screenshot | Manual | Tour | Help | Exercise |
|---|---|---|---|---|---|---|
| SCREEN-CMD-01 | / | SS-CMD-01 | Ch.2 | GT-02 | HELP-CMD-01 | EX-QS-01 |
| SCREEN-COURSE-01 | /my-courses | SS-COURSE-01 | Ch.6 | GT-03 | HELP-COURSE-01 | EX-QS-02 |
| SCREEN-COURSE-02 | /course-workspace/[id] | SS-COURSE-02 | Ch.6 | GT-04 | HELP-COURSE-02 | EX-QS-03 |
| SCREEN-ENTRY-01 | /pilot-entry | SS-ENTRY-01 | Ch.8 | GT-06 | HELP-ENTRY-01 | EX-QS-04 |
| SCREEN-LRN-01 | /teaching | SS-LRN-01 | Ch.8 | GT-05 | HELP-LRN-01 | EX-QS-05 |
| SCREEN-ASM-01 | /assessment | SS-ASM-01 | Ch.9 | GT-07 | HELP-ASM-01 | EX-QS-06 |
| SCREEN-EVD-01 | /evidence | SS-EVD-01 | Ch.10 | GT-08 | HELP-EVD-01 | EX-QS-07 |
| SCREEN-PLAN-01 | /plan-actual | SS-PLAN-01 | Ch.12 | GT-09 | HELP-PLAN-01 | EX-QS-08 |
| SCREEN-TRC-01 | /traceability | SS-TRC-01 | Ch.12 | GT-10 | HELP-TRC-01 | EX-QS-09 |

## 8. Help Article Template

Each help article should use this structure:

1. What this page is for
2. Who should use it
3. Before you start
4. What you see on screen
5. Step-by-step task flow
6. Expected result
7. Important governance boundary
8. Common states and meanings
9. Troubleshooting
10. Related next step

## 9. Runtime-State Help Contract

Help content must explain these states consistently:

- VERIFIED — controlled rows are visible in current authenticated RLS scope.
- EMPTY — no rows are visible in current authority scope.
- AUTH_REQUIRED — authenticated HEPE session is required.
- QUERY_ERROR — controlled source could not be read in current session/scope.
- RUNTIME_NOT_CONFIGURED — preview runtime binding is unavailable.
- NO VERIFIED DATA — field lacks verified value; do not infer one.
- NO EVIDENCE — no evidence is present in the current read model; do not equate with FAIL.
- NOT_YET_VERIFIED — claim/source exists but required verification or provenance is incomplete.

## 10. Quick Entry Safety Boundary

Quick Entry is the only P0 flow that can perform controlled synthetic writes in the current pilot path. Guided Tour must never submit the form automatically.

Required visual notice:

- NON-PRODUCTION
- SYNTHETIC TEST DATA ONLY
- Human authority preserved

Save success must not be worded as approval.

## 11. Screenshot Contract

All help articles should reference screenshot IDs, not hard-coded image filenames.

Screenshot metadata minimum:

- screenshotId
- route
- exactSha
- capturedAt
- persona
- environment
- dataClassification
- viewport
- annotationVersion
- status

Lifecycle:

PLANNED -> CAPTURED -> REVIEWED -> ANNOTATED -> MANUAL_READY -> STALE -> REPLACE

## 12. Proposed Code Placement

Recommended source layout:

```text
app/
  help/
    page.tsx
    [slug]/page.tsx
components/
  HelpButton.tsx
  GuidedTour.tsx
  GuidedTourLauncher.tsx
lib/
  help/
    help-registry.ts
    tour-registry.ts
    help-types.ts
content/
  help/
    *.md or *.tsx
```

The implementation may use static content initially. A database-backed help system is not required for the pilot.

## 13. Accessibility Requirements

Guided Tour must:

- support keyboard navigation
- expose meaningful ARIA labels
- trap focus only while the tour popover is active
- provide Skip Tour
- restore focus when closed
- not rely on color alone
- meet the application's existing responsive behavior

## 14. Mobile Behaviour

For narrow screens:

- use bottom-sheet or centered popover when target callouts would obscure the UI
- keep one objective per step
- avoid screenshots inside the live tour
- Help Center articles may use responsive screenshots separately

## 15. Analytics Boundary

Optional NON-PRODUCTION telemetry may record only tour events such as:

- tour_started
- tour_step_viewed
- tour_completed
- tour_skipped
- help_article_opened

Do not record student data, academic evidence content, form values, secrets, tokens, or protected identifiers for documentation analytics.

## 16. Acceptance Criteria

HEPE-MANUAL-04 implementation is acceptable when:

1. all 9 P0 screens have contextual help bindings;
2. all registered tour steps resolve to stable UI targets;
3. help articles render without runtime/database writes;
4. tour navigation does not mutate academic records;
5. Quick Entry never auto-submits;
6. NON-PRODUCTION boundary remains visible;
7. Evidence wording follows Evidence Admission Rule;
8. Save / Submit / Review / Approve language remains distinct;
9. missing data is never fabricated;
10. help/tour failures do not block core academic workflow.

## 17. Rollout Order

Wave A:
- Help registry
- Help Center home
- `? Help` buttons
- P0 help articles

Wave B:
- Guided Tour engine
- GT-02 through GT-06
- Quick Start exercise binding

Wave C:
- GT-07 through GT-10
- Troubleshooting index
- Screenshot insertion
- Responsive/accessibility regression

## 18. Gate Status

Blueprint: READY
Help route architecture: READY
Tour data contract: READY
Contextual binding registry: READY
Actual UI implementation: NOT YET EXECUTED
Screenshot capture: PENDING
Production authorization: NOT GRANTED
