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
  porDia: { dia: string; total: number }[]; // últimos 14 dias, formato dd/mm
}

const NOMES_DISPOSITIVO: Record<string, string> = {
  mobile: 'Celular',
  tablet: 'Tablet',
  desktop: 'Computador',
};

function inicioDoDia(diasAtras: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diasAtras);
  return d;
}

function inicioDoPeriodo(periodo: PeriodoAnalytics): Date | null {
  if (periodo === 'hoje') return inicioDoDia(0);
  if (periodo === 'semana') return inicioDoDia(6);
  if (periodo === 'mes') return inicioDoDia(29);
  return null; // total: sem limite
}

export function useAnalytics(periodo: PeriodoAnalytics = 'total') {
  const [linhas, setLinhas] = useState<{ created_at: string; dispositivo: string; origem: string }[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function carregar() {
      const [{ count }, { data }] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('created_at, dispositivo, origem'),
      ]);

      if (!mounted) return;
      setTotal(count ?? 0);
      setLinhas(data ?? []);
      setLoading(false);
    }

    carregar();
    return () => {
      mounted = false;
    };
  }, []);

  const dados = useMemo<AnalyticsResumo | null>(() => {
    if (!linhas) return null;

    const hojeInicio = inicioDoDia(0);
    const semanaInicio = inicioDoDia(6);
    const mesInicio = inicioDoDia(29);
    const inicioSelecionado = inicioDoPeriodo(periodo);

    let hoje = 0;
    let semana = 0;
    let mes = 0;
    const dispositivoMap: Record<string, number> = {};
    const origemMap: Record<string, number> = {};
    const diaMap: Record<string, number> = {};

    for (let i = 13; i >= 0; i--) {
      const d = inicioDoDia(i);
      const chave = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      diaMap[chave] = 0;
    }

    linhas.forEach((r) => {
      const data = new Date(r.created_at);
      if (data >= hojeInicio) hoje++;
      if (data >= semanaInicio) semana++;
      if (data >= mesInicio) mes++;

      const chaveDia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (chaveDia in diaMap) diaMap[chaveDia]++;

      if (inicioSelecionado && data < inicioSelecionado) return;

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
      porDia: Object.entries(diaMap).map(([dia, total]) => ({ dia, total })),
    };
  }, [linhas, total, periodo]);

  return { dados, loading };
}
