# HERmazing Race — Score Management

Vite + React + Tailwind score sheet for facilitators. Submissions are stored in **Supabase** so everyone sees the same data (no more per-device `localStorage`).

## Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env` with your Supabase URL and anon key, then:

```bash
npm run dev
```

## Supabase database

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the script in `supabase/migrations/001_submissions.sql` (creates `submissions`, indexes, and RLS policies).
3. **Row Level Security:** the migration allows **anonymous** `select`, `insert`, and `delete` on `submissions` so the browser client can sync scores and use “Reset all data.” This is intentional for a trusted facilitator scenario; tighten policies (e.g. authenticated users only) for production if needed.
4. **Realtime (optional, recommended):** Dashboard → **Database** → **Publications** → ensure the `supabase_realtime` publication includes the `submissions` table (or run the commented `alter publication` line from the migration file). Live updates across tabs/devices depend on this.

## Deploy on Vercel

1. Push the repo and import the project in Vercel.
2. Under **Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy so the build picks up the variables.

Do **not** add the database **password** or direct Postgres connection string to Vercel frontend env vars; the app only needs the public URL and anon key.

## Build

```bash
npm run build
npm run preview
```
