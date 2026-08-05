import ResourceAdminPage, { type FieldConfig } from '../../components/admin/ResourceAdminPage';

const fields: FieldConfig[] = [
  { key: 'foto_url', label: 'Foto', type: 'image', folder: 'estrutura' },
  { key: 'titulo', label: 'Título', type: 'text', required: true, hint: 'Ex: Piscina, Biblioteca' },
  { key: 'categoria', label: 'Categoria', type: 'text', hint: 'Opcional' },
  { key: 'descricao', label: 'Descrição do local', type: 'textarea' },
  { key: 'ordem', label: 'Posição', type: 'number', half: true, secao: true, hint: 'Número menor aparece primeiro' },
  { key: 'ativo', label: 'Publicado no site', type: 'toggle', half: true },
];

export default function GaleriaAdminPage() {
  return (
    <ResourceAdminPage
      title="Estrutura / Galeria"
      description="Fotos e descrições dos espaços e instalações da escola."
      table="galeria_fotos"
      fields={fields}
      titleKey="titulo"
      subtitleKey="categoria"
      imageKey="foto_url"
      defaultValues={{ titulo: '', categoria: '', descricao: '', foto_url: null, ativo: true }}
      addOnly
    />
  );
}
