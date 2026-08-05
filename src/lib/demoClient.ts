// Cliente "fake" que imita o subconjunto da API do supabase-js usado neste projeto,
// mas lê/escreve num banco temporário no navegador (localStorage) em vez de um
// servidor real. Existe só para apresentações/demonstrações sem depender de internet
// ou de um projeto Supabase configurado — veja lib/supabase.ts.
import { readTable, writeTable, readStorageMap, writeStorageFile } from './localDb';

type Row = Record<string, any>;
type Filter = (row: Row) => boolean;
type Op = { type: 'insert'; payload: Row | Row[] } | { type: 'update'; payload: Row } | { type: 'delete' };

class QueryBuilder implements PromiseLike<{ data: any; error: any; count?: number }> {
  private filters: Filter[] = [];
  private orderBy: { key: string; ascending: boolean } | null = null;
  private selectCols: string | null = null;
  private countOnly = false;
  private mode: 'many' | 'single' | 'maybeSingle' = 'many';
  private op: Op | null = null;
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  select(cols?: string, opts?: { count?: 'exact'; head?: boolean }) {
    this.selectCols = cols ?? '*';
    if (opts?.count === 'exact' && opts.head) this.countOnly = true;
    return this;
  }

  eq(key: string, value: any) {
    this.filters.push((r) => r[key] === value);
    return this;
  }

  in(key: string, values: any[]) {
    this.filters.push((r) => values.includes(r[key]));
    return this;
  }

  gte(key: string, value: any) {
    this.filters.push((r) => r[key] >= value);
    return this;
  }

  lte(key: string, value: any) {
    this.filters.push((r) => r[key] <= value);
    return this;
  }

  or(expr: string) {
    const clauses = expr.split(',').map((c) => {
      const [field, op, ...rest] = c.split('.');
      return { field, op, value: rest.join('.') };
    });
    this.filters.push((r) =>
      clauses.some((c) => {
        if (c.op === 'is') return c.value === 'null' ? r[c.field] == null : r[c.field] != null;
        if (c.op === 'gte') return r[c.field] >= c.value;
        return false;
      }),
    );
    return this;
  }

  order(key: string, opts: { ascending: boolean }) {
    this.orderBy = { key, ascending: opts.ascending };
    return this;
  }

  single() {
    this.mode = 'single';
    return this;
  }

  maybeSingle() {
    this.mode = 'maybeSingle';
    return this;
  }

  insert(payload: Row | Row[]) {
    this.op = { type: 'insert', payload };
    return this;
  }

  update(payload: Row) {
    this.op = { type: 'update', payload };
    return this;
  }

  delete() {
    this.op = { type: 'delete' };
    return this;
  }

  private execute() {
    let rows: Row[];
    const op = this.op;

    if (op?.type === 'insert') {
      const now = new Date().toISOString();
      const incoming = Array.isArray(op.payload) ? op.payload : [op.payload];
      const inserted = incoming.map((p) => ({
        id: p.id ?? crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        ...p,
      }));
      const all = readTable(this.table);
      writeTable(this.table, [...all, ...inserted]);
      rows = inserted;
    } else if (op?.type === 'update') {
      const now = new Date().toISOString();
      const all = readTable(this.table);
      const matchIds = new Set(all.filter((r) => this.filters.every((f) => f(r))).map((r) => r.id));
      const updatedAll = all.map((r) => (matchIds.has(r.id) ? { ...r, ...op.payload, updated_at: now } : r));
      writeTable(this.table, updatedAll);
      rows = updatedAll.filter((r) => matchIds.has(r.id));
    } else if (op?.type === 'delete') {
      const all = readTable(this.table);
      const matchIds = new Set(all.filter((r) => this.filters.every((f) => f(r))).map((r) => r.id));
      writeTable(this.table, all.filter((r) => !matchIds.has(r.id)));
      rows = all.filter((r) => matchIds.has(r.id));
    } else {
      rows = readTable(this.table).filter((r) => this.filters.every((f) => f(r)));
      if (this.orderBy) {
        const { key, ascending } = this.orderBy;
        rows = [...rows].sort((a, b) => {
          if (a[key] < b[key]) return ascending ? -1 : 1;
          if (a[key] > b[key]) return ascending ? 1 : -1;
          return 0;
        });
      }
    }

    if (this.countOnly) return { data: null, error: null, count: rows.length };

    if (this.selectCols && this.selectCols !== '*') {
      const cols = this.selectCols.split(',').map((c) => c.trim());
      rows = rows.map((r) => Object.fromEntries(cols.map((c) => [c, r[c]])));
    }

    if (this.mode === 'single') {
      return { data: rows[0] ?? null, error: rows[0] ? null : { message: 'Registro não encontrado.' } };
    }
    if (this.mode === 'maybeSingle') {
      return { data: rows[0] ?? null, error: null };
    }
    return { data: rows, error: null };
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

type AuthEvent = 'INITIAL_SESSION' | 'SIGNED_IN' | 'SIGNED_OUT';
type Session = { user: { id: string; email: string } };
type AuthListener = (event: AuthEvent, session: Session | null) => void;

const AUTH_KEY = 'demo_db:__auth__';
const listeners = new Set<AuthListener>();

// Credenciais fixas do modo apresentação — só pra dar um pouco de realismo ao
// login, já que não há autenticação de verdade por trás disso.
const DEMO_EMAIL = 'genivalnunes@gmail.com';
const DEMO_SENHA = 'genivalnunesdacosta@!';

function loadSession(): Session | null {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(session: Session | null) {
  if (session) localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  else localStorage.removeItem(AUTH_KEY);
}

export const demoClient = {
  from(table: string) {
    return new QueryBuilder(table);
  },
  storage: {
    from(_bucket: string) {
      return {
        async upload(path: string, file: Blob, _opts?: Record<string, unknown>) {
          try {
            const dataUrl = await fileToDataUrl(file);
            writeStorageFile(path, dataUrl);
            return { data: { path }, error: null };
          } catch {
            return { data: null, error: { message: 'Não foi possível salvar a imagem no armazenamento temporário do navegador.' } };
          }
        },
        getPublicUrl(path: string) {
          const map = readStorageMap();
          return { data: { publicUrl: map[path] ?? '' } };
        },
      };
    },
  },
  auth: {
    onAuthStateChange(cb: AuthListener) {
      listeners.add(cb);
      queueMicrotask(() => cb('INITIAL_SESSION', loadSession()));
      return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      if (email !== DEMO_EMAIL || password !== DEMO_SENHA) {
        return { error: { message: 'E-mail ou senha inválidos.' } };
      }
      const session: Session = { user: { id: 'demo-admin', email } };
      saveSession(session);
      listeners.forEach((cb) => cb('SIGNED_IN', session));
      return { error: null };
    },
    async signOut() {
      saveSession(null);
      listeners.forEach((cb) => cb('SIGNED_OUT', null));
      return { error: null };
    },
  },
};
