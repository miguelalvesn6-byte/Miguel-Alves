# Treino Físico — Triatlo

Biblioteca de sessões e exercícios de força, core, mobilidade e prevenção para os atletas de triatlo.
Complementa o TrainingPeaks: no treino do TrainingPeaks pões o link da sessão (ou do exercício) e o atleta abre-o no telemóvel.

## O que tem

- **Sessões** prontas (Força base, Força em casa, Core, Ombro do nadador, Pernas à prova de corrida, Mobilidade, Manutenção competitiva), com duração, fase, frequência, RPE alvo e ordem dos exercícios.
- **Exercícios** com execução passo a passo, erros comuns, versão mais fácil/mais difícil e link para vídeo. Filtros por categoria, disciplina e material.
- **Escala RPE (CR-10)** para os atletas registarem o esforço no TrainingPeaks de forma consistente.
- Cada sessão e exercício tem link próprio (botão "Copiar link"), por exemplo `.../treino-fisico/#s-forca-base` ou `.../treino-fisico/#ex-nordic`.

## Editar conteúdo

Tudo está em `dados.js`:

- Para acrescentar um exercício, copia um bloco de `EXERCICIOS` e muda os campos. O campo `video` aceita um link teu (YouTube, Google Drive...); se ficar vazio, aparece um botão de pesquisa no YouTube.
- Para criar uma sessão, copia um bloco de `SESSOES` e lista os exercícios pelo `id`.

## Publicar

Com o GitHub Pages ligado ao repositório, o site fica em `https://<utilizador>.github.io/<repositório>/treino-fisico/`.
