-- Schema inicial do site institucional EEEFM Deputado Genival Nunes da Costa

create extension if not exists "pgcrypto";

-- Perfis de usuário (autenticação). Único role usado hoje: 'admin'.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null default 'Admin',
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- Professores
create table professores (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  categoria   text not null default 'professor' check (categoria in ('gestao', 'professor', 'tecnica')),
  cargo       text,               -- ex: "Diretor", "Professor de Matemática", "Coordenador Pedagógico"
  disciplina  text,
  bio         text,               -- texto livre sobre o professor
  foto_url    text,
  ordem       int not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Atividades oferecidas pela escola (esportivas, culturais, extracurriculares)
create table atividades (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descricao   text,
  categoria   text not null default 'geral' check (categoria in ('esportiva','cultural','extracurricular','geral')),
  foto_url    text,
  ordem       int not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Galeria de fotos da estrutura/campo da escola (piscina, biblioteca, auditório, salas, etc.)
create table galeria_fotos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descricao   text,
  categoria   text,
  foto_url    text not null,
  ordem       int not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Posts/avisos com período de validade (ex: "Feira do dia 10/08 - 12/08")
create table posts (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  conteudo    text,
  foto_url    text,
  data_inicio date not null default current_date,
  data_fim    date,                -- null = sem data de expiração
  fixado      boolean not null default false, -- destaque no topo enquanto vigente
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Textos institucionais (Sobre, História, Missão, Visão, Valores) por chave única
create table conteudo_institucional (
  chave       text primary key,   -- 'historia', 'missao', 'visao', 'valores', ...
  titulo      text not null,
  corpo       text not null default '',
  updated_at  timestamptz not null default now()
);

-- Dados de contato / localização (linha única)
create table contato_info (
  id          int primary key default 1,
  endereco    text,
  bairro      text,
  cidade      text,
  cep         text,
  whatsapp    text,
  instagram   text,
  facebook    text,
  latitude    double precision,
  longitude   double precision,
  updated_at  timestamptz not null default now(),
  constraint contato_info_singleton check (id = 1)
);

-- Seções customizáveis: o admin pode criar novas seções (ex: "Alunos") sem alterar código.
-- Cada seção usa um dos "templates" abaixo para saber como renderizar seus itens.
create table secoes (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  slug        text not null unique,
  descricao   text,
  template    text not null default 'galeria' check (template in ('galeria','cards','lista')),
  ordem       int not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Itens de uma seção customizada (foto + texto)
create table secao_itens (
  id          uuid primary key default gen_random_uuid(),
  secao_id    uuid not null references secoes(id) on delete cascade,
  titulo      text,
  descricao   text,
  foto_url    text,
  ordem       int not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

create index idx_professores_ativo_ordem on professores (ativo, ordem);
create index idx_professores_categoria on professores (categoria, ordem);
create index idx_atividades_ativo_ordem on atividades (ativo, ordem);
create index idx_galeria_ativo_ordem on galeria_fotos (ativo, ordem);
create index idx_posts_vigencia on posts (ativo, data_inicio, data_fim);
create index idx_secao_itens_secao on secao_itens (secao_id, ativo, ordem);
