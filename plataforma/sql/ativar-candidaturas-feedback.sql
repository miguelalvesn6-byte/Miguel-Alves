-- CF Training — ativa as candidaturas do site e o feedback/comentários (junta 04 + 05).
-- Colar tudo no SQL Editor do Supabase e carregar em Run. Pode correr-se mais do que uma vez.

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

-- =====================================================================
-- CF Training — feedback semanal e comentários nos treinos
-- Correr uma vez no SQL Editor do Supabase (depois do 01-estrutura.sql).
-- Pode voltar a correr-se sem perder dados.
-- =====================================================================

-- ---------- Feedback semanal (treinador → atleta, com resposta do atleta) ----------
create table if not exists public.feedbacks (
  id            uuid primary key default gen_random_uuid(),
  atleta_id     uuid not null references public.perfis (id) on delete cascade,
  semana        date not null,                       -- segunda-feira da semana
  texto         text not null check (length(texto) between 1 and 5000),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  lido_em       timestamptz,
  resposta      text not null default '' check (length(resposta) <= 2000),
  resposta_em   timestamptz,
  unique (atleta_id, semana)
);
create index if not exists feedbacks_atleta on public.feedbacks (atleta_id, semana desc);

-- O atleta marca como lido e responde (não altera o texto do treinador).
create or replace function public.marcar_feedback_lido(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.feedbacks set lido_em = coalesce(lido_em, now())
   where id = p_id and atleta_id = auth.uid() and public.e_aprovado();
end;
$$;

create or replace function public.responder_feedback(p_id uuid, p_resposta text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if length(coalesce(p_resposta, '')) > 2000 then
    raise exception 'A resposta é demasiado longa (máximo 2000 caracteres).';
  end if;
  update public.feedbacks
     set resposta = coalesce(p_resposta, ''), resposta_em = now(), lido_em = coalesce(lido_em, now())
   where id = p_id and atleta_id = auth.uid() and public.e_aprovado();
  if not found then raise exception 'Feedback não encontrado'; end if;
end;
$$;

alter table public.feedbacks enable row level security;
drop policy if exists feedbacks_ler   on public.feedbacks;
drop policy if exists feedbacks_gerir on public.feedbacks;
create policy feedbacks_ler   on public.feedbacks for select to authenticated
  using ((atleta_id = auth.uid() and public.e_aprovado()) or public.e_treinador());
create policy feedbacks_gerir on public.feedbacks for all to authenticated
  using (public.e_treinador()) with check (public.e_treinador());

revoke execute on function public.marcar_feedback_lido(uuid) from public, anon;
revoke execute on function public.responder_feedback(uuid, text) from public, anon;
grant execute on function public.marcar_feedback_lido(uuid) to authenticated;
grant execute on function public.responder_feedback(uuid, text) to authenticated;

-- ---------- Comentários num treino (atleta e treinador) ----------
create table if not exists public.comentarios (
  id        uuid primary key default gen_random_uuid(),
  treino_id uuid not null references public.treinos (id) on delete cascade,
  autor_id  uuid not null references public.perfis (id) on delete cascade,
  texto     text not null check (length(texto) between 1 and 2000),
  criado_em timestamptz not null default now()
);
create index if not exists comentarios_treino on public.comentarios (treino_id, criado_em);

-- O treino é deste atleta (e o atleta está aprovado)?
create or replace function public.treino_do_atleta(p_treino uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.treinos t where t.id = p_treino and t.atleta_id = auth.uid()) and public.e_aprovado();
$$;

alter table public.comentarios enable row level security;
drop policy if exists comentarios_ler     on public.comentarios;
drop policy if exists comentarios_escrever on public.comentarios;
drop policy if exists comentarios_apagar  on public.comentarios;
create policy comentarios_ler on public.comentarios for select to authenticated
  using (public.e_treinador() or public.treino_do_atleta(treino_id));
create policy comentarios_escrever on public.comentarios for insert to authenticated
  with check (autor_id = auth.uid() and (public.e_treinador() or public.treino_do_atleta(treino_id)));
create policy comentarios_apagar on public.comentarios for delete to authenticated
  using (autor_id = auth.uid() or public.e_treinador());

revoke insert, update, delete on public.feedbacks, public.comentarios from anon;
