import ResourceAdminPage, { type FieldConfig } from '../../components/admin/ResourceAdminPage';

const fields: FieldConfig[] = [
  { key: 'foto_url', label: 'Foto', type: 'image', folder: 'professores' },
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  {
    key: 'categoria',
    label: 'Grupo',
    type: 'select',
    hint: 'Gestão: diretor, vice, secretário, orientador ou coordenador',
    options: [
      { value: 'gestao', label: 'Gestão' },
      { value: 'professor', label: 'Docentes' },
      { value: 'tecnica', label: 'Equipe Técnica' },
    ],
  },
  { key: 'cargo', label: 'Cargo', type: 'text', hint: 'Ex: Diretor, Professor de Matemática' },
  {
    key: 'disciplina',
    label: 'Disciplina',
    type: 'text',
    // Disciplina só faz sentido pra quem dá aula — some pra Gestão e Equipe Técnica.
    showIf: (v) => v.categoria === 'professor',
  },
  { key: 'bio', label: 'Sobre a pessoa', type: 'textarea' },
  { key: 'ordem', label: 'Posição', type: 'number', half: true, secao: true, hint: 'Número menor aparece primeiro' },
  { key: 'ativo', label: 'Publicado no site', type: 'toggle', half: true },
];

export default function ProfessoresAdminPage() {
  return (
    <ResourceAdminPage
      title="Equipe"
      description="Cadastre a foto e a descrição de cada pessoa da gestão, dos professores e da equipe técnica."
      table="professores"
      fields={fields}
      titleKey="nome"
      subtitleKey="cargo"
      imageKey="foto_url"
      defaultValues={{ nome: '', categoria: 'professor', cargo: '', disciplina: '', bio: '', foto_url: null, ativo: true }}
      filtro={{
        chave: 'categoria',
        opcoes: [
          { value: 'gestao', label: 'Gestão' },
          { value: 'professor', label: 'Docentes' },
          { value: 'tecnica', label: 'Equipe Técnica' },
        ],
      }}
      ordenarAlfabetico
    />
  );
}
