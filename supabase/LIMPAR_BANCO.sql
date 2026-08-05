-- Limpa os dados de teste/mock pra você começar a cadastrar tudo de verdade pelo painel admin.
-- Rode isso no SQL Editor do Supabase (https://supabase.com/dashboard/project/_/sql/new).
--
-- O que ESTE script apaga: professores/equipe, atividades, fotos da estrutura, posts/avisos
-- e as seções personalizadas (ex: "Vida Estudantil") com seus itens.
--
-- O que ESTE script NÃO apaga (de propósito): os textos institucionais (história, missão,
-- visão, valores...) e os dados de contato/localização — esses já estão corretos com as
-- informações reais da escola. Se quiser apagar esses também, veja a seção opcional no fim.

truncate table secao_itens restart identity;
truncate table secoes restart identity;
truncate table posts restart identity;
truncate table galeria_fotos restart identity;
truncate table atividades restart identity;
truncate table professores restart identity;

-- ─────────────────────────────────────────────────────────────────────────
-- OPCIONAL: só descomente e rode se quiser apagar TAMBÉM os textos
-- institucionais e o contato, voltando ao zero absoluto.
-- ─────────────────────────────────────────────────────────────────────────
-- truncate table conteudo_institucional;
-- truncate table contato_info;

-- OPCIONAL: recriar a seção "Vida Estudantil" vazia, já que o truncate acima
-- apaga ela junto. Descomente se quiser continuar usando essa seção.
-- insert into secoes (titulo, slug, descricao, template, ordem) values
-- ('Vida Estudantil', 'alunos', 'Momentos e projetos protagonizados pelos nossos alunos.', 'galeria', 1);
