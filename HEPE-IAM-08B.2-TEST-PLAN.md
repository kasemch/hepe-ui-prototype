# HEPE-IAM-08B.2 Controlled Synthetic Auth Code Exchange & Callback Regression

Environment: NON-PRODUCTION only.

Authorized scope: synthetic Auth identity + PKCE authorization-code exchange + callback regression only.
Explicitly excluded: real user, email send, SMTP change, HEPE authority grant, production.

## Preconditions
1. Runtime binding verifier is PASS for Supabase project `lztxpjsuzqvtgyasfnyj`.
2. Supabase Anonymous Sign-Ins are enabled for the sandbox project.
3. One OAuth provider (`github` or `google`) is configured in Supabase Auth.
4. A dedicated synthetic account exists at that provider. Do not use a real-person account for this gate.
5. Vercel Preview env:
   - `HEPE_IAM_08B2_SYNTHETIC_AUTH_ENABLED=true`
   - `HEPE_IAM_08B2_SYNTHETIC_PROVIDER=<github|google>`

## Assertions
- B2-A01 Start route creates an anonymous Supabase Auth user marked `hepe_synthetic_test=true` and `hepe_gate=HEPE-IAM-08B.2` without email.
- B2-A02 Provider-link initiation produces a PKCE redirect and persists verifier/session cookies.
- B2-A03 Supabase-issued authorization code exchanges successfully at `/auth/callback`.
- B2-A04 Callback verifies the synthetic metadata marker after exchange.
- B2-A05 Missing code -> HTTP 400 `HEPE_AUTH_CALLBACK_CODE_MISSING`.
- B2-A06 Invalid code -> safe HOLD `SESSION_EXCHANGE_FAILED`.
- B2-A07 Reused code -> safe HOLD `SESSION_EXCHANGE_FAILED` (authorization codes are single-use).
- B2-A08 Wrong/missing PKCE verifier -> exchange denied.
- B2-A09 No HEPE actor/role/authority is auto-created or granted.
- B2-A10 Positive PKCE result is not admitted as first-login evidence.

## Admission rule
Synthetic PKCE self-test evidence and live code-exchange evidence must remain separate. Live positive exchange may support only the callback/code-exchange assertion. It must not be used as evidence of real-user first login, onboarding activation, email delivery, or HEPE business authority.
