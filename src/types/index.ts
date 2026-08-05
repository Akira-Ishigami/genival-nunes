export interface Profile {
  id: string;
  nome: string;
  role: 'admin';
  created_at: string;
}

export type CategoriaEquipe = 'gestao' | 'professor' | 'tecnica';

export interface Professor {
  id: string;
  nome: string;
  categoria: CategoriaEquipe;
  cargo: string | null;
  disciplina: string | null;
  bio: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type CategoriaAtividade = 'esportiva' | 'cultural' | 'extracurricular' | 'geral';

export interface Atividade {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: CategoriaAtividade;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface GaleriaFoto {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: string | null;
  foto_url: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  titulo: string;
  conteudo: string | null;
  foto_url: string | null;
  data_inicio: string;
  data_fim: string | null;
  fixado: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type ConteudoChave =
  | 'historia' | 'missao' | 'visao' | 'valores' | 'estrutura' | 'equipe' | 'protagonismo';

export interface ConteudoInstitucional {
  chave: string;
  titulo: string;
  corpo: string;
  updated_at: string;
}

export interface ContatoInfo {
  id: number;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  cep: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
}

export type SecaoTemplate = 'galeria' | 'cards' | 'lista';

export interface Secao {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  template: SecaoTemplate;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface SecaoItem {
  id: string;
  secao_id: string;
  titulo: string | null;
  descricao: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
}
