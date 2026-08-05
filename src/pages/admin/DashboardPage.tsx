import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Images, Megaphone, ExternalLink, Smartphone, Monitor, Tablet, Eye, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAnalytics, type PeriodoAnalytics } from '../../hooks/useAnalytics';

const PERIODOS: { value: PeriodoAnalytics; label: string }[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: '7 dias' },
  { value: 'mes', label: '30 dias' },
  { value: 'total', label: 'Total' },
];

const ROTULO_PERIODO: Record<PeriodoAnalytics, string> = {
  hoje: 'hoje',
  semana: 'últimos 7 dias',
  mes: 'últimos 30 dias',
  total: 'desde o início',
};

const CARDS = [
  { table: 'professores', label: 'Equipe', icon: Users, to: '/admin/professores' },
  { table: 'atividades', label: 'Atividades', icon: Trophy, to: '/admin/atividades' },
  { table: 'galeria_fotos', label: 'Fotos da Estrutura', icon: Images, to: '/admin/galeria' },
  { table: 'posts', label: 'Avisos e Posts', icon: Megaphone, to: '/admin/posts' },
];

const ICONE_DISPOSITIVO: Record<string, typeof Smartphone> = {
  Celular: Smartphone,
  Computador: Monitor,
  Tablet: Tablet,
};

export default function DashboardPage() {
  const [contagens, setContagens] = useState<Record<string, number>>({});
  const [periodo, setPeriodo] = useState<PeriodoAnalytics>('total');
  const { dados, loading: carregandoAnalytics, recarregando, atualizar } = useAnalytics(periodo);

  useEffect(() => {
    CARDS.forEach(({ table }) => {
      supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .then(({ count }) => setContagens((prev) => ({ ...prev, [table]: count ?? 0 })));
    });
  }, []);

  const maxDia = dados ? Math.max(1, ...dados.porDia.map((d) => d.total)) : 1;
  const totalDispositivos = dados ? dados.porDispositivo.reduce((s, d) => s + d.total, 0) : 0;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">Painel</h1>
          <p className="text-sm text-slate-500">Visão geral do site e de quem está visitando.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5"
        >
          Ver site <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.table}
            to={c.to}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <c.icon className="h-5 w-5" />
            </span>
            <span className="text-2xl font-bold text-ink">{contagens[c.table] ?? '—'}</span>
            <span className="text-xs font-medium text-slate-500">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-brand" />
          <h2 className="font-display text-lg font-bold text-ink">Quem está visitando o site</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriodo(p.value)}
                className={`tap-target rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  periodo === p.value ? 'bg-white text-brand shadow-card' : 'text-slate-500 hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={atualizar}
            disabled={recarregando}
            aria-label="Atualizar resultados"
            className="tap-target flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:text-brand disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${recarregando ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {carregandoAnalytics && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      )}

      {!carregandoAnalytics && dados && (
        <div className="flex flex-col gap-5">
          {/* Resumo rápido: hoje, semana, mês, total */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Acessos hoje', valor: dados.hoje },
              { label: 'Últimos 7 dias', valor: dados.semana },
              { label: 'Últimos 30 dias', valor: dados.mes },
              { label: 'Desde o início', valor: dados.total },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="text-3xl font-bold text-ink">{s.valor}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Gráfico simples dos últimos 14 dias */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-3">
              <p className="mb-4 text-sm font-semibold text-ink">Acessos nos últimos 14 dias</p>
              {dados.porDia.every((d) => d.total === 0) ? (
                <p className="py-8 text-center text-sm text-slate-400">Ainda não há acessos registrados.</p>
              ) : (
                <div className="flex h-40 items-end gap-1.5">
                  {dados.porDia.map((d) => (
                    <div key={d.dia} className="flex flex-1 flex-col items-center gap-1.5">
                      <div
                        className="w-full rounded-t-md bg-brand/80 transition-all"
                        style={{ height: `${Math.max(4, (d.total / maxDia) * 100)}%` }}
                        title={`${d.dia}: ${d.total} acessos`}
                      />
                      <span className="text-[9px] text-slate-400">{d.dia.slice(0, 2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Celular x Computador */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
              <p className="mb-4 text-sm font-semibold text-ink">Celular ou computador? <span className="font-normal text-slate-400">({ROTULO_PERIODO[periodo]})</span></p>
              {totalDispositivos === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">Sem dados ainda.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {dados.porDispositivo.map((d) => {
                    const Icone = ICONE_DISPOSITIVO[d.dispositivo] ?? Monitor;
                    const pct = Math.round((d.total / totalDispositivos) * 100);
                    return (
                      <div key={d.dispositivo}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 font-medium text-ink">
                            <Icone className="h-4 w-4 text-brand" /> {d.dispositivo}
                          </span>
                          <span className="text-slate-500">{pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* De onde vieram */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="mb-4 text-sm font-semibold text-ink">De onde as pessoas vieram <span className="font-normal text-slate-400">({ROTULO_PERIODO[periodo]})</span></p>
            {dados.porOrigem.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">Sem dados ainda.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {dados.porOrigem.map((o) => (
                  <li key={o.origem} className="flex items-center justify-between rounded-xl bg-bg px-4 py-3 text-sm">
                    <span className="font-medium text-ink">{o.origem}</span>
                    <span className="font-bold text-brand">{o.total}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
