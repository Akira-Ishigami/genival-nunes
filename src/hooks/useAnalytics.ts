import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export type PeriodoAnalytics = 'hoje' | 'semana' | 'mes' | 'total';

export interface AnalyticsResumo {
  hoje: number;
  semana: number;
  mes: number;
  total: number;
  porDispositivo: { dispositivo: string; total: number }[];
  porOrigem: { origem: string; total: number }[];
  serie: { rotulo: string; total: number }[];
  serieGranularidade: 'hora' | 'dia' | 'mes';
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

function inicioDoPeriodo(periodo: PeriodoAnalytics): Date | null {
  if (periodo === 'hoje') return inicioDoDiaAtual();
  if (periodo === 'semana') return inicioDaSemanaAtual();
  if (periodo === 'mes') return inicioDoMesAtual();
  return null; // total: sem limite
}

function diasEntre(inicio: Date, fim: Date) {
  return Math.floor((fim.getTime() - inicio.getTime()) / 86400000);
}

// Monta a série do gráfico de acordo com o período escolhido: por hora (hoje),
// por dia (semana/mês atuais) ou por dia/mês (total, dependendo do histórico).
function montarSerie(
  periodo: PeriodoAnalytics,
  linhas: { created_at: string }[],
): { serie: { rotulo: string; total: number }[]; serieGranularidade: 'hora' | 'dia' | 'mes' } {
  if (periodo === 'hoje') {
    const horaMap = new Map<number, number>();
    for (let h = 0; h <= new Date().getHours(); h++) horaMap.set(h, 0);
    linhas.forEach((r) => {
      const d = new Date(r.created_at);
      if (horaMap.has(d.getHours())) horaMap.set(d.getHours(), (horaMap.get(d.getHours()) ?? 0) + 1);
    });
    return {
      serie: Array.from(horaMap.entries()).map(([h, total]) => ({ rotulo: `${String(h).padStart(2, '0')}h`, total })),
      serieGranularidade: 'hora',
    };
  }

  if (periodo === 'semana' || periodo === 'mes') {
    const inicio = periodo === 'semana' ? inicioDaSemanaAtual() : inicioDoMesAtual();
    const dias = diasEntre(inicio, inicioDoDiaAtual());
    const diaMap = new Map<string, number>();
    for (let i = 0; i <= dias; i++) {
      const d = new Date(inicio);
      d.setDate(d.getDate() + i);
      diaMap.set(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 0);
    }
    linhas.forEach((r) => {
      const chave = new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (diaMap.has(chave)) diaMap.set(chave, (diaMap.get(chave) ?? 0) + 1);
    });
    return {
      serie: Array.from(diaMap.entries()).map(([rotulo, total]) => ({ rotulo, total })),
      serieGranularidade: 'dia',
    };
  }

  // total: se o histórico é curto, agrupa por dia; se é longo, agrupa por mês.
  if (linhas.length === 0) return { serie: [], serieGranularidade: 'dia' };
  const datas = linhas.map((r) => new Date(r.created_at).getTime());
  const primeira = new Date(Math.min(...datas));
  const diasDeHistorico = diasEntre(primeira, new Date());

  if (diasDeHistorico <= 60) {
    const diaMap = new Map<string, number>();
    for (let i = diasDeHistorico; i >= 0; i--) {
      const d = inicioDoDiaAtual();
      d.setDate(d.getDate() - i);
      diaMap.set(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 0);
    }
    linhas.forEach((r) => {
      const chave = new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (diaMap.has(chave)) diaMap.set(chave, (diaMap.get(chave) ?? 0) + 1);
    });
    return {
      serie: Array.from(diaMap.entries()).map(([rotulo, total]) => ({ rotulo, total })),
      serieGranularidade: 'dia',
    };
  }

  const mesMap = new Map<string, number>();
  const cursor = new Date(primeira.getFullYear(), primeira.getMonth(), 1);
  const fim = new Date();
  while (cursor <= fim) {
    mesMap.set(cursor.toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }), 0);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  linhas.forEach((r) => {
    const chave = new Date(r.created_at).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' });
    if (mesMap.has(chave)) mesMap.set(chave, (mesMap.get(chave) ?? 0) + 1);
  });
  return {
    serie: Array.from(mesMap.entries()).map(([rotulo, total]) => ({ rotulo, total })),
    serieGranularidade: 'mes',
  };
}

export function useAnalytics(periodo: PeriodoAnalytics = 'total') {
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

      if (inicioSelecionado && data < inicioSelecionado) return;

      const nomeDisp = NOMES_DISPOSITIVO[r.dispositivo] ?? r.dispositivo;
      dispositivoMap[nomeDisp] = (dispositivoMap[nomeDisp] ?? 0) + 1;
      origemMap[r.origem] = (origemMap[r.origem] ?? 0) + 1;
    });

    const { serie, serieGranularidade } = montarSerie(periodo, linhas);

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
      serie,
      serieGranularidade,
    };
  }, [linhas, total, periodo]);

  return { dados, loading, recarregando, atualizar };
}
