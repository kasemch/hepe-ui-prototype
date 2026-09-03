# HEPE UI Prototype — HEPE-IAM-08B.1 Patched Deployable Source

Status: **NON-PRODUCTION / CONTROLLED SOURCE**

This package is a deployable repository-root source tree derived from the supplied commit snapshot `b7ca61b37d564a214c373e235f535caa055a0e3d` and the nested canonical source package.

## IAM-08B.1 patch scope

- Keeps `/auth/callback` Supabase PKCE code-exchange path.
- Adds a safe runtime-binding verifier at `/api/iam/runtime-binding`.
- Adds a **local-only synthetic PKCE S256 self-test** at `/api/iam/pkce-synthetic`.
- Adds TypeScript build dependencies required for a clean Next.js build.
- Does not expose the publishable key value in verifier responses.
- Does not create a real user, send email, modify SMTP, grant HEPE authority, or authorize production.

## Required Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL=https://lztxpjsuzqvtgyasfnyj.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<NON-SECRET publishable/anon key>`

Do **not** use a service-role key.

## Controlled regression endpoints

1. `GET /` → expected HTTP 200.
2. `GET /api/iam/runtime-binding` → expected HTTP 200 with `HEPE_RUNTIME_BINDING_VERIFIED` when env binding matches the HEPE sandbox project; otherwise 503.
3. `GET /api/iam/pkce-synthetic` → expected HTTP 200 with `HEPE_SYNTHETIC_PKCE_SELF_TEST_PASS`; this performs no network call and uses no user.
4. `GET /auth/callback` without `code` → expected HTTP 400 `HEPE_AUTH_CALLBACK_CODE_MISSING`.
5. Actual Supabase `exchangeCodeForSession` remains **PENDING** until a separately controlled synthetic authorization-code flow is executed. This local PKCE self-test must not be represented as proof of live Supabase code exchange.

## Upload rule

Extract this ZIP first. Upload the **contents** (`package.json`, `app/`, `lib/`, etc.) to the root of the GitHub `non-production` branch. Do not upload this ZIP as a single repository file.

Suggested commit message:

`HEPE-IAM-08B1 add runtime binding verifier and synthetic PKCE harness`
