import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, GripVertical, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploadField from './ImageUploadField';
import ImageWithFallback from '../ui/ImageWithFallback';

type Option = { value: string; label: string };
type Extra = {
  /** Some campos só fazem sentido dependendo de outro campo (ex: "Disciplina" só se o Grupo for Docente). */
  showIf?: (values: Record<string, any>) => boolean;
  /** Encaixa lado a lado com o próximo campo marcado como `half`, pra economizar espaço. */
  half?: boolean;
  /** Texto pequeno de ajuda embaixo do campo (evita rótulos longos que quebram linha). */
  hint?: string;
  /** Abre uma divisória "Configurações" antes deste campo, pra separar do conteúdo principal. */
  secao?: boolean;
};

export type FieldConfig = Extra &
  (
    | { key: string; label: string; type: 'text' | 'textarea' | 'date'; required?: boolean }
    | { key: string; label: string; type: 'number' }
    | { key: string; label: string; type: 'toggle' }
    | { key: string; label: string; type: 'select'; options: Option[] | ((values: Record<string, any>) => Option[]) }
    | { key: string; label: string; type: 'image'; folder: string }
  );

interface Props {
  title: string;
  description?: string;
  table: string;
  fields: FieldConfig[];
  defaultValues: Record<string, unknown>;
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  orderKey?: string;
  extraFilter?: Record<string, unknown>;
  /** Quando true: só permite adicionar novo ou excluir — não dá pra editar o que já existe. */
  addOnly?: boolean;
  /** Mostra abas de filtro acima da lista (ex: filtrar Equipe por Gestão/Docentes/Técnica). */
  filtro?: { chave: string; opcoes: Option[] };
  /** Mostra a lista em ordem alfabética pelo título, em vez da ordem de exibição do site. */
  ordenarAlfabetico?: boolean;
}

function camposVisiveis(fields: FieldConfig[], values: Record<string, any>) {
  return fields.filter((f) => !f.showIf || f.showIf(values));
}

// Agrupa campos consecutivos marcados como `half` em pares, pra renderizar lado a lado.
function agruparEmLinhas(fields: FieldConfig[]): FieldConfig[][] {
  const linhas: FieldConfig[][] = [];
  for (const f of fields) {
    const ultima = linhas[linhas.length - 1];
    if (f.half && ultima && ultima.length === 1 && ultima[0].half) {
      ultima.push(f);
    } else {
      linhas.push([f]);
    }
  }
  return linhas;
}

