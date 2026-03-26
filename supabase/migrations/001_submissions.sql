-- HERmazing Race — shared submissions (run in Supabase SQL Editor or via CLI)
-- Requires extension for gen_random_uuid (usually enabled on Supabase)

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  team text not null,
  station int not null check (station >= 1 and station <= 5),
  scores jsonb not null default '{}'::jsonb,
  facilitator_name text not null default '',
  time_completed text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);

create index if not exists submissions_team_station_created_at_idx
  on public.submissions (team, station, created_at desc);

alter table public.submissions enable row level security;

-- Permissive policies for a facilitator-only event app (anon key in browser).
-- Tighten later with auth or a single shared secret if needed.
drop policy if exists "submissions_select_anon" on public.submissions;
drop policy if exists "submissions_insert_anon" on public.submissions;
drop policy if exists "submissions_delete_anon" on public.submissions;

create policy "submissions_select_anon"
  on public.submissions for select
  to anon, authenticated
  using (true);

create policy "submissions_insert_anon"
  on public.submissions for insert
  to anon, authenticated
  with check (true);

create policy "submissions_delete_anon"
  on public.submissions for delete
  to anon, authenticated
  using (true);

-- Realtime: in Dashboard → Database → Publications, ensure `supabase_realtime`
-- includes `submissions`, or run:
-- alter publication supabase_realtime add table public.submissions;
