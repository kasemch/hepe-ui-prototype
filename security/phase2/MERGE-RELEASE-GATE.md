# Merge / Release Gate

Status: HOLD BEFORE MERGE TO main

## Why
The repository is connected to Vercel project `hepe-ui-prototype`.

Verified behavior:
- commits on feature/security branches create Vercel preview deployments (target=null)
- commits on `main` create Vercel deployments with target=`production`

Therefore merging this branch to `main` is not a source-only action. It is coupled to production deployment.

## Current approved state
- Supabase Sandbox SEC-01 + SEC-02: applied and verified
- Supabase migration history: recorded
- GitHub security branch: prepared
- Vercel branch preview: READY
- main: unchanged
- production: unchanged

## Remaining Human Gate
A separate explicit approval is required before merging this PR to `main`, because that merge is expected to trigger a production Vercel deployment.

SEC-03 remains excluded.
