-- Run this in Supabase SQL editor to set up the database

create extension if not exists "uuid-ossp";

-- Rooms
create table if not exists rooms (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'waiting' check (status in ('waiting', 'active', 'ended')),
  ended_at    timestamptz
);

-- Participants
create table if not exists participants (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references rooms(id) on delete cascade,
  language    text not null,
  joined_at   timestamptz not null default now(),
  left_at     timestamptz
);

-- Transcripts / session log
create table if not exists transcripts (
  id               uuid primary key default gen_random_uuid(),
  room_id          uuid not null references rooms(id) on delete cascade,
  participant_id   uuid references participants(id) on delete set null,
  speaker_language text not null,
  original_text    text not null,
  translated_text  text not null,
  target_language  text not null,
  created_at       timestamptz not null default now()
);

-- Indexes
create index if not exists transcripts_room_id_idx on transcripts(room_id);
create index if not exists transcripts_created_at_idx on transcripts(created_at desc);
create index if not exists participants_room_id_idx on participants(room_id);

-- Row-level security (open for the app with anon key — tighten for production)
alter table rooms        enable row level security;
alter table participants enable row level security;
alter table transcripts  enable row level security;

create policy "Allow all on rooms"        on rooms        for all using (true) with check (true);
create policy "Allow all on participants" on participants for all using (true) with check (true);
create policy "Allow all on transcripts"  on transcripts  for all using (true) with check (true);

-- Realtime: enable for signaling channel
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table participants;
