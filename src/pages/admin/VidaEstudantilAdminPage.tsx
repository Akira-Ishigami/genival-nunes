import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ResourceAdminPage, { type FieldConfig } from '../../components/admin/ResourceAdminPage';

const SLUG = 'alunos';

const fields: FieldConfig[] = [
  { key: 'foto_url', label: 'Foto', type: 'image', folder: 'secoes' },
  { key: 'titulo', label: 'Título', type: 'text' },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'ordem', label: 'Posição', type: 'number', half: true, secao: true, hint: 'Número menor aparece primeiro' },
  { key: 'ativo', label: 'Publicado no site', type: 'toggle', half: true },
];

// Não expomos "criar/editar seções" pro admin — é só fotos e textos da Vida Estudantil.
export default function VidaEstudantilAdminPage() {
  const [secaoId, setSecaoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function garantirSecao() {
      const { data } = await supabase.from('secoes').select('id').eq('slug', SLUG).maybeSingle();
      if (data) {
        setSecaoId(data.id);
      } else {
        const { data: nova } = await supabase
          .from('secoes')
          .insert({
            titulo: 'Vida Estudantil',
            slug: SLUG,
            descricao: 'Momentos e projetos protagonizados pelos nossos alunos.',
            template: 'galeria',
            ordem: 1,
          })
          .select('id')
          .single();
        setSecaoId(nova?.id ?? null);
      }
      setCarregando(false);
    }
    garantirSecao();
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
      </div>
    );
  }

  if (!secaoId) {
    return <p className="text-sm text-red-600">Não foi possível carregar a Vida Estudantil. Tente recarregar a página.</p>;
  }

  return (
    <ResourceAdminPage
      title="Vida Estudantil"
      description="Adicione fotos e uma frase curta contando o que os alunos estão fazendo."
      table="secao_itens"
      fields={fields}
      titleKey="titulo"
      subtitleKey="descricao"
      imageKey="foto_url"
      defaultValues={{ titulo: '', descricao: '', foto_url: null, ativo: true }}
      extraFilter={{ secao_id: secaoId }}
      addOnly
    />
  );
}
