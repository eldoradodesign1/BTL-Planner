-- ME Planner — Mon Essentiel — schéma Supabase versionné.
-- Appliquer dans l’éditeur SQL Supabase. Ne jamais exposer la service-role key au frontend.
--
-- ATTENTION : cette migration est une réinitialisation destructive de l’application.
-- Elle supprime les tables et vues détenues par l’application dans le schéma public,
-- ainsi que les types ME Planner ci-dessous, puis recrée la structure complète.
-- Elle ne touche pas aux schémas système Supabase auth et storage.

do $$
declare
  item record;
begin
  for item in
    select c.relname, c.relkind
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p', 'v', 'm')
      and not exists (
        select 1 from pg_depend d
        where d.classid = 'pg_class'::regclass
          and d.objid = c.oid
          and d.deptype = 'e'
      )
  loop
    if item.relkind = 'm' then
      execute format('drop materialized view if exists public.%I cascade', item.relname);
    elsif item.relkind = 'v' then
      execute format('drop view if exists public.%I cascade', item.relname);
    else
      execute format('drop table if exists public.%I cascade', item.relname);
    end if;
  end loop;
end $$;

drop type if exists public.app_role cascade;
drop type if exists public.task_status cascade;
drop type if exists public.task_priority cascade;

create extension if not exists "pgcrypto";
create type public.app_role as enum ('super_admin', 'admin', 'director', 'member');
create type public.task_status as enum ('todo', 'in_progress', 'done', 'blocked');
create type public.task_priority as enum ('urgent', 'high', 'medium', 'low');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'member',
  avatar_url text,
  locale text not null default 'fr',
  theme text not null default 'dark',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#69D2FF',
  archived boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, profile_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 240),
  description text,
  project_id uuid references public.projects(id) on delete set null,
  creator_id uuid not null references public.profiles(id),
  assignee_id uuid references public.profiles(id) on delete set null,
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  start_at timestamptz,
  end_at timestamptz,
  reminder_at timestamptz,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  spent_minutes integer not null default 0 check (spent_minutes >= 0),
  color text,
  tags text[] not null default '{}',
  starred boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_assignees (
  task_id uuid not null references public.tasks(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (task_id, profile_id)
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  position integer not null default 0
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  task_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  kind text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  name text,
  kind text not null check (kind in ('global', 'private', 'project')),
  project_id uuid references public.projects(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  primary key (conversation_id, profile_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 4000),
  reply_to_id uuid references public.messages(id) on delete set null,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table if not exists public.message_reactions (
  message_id uuid not null references public.messages(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null check (char_length(reaction) between 1 and 32),
  primary key (message_id, profile_id, reaction)
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  bucket text not null default 'attachments',
  object_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 52428800),
  created_at timestamptz not null default now(),
  check ((task_id is not null) or (message_id is not null))
);

create index if not exists tasks_assignee_idx on public.tasks(assignee_id);
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists tasks_schedule_idx on public.tasks(start_at, end_at);
create index if not exists notifications_recipient_idx on public.notifications(recipient_id, created_at desc);
create index if not exists activity_created_idx on public.activity_log(created_at desc);
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);
create index if not exists attachments_task_idx on public.attachments(task_id);

create or replace function public.is_director_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'director'));
$$;

create or replace function public.is_account_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'));
$$;

create or replace function public.prevent_unauthorized_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_account_admin() then
    raise exception 'Seuls les administrateurs peuvent modifier les rôles.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_change on public.profiles;
create trigger protect_profile_role_change
before update on public.profiles
for each row execute function public.prevent_unauthorized_role_change();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  display_name text;
  initial_role public.app_role;
begin
  display_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Membre ME'
  );
  initial_role := case
    when not exists (select 1 from public.profiles where role = 'super_admin') then 'super_admin'::public.app_role
    else 'member'::public.app_role
  end;
  begin
    insert into public.profiles (id, full_name, role)
    values (new.id, display_name, initial_role)
    on conflict (id) do nothing;
  exception when others then
    raise warning 'ME Planner profile bootstrap failed for user %: %', new.id, sqlerrm;
  end;
  return new;
end;
$$;

create or replace function public.claim_initial_admin()
returns public.app_role language plpgsql security definer set search_path = public as $$
declare
  assigned_role public.app_role;
  display_name text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  select coalesce(nullif(trim(raw_user_meta_data->>'full_name'), ''), nullif(split_part(coalesce(email, ''), '@', 1), ''), 'Membre ME')
    into display_name
    from auth.users
   where id = auth.uid();
  insert into public.profiles (id, full_name, role)
  values (auth.uid(), coalesce(display_name, 'Membre ME'), 'member'::public.app_role)
  on conflict (id) do nothing;
  if not exists (select 1 from public.profiles where role = 'super_admin') then
    update public.profiles set role = 'super_admin' where id = auth.uid();
  end if;
  select role into assigned_role from public.profiles where id = auth.uid();
  return assigned_role;
