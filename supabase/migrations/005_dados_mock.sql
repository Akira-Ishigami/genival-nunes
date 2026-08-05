-- Dados fictícios (mock) para o site ficar populado durante o desenvolvimento/demonstração.
-- As fotos usam um serviço de placeholder (picsum.photos) — troque pelas fotos reais pelo painel admin.
-- Esta migration pode ser pulada em produção se preferir começar com o site vazio.

-- Equipe: gestão
insert into professores (nome, categoria, cargo, disciplina, bio, foto_url, ordem) values
('Marcos Aurélio Ferreira', 'gestao', 'Diretor', null,
 'Educador há mais de 20 anos, à frente da gestão pedagógica e administrativa da escola, com foco na educação integral e no bem-estar da comunidade escolar.',
 'https://i.pravatar.cc/400?img=12', 1),
('Eduardo Lima Souza', 'gestao', 'Vice-diretor', null,
 'Apoia a direção na gestão administrativa e pedagógica, acompanhando de perto o dia a dia da escola.',
 'https://i.pravatar.cc/400?img=51', 2),
('Camila Rodrigues Alves', 'gestao', 'Secretária', null,
 'Responsável pela secretaria escolar: matrículas, documentação e atendimento às famílias.',
 'https://i.pravatar.cc/400?img=32', 3),
('Beatriz Fernandes Costa', 'gestao', 'Orientadora Educacional', null,
 'Acompanha o desenvolvimento socioemocional dos estudantes e a mediação de conflitos no ambiente escolar.',
 'https://i.pravatar.cc/400?img=45', 4),
('Ana Paula Souza Lima', 'gestao', 'Coordenadora Pedagógica', null,
 'Responsável pelo acompanhamento pedagógico dos estudantes e pela integração entre professores e o Programa de Educação Integral.',
 'https://i.pravatar.cc/400?img=47', 5)
on conflict do nothing;

-- Equipe: professores
insert into professores (nome, categoria, cargo, disciplina, bio, foto_url, ordem) values
('Carlos Eduardo Martins', 'professor', 'Professor', 'Matemática',
 'Formado em Licenciatura em Matemática, atua há 8 anos incentivando o raciocínio lógico através de projetos práticos e olimpíadas de matemática.',
 'https://i.pravatar.cc/400?img=13', 1),
('Juliana Costa Ribeiro', 'professor', 'Professora', 'Língua Portuguesa e Literatura',
 'Apaixonada por leitura, desenvolve projetos de incentivo à escrita e clube do livro com os estudantes do ensino médio.',
 'https://i.pravatar.cc/400?img=25', 2),
('Roberto Almeida Santos', 'professor', 'Professor', 'Educação Física',
 'Responsável pelos treinamentos esportivos da escola, incluindo as aulas de natação na piscina e os times de vôlei e futsal.',
 'https://i.pravatar.cc/400?img=15', 3),
('Fernanda Oliveira Dias', 'professor', 'Professora', 'Ciências / Biologia',
 'Coordena o laboratório de ciências e os projetos de horta escolar sustentável desenvolvidos com os alunos.',
 'https://i.pravatar.cc/400?img=44', 4),
('Patrícia Gomes Nascimento', 'professor', 'Professora', 'História e Geografia',
 'Desenvolve projetos de protagonismo juvenil e cidadania, incentivando o senso crítico dos estudantes sobre a realidade local.',
 'https://i.pravatar.cc/400?img=9', 5),
('Thiago Henrique Barbosa', 'professor', 'Professor', 'Artes',
 'Coordena o grêmio estudantil e os projetos culturais, incluindo o festival de talentos realizado no auditório da escola.',
 'https://i.pravatar.cc/400?img=33', 6)
on conflict do nothing;

-- Equipe: técnica e de apoio
insert into professores (nome, categoria, cargo, disciplina, bio, foto_url, ordem) values
('José Carlos Pereira', 'tecnica', 'Assistente Administrativo', null,
 'Cuida da parte administrativa da escola, dando suporte à secretaria e à direção.',
 'https://i.pravatar.cc/400?img=53', 1),
('Maria das Graças Silva', 'tecnica', 'Auxiliar de Serviços Gerais', null,
 'Responsável pela limpeza e organização dos espaços da escola.',
 'https://i.pravatar.cc/400?img=48', 2),
('Lucas Gabriel Torres', 'tecnica', 'Técnico de Informática', null,
 'Mantém os laboratórios e equipamentos de informática funcionando para alunos e professores.',
 'https://i.pravatar.cc/400?img=60', 3),
('Rosana Aparecida Souza', 'tecnica', 'Nutricionista', null,
 'Responsável pela alimentação escolar dos estudantes durante o período integral.',
 'https://i.pravatar.cc/400?img=41', 4)
on conflict do nothing;

