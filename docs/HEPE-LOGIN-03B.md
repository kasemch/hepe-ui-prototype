# HEPE-LOGIN-03B Controlled Auth

Status: NON-PRODUCTION / CONTROLLED PILOT.

Architecture:
- GitHub Pages-compatible static UI.
- Supabase Edge Function `hepe-username-login` resolves Username server-side.
- Supabase Edge Function `hepe-account-setup` completes first-login setup.
- No service/secret key is present in the browser or GitHub Pages bundle.
- Passwords are handled only by Supabase Auth.
- Durable throttling is recorded in `hepe_login_attempts`.
- Login account records are service-role only and client RLS is explicit deny-all.
- Only an existing VERIFIED person↔actor binding can complete account setup.
- Authentication never creates HEPE business authority.

Current controlled database state:
- `hepe_login_accounts` and `hepe_login_attempts` exist in the HEPE Sandbox.
- Only the verified bound account requested for the pilot has Username `kasem.ch`.
- No password was created or changed from chat content.

Edge Functions:
- `hepe-username-login`: deployed, public invocation with custom credential verification and throttling.
- `hepe-account-setup`: deployed, JWT required.

Build:
- Static export is configured in `next.config.mjs`.
- CI workflow builds only. It does NOT publish GitHub Pages.

Human gate before public preview:
1. Review CI build result.
2. Confirm GitHub Pages publication scope.
3. Confirm Auth redirect URL allow-list for the intended Pages URL.
4. Confirm account recovery flow before wider user rollout.