end;
$$;
grant execute on function public.claim_initial_admin() to authenticated;

-- Répare les utilisateurs créés avant l’installation du trigger de profil.
insert into public.profiles (id, full_name, role)
select u.id,
       coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), nullif(split_part(coalesce(u.email, ''), '@', 1), ''), 'Membre ME'),
       'member'::public.app_role
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

update public.profiles
set role = 'super_admin'::public.app_role
where id = (select u.id from auth.users u order by u.created_at asc limit 1)
  and not exists (select 1 from public.profiles where role = 'super_admin');

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at before update on public.projects for each row execute procedure public.touch_updated_at();
drop trigger if exists tasks_touch_updated_at on public.tasks;
create trigger tasks_touch_updated_at before update on public.tasks for each row execute procedure public.touch_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignees enable row level security;
alter table public.checklist_items enable row level security;
alter table public.task_comments enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_log enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.attachments enable row level security;

drop policy if exists profiles_self_or_admin on public.profiles;
create policy profiles_self_or_admin on public.profiles for select using (id = auth.uid() or public.is_director_or_admin());
drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles for update using (id = auth.uid() or public.is_director_or_admin());

drop policy if exists projects_visible_to_authenticated on public.projects;
create policy projects_visible_to_authenticated on public.projects for select to authenticated using (true);
drop policy if exists projects_manage_directors on public.projects;
create policy projects_manage_directors on public.projects for all to authenticated using (public.is_director_or_admin()) with check (public.is_director_or_admin());

alter table public.project_members enable row level security;
drop policy if exists project_members_visible_to_authenticated on public.project_members;
create policy project_members_visible_to_authenticated on public.project_members for select to authenticated using (true);
drop policy if exists project_members_manage_directors on public.project_members;
create policy project_members_manage_directors on public.project_members for all to authenticated using (public.is_director_or_admin()) with check (public.is_director_or_admin());

drop policy if exists tasks_visible_to_assignee_or_admin on public.tasks;
create policy tasks_visible_to_assignee_or_admin on public.tasks for select to authenticated using (creator_id = auth.uid() or assignee_id = auth.uid() or public.is_director_or_admin());
drop policy if exists tasks_insert_authenticated on public.tasks;
create policy tasks_insert_authenticated on public.tasks for insert to authenticated with check (creator_id = auth.uid() or public.is_director_or_admin());
drop policy if exists tasks_update_assignee_or_admin on public.tasks;
create policy tasks_update_assignee_or_admin on public.tasks for update to authenticated using (assignee_id = auth.uid() or creator_id = auth.uid() or public.is_director_or_admin()) with check (assignee_id = auth.uid() or creator_id = auth.uid() or public.is_director_or_admin());
drop policy if exists tasks_delete_admin on public.tasks;
create policy tasks_delete_admin on public.tasks for delete to authenticated using (public.is_director_or_admin());

drop policy if exists task_assignees_visible_related on public.task_assignees;
create policy task_assignees_visible_related on public.task_assignees for select to authenticated using (profile_id = auth.uid() or public.is_director_or_admin() or exists (select 1 from public.tasks where id = task_id and (creator_id = auth.uid() or assignee_id = auth.uid())));
drop policy if exists task_assignees_manage_directors on public.task_assignees;
create policy task_assignees_manage_directors on public.task_assignees for all to authenticated using (public.is_director_or_admin()) with check (public.is_director_or_admin());

drop policy if exists checklist_visible_related on public.checklist_items;
create policy checklist_visible_related on public.checklist_items for select to authenticated using (exists (select 1 from public.tasks where id = task_id and (creator_id = auth.uid() or assignee_id = auth.uid() or public.is_director_or_admin())));
drop policy if exists checklist_manage_related on public.checklist_items;
create policy checklist_manage_related on public.checklist_items for all to authenticated using (exists (select 1 from public.tasks where id = task_id and (creator_id = auth.uid() or assignee_id = auth.uid() or public.is_director_or_admin()))) with check (exists (select 1 from public.tasks where id = task_id and (creator_id = auth.uid() or assignee_id = auth.uid() or public.is_director_or_admin())));

