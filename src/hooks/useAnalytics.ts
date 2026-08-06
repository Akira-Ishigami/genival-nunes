import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export type PeriodoAnalytics = 'hoje' | 'semana' | 'mes';

export interface AnalyticsResumo {
  hoje: number;
  semana: number;
  mes: number;
  total: number;
  porDispositivo: { dispositivo: string; total: number }[];
  porOrigem: { origem: string; total: number }[];
  serie: { rotulo: string; total: number }[];
}

const NOMES_DISPOSITIVO: Record<string, string> = {
  mobile: 'Celular',
  tablet: 'Tablet',
  desktop: 'Computador',
};

function inicioDoDiaAtual() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Domingo da semana atual (calendário, não janela rolante de 7 dias).
function inicioDaSemanaAtual() {
  const d = inicioDoDiaAtual();
  d.setDate(d.getDate() - d.getDay());
  return d;
}

// Dia 1 do mês atual (calendário, não janela rolante de 30 dias).
function inicioDoMesAtual() {
  const d = inicioDoDiaAtual();
  d.setDate(1);
  return d;
}

function diasNoMesAtual() {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
}

function inicioDoPeriodo(periodo: PeriodoAnalytics): Date {
  if (periodo === 'hoje') return inicioDoDiaAtual();
  if (periodo === 'semana') return inicioDaSemanaAtual();
  return inicioDoMesAtual();
}

// Monta a série do gráfico de acordo com o período: uma barra só (hoje), os 7
// dias da semana (domingo a sábado) ou todos os dias do mês atual.
function montarSerie(
  periodo: PeriodoAnalytics,
  linhas: { created_at: string }[],
): { rotulo: string; total: number }[] {
  if (periodo === 'hoje') {
    const hojeInicio = inicioDoDiaAtual();
    const total = linhas.filter((r) => new Date(r.created_at) >= hojeInicio).length;
    return [{ rotulo: 'Hoje', total }];
  }

  if (periodo === 'semana') {
    const inicio = inicioDaSemanaAtual();
    const diaMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(inicio);
      d.setDate(d.getDate() + i);
      diaMap.set(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 0);
    }
    linhas.forEach((r) => {
      const chave = new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (diaMap.has(chave)) diaMap.set(chave, (diaMap.get(chave) ?? 0) + 1);
    });
    return Array.from(diaMap.entries()).map(([rotulo, total]) => ({ rotulo, total }));
  }

  // mes: todos os dias do mês atual, do dia 1 até o último.
  const inicio = inicioDoMesAtual();
  const totalDias = diasNoMesAtual();
  const diaMap = new Map<string, number>();
  for (let i = 0; i < totalDias; i++) {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    diaMap.set(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 0);
  }
  linhas.forEach((r) => {
    const chave = new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (diaMap.has(chave)) diaMap.set(chave, (diaMap.get(chave) ?? 0) + 1);
  });
  return Array.from(diaMap.entries()).map(([rotulo, total]) => ({ rotulo, total }));
}

export function useAnalytics(periodo: PeriodoAnalytics = 'hoje') {
  const [linhas, setLinhas] = useState<{ created_at: string; dispositivo: string; origem: string }[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recarregando, setRecarregando] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function carregar() {
      if (versao > 0) setRecarregando(true);
      const [{ count }, { data }] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('created_at, dispositivo, origem'),
      ]);

      if (!mounted) return;
      setTotal(count ?? 0);
      setLinhas(data ?? []);
      setLoading(false);
      setRecarregando(false);
    }

    carregar();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versao]);

  const atualizar = () => setVersao((v) => v + 1);

  const dados = useMemo<AnalyticsResumo | null>(() => {
    if (!linhas) return null;

    const hojeInicio = inicioDoDiaAtual();
    const semanaInicio = inicioDaSemanaAtual();
    const mesInicio = inicioDoMesAtual();
    const inicioSelecionado = inicioDoPeriodo(periodo);

    let hoje = 0;
    let semana = 0;
    let mes = 0;
    const dispositivoMap: Record<string, number> = {};
    const origemMap: Record<string, number> = {};

    linhas.forEach((r) => {
      const data = new Date(r.created_at);
      if (data >= hojeInicio) hoje++;
      if (data >= semanaInicio) semana++;
      if (data >= mesInicio) mes++;

      if (data < inicioSelecionado) return;

      const nomeDisp = NOMES_DISPOSITIVO[r.dispositivo] ?? r.dispositivo;
      dispositivoMap[nomeDisp] = (dispositivoMap[nomeDisp] ?? 0) + 1;
      origemMap[r.origem] = (origemMap[r.origem] ?? 0) + 1;
    });

    return {
      hoje,
      semana,
      mes,
      total,
      porDispositivo: Object.entries(dispositivoMap)
        .map(([dispositivo, total]) => ({ dispositivo, total }))
        .sort((a, b) => b.total - a.total),
      porOrigem: Object.entries(origemMap)
        .map(([origem, total]) => ({ origem, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6),
      serie: montarSerie(periodo, linhas),
    };
  }, [linhas, total, periodo]);

  return { dados, loading, recarregando, atualizar };
}
