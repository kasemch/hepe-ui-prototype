# HEPE A10B Login Acceptance

Last observed: Preview branch alias returned HTTP 404 for /login. A source file in GitHub does not by itself establish a deployed route.

Acceptance criteria:
1. Exact commit deployed READY.
2. GET /login returns HTTP 200 through protected-preview-aware fetch.
3. Login page displays NON-PRODUCTION and Google sign-in action.
4. OAuth callback is separately verified, and academic role binding is never inferred from authentication.
5. No production or official authority activation.

Status: HOLD until verified.
