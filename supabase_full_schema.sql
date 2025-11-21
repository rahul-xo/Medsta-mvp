-- supabase_full_schema.sql
-- DESTRUCTIVE: Drops and recreates the main application schema for Medsta MVP.
-- Run in Supabase SQL editor (Project > SQL > New query) or via supabase CLI.
-- WARNING: This will DROP tables in the public schema. Back up data if needed.

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Enable PostGIS to provide `geometry` / `geography` types (required if using geometry)
CREATE EXTENSION IF NOT EXISTS postgis;

BEGIN;

-- Drop all app tables if they exist (be conservative: only public schema)
DROP TABLE IF EXISTS public.patient_lab_tests CASCADE;
DROP TABLE IF EXISTS public.patient_reports CASCADE;
DROP TABLE IF EXISTS public.patient_carts CASCADE;
DROP TABLE IF EXISTS public.medicine_orders CASCADE;
DROP TABLE IF EXISTS public.diagnostic_tests CASCADE;
DROP TABLE IF EXISTS public.providers_pharmacies CASCADE;
DROP TABLE IF EXISTS public.providers_clinics CASCADE;
DROP TABLE IF EXISTS public.providers_therapies CASCADE;
DROP TABLE IF EXISTS public.providers_others CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Public users profile table (mirrors auth.users with extra profile fields)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table: use the same id as auth.users (one-to-one with auth user)
CREATE TABLE public.patients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  dob date,
  gender text,
  blood_group text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Providers master table (optional shared table)
CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_type text, -- e.g., clinic, pharmacy, therapy, other
  name text,
  description text,
  contact jsonb,
  location geometry(Point,4326), -- optional: store geolocation (PostGIS required; uses SRID 4326)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Providers: clinics
CREATE TABLE public.providers_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  clinic_name text,
  address text,
  city text,
  state text,
  zip text,
  phone text,
  opening_hours jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Providers: pharmacies
CREATE TABLE public.providers_pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  pharmacy_name text,
  address text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Providers: therapy
CREATE TABLE public.providers_therapies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  therapy_name text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Providers: others (catch-all)
CREATE TABLE public.providers_others (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text,
  info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Diagnostic tests metadata
CREATE TABLE public.diagnostic_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE SET NULL,
  name text,
  description text,
  price numeric,
  created_at timestamptz DEFAULT now()
);

-- Medicine orders (from frontend medicine ordering page)
CREATE TABLE public.medicine_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  pharmacy_id uuid REFERENCES public.providers_pharmacies(id) ON DELETE SET NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending',
  total_amount numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patient carts
CREATE TABLE public.patient_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patient lab tests & results
CREATE TABLE public.patient_lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  diagnostic_test_id uuid REFERENCES public.diagnostic_tests(id) ON DELETE SET NULL,
  requested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'requested',
  result jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patient reports (files metadata)
CREATE TABLE public.patient_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  file_path text,
  file_meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_providers_owner ON public.providers(owner_id);
CREATE INDEX IF NOT EXISTS idx_providers_clinics_owner ON public.providers_clinics(owner_id);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON public.patients(created_at);

-- Enable Row Level Security and create policies
-- USERS (profile) table: owner-only access for profile modifications
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_owner" ON public.users
  FOR SELECT USING (auth.uid()::uuid = id OR auth.role() = 'service_role');
CREATE POLICY "users_update_owner" ON public.users
  FOR UPDATE USING (auth.uid()::uuid = id)
  WITH CHECK (auth.uid()::uuid = id);
CREATE POLICY "users_insert_owner" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::uuid = id OR auth.role() = 'service_role');

-- PATIENTS: only the owner (auth user) can access their patient row
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patients_select_owner" ON public.patients
  FOR SELECT USING (auth.uid()::uuid = id);
CREATE POLICY "patients_insert_owner" ON public.patients
  FOR INSERT WITH CHECK (auth.uid()::uuid = id);
CREATE POLICY "patients_update_owner" ON public.patients
  FOR UPDATE USING (auth.uid()::uuid = id)
  WITH CHECK (auth.uid()::uuid = id);
CREATE POLICY "patients_delete_owner" ON public.patients
  FOR DELETE USING (auth.uid()::uuid = id);

-- PROVIDERS: allow public SELECT for provider listings, owners can mutate
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_select_public" ON public.providers
  FOR SELECT USING (true);
CREATE POLICY "providers_insert_owner" ON public.providers
  FOR INSERT WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_update_owner" ON public.providers
  FOR UPDATE USING (auth.uid()::uuid = owner_id)
  WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_delete_owner" ON public.providers
  FOR DELETE USING (auth.uid()::uuid = owner_id);

-- PROVIDERS_CLINICS: public read, owner modify
ALTER TABLE public.providers_clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_clinics_select_public" ON public.providers_clinics
  FOR SELECT USING (true);
CREATE POLICY "providers_clinics_insert_owner" ON public.providers_clinics
  FOR INSERT WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_clinics_update_owner" ON public.providers_clinics
  FOR UPDATE USING (auth.uid()::uuid = owner_id)
  WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_clinics_delete_owner" ON public.providers_clinics
  FOR DELETE USING (auth.uid()::uuid = owner_id);

