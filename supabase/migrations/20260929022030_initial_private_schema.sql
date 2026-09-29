-- Dedicated project for Abby's App. No shared tables or credentials.
create table public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null check (length(item_id) between 1 and 100),
  completed_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
alter table public.progress enable row level security;
create policy "read own progress" on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own progress" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own progress" on public.progress for delete to authenticated using ((select auth.uid()) = user_id);

create table public.private_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('ideal', 'goal')),
  title text not null check (length(title) between 1 and 120),
  body text not null default '' check (length(body) <= 2000),
  image_path text,
  created_at timestamptz not null default now()
);
create index private_entries_user_created_idx on public.private_entries (user_id, created_at desc);
alter table public.private_entries enable row level security;
create policy "read own entries" on public.private_entries for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own entries" on public.private_entries for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own entries" on public.private_entries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own entries" on public.private_entries for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.progress, public.private_entries to authenticated;
revoke all on public.progress, public.private_entries from anon;
