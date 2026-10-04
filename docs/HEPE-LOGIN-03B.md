# HEPE-LOGIN-03B Controlled Auth

Status: NON-PRODUCTION / CONTROLLED PILOT.

This branch adds username/password sign-in on top of Supabase Auth without exposing
the user's email to the browser.

Security model:
- Username is resolved only on the server.
- Password is passed directly to Supabase Auth and is never stored by this app.
- Login account/attempt tables are service-role only with deny-all client RLS.
- A durable per-username and HMAC-IP throttling layer complements Supabase Auth rate limits.
- Only an Auth user already linked to a VERIFIED academic_person_actor_binding can finish first setup.
- Authentication never creates HEPE business authority.

Required server-only environment variables:
- SUPABASE_SECRET_KEY (preferred) or SUPABASE_SERVICE_ROLE_KEY
- HEPE_LOGIN_IP_HMAC_SECRET

Required public environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY)

Human gates before preview activation:
1. Configure the two server-only secrets in the preview runtime.
2. Confirm Auth URL allow-list for the preview URL.
3. Run build/typecheck and login negative tests.
4. Confirm account recovery path before real-user rollout.
5. Do not merge or publish until the controlled preview is accepted.