drop policy if exists task_comments_visible_related on public.task_comments;
create policy task_comments_visible_related on public.task_comments for select to authenticated using (author_id = auth.uid() or exists (select 1 from public.tasks where id = task_id and (creator_id = auth.uid() or assignee_id = auth.uid() or public.is_director_or_admin())));
drop policy if exists task_comments_insert_authenticated on public.task_comments;
create policy task_comments_insert_authenticated on public.task_comments for insert to authenticated with check (author_id = auth.uid() and exists (select 1 from public.tasks where id = task_id and (creator_id = auth.uid() or assignee_id = auth.uid() or public.is_director_or_admin())));
drop policy if exists task_comments_update_author on public.task_comments;
create policy task_comments_update_author on public.task_comments for update to authenticated using (author_id = auth.uid() or public.is_director_or_admin()) with check (author_id = auth.uid() or public.is_director_or_admin());

drop policy if exists notifications_self on public.notifications;
create policy notifications_self on public.notifications for select to authenticated using (recipient_id = auth.uid());
drop policy if exists notifications_mark_read on public.notifications;
create policy notifications_mark_read on public.notifications for update to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

drop policy if exists activity_visible_authenticated on public.activity_log;
create policy activity_visible_authenticated on public.activity_log for select to authenticated using (actor_id = auth.uid() or public.is_director_or_admin());

drop policy if exists conversation_members_self on public.conversation_members;
create policy conversation_members_self on public.conversation_members for select to authenticated using (profile_id = auth.uid() or public.is_director_or_admin());
drop policy if exists conversations_member_read on public.conversations;
create policy conversations_member_read on public.conversations for select to authenticated using (created_by = auth.uid() or public.is_director_or_admin() or exists (select 1 from public.conversation_members where conversation_id = id and profile_id = auth.uid()));
drop policy if exists conversations_create_self on public.conversations;
create policy conversations_create_self on public.conversations for insert to authenticated with check (created_by = auth.uid());
drop policy if exists conversations_update_owner on public.conversations;
create policy conversations_update_owner on public.conversations for update to authenticated using (created_by = auth.uid() or public.is_director_or_admin()) with check (created_by = auth.uid() or public.is_director_or_admin());
drop policy if exists conversations_delete_owner on public.conversations;
create policy conversations_delete_owner on public.conversations for delete to authenticated using (created_by = auth.uid() or public.is_director_or_admin());
drop policy if exists conversation_members_insert_self on public.conversation_members;
create policy conversation_members_insert_self on public.conversation_members for insert to authenticated with check (profile_id = auth.uid() or public.is_director_or_admin());
drop policy if exists conversation_members_delete_self on public.conversation_members;
create policy conversation_members_delete_self on public.conversation_members for delete to authenticated using (profile_id = auth.uid() or public.is_director_or_admin());
drop policy if exists messages_member_read on public.messages;
create policy messages_member_read on public.messages for select to authenticated using (author_id = auth.uid() or public.is_director_or_admin() or exists (select 1 from public.conversation_members where conversation_id = messages.conversation_id and profile_id = auth.uid()));
drop policy if exists messages_member_insert on public.messages;
create policy messages_member_insert on public.messages for insert to authenticated with check (author_id = auth.uid() and exists (select 1 from public.conversation_members where conversation_id = messages.conversation_id and profile_id = auth.uid()));
drop policy if exists message_reactions_member on public.message_reactions;
create policy message_reactions_member on public.message_reactions for all to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
drop policy if exists attachments_owner on public.attachments;
create policy attachments_owner on public.attachments for all to authenticated using (owner_id = auth.uid() or public.is_director_or_admin()) with check (owner_id = auth.uid() or public.is_director_or_admin());

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do update set public = true;

drop policy if exists attachment_objects_owner on storage.objects;
create policy attachment_objects_owner on storage.objects for all to authenticated using (bucket_id = 'attachments' and (owner_id = auth.uid()::text or public.is_director_or_admin())) with check (bucket_id = 'attachments' and owner_id = auth.uid()::text);

drop policy if exists profile_avatars_select on storage.objects;
create policy profile_avatars_select on storage.objects for select using (bucket_id = 'profile-avatars');
drop policy if exists profile_avatars_insert on storage.objects;
create policy profile_avatars_insert on storage.objects for insert to authenticated with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists profile_avatars_update on storage.objects;
create policy profile_avatars_update on storage.objects for update to authenticated using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists profile_avatars_delete on storage.objects;
create policy profile_avatars_delete on storage.objects for delete to authenticated using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks') then
    alter publication supabase_realtime add table public.tasks;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications') then
    alter publication supabase_realtime add table public.notifications;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
