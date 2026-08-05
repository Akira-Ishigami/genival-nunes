import ResourceAdminPage, { type FieldConfig } from '../../components/admin/ResourceAdminPage';

const fields: FieldConfig[] = [
  { key: 'foto_url', label: 'Foto', type: 'image', folder: 'posts' },
  { key: 'titulo', label: 'Título do aviso/post', type: 'text', required: true },
  { key: 'conteudo', label: 'Conteúdo', type: 'textarea' },
  { key: 'data_inicio', label: 'Exibir a partir de', type: 'date', required: true, half: true, secao: true },
  { key: 'data_fim', label: 'Exibir até (opcional)', type: 'date', half: true },
  { key: 'fixado', label: 'Destacar no topo', type: 'toggle', half: true },
  { key: 'ativo', label: 'Publicado no site', type: 'toggle', half: true },
];

const hoje = new Date().toISOString().slice(0, 10);

export default function PostsAdminPage() {
  return (
    <ResourceAdminPage
      title="Avisos e Posts"
      description='Ex: "Feira do dia 10/08 até 12/08" — o post some sozinho do site após a data final.'
      table="posts"
      fields={fields}
      titleKey="titulo"
      subtitleKey="conteudo"
      imageKey="foto_url"
      orderKey="data_inicio"
      defaultValues={{
        titulo: '', conteudo: '', foto_url: null, data_inicio: hoje, data_fim: null, fixado: false, ativo: true,
      }}
    />
  );
}
