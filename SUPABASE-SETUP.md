Supabase setup for Medsta MVP

This file contains step-by-step instructions to create the database schema and storage needed for the Medsta project in your Supabase project.

1) Add credentials to `.env.local`

- Ensure the following env vars are in your `.env.local` (we've already added them):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

2) Apply the SQL schema

Option A — Supabase Dashboard (recommended):
- Go to your Supabase project dashboard -> SQL -> New query
- Open `supabase_schema.sql` in this repository and paste its contents into the SQL editor
- Run the script. It will create tables, indexes, and Row Level Security (RLS) policies.

Option B — supabase CLI:
- Install Supabase CLI: https://supabase.com/docs/guides/cli
- Authenticate and link your project, then run:

```bash
supabase db query supabase_schema.sql
```

3) Storage buckets

- In the Supabase dashboard, go to Storage -> Create a new bucket (for example: `uploads` or `reports`).
- Choose public or private depending on your app logic. If private, use signed URLs via the Supabase client to serve objects.

4) RLS policies and roles

- The SQL file enables RLS on the created tables and adds policies that require `auth.uid()` to match the appropriate `id`/`user_id`.
- If you need public read access for provider directories, add a policy such as:

```sql
CREATE POLICY providers_public_read ON public.providers_clinics FOR SELECT USING (true);
```

- Be careful: opening public read weakens privacy — prefer views or a separate public table.

5) Auth providers

- Configure Email/Password, Phone, or OAuth providers in Supabase Dashboard -> Authentication -> Providers.
- For phone auth, enable the provider and configure SMS settings if required.

6) Adjust frontend expectations

- The app's frontend currently upserts with `id: user.id` — Supabase uses UUIDs for `auth.users.id`, so that should work as long as your frontend uses `supabase.auth.getUser()` to get `user.id`.
- Some field names in SQL use snake_case (e.g., `clinic_name`). Update frontend mapping or change SQL column names to camelCase if you prefer direct mapping.

7) Helpful commands

- Local dev (already tried):

```bash
npm install
npm run dev
```

- Run a quick SQL query via CLI:

```bash
supabase db query "select count(*) from providers_clinics;"
```

8) Next steps I can take for you

- Create a migration script to import existing Firestore data into Supabase (if you have an export).
- Add example RLS policies granting limited public read for provider directory pages.
- Tweak the SQL to use camelCase column names instead of snake_case, if you prefer to keep frontend unchanged.

If you want me to apply these SQL commands directly into your Supabase project, I can prepare the exact HTTP calls or CLI commands, but I will need confirmation before using your credentials. Alternatively, you can run the steps in the dashboard — it's the safest.

---
**Destructive fix for `patients` (Option A)**

If your `patients` table is empty (row count = 0) and you want to proceed with the destructive fix to resolve UUID vs bigint mismatches, run the SQL file added to this repo: `supabase_recreate_patients.sql`.

How to run it:

1. In the Supabase dashboard open **SQL > New query**.
2. Click **Open file** and upload `supabase_recreate_patients.sql` from this repo, or copy/paste its contents.
3. Run the query. This will DROP `public.patients` and recreate it with a `uuid` primary key referencing `auth.users(id)`, enable RLS, and add owner-only policies.

Security Advisor note: your Supabase project may currently show warnings that RLS is disabled for tables (see Security Advisor). The SQL file enables RLS for the `patients` table and creates policies that explicitly permit authenticated users to operate only on their own rows. If Security Advisor still reports issues after running the script, re-open the SQL editor and confirm the `ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;` statement ran without error.

If you prefer the alternate design (auto-generated `id` plus `user_id uuid` foreign key) instead of using `id` as the link to `auth.users`, tell me and I'll produce the alternate SQL and policies.
