-- Run once in the Supabase SQL editor. Each account can access only its own quest.
create table if not exists public.quest_progress (
 user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
 state jsonb not null check (jsonb_typeof(state) = 'object'),
 revision integer not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.quest_progress enable row level security;
revoke all on public.quest_progress from anon;
grant select,insert,update on public.quest_progress to authenticated;
create policy "Read own quest" on public.quest_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "Create own quest" on public.quest_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own quest" on public.quest_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
-- Optimistic locking prevents two devices from silently overwriting each other.
create or replace function public.save_quest_progress(new_state jsonb, expected_revision integer)
returns integer language plpgsql security invoker set search_path = '' as $$
declare next_revision integer;
begin
 if auth.uid() is null then raise exception 'Sign in to save your quest.'; end if;
 if expected_revision = 0 then
  insert into public.quest_progress(user_id,state,revision) values(auth.uid(),new_state,1)
  on conflict(user_id) do nothing returning revision into next_revision;
 else
  update public.quest_progress set state=new_state,revision=revision+1,updated_at=now()
  where user_id=auth.uid() and revision=expected_revision returning revision into next_revision;
 end if;
 if next_revision is null then raise exception 'QUEST_CONFLICT: Another device has newer progress. Reload your saved quest.'; end if;
 return next_revision;
end $$;
revoke all on function public.save_quest_progress(jsonb,integer) from public,anon;
grant execute on function public.save_quest_progress(jsonb,integer) to authenticated;
