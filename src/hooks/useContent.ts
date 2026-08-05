import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Professor, Atividade, GaleriaFoto, Post, ConteudoInstitucional, ContatoInfo, SecaoItem,
} from '../types';

function useQuery<T>(run: () => PromiseLike<{ data: T | null }>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    run().then(({ data }) => {
      if (mounted) {
        setData(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading };
}

export function useProfessores() {
  const { data, loading } = useQuery<Professor[]>(() =>
    supabase.from('professores').select('*').eq('ativo', true).order('ordem', { ascending: true }),
  );
  return { professores: data ?? [], loading };
}

export function useAtividades() {
  const { data, loading } = useQuery<Atividade[]>(() =>
    supabase.from('atividades').select('*').eq('ativo', true).order('ordem', { ascending: true }),
  );
  return { atividades: data ?? [], loading };
}

export function useGaleria() {
  const { data, loading } = useQuery<GaleriaFoto[]>(() =>
    supabase.from('galeria_fotos').select('*').eq('ativo', true).order('ordem', { ascending: true }),
  );
  return { fotos: data ?? [], loading };
}

export function usePostsAtivos() {
  const hoje = new Date().toISOString().slice(0, 10);
  const { data, loading } = useQuery<Post[]>(() =>
    supabase
      .from('posts')
      .select('*')
      .eq('ativo', true)
      .lte('data_inicio', hoje)
      .or(`data_fim.is.null,data_fim.gte.${hoje}`)
      .order('fixado', { ascending: false })
      .order('data_inicio', { ascending: false }),
  );
  return { posts: data ?? [], loading };
}

export function useConteudo(chaves: string[]) {
  const { data, loading } = useQuery<ConteudoInstitucional[]>(
    () => supabase.from('conteudo_institucional').select('*').in('chave', chaves),
    [chaves.join(',')],
  );
  const map: Record<string, ConteudoInstitucional> = {};
  (data ?? []).forEach((c) => { map[c.chave] = c; });
  return { conteudo: map, loading };
}

export function useContato() {
  const { data, loading } = useQuery<ContatoInfo>(() =>
    supabase.from('contato_info').select('*').eq('id', 1).single(),
  );
  return { contato: data, loading };
}

export function useSecaoBySlug(slug: string) {
  const [secao, setSecao] = useState<{ id: string; titulo: string; descricao: string | null } | null>(null);
  const [itens, setItens] = useState<SecaoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase
      .from('secoes')
      .select('id, titulo, descricao')
      .eq('slug', slug)
      .eq('ativo', true)
      .single()
      .then(async ({ data: s }) => {
        if (!mounted) return;
        setSecao(s ?? null);
        if (s) {
          const { data: it } = await supabase
            .from('secao_itens')
            .select('*')
            .eq('secao_id', s.id)
            .eq('ativo', true)
            .order('ordem', { ascending: true });
          if (mounted) setItens(it ?? []);
        }
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  return { secao, itens, loading };
}
