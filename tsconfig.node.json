-- ME Planner — activation non destructive de la création et de la gestion du chat.
-- À exécuter si supabase/schema.sql a déjà été appliqué.

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
