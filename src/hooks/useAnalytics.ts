import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

export function useAnalytics() {
  const [dados, setDados] = useState<AnalyticsResumo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function carregar() {
      const desde30 = inicioDoDia(29).toISOString();

      const [{ count: total }, { data: ultimos30 }] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('created_at, dispositivo, origem').gte('created_at', desde30),
      ]);

      if (!mounted) return;

      const rows = ultimos30 ?? [];
      const hojeInicio = inicioDoDia(0);
      const semanaInicio = inicioDoDia(6);

      let hoje = 0;
      let semana = 0;
      const dispositivoMap: Record<string, number> = {};
      const origemMap: Record<string, number> = {};
      const diaMap: Record<string, number> = {};

      for (let i = 13; i >= 0; i--) {
        const d = inicioDoDia(i);
        const chave = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        diaMap[chave] = 0;
      }

      rows.forEach((r) => {
        const data = new Date(r.created_at);
        if (data >= hojeInicio) hoje++;
        if (data >= semanaInicio) semana++;

        const nomeDisp = NOMES_DISPOSITIVO[r.dispositivo] ?? r.dispositivo;
        dispositivoMap[nomeDisp] = (dispositivoMap[nomeDisp] ?? 0) + 1;

        origemMap[r.origem] = (origemMap[r.origem] ?? 0) + 1;

        const chaveDia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        if (chaveDia in diaMap) diaMap[chaveDia]++;
      });

      setDados({
        hoje,
        semana,
        mes: rows.length,
        total: total ?? 0,
        porDispositivo: Object.entries(dispositivoMap)
          .map(([dispositivo, total]) => ({ dispositivo, total }))
          .sort((a, b) => b.total - a.total),
        porOrigem: Object.entries(origemMap)
          .map(([origem, total]) => ({ origem, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 6),
        porDia: Object.entries(diaMap).map(([dia, total]) => ({ dia, total })),
      });
      setLoading(false);
    }

    carregar();
    return () => {
      mounted = false;
    };
  }, []);

  return { dados, loading };
}
