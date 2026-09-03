# HEPE UI Prototype Canonical Source v0.1.0

Status: NON-PRODUCTION / CONTROLLED SOURCE PREPARATION

Purpose:
- Canonicalize the previously standalone HEPE Vercel prototype into a traceable source package.
- Provide `/auth/callback` route source for Supabase PKCE code exchange.
- Preserve the HEPE IAM governance boundary.

Not authorized by this package:
- Production deployment
- Real-user creation
- Real invitation/email delivery
- Authority grant
- Production authorization

Callback contract:
1. Accept Supabase `code` query parameter.
2. Reject missing code.
3. Exchange code for session only when runtime env is configured.
4. Do not grant HEPE business authority.
5. Redirect to controlled callback status.
6. Error paths remain HOLD/DENY semantics.

Required deployment verification:
- GET `/` -> 200
- GET `/auth/callback` without code -> 400 HEPE_AUTH_CALLBACK_CODE_MISSING
- callback with runtime absent -> 503 HEPE_AUTH_CALLBACK_RUNTIME_NOT_CONFIGURED
- Supabase PKCE exchange tested only with separately authorized synthetic/controlled identity.
