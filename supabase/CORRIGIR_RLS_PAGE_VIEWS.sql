-- Corrige a política de segurança (RLS) da tabela page_views, que por algum
-- motivo não ficou ativa neste projeto (o registro de acessos do site estava
-- sendo bloqueado com erro 401 "row-level security policy"). Rode no SQL
-- Editor do Supabase.

drop policy if exists "page_views_public_insert" on page_views;
drop policy if exists "page_views_admin_select" on page_views;
drop policy if exists "page_views_admin_delete" on page_views;

create policy "page_views_public_insert" on page_views
  for insert with check (true);

create policy "page_views_admin_select" on page_views
  for select using (is_admin());

create policy "page_views_admin_delete" on page_views
  for delete using (is_admin());
