# Plataforma de treino (com login)

Site onde cada atleta entra com a sua conta e vê os treinos que o treinador lhe atribuiu.

- **Treinador:** aprova atletas, atribui treinos por data (a partir das sessões-modelo ou em branco, com doses e notas por atleta), vê o RPE, os minutos e os comentários de cada treino, e a carga semanal (RPE × minutos) das últimas 8 semanas.
- **Atleta:** vê o treino de hoje, os próximos e o histórico. Regista se fez o treino, o RPE (0–10), os minutos e um comentário.
- **Biblioteca:** sessões-modelo e exercícios com execução, erros comuns e vídeo.

Tecnologia: site estático (HTML/CSS/JS) + [Supabase](https://supabase.com) para login e base de dados.
Cada atleta só consegue ler os seus próprios treinos; isso é garantido na base de dados (Row Level Security), não só no site.

## Configuração (uma vez)

1. **Base de dados** — no Supabase, abre **SQL Editor → New query**, cola o conteúdo de `sql/01-estrutura.sql` e carrega em **Run**. Depois faz o mesmo com `sql/02-biblioteca.sql` (o `sql/03-biblioteca-alargada.sql` é opcional: a plataforma já carrega a biblioteca completa dos ficheiros do site).
2. **Email de confirmação** — em **Authentication → Sign In / Providers → Email**, desliga **Confirm email**. Como és tu que aprovas cada atleta, não é preciso, e o envio de emails grátis do Supabase é muito limitado (poucos por hora).
3. **A tua conta** — abre o site, carrega em "Ainda não tenho conta" e regista-te. Depois, no SQL Editor, corre (com o teu email):
   ```sql
   update public.perfis set papel = 'treinador', aprovado = true where email = 'o-teu-email@exemplo.com';
   ```
   Volta ao site e atualiza a página: já entras como treinador.
4. **Publicar** — no GitHub: **Settings → Pages → Deploy from branch**, escolhe o ramo e a pasta `/ (root)`. O site fica em `https://<utilizador>.github.io/<repositório>/plataforma/`.
5. **Links dos emails** — em **Authentication → URL Configuration** do Supabase, põe esse endereço em **Site URL** e em **Redirect URLs** (é para onde levam os emails de recuperar a palavra-passe).

## Uso

- Envia o link do site aos atletas. Eles criam conta e aparecem em **Atletas → À espera de aprovação**.
- Para atribuir um treino: **+ Atribuir treino**, escolhe os atletas, a data e uma sessão-modelo; ajusta as doses e as notas e guarda.
- **Repetir:** no mesmo formulário escolhe os dias da semana e durante quantas semanas — cria todos os treinos de uma vez.
- **Duplicar:** dentro de um treino, "Duplicar" abre uma cópia para outro dia ou outro atleta.
- **Copiar semana:** na página do atleta, copia todos os treinos desta semana para a semana seguinte.
- **Hoje:** a página Atletas mostra os treinos de hoje de todos os atletas e quantos já registaram.
- **Planeamento por fases:** em Biblioteca escolhe o nível (Básico, Avançado, Elite) e, em cada fase (Preparatória geral, Preparatória específica, Pré-competitiva, Competitiva, Transição), carrega em **Atribuir esta fase**. Escolhes os atletas, a semana de início, os dois dias da semana e o número de semanas, e são criados todos os treinos da fase (com semana de descarga a cada 4.ª semana, opcional).
- A biblioteca (169 exercícios, 29 sessões-modelo, incluindo técnica de corrida e pliometria) vem de `../treino-fisico/dados.js`, `exercicios-extra.js`, `tecnica-pliometria.js` `sessoes-completas.js` e `planeamento.js` (5 fases × 3 níveis × 2 dias = 30 sessões de até 1 h: mobilidade → técnica de corrida → pliometria → força inferior → força superior e core). Se um exercício ou sessão com o mesmo `id` existir nas tabelas `exercicios`/`sessoes` do Supabase, essa versão é a que aparece (por exemplo, para pores o link de um vídeo teu no campo `video`).

## Ficheiros

- `index.html`, `app.js`, `estilos.css` — o site.
- `config.js` — endereço do projeto Supabase e chave pública (anon).
- `sql/01-estrutura.sql` — tabelas, permissões e funções.
- `sql/02-biblioteca.sql` — exercícios e sessões-modelo iniciais (gerado a partir de `../treino-fisico/dados.js`).
- `sql/03-biblioteca-alargada.sql` — biblioteca completa (gerado a partir de `../treino-fisico/dados.js` e `../treino-fisico/exercicios-extra.js`).
