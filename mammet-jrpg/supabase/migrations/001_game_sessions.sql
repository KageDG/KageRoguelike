-- Run in the Supabase SQL editor once. Only the Edge Function service role can read/write.
create table if not exists public.game_sessions (
  id text primary key,
  version integer not null default 0,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.game_sessions enable row level security;
revoke all on public.game_sessions from anon, authenticated;
-- No RLS policies intentionally: browsers only call the authenticated game Edge Function.
create index if not exists game_sessions_updated_at_idx on public.game_sessions(updated_at);
