-- Row Level Security: leitura pública liberada, escrita só para admin autenticado.

alter table profiles enable row level security;
alter table professores enable row level security;
alter table atividades enable row level security;
alter table galeria_fotos enable row level security;
alter table posts enable row level security;
alter table conteudo_institucional enable row level security;
alter table contato_info enable row level security;
alter table secoes enable row level security;
alter table secao_itens enable row level security;

-- profiles: cada admin só enxerga o próprio perfil
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

-- Helper: verifica se o usuário autenticado é admin
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Leitura pública em todas as tabelas de conteúdo
create policy "professores_public_select" on professores for select using (true);
create policy "atividades_public_select" on atividades for select using (true);
create policy "galeria_public_select" on galeria_fotos for select using (true);
create policy "posts_public_select" on posts for select using (true);
create policy "conteudo_public_select" on conteudo_institucional for select using (true);
create policy "contato_public_select" on contato_info for select using (true);
create policy "secoes_public_select" on secoes for select using (true);
create policy "secao_itens_public_select" on secao_itens for select using (true);

-- Escrita (insert/update/delete) restrita a admin
create policy "professores_admin_write" on professores for all using (is_admin()) with check (is_admin());
create policy "atividades_admin_write" on atividades for all using (is_admin()) with check (is_admin());
create policy "galeria_admin_write" on galeria_fotos for all using (is_admin()) with check (is_admin());
create policy "posts_admin_write" on posts for all using (is_admin()) with check (is_admin());
create policy "conteudo_admin_write" on conteudo_institucional for all using (is_admin()) with check (is_admin());
create policy "contato_admin_write" on contato_info for all using (is_admin()) with check (is_admin());
create policy "secoes_admin_write" on secoes for all using (is_admin()) with check (is_admin());
create policy "secao_itens_admin_write" on secao_itens for all using (is_admin()) with check (is_admin());

-- Storage: bucket "fotos" público para leitura, upload só para admin autenticado
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "fotos_public_read" on storage.objects
  for select using (bucket_id = 'fotos');

create policy "fotos_admin_write" on storage.objects
  for insert with check (bucket_id = 'fotos' and is_admin());

create policy "fotos_admin_update" on storage.objects
  for update using (bucket_id = 'fotos' and is_admin());

create policy "fotos_admin_delete" on storage.objects
  for delete using (bucket_id = 'fotos' and is_admin());
