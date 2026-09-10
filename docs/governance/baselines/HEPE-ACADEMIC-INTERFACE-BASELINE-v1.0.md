# HEPE Academic Interface Baseline v1.0

Status: **FROZEN / CONTROLLED VISUAL BASELINE — NON-PRODUCTION**  
Gate: **HEPE-UI-01 / HEPE-UI-01A**  
Date: **2026-09-10**  
Human Authority: **Explicit visual acceptance recorded for UI-01**  
Production Authorization: **NOT GRANTED**

## Scope
This baseline controls the visual and interaction language of the HEPE Academic Command Center and its browser-facing academic workspaces. It does not authorize Production deployment, schema/RLS changes, database writes, real connector execution, SMTP changes, secret changes, or academic authority mutation.

## Controlled visual language
- Academic Command Center / Curriculum Governance Platform / Evidence-First Academic Workspace identity
- restrained institutional navy, paper surface and muted-gold accent system
- academic display typography paired with sans-serif operational metadata
- consistent sidebar, context chips, evidence notices, cards, status rows, workspace links and provenance footer
- persistent NON-PRODUCTION indicator
- explicit evidence/provenance language
- responsive desktop/tablet/mobile breakpoints
- keyboard focus-visible treatment
- no decorative unverified charts and no fabricated academic metrics.

## Controlled source lineage
UI source branch at freeze preparation: `gov/hepe-ui-01-academic-visual-refinement`.

Preview evidence:
- Vercel deployment: `dpl_FUbcaGzufVZKvgA4KW5EvnbTSBuW`
- Preview hostname: `hepe-ui-prototype-74ivsn41c-kasemch-3467s-projects.vercel.app`
- Preview state: `READY`
- Build: optimized compile successful; type validity check completed; static generation `18/18`
- Deployment protection retained.

GitHub governance evidence:
- integration-test PR #26 was closed unmerged after exercising the controlled governance path
- governance-policy check `102840330931` concluded `success` on head `415f946646496bd6e8c7b25fe6aaf158cf47d0d3`.

## Human visual acceptance
Human Authority explicitly reported `ผ่าน UI-01` on 2026-09-10. This decision is admitted only as visual/interface acceptance within HEPE-UI-01 scope. It does not expand authority beyond this gate.

## Baseline rule
Future frontend work should inherit this baseline unless a later controlled UI change gate explicitly supersedes it. Runtime/data binding may extend components without silently changing the visual baseline.

Conversation ≠ Audit Evidence. This controlled baseline and verified system evidence prevail over discussion-only content.
