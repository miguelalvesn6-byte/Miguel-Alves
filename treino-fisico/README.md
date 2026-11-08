# Treino Físico — Triatlo e Corrida

Biblioteca de sessões e exercícios de força, pliometria, técnica de corrida, core, mobilidade e prevenção para triatletas e corredores.
Complementa o TrainingPeaks: no treino do TrainingPeaks pões o link da sessão (ou do exercício) e o atleta abre-o no telemóvel.

## O que tem

- **Sessões** prontas (Força base, Força em casa, Core, Ombro do nadador, Pernas à prova de corrida, Mobilidade, Manutenção competitiva), com duração, fase, frequência, RPE alvo e ordem dos exercícios.
- **Exercícios** com execução passo a passo, erros comuns, versão mais fácil/mais difícil e link para vídeo. Filtros por categoria, disciplina e material.
- **Escala RPE (CR-10)** para os atletas registarem o esforço no TrainingPeaks de forma consistente.
- Cada sessão e exercício tem link próprio (botão "Copiar link"), por exemplo `.../treino-fisico/#s-forca-base` ou `.../treino-fisico/#ex-nordic`.

## Planeamento da época (`planeamento.js`)

Dois planos separados, cada um com 6 fases × 3 níveis (básico, avançado, elite) × 2 sessões por semana (≤60 min, 5 blocos: Mobilidade → Técnica de corrida → Pliometria → Força inferior → Força superior e core):

- **Triatlo** (`PLANEAMENTO.modalidades.triatlo`, também em `PLANEAMENTO.fases`): pliometria moderada, ombro/natação no seco, core para a posição aero, quadríceps e extensão da anca para o ciclismo.
- **Corrida** (`PLANEAMENTO.modalidades.corrida`, ids `cor-…`): mais pliometria e progressão técnica (dribles → wickets), gémeos–sóleo–Aquiles, isquiotibiais, flexores da anca e força unilateral; menos membros superiores.

Fases: Preparatória geral → Preparatória específica (força máxima) → Pré-competitiva (potência) → Competitiva (manutenção) → Afinação (taper para prova A) → Transição. Blocos curtos e repetíveis: Preparatória geral 4 sem. (3+1), Preparatória específica 4 sem. (3+1), Pré-competitiva 3 sem., Competitiva em blocos de 2–4 sem. entre provas, Afinação 1–2 sem., Transição 1–3 sem. (`semanasNum` = semanas pré-preenchidas na app). `PLANEAMENTO.guia` explica como encadeá-las e repeti-las com provas A/B/C. Os contactos de pliometria de cada sessão são calculados automaticamente e escritos na nota (alvo por fase e nível em `fase.contactos`).

## Editar conteúdo

Exercícios em `dados.js`, `exercicios-extra.js` e `tecnica-pliometria.js`; sessões curtas e de casa em `exercicios-extra.js`, `tecnica-pliometria.js` e `sessoes-completas.js`. **Nunca mudes nem apagues o `id` de um exercício** (os treinos guardados usam-no); para descontinuar, deixa-o e marca com um comentário.

- Para acrescentar um exercício, copia um bloco de `EXERCICIOS` e muda os campos. O campo `video` aceita um link teu (YouTube, Google Drive...); se ficar vazio, aparece um botão de pesquisa no YouTube.
- Para criar uma sessão, copia um bloco de `SESSOES` e lista os exercícios pelo `id`.

## Publicar

Com o GitHub Pages ligado ao repositório, o site fica em `https://<utilizador>.github.io/<repositório>/treino-fisico/`.
