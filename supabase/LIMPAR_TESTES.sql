-- Remove os registros de teste criados ao experimentar o painel admin
-- (título "teste", descrição vazia) e os arquivos órfãos que ficaram no
-- Storage por causa deles. Rode no SQL Editor do Supabase.
-- Não sobe fotos, gente ou atividades reais aqui — isso fica pro admin cadastrar depois.

delete from atividades where titulo = 'teste';
delete from professores where nome = 'teste';
delete from galeria_fotos where titulo = 'teste';
delete from posts where titulo = 'teste';
delete from secao_itens where titulo = 'teste';

-- Fotos órfãs deixadas pelos itens de teste acima (bucket "fotos").
delete from storage.objects
where bucket_id = 'fotos'
  and name in (
    'atividades/89803ea7-164b-4bf3-9f0e-f84c480b3893.webp',
    'professores/e1c0558e-b968-46bb-8589-62e8bcaf076e.jpg',
    'estrutura/9c6f6b6a-8bac-4a68-b60b-522a5d418bc0.webp',
    'posts/1c82966e-b659-4390-af4f-ee961520b77c.jpg',
    'secoes/45682f72-0a92-410a-b0c7-071267426017.webp'
  );
