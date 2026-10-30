-- =====================================================================
-- Plataforma de treino — estrutura da base de dados (Supabase)
-- Correr uma vez no SQL Editor do Supabase (colar tudo e carregar em Run).
-- Pode voltar a correr-se sem perder dados.
-- =====================================================================

-- ---------- Perfis (um por utilizador com login) ----------
create table if not exists public.perfis (
  id         uuid primary key references auth.users (id) on delete cascade,
  nome       text not null default '',
  email      text not null default '',
  papel      text not null default 'atleta' check (papel in ('atleta', 'treinador')),
  aprovado   boolean not null default false,
  criado_em  timestamptz not null default now()
);

-- Cria o perfil automaticamente quando alguém se regista no site.
create or replace function public.novo_utilizador()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''), coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ao_criar_utilizador on auth.users;
create trigger ao_criar_utilizador
  after insert on auth.users
  for each row execute function public.novo_utilizador();

-- Funções auxiliares para as permissões (security definer evita recursão nas políticas).
create or replace function public.e_treinador()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.perfis where id = auth.uid() and papel = 'treinador');
$$;

create or replace function public.e_aprovado()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.perfis where id = auth.uid() and (aprovado or papel = 'treinador'));
$$;

-- Impede um atleta de se promover a treinador ou de se aprovar a si próprio.
-- (No SQL Editor não há utilizador com sessão, por isso aí as alterações passam.)
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
  end if;
  return new;
end;
$$;

drop trigger if exists ao_editar_perfil on public.perfis;
create trigger ao_editar_perfil
  before update on public.perfis
  for each row execute function public.proteger_perfil();

-- ---------- Biblioteca: exercícios ----------
create table if not exists public.exercicios (
  id          text primary key,
  nome        text not null,
  nome_en     text not null default '',
  categoria   text not null check (categoria in ('forca', 'core', 'mobilidade', 'prevencao', 'ativacao', 'pliometria', 'tecnica')),
  material    text[] not null default '{}',
  disciplinas text[] not null default '{}',
  musculos    text not null default '',
  execucao    text[] not null default '{}',
  erros       text[] not null default '{}',
  regressao   text not null default '',
  progressao  text not null default '',
  dose        text not null default '',
  video       text not null default ''
);

-- ---------- Biblioteca: sessões-modelo ----------
-- blocos = [{ "titulo": "Principal", "itens": [{ "ex": "id-do-exercicio", "dose": "3 × 8", "descanso": "90 s" }] }]
create table if not exists public.sessoes (
  id         text primary key,
  nome       text not null,
  fase       text not null default '',
  local      text not null default '',
  duracao    integer not null default 0,
  frequencia text not null default '',
  rpe        text not null default '',
  objetivo   text not null default '',
  nota       text not null default '',
  blocos     jsonb not null default '[]'::jsonb
);

-- ---------- Treinos atribuídos a cada atleta ----------
create table if not exists public.treinos (
  id                uuid primary key default gen_random_uuid(),
  atleta_id         uuid not null references public.perfis (id) on delete cascade,
  data              date not null,
  sessao_id         text references public.sessoes (id) on delete set null,
  titulo            text not null,
  duracao_prevista  integer not null default 0,
  rpe_alvo          text not null default '',
  notas_treinador   text not null default '',
  blocos            jsonb not null default '[]'::jsonb,
  estado            text not null default 'planeado' check (estado in ('planeado', 'feito', 'nao_feito')),
  rpe               integer check (rpe between 0 and 10),
  duracao_real      integer check (duracao_real between 0 and 600),
  comentario_atleta text not null default '',
  registado_em      timestamptz,
  criado_em         timestamptz not null default now()
);
create index if not exists treinos_atleta_data on public.treinos (atleta_id, data);

-- O atleta só regista o resultado do seu treino (não altera o plano).
create or replace function public.registar_treino(
  p_id uuid, p_estado text, p_rpe integer, p_duracao integer, p_comentario text
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if p_estado is null or p_estado not in ('planeado', 'feito', 'nao_feito') then
    raise exception 'Estado inválido';
  end if;
  if p_estado = 'feito' and (p_rpe is null or p_rpe not between 0 and 10) then
    raise exception 'Indica o RPE (0 a 10).';
  end if;
  if p_estado = 'feito' and (p_duracao is null or p_duracao not between 1 and 600) then
    raise exception 'Indica os minutos (1 a 600).';
  end if;
  if length(coalesce(p_comentario, '')) > 2000 then
    raise exception 'O comentário é demasiado longo (máximo 2000 caracteres).';
  end if;
  if p_estado <> 'planeado' and exists (select 1 from public.treinos where id = p_id and data > current_date + 1) then
    raise exception 'Ainda não podes registar um treino futuro.';
  end if;
  update public.treinos
     set estado = p_estado,
         rpe = case when p_estado = 'feito' then p_rpe else null end,
         duracao_real = case when p_estado = 'feito' then p_duracao else null end,
         comentario_atleta = coalesce(p_comentario, ''),
         registado_em = case when p_estado = 'planeado' then null else now() end
   where id = p_id
     and atleta_id = auth.uid()
     and public.e_aprovado();
  if not found then
    raise exception 'Treino não encontrado';
  end if;
end;
$$;

-- ---------- Permissões (Row Level Security) ----------
alter table public.perfis     enable row level security;
alter table public.exercicios enable row level security;
alter table public.sessoes    enable row level security;
alter table public.treinos    enable row level security;

drop policy if exists perfis_ler     on public.perfis;
drop policy if exists perfis_editar  on public.perfis;
drop policy if exists perfis_apagar  on public.perfis;
create policy perfis_ler    on public.perfis for select to authenticated using (id = auth.uid() or public.e_treinador());
create policy perfis_editar on public.perfis for update to authenticated using (id = auth.uid() or public.e_treinador());
create policy perfis_apagar on public.perfis for delete to authenticated using (public.e_treinador());

drop policy if exists exercicios_ler    on public.exercicios;
drop policy if exists exercicios_gerir  on public.exercicios;
create policy exercicios_ler   on public.exercicios for select to authenticated using (public.e_aprovado());
create policy exercicios_gerir on public.exercicios for all    to authenticated using (public.e_treinador()) with check (public.e_treinador());

drop policy if exists sessoes_ler    on public.sessoes;
drop policy if exists sessoes_gerir  on public.sessoes;
create policy sessoes_ler   on public.sessoes for select to authenticated using (public.e_aprovado());
create policy sessoes_gerir on public.sessoes for all    to authenticated using (public.e_treinador()) with check (public.e_treinador());

drop policy if exists treinos_ler    on public.treinos;
drop policy if exists treinos_gerir  on public.treinos;
create policy treinos_ler   on public.treinos for select to authenticated using ((atleta_id = auth.uid() and public.e_aprovado()) or public.e_treinador());
create policy treinos_gerir on public.treinos for all    to authenticated using (public.e_treinador()) with check (public.e_treinador());

revoke execute on function public.registar_treino(uuid, text, integer, integer, text) from public, anon;
grant  execute on function public.registar_treino(uuid, text, integer, integer, text) to authenticated;

-- O utilizador sem sessão (anon) não escreve em nenhuma tabela (camada extra além do RLS).
revoke insert, update, delete on public.perfis, public.exercicios, public.sessoes, public.treinos from anon;
