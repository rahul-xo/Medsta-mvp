#!/usr/bin/env node
/**
 * Server-side seeding script that creates an auth user and inserts a `users` profile
 * and `patients` row. Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 *
 * Usage:
 * 1. Install deps: `npm install @supabase/supabase-js dotenv`
 * 2. Ensure temporary policies from `sql/allow_service_role_policies.sql` are applied in your DB.
 * 3. Set env vars (example below) and run: `node scripts/seed_create_user_and_patient.js`
 *
 * Environment variables (example):
 * SUPABASE_URL=https://xyzcompany.supabase.co
 * SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
 * SEED_EMAIL=seed+patient@example.com
 * SEED_PASSWORD=ChangeMe123!
 */
/* eslint-env node */
import 'dotenv/config';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const email = process.env.SEED_EMAIL || `seed+patient+${Date.now()}@example.com`;
    const password = process.env.SEED_PASSWORD || 'ChangeMe123!';

    // If an existing user id is provided via env, use it. Otherwise create a new auth user.
    let userId = process.env.EXISTING_USER_ID;
    if (userId) {
      console.log('Using existing user id from EXISTING_USER_ID:', userId);
    } else {
      const { data: createdUser, error: createUserErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createUserErr) {
        // Provide a clearer message for the common 'not_admin' / 403 case
        if (createUserErr?.status === 403 || createUserErr?.code === 'not_admin') {
          console.error('\nAuth admin createUser failed: your key is not the service_role (not_admin / 403).');
          console.error('Make sure you set SUPABASE_SERVICE_ROLE_KEY to the service_role key from:');
          console.error('  Supabase Dashboard → Settings → API → Service role key');
          console.error('Or set EXISTING_USER_ID to the id of an existing auth user to skip creation.');
          process.exit(3);
        }
        throw createUserErr;
      }
      // `createdUser` may contain the user object directly depending on SDK shape
      userId = createdUser?.id ?? createdUser?.user?.id;
      if (!userId) throw new Error('Unable to determine created user id from admin.createUser response');
      console.log('Created auth user id:', userId);
    }

    // Insert into public.users (profile)
    const profile = {
      id: userId,
      full_name: 'Seed Patient',
      phone: process.env.SEED_PHONE || '0000000000',
      role: 'patient',
    };
    const { data: profileData, error: profileErr } = await supabase.from('users').insert(profile).select();
    if (profileErr) throw profileErr;
    console.log('Inserted profile row:', profileData);

    // Insert into patients
    const patient = {
      id: userId,
      full_name: 'Seed Patient',
      dob: process.env.SEED_DOB || '1990-01-01',
      gender: process.env.SEED_GENDER || 'other',
      blood_group: process.env.SEED_BLOOD || null,
    };
    const { data: patientData, error: patientErr } = await supabase.from('patients').insert(patient).select();
    if (patientErr) throw patientErr;
    console.log('Inserted patient row:', patientData);

    console.log('Seeding complete. Remember to DROP the temporary policies when done.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(2);
  }
}

run();
