import { useEffect, useState } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { MOCK_SECOES } from '../lib/mockData';
import type { Secao } from '../types';

export function useSecoes() {
  const [secoes, setSecoes] = useState<Secao[]>(isDemoMode() ? MOCK_SECOES : []);
  const [loading, setLoading] = useState(!isDemoMode());

  useEffect(() => {
    if (isDemoMode()) {
      setSecoes(MOCK_SECOES);
      setLoading(false);
      return;
    }
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