-- Atividades
insert into atividades (titulo, descricao, categoria, foto_url, ordem) values
('Natação', 'Aulas de natação e treinamentos na piscina da escola, para todas as idades e níveis.', 'esportiva', 'https://picsum.photos/seed/genival-ativ-1/600/400', 1),
('Futsal e Vôlei', 'Times esportivos que representam a escola em competições municipais e estaduais.', 'esportiva', 'https://picsum.photos/seed/genival-ativ-2/600/400', 2),
('Clube do Livro', 'Encontros semanais de leitura e discussão literária na biblioteca da escola.', 'cultural', 'https://picsum.photos/seed/genival-ativ-3/600/400', 3),
('Festival de Talentos', 'Apresentações culturais e artísticas dos estudantes no auditório climatizado.', 'cultural', 'https://picsum.photos/seed/genival-ativ-4/600/400', 4),
('Grêmio Estudantil', 'Espaço de protagonismo juvenil onde os alunos organizam projetos sociais e culturais.', 'extracurricular', 'https://picsum.photos/seed/genival-ativ-5/600/400', 5),
('Horta Escolar', 'Projeto de educação ambiental e sustentabilidade conduzido pelos próprios estudantes.', 'extracurricular', 'https://picsum.photos/seed/genival-ativ-6/600/400', 6),
('Olimpíada de Matemática', 'Preparação e participação em olimpíadas de matemática municipais e nacionais.', 'extracurricular', 'https://picsum.photos/seed/genival-ativ-7/600/400', 7)
on conflict do nothing;

-- Galeria / Estrutura
insert into galeria_fotos (titulo, descricao, categoria, foto_url, ordem) values
('Piscina', 'Espaço para aulas de Educação Física e treinamentos esportivos.', 'Esporte', 'https://picsum.photos/seed/genival-galeria-1/700/700', 1),
('Biblioteca', 'Espaço tranquilo e acolhedor para leitura, pesquisa e estudo.', 'Educação', 'https://picsum.photos/seed/genival-galeria-2/700/700', 2),
('Auditório', 'Auditório climatizado para eventos, apresentações e atividades culturais.', 'Cultura', 'https://picsum.photos/seed/genival-galeria-3/700/700', 3),
('Salas de Aula', 'Salas confortáveis e bem equipadas para o aprendizado dos estudantes.', 'Educação', 'https://picsum.photos/seed/genival-galeria-4/700/700', 4),
('Laboratório', 'Laboratório equipado para aulas práticas de ciências.', 'Educação', 'https://picsum.photos/seed/genival-galeria-5/700/700', 5),
('Refeitório', 'Espaço para as refeições dos estudantes durante o período integral.', 'Estrutura', 'https://picsum.photos/seed/genival-galeria-6/700/700', 6),
('Quadra Poliesportiva', 'Espaço para práticas esportivas e educação física.', 'Esporte', 'https://picsum.photos/seed/genival-galeria-7/700/700', 7),
('Área de Convivência', 'Espaço de convivência e socialização entre os estudantes.', 'Estrutura', 'https://picsum.photos/seed/genival-galeria-8/700/700', 8)
on conflict do nothing;

-- Posts / Avisos (alguns vigentes, um já expirado, para testar a regra de validade)
insert into posts (titulo, conteudo, foto_url, data_inicio, data_fim, fixado) values
('Matrículas abertas para 2026', 'As matrículas para o próximo ano letivo já estão abertas. Procure a secretaria para mais informações.', 'https://picsum.photos/seed/genival-post-1/600/400', current_date - 5, current_date + 30, true),
('Feira de Ciências', 'Venha conferir os projetos desenvolvidos pelos nossos estudantes no laboratório de ciências.', 'https://picsum.photos/seed/genival-post-2/600/400', current_date, current_date + 7, false),
('Festival de Talentos 2026', 'Apresentações culturais dos alunos no auditório da escola. Entrada gratuita para a comunidade.', 'https://picsum.photos/seed/genival-post-3/600/400', current_date + 10, current_date + 12, false),
('Reunião de pais — encerrada', 'Reunião de pais e mestres do primeiro bimestre.', null, current_date - 40, current_date - 35, false)
on conflict do nothing;

-- Itens da seção "Vida Estudantil" (criada no seed institucional)
insert into secao_itens (secao_id, titulo, descricao, foto_url, ordem)
select id, 'Protagonismo Juvenil', 'Estudantes organizando projetos sociais através do grêmio estudantil.', 'https://picsum.photos/seed/genival-secao-1/500/500', 1
from secoes where slug = 'alunos'
on conflict do nothing;

insert into secao_itens (secao_id, titulo, descricao, foto_url, ordem)
select id, 'Projetos Culturais', 'Momentos do Festival de Talentos organizado pelos alunos.', 'https://picsum.photos/seed/genival-secao-2/500/500', 2
from secoes where slug = 'alunos'
on conflict do nothing;

insert into secao_itens (secao_id, titulo, descricao, foto_url, ordem)
select id, 'Horta Escolar', 'Alunos cuidando do projeto de sustentabilidade da escola.', 'https://picsum.photos/seed/genival-secao-3/500/500', 3
from secoes where slug = 'alunos'
on conflict do nothing;
