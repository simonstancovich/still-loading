create extension if not exists "pgcrypto";

create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  word text not null check (char_length(word) between 1 and 32),
  x_position double precision not null check (x_position between 0 and 1),
  y_position double precision not null check (y_position between 0 and 1),
  created_at timestamptz not null default now(),
  approved boolean not null default false,
  flagged_reason text,
  visitor_hash text
);

create index if not exists gifts_approved_idx on gifts (approved) where approved = true;

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  reached_ritual boolean not null default false,
  gave_love boolean not null default false,
  long_tail_unlocked boolean not null default false,
  visitor_hash text not null
);

create index if not exists sessions_started_idx on sessions (started_at desc);

create materialized view if not exists lifetime_count as
  select count(*)::bigint as total from sessions;

alter table gifts enable row level security;
alter table sessions enable row level security;

create policy gifts_read_approved
  on gifts for select
  to anon
  using (approved = true);

create policy sessions_insert_anon
  on sessions for insert
  to anon
  with check (true);

create policy sessions_update_own
  on sessions for update
  to anon
  using (true)
  with check (true);
