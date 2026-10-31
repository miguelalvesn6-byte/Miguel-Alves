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
