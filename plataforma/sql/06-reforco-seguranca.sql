-- =====================================================================
-- CF Training — reforço de segurança (recomendações da auditoria)
-- Opcional. Correr no SQL Editor do Supabase depois dos anteriores.
-- Pode voltar a correr-se sem perder dados.
-- =====================================================================

-- Candidaturas: o visitante não escolhe a data de criação (impede datas falsas)
-- e não tem nenhuma outra permissão além de inserir.
drop policy if exists candidaturas_enviar on public.candidaturas;
create policy candidaturas_enviar on public.candidaturas for insert to anon, authenticated
  with check (estado = 'nova' and criado_em between now() - interval '1 minute' and now() + interval '1 minute');
revoke select, update, delete, truncate on public.candidaturas from anon;

-- Perfil: o atleta não altera a data de criação e o nome tem limite de tamanho.
create or replace function public.proteger_perfil()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is not null and not public.e_treinador() then
    new.papel := old.papel;
    new.aprovado := old.aprovado;
    new.email := old.email;
    new.criado_em := old.criado_em;
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'perfis_nome_tamanho') then
    alter table public.perfis add constraint perfis_nome_tamanho check (length(nome) <= 120) not valid;
  end if;
end;
$$;

-- Ninguém sem sessão pode esvaziar tabelas (TRUNCATE não está exposto pela API, mas fica fechado).
revoke truncate on all tables in schema public from anon;