export default function ResourceAdminPage({
  title,
  description,
  table,
  fields,
  defaultValues,
  titleKey,
  subtitleKey,
  imageKey,
  orderKey = 'ordem',
  extraFilter,
  addOnly = false,
  filtro,
  ordenarAlfabetico = false,
}: Props) {
  const [itens, setItens] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Record<string, any> | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Record<string, any> | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  async function carregar() {
    setLoading(true);
    let query = supabase.from(table).select('*').order(orderKey, { ascending: true });
    if (extraFilter) {
      Object.entries(extraFilter).forEach(([k, v]) => { query = query.eq(k, v); });
    }
    const { data } = await query;
    setItens(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, JSON.stringify(extraFilter)]);

  function abrirNovo() {
    setEditando({ ...defaultValues, ...extraFilter, [orderKey]: itens.length });
  }

  function abrirEdicao(item: Record<string, any>) {
    setEditando({ ...item });
  }

  async function salvar() {
    if (!editando) return;
    setSalvando(true);
    const { id, ...payload } = editando;

    // Campos escondidos pela lógica (showIf) não devem ser salvos com um valor antigo/irrelevante.
    fields.forEach((f) => {
      if (f.showIf && !f.showIf(editando)) payload[f.key] = null;
    });

    if (id) {
      await supabase.from(table).update(payload).eq('id', id);
    } else {
      await supabase.from(table).insert(payload);
    }
    setSalvando(false);
    setEditando(null);
    carregar();
  }

  async function confirmarExclusao() {
    if (!paraExcluir) return;
    const id = paraExcluir.id;
    setParaExcluir(null);
    setExcluindoId(id);
    await supabase.from(table).delete().eq('id', id);
    setExcluindoId(null);
    carregar();
  }

  const linhas = editando ? agruparEmLinhas(camposVisiveis(fields, editando)) : [];

  let itensExibidos = itens;
  if (filtro && filtroAtivo !== 'todos') {
    itensExibidos = itensExibidos.filter((item) => item[filtro.chave] === filtroAtivo);
  }
  if (ordenarAlfabetico) {
    itensExibidos = [...itensExibidos].sort((a, b) =>
      String(a[titleKey] ?? '').localeCompare(String(b[titleKey] ?? ''), 'pt-BR'),
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
          {description && <p className="text-sm text-slate-500">{description}</p>}
          {addOnly && (
            <p className="mt-1 text-sm font-medium text-amber-600">
              Aqui você só adiciona novos ou apaga — não dá pra editar o texto do que já existe.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={abrirNovo}
          className="tap-target inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      {filtro && !loading && itens.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFiltroAtivo('todos')}
            className={`tap-target rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filtroAtivo === 'todos' ? 'bg-brand text-white' : 'bg-white text-slate-600 shadow-card hover:text-brand'
            }`}
          >
            Todos
          </button>
          {filtro.opcoes.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setFiltroAtivo(o.value)}
              className={`tap-target rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filtroAtivo === o.value ? 'bg-brand text-white' : 'bg-white text-slate-600 shadow-card hover:text-brand'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      )}

      {!loading && itens.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Nada cadastrado ainda. Clique em "Adicionar" para começar.
        </p>
      )}

      {!loading && itens.length > 0 && itensExibidos.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Nada aqui pra esse filtro.
        </p>
      )}

      <ul className="space-y-2">
        {itensExibidos.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card"
          >
            <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
            {imageKey && (
              <ImageWithFallback src={item[imageKey]} alt="" className="h-12 w-12 shrink-0 rounded-lg" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{item[titleKey]}</p>
              {subtitleKey && item[subtitleKey] && (
                <p className="truncate text-xs text-slate-500">{item[subtitleKey]}</p>
              )}
            </div>
            {'ativo' in item && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  item.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.ativo ? 'Ativo' : 'Inativo'}
              </span>
            )}
            {!addOnly && (
              <button
                type="button"
                onClick={() => abrirEdicao(item)}
                aria-label="Editar"
                className="tap-target flex shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setParaExcluir(item)}
              aria-label="Excluir"
              disabled={excluindoId === item.id}
              className="tap-target flex shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              {excluindoId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </li>
        ))}
      </ul>

      {editando && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setEditando(null)}
        >
          <div
            className="animate-slide-up sm:animate-scale-in safe-bottom max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brand/70">
                  {editando.id ? 'Editar' : 'Novo item'}
                </p>
                <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditando(null)}
                aria-label="Fechar"
                className="tap-target flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="flex flex-col gap-5 p-6"
              onSubmit={(e) => {
                e.preventDefault();
                salvar();
              }}
            >
              {linhas.map((linha, i) => (
                <div key={i}>
                  {linha[0].secao && (
                    <p className="mb-3 mt-1 border-t border-slate-100 pt-5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Configurações
                    </p>
                  )}
                  <div className={linha.length === 2 ? 'grid grid-cols-2 gap-4' : ''}>
                    {linha.map((f) => (
                      <FieldInput
                        key={f.key}
                        field={f}
                        values={editando}
                        value={editando[f.key]}
                        onChange={(v) => setEditando({ ...editando, [f.key]: v })}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={salvando}
                className="tap-target mt-1 flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
              >
                {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      {paraExcluir && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={() => setParaExcluir(null)}
        >
          <div
            className="animate-scale-in w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h2 className="font-display text-lg font-bold text-ink">Excluir "{paraExcluir[titleKey]}"?</h2>
            <p className="mt-2 text-sm text-slate-500">Isso não pode ser desfeito depois.</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setParaExcluir(null)}
                className="tap-target flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExclusao}
                className="tap-target flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({
  field,
  values,
  value,
  onChange,
}: {
  field: FieldConfig;
  values: Record<string, any>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === 'image') {
    return (
      <ImageUploadField
        label={field.label}
        value={(value as string) ?? null}
        onChange={onChange}
        folder={field.folder}
      />
    );
  }

  if (field.type === 'toggle') {
    return (
      <label className="tap-target flex h-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
        <span className="text-sm font-medium text-slate-700">{field.label}</span>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 shrink-0 rounded text-brand focus:ring-brand"
        />
      </label>
    );
  }

  if (field.type === 'select') {
    const opcoes = typeof field.options === 'function' ? field.options(values) : field.options;
    return (
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink/60">{field.label}</label>
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {opcoes.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {field.hint && <p className="mt-1 text-xs text-ink/35">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink/60">{field.label}</label>
        <textarea
          required={field.required}
          rows={4}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {field.hint && <p className="mt-1 text-xs text-ink/35">{field.hint}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink/60">{field.label}</label>
      <input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        required={'required' in field ? field.required : false}
        value={(value as string | number) ?? (field.type === 'number' ? 0 : '')}
        onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
      {field.hint && <p className="mt-1 text-xs text-ink/35">{field.hint}</p>}
    </div>
  );
}
