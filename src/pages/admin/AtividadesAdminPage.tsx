import ResourceAdminPage, { type FieldConfig } from '../../components/admin/ResourceAdminPage';

const fields: FieldConfig[] = [
  { key: 'foto_url', label: 'Foto', type: 'image', folder: 'atividades' },
  { key: 'titulo', label: 'Título', type: 'text', required: true },
  {
    key: 'categoria',
    label: 'Categoria',
    type: 'select',
    options: [
      { value: 'esportiva', label: 'Esportiva' },
      { value: 'cultural', label: 'Cultural' },
      { value: 'extracurricular', label: 'Extracurricular' },
      { value: 'geral', label: 'Geral' },
    ],
  },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'ordem', label: 'Posição', type: 'number', half: true, secao: true, hint: 'Número menor aparece primeiro' },
  { key: 'ativo', label: 'Publicado no site', type: 'toggle', half: true },
];

export default function AtividadesAdminPage() {
  return (
    <ResourceAdminPage
      title="Atividades"
      description="Atividades esportivas, culturais e extracurriculares da escola."
      table="atividades"
      fields={fields}
      titleKey="titulo"
      subtitleKey="categoria"
      imageKey="foto_url"
      defaultValues={{ titulo: '', categoria: 'geral', descricao: '', foto_url: null, ativo: true }}
      addOnly
    />
  );
}
