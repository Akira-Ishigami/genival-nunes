import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Secao } from '../types';

export function useSecoes() {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from('secoes')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .then(({ data }) => {
        if (mounted) {
          setSecoes(data ?? []);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { secoes, loading };
}
