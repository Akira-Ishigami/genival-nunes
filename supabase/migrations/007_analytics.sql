-- Registro simples de acessos ao site (dispositivo + origem), para o admin
-- acompanhar quantas pessoas visitaram e como chegaram até o site.

create table page_views (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  caminho       text not null default '/',
  dispositivo   text not null default 'desktop' check (dispositivo in ('mobile', 'tablet', 'desktop')),
  origem        text not null default 'Direto'   -- ex: "Google", "Instagram", "Direto", "WhatsApp"
);

create index idx_page_views_created_at on page_views (created_at);

alter table page_views enable row level security;

-- Qualquer visitante pode registrar um acesso (é assim que a contagem funciona),
-- mas só o admin pode ler os dados — ninguém de fora consegue ver as estatísticas.
create policy "page_views_public_insert" on page_views
  for insert with check (true);

create policy "page_views_admin_select" on page_views
  for select using (is_admin());

create policy "page_views_admin_delete" on page_views
  for delete using (is_admin());
