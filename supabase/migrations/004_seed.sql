-- Conteúdo institucional inicial (extraído de escolagenivalnunes.com.br em 2026-07-17).
-- Fotos ficam de fora do seed: o admin sobe todas pelo painel.

insert into conteudo_institucional (chave, titulo, corpo) values
('historia', 'Nossa História',
 'A EEEFM Deputado Genival Nunes da Costa foi fundada no final dos anos 1980 para atender os setores 08 e 09 de Vilhena, iniciando com turmas do 1º ao 4º ano em dependências de supletivo. A sede atual foi inaugurada em março de 1992. A escola homenageia o deputado Genival Nunes da Costa, reconhecido por seu compromisso com a educação.'),
('missao', 'Missão',
 'Garantir formação integral em tempo integral, preparando estudantes para a vida, o trabalho e o exercício da cidadania.'),
('visao', 'Visão',
 'Ser uma escola de referência na oferta de educação integral de qualidade pelo Programa de Educação Integral (PEI), reduzindo o abandono escolar.'),
('valores', 'Valores',
 'Baseados nas competências gerais da BNCC, nossos valores enfatizam cidadania, autonomia, empatia e transformação social.'),
('estrutura', 'Nossa Estrutura',
 'Contamos com auditório climatizado para eventos e atividades culturais, piscina para aulas de Educação Física e treinamentos, biblioteca acolhedora para leitura e pesquisa, salas de aula confortáveis, laboratórios equipados, refeitório e áreas de convivência.'),
('equipe', 'Nossa Equipe',
 'Nossa equipe gestora é comprometida com a qualidade educacional e o bem-estar da comunidade escolar. A equipe docente é composta por profissionais qualificados, dedicados e experientes. As equipes técnica e de apoio reúnem assistentes administrativos, auxiliares e profissionais de manutenção.'),
('protagonismo', 'Protagonismo Juvenil',
 'Estimulamos a participação dos estudantes através de grêmios, projetos sociais, culturais e esportivos.')
on conflict (chave) do nothing;

insert into contato_info (id, endereco, bairro, cidade, cep, whatsapp, instagram, facebook, latitude, longitude) values
(1, 'Rua 907, nº 2078', 'Nova Esperança', 'Vilhena/RO', '76980-000', '556933222863', '@escola_genival_nunes', 'EEEF. Deputado Genival Nunes da Costa', -12.726281, -60.111185)
on conflict (id) do update set
  endereco = excluded.endereco,
  bairro = excluded.bairro,
  cidade = excluded.cidade,
  cep = excluded.cep,
  whatsapp = excluded.whatsapp,
  instagram = excluded.instagram,
  facebook = excluded.facebook;

insert into secoes (titulo, slug, descricao, template, ordem) values
('Vida Estudantil', 'alunos', 'Momentos e projetos protagonizados pelos nossos alunos.', 'galeria', 1)
on conflict (slug) do nothing;
