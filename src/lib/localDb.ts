// Banco de dados temporário no navegador (localStorage), usado no lugar do Supabase
// enquanto o site está em modo de demonstração/apresentação. Veja lib/demoClient.ts.
import {
  MOCK_PROFESSORES, MOCK_ATIVIDADES, MOCK_GALERIA, MOCK_POSTS, MOCK_CONTEUDO, MOCK_CONTATO,
  MOCK_SECOES, MOCK_SECAO_ITENS,
} from './mockData';

const PREFIX = 'demo_db:';

const SEED: Record<string, unknown[]> = {
  professores: MOCK_PROFESSORES,
  atividades: MOCK_ATIVIDADES,
  galeria_fotos: MOCK_GALERIA,
  posts: MOCK_POSTS,
  secoes: MOCK_SECOES,
  secao_itens: Object.values(MOCK_SECAO_ITENS).flat(),
  conteudo_institucional: Object.values(MOCK_CONTEUDO),
  contato_info: [MOCK_CONTATO],
  page_views: [],
  profiles: [{ id: 'demo-admin', nome: 'Administrador (demonstração)', role: 'admin', created_at: new Date().toISOString() }],
};

export function readTable<T = Record<string, any>>(table: string): T[] {
  const key = PREFIX + table;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as T[];
    } catch {
      // dados corrompidos, cai pro seed abaixo
    }
  }
  const seed = (SEED[table] ?? []) as T[];
  localStorage.setItem(key, JSON.stringify(seed));
  return JSON.parse(JSON.stringify(seed));
}

export function writeTable(table: string, rows: unknown[]): void {
  localStorage.setItem(PREFIX + table, JSON.stringify(rows));
}

const STORAGE_KEY = 'demo_db:__storage__';

export function readStorageMap(): Record<string, string> {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function writeStorageFile(path: string, dataUrl: string): void {
  const map = readStorageMap();
  map[path] = dataUrl;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}
