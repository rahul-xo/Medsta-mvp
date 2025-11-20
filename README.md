## Medsta MVP

A Vite + React app with Tailwind, Supabase (Auth + Postgres + Storage), and a small Zustand store.

### Quick start
1) Install deps
```bash
npm install
```
2) Configure Supabase (required)
 	- Copy `.env.local.example` to `.env.local` and set your Supabase keys from the Supabase project dashboard.
 	- Required keys:
 		- `VITE_SUPABASE_URL`
 		- `VITE_SUPABASE_ANON_KEY`
 	- Optional: `VITE_API_BASE_URL` (if you add a backend later)

3) Run the dev server
```bash
npm run dev
```

### Useful scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build locally
- `npm run lint` — run ESLint
(Firebase scripts removed) Use the Supabase dashboard or CLI for DB/storage configuration.

### Project layout (high level)
-- `src/Services/` — `supabase.js` (env-based), phone.service.js, api.js (Axios)
- `src/Stores/` — authStore.js (Zustand)
- `src/Pages/` — pages (Login, Signup, Dashboards, etc.)
- `src/Components/` — UI and utilities (e.g., OtpModal, AddressPicker)
- `src/Components/router/ProtectedRoute.jsx` — auth/role guard
- `public/` — static assets

### Supabase notes
- Create the required tables (users, providers_clinics, providers_therapies, providers_others, etc.) and enable Row Level Security (RLS) with appropriate policies.
- Enable authentication providers you use (Email/Password; Phone if linking phone numbers) in the Supabase dashboard.
- Authorized domains (CORS) should include localhost/127.0.0.1 for local dev.

### Troubleshooting
- `auth/invalid-api-key` or `[Firebase] Missing required env values` → check `.env.local` keys and restart `npm run dev`.
- Permission errors → ensure Firestore is created and rules are deployed: `npm run deploy:rules`.

### Pull latest
```bash
git pull
npm install
npm run dev
```