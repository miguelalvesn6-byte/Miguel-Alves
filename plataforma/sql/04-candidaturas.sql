-- =====================================================================
-- CF Training — candidaturas recebidas pelo site da marca
-- Correr uma vez no SQL Editor do Supabase (depois do 01-estrutura.sql).
-- Qualquer visitante pode ENVIAR uma candidatura; só o treinador as LÊ.
-- =====================================================================

create table if not exists public.candidaturas (
  id          uuid primary key default gen_random_uuid(),
  criado_em   timestamptz not null default now(),
  nome        text not null check (length(nome) between 2 and 120),
  email       text not null check (length(email) between 5 and 200 and email like '%@%'),
  telefone    text not null default '' check (length(telefone) <= 30),
  modalidade  text not null check (modalidade in ('triatlo', 'corrida')),
  nivel       text not null default '' check (length(nivel) <= 60),
  objetivo    text not null default '' check (length(objetivo) <= 300),
  plano       text not null default '' check (length(plano) <= 60),
  horas       text not null default '' check (length(horas) <= 30),
  mensagem    text not null default '' check (length(mensagem) <= 2000),
  consentimento boolean not null check (consentimento),
  estado      text not null default 'nova' check (estado in ('nova', 'contactado', 'cliente', 'arquivada'))
);
create index if not exists candidaturas_data on public.candidaturas (criado_em desc);

alter table public.candidaturas enable row level security;

drop policy if exists candidaturas_enviar on public.candidaturas;
drop policy if exists candidaturas_ler   on public.candidaturas;
drop policy if exists candidaturas_gerir on public.candidaturas;
drop policy if exists candidaturas_apagar on public.candidaturas;

-- Visitantes (anon) e utilizadores com sessão podem inserir, sempre com estado 'nova'.
create policy candidaturas_enviar on public.candidaturas for insert to anon, authenticated
  with check (estado = 'nova');
-- Só o treinador lê, atualiza o estado e apaga.
create policy candidaturas_ler    on public.candidaturas for select to authenticated using (public.e_treinador());
create policy candidaturas_gerir  on public.candidaturas for update to authenticated using (public.e_treinador()) with check (public.e_treinador());
create policy candidaturas_apagar on public.candidaturas for delete to authenticated using (public.e_treinador());

grant insert on public.candidaturas to anon;
grant select, insert, update, delete on public.candidaturas to authenticated;
