// Dados de demonstração usados quando o Supabase ainda não foi configurado
// (veja isDemoMode() em lib/supabase.ts). Espelha o conteúdo de
// supabase/migrations/004_seed.sql e 005_dados_mock.sql — mantenha os dois em sincronia.
import type {
  Professor, Atividade, GaleriaFoto, Post, ConteudoInstitucional, ContatoInfo, Secao, SecaoItem,
} from '../types';

const now = new Date().toISOString();
const hoje = new Date();
function addDias(dias: number) {
  const d = new Date(hoje);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export const MOCK_PROFESSORES: Professor[] = [
  { id: 'p1', nome: 'Marcos Aurélio Ferreira', categoria: 'gestao', cargo: 'Diretor', disciplina: null, bio: 'Educador há mais de 20 anos, à frente da gestão pedagógica e administrativa da escola, com foco na educação integral e no bem-estar da comunidade escolar.', foto_url: 'https://i.pravatar.cc/400?img=12', ordem: 1, ativo: true, created_at: now, updated_at: now },
  { id: 'p9', nome: 'Eduardo Lima Souza', categoria: 'gestao', cargo: 'Vice-diretor', disciplina: null, bio: 'Apoia a direção na gestão administrativa e pedagógica, acompanhando de perto o dia a dia da escola.', foto_url: 'https://i.pravatar.cc/400?img=51', ordem: 2, ativo: true, created_at: now, updated_at: now },
  { id: 'p10', nome: 'Camila Rodrigues Alves', categoria: 'gestao', cargo: 'Secretária', disciplina: null, bio: 'Responsável pela secretaria escolar: matrículas, documentação e atendimento às famílias.', foto_url: 'https://i.pravatar.cc/400?img=32', ordem: 3, ativo: true, created_at: now, updated_at: now },
  { id: 'p11', nome: 'Beatriz Fernandes Costa', categoria: 'gestao', cargo: 'Orientadora Educacional', disciplina: null, bio: 'Acompanha o desenvolvimento socioemocional dos estudantes e a mediação de conflitos no ambiente escolar.', foto_url: 'https://i.pravatar.cc/400?img=45', ordem: 4, ativo: true, created_at: now, updated_at: now },
  { id: 'p2', nome: 'Ana Paula Souza Lima', categoria: 'gestao', cargo: 'Coordenadora Pedagógica', disciplina: null, bio: 'Responsável pelo acompanhamento pedagógico dos estudantes e pela integração entre professores e o Programa de Educação Integral.', foto_url: 'https://i.pravatar.cc/400?img=47', ordem: 5, ativo: true, created_at: now, updated_at: now },
  { id: 'p3', nome: 'Carlos Eduardo Martins', categoria: 'professor', cargo: 'Professor', disciplina: 'Matemática', bio: 'Formado em Licenciatura em Matemática, atua há 8 anos incentivando o raciocínio lógico através de projetos práticos e olimpíadas de matemática.', foto_url: 'https://i.pravatar.cc/400?img=13', ordem: 1, ativo: true, created_at: now, updated_at: now },
  { id: 'p4', nome: 'Juliana Costa Ribeiro', categoria: 'professor', cargo: 'Professora', disciplina: 'Língua Portuguesa e Literatura', bio: 'Apaixonada por leitura, desenvolve projetos de incentivo à escrita e clube do livro com os estudantes do ensino médio.', foto_url: 'https://i.pravatar.cc/400?img=25', ordem: 2, ativo: true, created_at: now, updated_at: now },
  { id: 'p5', nome: 'Roberto Almeida Santos', categoria: 'professor', cargo: 'Professor', disciplina: 'Educação Física', bio: 'Responsável pelos treinamentos esportivos da escola, incluindo as aulas de natação na piscina e os times de vôlei e futsal.', foto_url: 'https://i.pravatar.cc/400?img=15', ordem: 3, ativo: true, created_at: now, updated_at: now },
  { id: 'p6', nome: 'Fernanda Oliveira Dias', categoria: 'professor', cargo: 'Professora', disciplina: 'Ciências / Biologia', bio: 'Coordena o laboratório de ciências e os projetos de horta escolar sustentável desenvolvidos com os alunos.', foto_url: 'https://i.pravatar.cc/400?img=44', ordem: 4, ativo: true, created_at: now, updated_at: now },
  { id: 'p7', nome: 'Patrícia Gomes Nascimento', categoria: 'professor', cargo: 'Professora', disciplina: 'História e Geografia', bio: 'Desenvolve projetos de protagonismo juvenil e cidadania, incentivando o senso crítico dos estudantes sobre a realidade local.', foto_url: 'https://i.pravatar.cc/400?img=9', ordem: 5, ativo: true, created_at: now, updated_at: now },
  { id: 'p8', nome: 'Thiago Henrique Barbosa', categoria: 'professor', cargo: 'Professor', disciplina: 'Artes', bio: 'Coordena o grêmio estudantil e os projetos culturais, incluindo o festival de talentos realizado no auditório da escola.', foto_url: 'https://i.pravatar.cc/400?img=33', ordem: 6, ativo: true, created_at: now, updated_at: now },
  { id: 'p12', nome: 'José Carlos Pereira', categoria: 'tecnica', cargo: 'Assistente Administrativo', disciplina: null, bio: 'Cuida da parte administrativa da escola, dando suporte à secretaria e à direção.', foto_url: 'https://i.pravatar.cc/400?img=53', ordem: 1, ativo: true, created_at: now, updated_at: now },
  { id: 'p13', nome: 'Maria das Graças Silva', categoria: 'tecnica', cargo: 'Auxiliar de Serviços Gerais', disciplina: null, bio: 'Responsável pela limpeza e organização dos espaços da escola.', foto_url: 'https://i.pravatar.cc/400?img=48', ordem: 2, ativo: true, created_at: now, updated_at: now },
  { id: 'p14', nome: 'Lucas Gabriel Torres', categoria: 'tecnica', cargo: 'Técnico de Informática', disciplina: null, bio: 'Mantém os laboratórios e equipamentos de informática funcionando para alunos e professores.', foto_url: 'https://i.pravatar.cc/400?img=60', ordem: 3, ativo: true, created_at: now, updated_at: now },
  { id: 'p15', nome: 'Rosana Aparecida Souza', categoria: 'tecnica', cargo: 'Nutricionista', disciplina: null, bio: 'Responsável pela alimentação escolar dos estudantes durante o período integral.', foto_url: 'https://i.pravatar.cc/400?img=41', ordem: 4, ativo: true, created_at: now, updated_at: now },
];

export const MOCK_ATIVIDADES: Atividade[] = [
  { id: 'a1', titulo: 'Natação', descricao: 'Aulas de natação e treinamentos na piscina da escola, para todas as idades e níveis.', categoria: 'esportiva', foto_url: 'https://picsum.photos/seed/genival-ativ-1/600/400', ordem: 1, ativo: true, created_at: now, updated_at: now },
  { id: 'a2', titulo: 'Futsal e Vôlei', descricao: 'Times esportivos que representam a escola em competições municipais e estaduais.', categoria: 'esportiva', foto_url: 'https://picsum.photos/seed/genival-ativ-2/600/400', ordem: 2, ativo: true, created_at: now, updated_at: now },
  { id: 'a3', titulo: 'Clube do Livro', descricao: 'Encontros semanais de leitura e discussão literária na biblioteca da escola.', categoria: 'cultural', foto_url: 'https://picsum.photos/seed/genival-ativ-3/600/400', ordem: 3, ativo: true, created_at: now, updated_at: now },
  { id: 'a4', titulo: 'Festival de Talentos', descricao: 'Apresentações culturais e artísticas dos estudantes no auditório climatizado.', categoria: 'cultural', foto_url: 'https://picsum.photos/seed/genival-ativ-4/600/400', ordem: 4, ativo: true, created_at: now, updated_at: now },
  { id: 'a5', titulo: 'Grêmio Estudantil', descricao: 'Espaço de protagonismo juvenil onde os alunos organizam projetos sociais e culturais.', categoria: 'extracurricular', foto_url: 'https://picsum.photos/seed/genival-ativ-5/600/400', ordem: 5, ativo: true, created_at: now, updated_at: now },
  { id: 'a6', titulo: 'Horta Escolar', descricao: 'Projeto de educação ambiental e sustentabilidade conduzido pelos próprios estudantes.', categoria: 'extracurricular', foto_url: 'https://picsum.photos/seed/genival-ativ-6/600/400', ordem: 6, ativo: true, created_at: now, updated_at: now },
  { id: 'a7', titulo: 'Olimpíada de Matemática', descricao: 'Preparação e participação em olimpíadas de matemática municipais e nacionais.', categoria: 'extracurricular', foto_url: 'https://picsum.photos/seed/genival-ativ-7/600/400', ordem: 7, ativo: true, created_at: now, updated_at: now },
];

export const MOCK_GALERIA: GaleriaFoto[] = [
  { id: 'g1', titulo: 'Piscina', descricao: 'Espaço para aulas de Educação Física e treinamentos esportivos.', categoria: 'Esporte', foto_url: 'https://picsum.photos/seed/genival-galeria-1/700/700', ordem: 1, ativo: true, created_at: now },
  { id: 'g2', titulo: 'Biblioteca', descricao: 'Espaço tranquilo e acolhedor para leitura, pesquisa e estudo.', categoria: 'Educação', foto_url: 'https://picsum.photos/seed/genival-galeria-2/700/700', ordem: 2, ativo: true, created_at: now },
  { id: 'g3', titulo: 'Auditório', descricao: 'Auditório climatizado para eventos, apresentações e atividades culturais.', categoria: 'Cultura', foto_url: 'https://picsum.photos/seed/genival-galeria-3/700/700', ordem: 3, ativo: true, created_at: now },
  { id: 'g4', titulo: 'Salas de Aula', descricao: 'Salas confortáveis e bem equipadas para o aprendizado dos estudantes.', categoria: 'Educação', foto_url: 'https://picsum.photos/seed/genival-galeria-4/700/700', ordem: 4, ativo: true, created_at: now },
  { id: 'g5', titulo: 'Laboratório', descricao: 'Laboratório equipado para aulas práticas de ciências.', categoria: 'Educação', foto_url: 'https://picsum.photos/seed/genival-galeria-5/700/700', ordem: 5, ativo: true, created_at: now },
  { id: 'g6', titulo: 'Refeitório', descricao: 'Espaço para as refeições dos estudantes durante o período integral.', categoria: 'Estrutura', foto_url: 'https://picsum.photos/seed/genival-galeria-6/700/700', ordem: 6, ativo: true, created_at: now },
  { id: 'g7', titulo: 'Quadra Poliesportiva', descricao: 'Espaço para práticas esportivas e educação física.', categoria: 'Esporte', foto_url: 'https://picsum.photos/seed/genival-galeria-7/700/700', ordem: 7, ativo: true, created_at: now },
  { id: 'g8', titulo: 'Área de Convivência', descricao: 'Espaço de convivência e socialização entre os estudantes.', categoria: 'Estrutura', foto_url: 'https://picsum.photos/seed/genival-galeria-8/700/700', ordem: 8, ativo: true, created_at: now },
];

export const MOCK_POSTS: Post[] = [
  { id: 'post1', titulo: 'Matrículas abertas para 2026', conteudo: 'As matrículas para o próximo ano letivo já estão abertas. Procure a secretaria para mais informações.', foto_url: 'https://picsum.photos/seed/genival-post-1/600/400', data_inicio: addDias(-5), data_fim: addDias(30), fixado: true, ativo: true, created_at: now, updated_at: now },
  { id: 'post2', titulo: 'Feira de Ciências', conteudo: 'Venha conferir os projetos desenvolvidos pelos nossos estudantes no laboratório de ciências.', foto_url: 'https://picsum.photos/seed/genival-post-2/600/400', data_inicio: addDias(0), data_fim: addDias(7), fixado: false, ativo: true, created_at: now, updated_at: now },
  { id: 'post3', titulo: 'Festival de Talentos 2026', conteudo: 'Apresentações culturais dos alunos no auditório da escola. Entrada gratuita para a comunidade.', foto_url: 'https://picsum.photos/seed/genival-post-3/600/400', data_inicio: addDias(10), data_fim: addDias(12), fixado: false, ativo: true, created_at: now, updated_at: now },
];

export const MOCK_CONTEUDO: Record<string, ConteudoInstitucional> = {
  historia: { chave: 'historia', titulo: 'Nossa História', corpo: 'A EEEFM Deputado Genival Nunes da Costa foi fundada no final dos anos 1980 para atender os setores 08 e 09 de Vilhena, iniciando com turmas do 1º ao 4º ano em dependências de supletivo. A sede atual foi inaugurada em março de 1992. A escola homenageia o deputado Genival Nunes da Costa, reconhecido por seu compromisso com a educação.', updated_at: now },
  missao: { chave: 'missao', titulo: 'Missão', corpo: 'Garantir formação integral em tempo integral, preparando estudantes para a vida, o trabalho e o exercício da cidadania.', updated_at: now },
  visao: { chave: 'visao', titulo: 'Visão', corpo: 'Ser uma escola de referência na oferta de educação integral de qualidade pelo Programa de Educação Integral (PEI), reduzindo o abandono escolar.', updated_at: now },
  valores: { chave: 'valores', titulo: 'Valores', corpo: 'Baseados nas competências gerais da BNCC, nossos valores enfatizam cidadania, autonomia, empatia e transformação social.', updated_at: now },
  estrutura: { chave: 'estrutura', titulo: 'Nossa Estrutura', corpo: 'Contamos com auditório climatizado para eventos e atividades culturais, piscina para aulas de Educação Física e treinamentos, biblioteca acolhedora para leitura e pesquisa, salas de aula confortáveis, laboratórios equipados, refeitório e áreas de convivência.', updated_at: now },
  equipe: { chave: 'equipe', titulo: 'Nossa Equipe', corpo: 'Nossa equipe gestora é comprometida com a qualidade educacional e o bem-estar da comunidade escolar. A equipe docente é composta por profissionais qualificados, dedicados e experientes. As equipes técnica e de apoio reúnem assistentes administrativos, auxiliares e profissionais de manutenção.', updated_at: now },
  protagonismo: { chave: 'protagonismo', titulo: 'Protagonismo Juvenil', corpo: 'Estimulamos a participação dos estudantes através de grêmios, projetos sociais, culturais e esportivos.', updated_at: now },
};

export const MOCK_CONTATO: ContatoInfo = {
  id: 1,
  endereco: 'Rua 907, nº 2078',
  bairro: 'Boa Esperança',
  cidade: 'Vilhena/RO',
  cep: '76985-440',
  whatsapp: '5569984373868',
  instagram: '@escola_genival_nunes',
  facebook: 'EEEF Deputado Genival Nunes da Costa',
  latitude: -12.726281,
  longitude: -60.111185,
  updated_at: now,
};

export const MOCK_SECOES: Secao[] = [
  { id: 's1', titulo: 'Vida Estudantil', slug: 'alunos', descricao: 'Momentos e projetos protagonizados pelos nossos alunos.', template: 'galeria', ordem: 1, ativo: true, created_at: now },
];

export const MOCK_SECAO_ITENS: Record<string, SecaoItem[]> = {
  alunos: [
    { id: 'si1', secao_id: 's1', titulo: 'Protagonismo Juvenil', descricao: 'Estudantes organizando projetos sociais através do grêmio estudantil.', foto_url: 'https://picsum.photos/seed/genival-secao-1/500/500', ordem: 1, ativo: true, created_at: now },
    { id: 'si2', secao_id: 's1', titulo: 'Projetos Culturais', descricao: 'Momentos do Festival de Talentos organizado pelos alunos.', foto_url: 'https://picsum.photos/seed/genival-secao-2/500/500', ordem: 2, ativo: true, created_at: now },
    { id: 'si3', secao_id: 's1', titulo: 'Horta Escolar', descricao: 'Alunos cuidando do projeto de sustentabilidade da escola.', foto_url: 'https://picsum.photos/seed/genival-secao-3/500/500', ordem: 3, ativo: true, created_at: now },
  ],
};