-- PROVIDERS_PHARMACIES: public read, owner modify
ALTER TABLE public.providers_pharmacies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_pharmacies_select_public" ON public.providers_pharmacies
  FOR SELECT USING (true);
CREATE POLICY "providers_pharmacies_insert_owner" ON public.providers_pharmacies
  FOR INSERT WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_pharmacies_update_owner" ON public.providers_pharmacies
  FOR UPDATE USING (auth.uid()::uuid = owner_id)
  WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_pharmacies_delete_owner" ON public.providers_pharmacies
  FOR DELETE USING (auth.uid()::uuid = owner_id);

-- PROVIDERS_THERAPIES: public read, owner modify
ALTER TABLE public.providers_therapies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_therapies_select_public" ON public.providers_therapies
  FOR SELECT USING (true);
CREATE POLICY "providers_therapies_insert_owner" ON public.providers_therapies
  FOR INSERT WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_therapies_update_owner" ON public.providers_therapies
  FOR UPDATE USING (auth.uid()::uuid = owner_id)
  WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_therapies_delete_owner" ON public.providers_therapies
  FOR DELETE USING (auth.uid()::uuid = owner_id);

-- PROVIDERS_OTHERS: public read, owner modify
ALTER TABLE public.providers_others ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_others_select_public" ON public.providers_others
  FOR SELECT USING (true);
CREATE POLICY "providers_others_insert_owner" ON public.providers_others
  FOR INSERT WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_others_update_owner" ON public.providers_others
  FOR UPDATE USING (auth.uid()::uuid = owner_id)
  WITH CHECK (auth.uid()::uuid = owner_id);
CREATE POLICY "providers_others_delete_owner" ON public.providers_others
  FOR DELETE USING (auth.uid()::uuid = owner_id);

-- MEDICINE_ORDERS: patient can create and see their orders
ALTER TABLE public.medicine_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "medicine_orders_select_owner" ON public.medicine_orders
  FOR SELECT USING (auth.uid()::uuid = patient_id);
CREATE POLICY "medicine_orders_insert_owner" ON public.medicine_orders
  FOR INSERT WITH CHECK (auth.uid()::uuid = patient_id);
CREATE POLICY "medicine_orders_update_owner" ON public.medicine_orders
  FOR UPDATE USING (auth.uid()::uuid = patient_id)
  WITH CHECK (auth.uid()::uuid = patient_id);
CREATE POLICY "medicine_orders_delete_owner" ON public.medicine_orders
  FOR DELETE USING (auth.uid()::uuid = patient_id);

-- PATIENT_CARTS: patient-only
ALTER TABLE public.patient_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_carts_select_owner" ON public.patient_carts
  FOR SELECT USING (auth.uid()::uuid = patient_id);
CREATE POLICY "patient_carts_insert_owner" ON public.patient_carts
  FOR INSERT WITH CHECK (auth.uid()::uuid = patient_id);
CREATE POLICY "patient_carts_update_owner" ON public.patient_carts
  FOR UPDATE USING (auth.uid()::uuid = patient_id)
  WITH CHECK (auth.uid()::uuid = patient_id);
CREATE POLICY "patient_carts_delete_owner" ON public.patient_carts
  FOR DELETE USING (auth.uid()::uuid = patient_id);

-- PATIENT_LAB_TESTS: patient can see their tests, providers can update results
ALTER TABLE public.patient_lab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_lab_tests_select_owner" ON public.patient_lab_tests
  FOR SELECT USING (auth.uid()::uuid = patient_id OR auth.uid()::uuid = requested_by);
CREATE POLICY "patient_lab_tests_insert_owner" ON public.patient_lab_tests
  FOR INSERT WITH CHECK (auth.uid()::uuid = requested_by OR auth.uid()::uuid = patient_id);
CREATE POLICY "patient_lab_tests_update_provider_or_owner" ON public.patient_lab_tests
  FOR UPDATE USING (auth.uid()::uuid = requested_by OR auth.uid()::uuid = patient_id)
  WITH CHECK (auth.uid()::uuid = requested_by OR auth.uid()::uuid = patient_id);
CREATE POLICY "patient_lab_tests_delete_owner" ON public.patient_lab_tests
  FOR DELETE USING (auth.uid()::uuid = requested_by OR auth.uid()::uuid = patient_id);

-- PATIENT_REPORTS: patient can see their reports, uploader (provider) can upload
ALTER TABLE public.patient_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_reports_select_owner" ON public.patient_reports
  FOR SELECT USING (auth.uid()::uuid = patient_id OR auth.uid()::uuid = uploaded_by);
CREATE POLICY "patient_reports_insert_uploader" ON public.patient_reports
  FOR INSERT WITH CHECK (auth.uid()::uuid = uploaded_by OR auth.uid()::uuid = patient_id);
CREATE POLICY "patient_reports_delete_owner" ON public.patient_reports
  FOR DELETE USING (auth.uid()::uuid = uploaded_by OR auth.uid()::uuid = patient_id);

COMMIT;

-- End of schema
