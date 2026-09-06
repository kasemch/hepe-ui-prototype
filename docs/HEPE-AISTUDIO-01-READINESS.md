# HEPE-AISTUDIO-01 — Google AI Studio Development Pipeline Integration

Status: NON-PRODUCTION / CONTROLLED PILOT PREPARATION

## Canonical architecture

- Google AI Studio: implementation environment only
- GitHub `kasemch/hepe-ui-prototype`: canonical source code repository
- Vercel `hepe-ui-prototype`: preview/runtime deployment
- Supabase: authoritative data/auth/RLS/authority layer
- Gemini: advisory AI layer only

## AI Studio branch boundary

AI Studio generated changes MUST be confined to branch `aistudio-integration` (or a child feature branch) until reviewed.

AI Studio MUST NOT:

- push directly to `main`
- modify production credentials
- modify production RLS or authority assignments
- execute destructive migrations
- weaken authentication/authorization
- create autonomous academic approvals
- treat a deployment as production authorization

## Pilot scope

Preferred first pilot: Academic Command Center UI enhancement or another read-only UI improvement.

Excluded from first pilot:

- production authentication
- RLS modifications
- authority assignment
- academic approval engine
- destructive migration
- production email workflow

## Required acceptance path

Google AI Studio -> `aistudio-integration` -> GitHub review/CI -> Vercel Preview -> Supabase sandbox regression -> human decision.

## Known readiness findings

- Next.js + React + TypeScript application
- Supabase SSR/client dependencies present
- server-side auth callback exists
- Vercel Git integration already binds this repository to the `hepe-ui-prototype` project
- governance artifacts (CODEOWNERS / PR template / governance workflow) exist on `non-production`
- `.env.example` contains only the public Supabase URL and a placeholder publishable key

## Open control finding

GitHub branch metadata currently reports `main` and `non-production` as unprotected. AI Studio integration may proceed only as a NON-PRODUCTION pilot; production readiness cannot be declared PASS until required branch/ruleset enforcement is verified and enabled.

## Human-only production boundary

Merge/release to production and production-critical database or authority changes remain human controlled.
