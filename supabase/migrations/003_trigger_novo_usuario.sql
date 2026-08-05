-- Cria automaticamente um profile (role admin) para todo novo usuário do Supabase Auth.
-- Fluxo: o admin é criado manualmente em Authentication > Users no painel do Supabase;
-- este trigger garante que ele ganhe acesso ao painel /admin assim que a conta existir.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, nome, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', 'Admin'), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
