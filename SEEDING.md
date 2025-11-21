# Seeding with Supabase service role (patients)

This guide shows how to seed `auth` + `public.users` + `public.patients` using the Supabase `service_role` key.

Important safety notes
- Never commit your `service_role` key to source control.
- Only apply the temporary policies while seeding, and remove them afterwards.

Steps
1. In the Supabase SQL editor, run `sql/allow_service_role_policies.sql` to create temporary policies that allow `service_role` to insert/select/update/delete on `public.patients`.
2. Install dependencies for the seeding script:

```bash
npm install @supabase/supabase-js dotenv
```

3. Set environment variables (example):

If you want to run the front-end locally you can use your Vite public vars (these are *publishable*):

```bash
export VITE_SUPABASE_URL="https://ajvlgviiwwigiriuuoqv.supabase.co"
export VITE_SUPABASE_ANON_KEY="<your-anon-key>"
```

To run the server-side seeding script you MUST provide the service role key (admin). This key should never be committed.

```bash
export SUPABASE_URL="https://ajvlgviiwwigiriuuoqv.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key-here>"  # required for admin.createUser()
export SEED_EMAIL="seed+patient@example.com"
export SEED_PASSWORD="ChangeMe123!"
```

4. Run the seed script:

```bash
node scripts/seed_create_user_and_patient.js
```

5. After seeding, remove the temporary policies (run the DROP POLICY lines in `sql/allow_service_role_policies.sql` or via SQL editor).

Troubleshooting
- If the script fails when creating the auth user, ensure your service role key is correct and has admin privileges. If you see `not_admin` or 403 errors, you are using an anon/public key instead of the service role key.
- If you don't want to use the service role key, set `EXISTING_USER_ID` to the id of an already-created auth user and the script will skip creating an auth user.
- If insertion to `public.patients` fails due to FK, ensure the auth user was created successfully first; the script creates the auth user before inserting the profile and patient rows.

Notes about the anon key you provided
- The Vite anon key you gave (publishable) is fine for client-side local development and for making public API calls from the browser, but it cannot be used to call admin routes (like `auth.admin.createUser`). For seeding, provide the service role key instead (see Supabase Dashboard → Settings → API → Service role key).

