# HEPE-MANUAL-05A — Authenticated Visual Acceptance & Screenshot Capture

Project: HEPE Curriculum Governance & Development
Environment: NON-PRODUCTION ONLY
Branch: docs/hepe-manual-04-help-tour-blueprint
Baseline: feat/hepe-pilot-master-01 @ 259baf896a34c89d0e974520f564bbec2e9269f3
Current HEPE-MANUAL-05A head: 4c8c8202da2275059155c3641ac5bb69a65c9bc3
PR: #38 (DRAFT / NOT MERGED)

## Gate objective

Validate the HEPE Help Center and Guided Tour on the protected Preview, capture the P0 screenshot library, verify keyboard/focus/contrast/overflow behavior, and prepare the visual-ready Quick Start package before any merge consideration.

## Authenticated browser status

Vercel share access was generated for the exact Preview, but direct protected-page fetch still redirects to Vercel SSO. Therefore no rendered screenshot is admitted in this gate yet. No simulated screenshot is substituted.

Status: PENDING_AUTH_CAPTURE

## Verified non-visual checks

### Build/runtime
- Vercel Preview deployment for head 4c8c8202da2275059155c3641ac5bb69a65c9bc3: READY.
- HEPE-MANUAL-05 structural/keyboard regression: PASS (21 checks).
- Next.js compile/type/static generation: PASS.
- /help and /help/[slug] routes are present in build output.

### Keyboard/focus review
An acceptance review identified that the initial modal implementation exposed dialog semantics but did not yet explicitly manage modal focus or Escape closure. HEPE-MANUAL-05A patched the tour layer to:
- move focus into the dialog when opened;
- trap Tab / Shift+Tab inside tour controls;
- close on Escape;
- restore focus to the Guided tour launcher after closure;
- expose aria-haspopup=dialog and aria-expanded on the launcher;
- add aria-describedby and an explicit close-button accessible name.

These semantics are now included in the 21-check build regression. Runtime browser confirmation remains pending authenticated capture.

### Contrast calculation
Static color-pair calculations against current CSS:
- #173956 on #ffffff = 11.96:1 — PASS WCAG AA normal text.
- #667085 on #ffffff = 4.97:1 — PASS WCAG AA normal text.
- #245f8f on #ffffff = 6.76:1 — PASS WCAG AA normal text.
- #dceaf3 on #0b2540 = 12.64:1 — PASS.
- #f2d39b on #071728 = 12.53:1 — PASS.
- #315f80 on #eaf2f8 = 6.03:1 — PASS.
- #645538 on #fff8e9 = 6.85:1 — PASS.

These are calculated CSS color checks, not rendered-browser contrast evidence.

### Responsive / overflow structural review
Current CSS defines responsive transitions at 1100px, 900px, 760px, 620px and 420px across app/help surfaces. Main grids collapse to fewer columns and then single-column layouts; Help article sidebars unstick at <=900px; Help cards collapse at <=620px; tour actions become a two-column grid on narrow screens; main navigation collapses to a single column at <=420px.

Rendered-browser overflow verification remains PENDING_AUTH_CAPTURE.

## Required visual capture set

1. SS-CMD-01 — My Academic Workspace
2. SS-COURSE-01 — My Courses
3. SS-COURSE-02 — Course Workspace
4. SS-ENTRY-01A — Quick Entry full view
5. SS-ENTRY-01B — Teaching entry
6. SS-ENTRY-01C — Assessment evidence entry
7. SS-ENTRY-01D — Save-success state
8. SS-LRN-01 — Learning & Teaching
9. SS-ASM-01 — Assessment
10. SS-EVD-01 — Evidence
11. SS-PLAN-01 — Plan vs Actual
12. SS-TRC-01 — PLO / CLO Traceability
13. SS-HELP-01 — Help Center
14. SS-TOUR-01 — Guided Tour dialog desktop
15. SS-TOUR-02 — Guided Tour dialog mobile

## Capture acceptance criteria

Each admitted image must identify the exact deployment/commit, show NON-PRODUCTION context where applicable, use synthetic/test data only, contain no secret/token/sensitive real-user data, use 100% browser zoom, and be reviewed for clipping, horizontal overflow, unreadable callouts and stale UI state.

Target viewports:
- Desktop: 1440 x 900
- Mobile: 390 x 844

## Gate verdict

IMPLEMENTATION / BUILD / STRUCTURAL ACCESSIBILITY: PASS.
AUTHENTICATED RENDERED VISUAL ACCEPTANCE: PENDING.
SCREENSHOT CAPTURE: PENDING_AUTH_CAPTURE.

Screenshot Library v1.0 is currently a registry-only package until real rendered images are captured. PR #38 remains DRAFT and must not be merged on this gate alone. This document is controlled project context and is not automatically Audit Evidence.
