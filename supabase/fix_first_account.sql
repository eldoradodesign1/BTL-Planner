-- ME Planner — Mon Essentiel — correction non destructive du premier compte.
-- À exécuter si `supabase/schema.sql` a déjà été appliqué et qu’un compte existe sans profil.

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.claim_initial_admin()
returns public.app_role language plpgsql security definer set search_path = public as $$
declare
  assigned_role public.app_role;
  display_name text;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
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
