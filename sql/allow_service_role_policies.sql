-- Temporary policies to allow the Supabase `service_role` to seed the `patients` table.
-- Run this BEFORE seeding with the service role key, and DROP them after seeding.

DROP POLICY IF EXISTS "patients_select_service_role" ON public.patients;
CREATE POLICY "patients_select_service_role" ON public.patients
  FOR SELECT USING (auth.role() = 'service_role' OR auth.uid()::uuid = id);

DROP POLICY IF EXISTS "patients_insert_service_role" ON public.patients;
CREATE POLICY "patients_insert_service_role" ON public.patients
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid()::uuid = id);

DROP POLICY IF EXISTS "patients_update_service_role" ON public.patients;
CREATE POLICY "patients_update_service_role" ON public.patients
  FOR UPDATE USING (auth.role() = 'service_role' OR auth.uid()::uuid = id)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid()::uuid = id);

DROP POLICY IF EXISTS "patients_delete_service_role" ON public.patients;
CREATE POLICY "patients_delete_service_role" ON public.patients
  FOR DELETE USING (auth.role() = 'service_role' OR auth.uid()::uuid = id);

-- After seeding, cleanup (run these to remove temporary policies):
-- DROP POLICY IF EXISTS "patients_select_service_role" ON public.patients;
-- DROP POLICY IF EXISTS "patients_insert_service_role" ON public.patients;
-- DROP POLICY IF EXISTS "patients_update_service_role" ON public.patients;
-- DROP POLICY IF EXISTS "patients_delete_service_role" ON public.patients;

-- NOTE:
-- - These policies allow the server-side `service_role` key to bypass the usual owner-only checks.
-- - Keep this file out of automated runs in production unless you intentionally allow service-role access.
