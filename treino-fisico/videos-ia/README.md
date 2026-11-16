# Vídeos com pessoa gerada por IA

Um ficheiro por exercício: `<id-do-exercicio>.mp4` (o id vem de `dados.js` / `exercicios-extra.js`).
Depois de pôr o ficheiro aqui, acrescentar o id à lista em `../videos-ia.js`.

## Formato
- 5 a 8 segundos, em loop, **sem som**
- 16:9, 720p, H.264 (`.mp4`) — funciona em iPhone e Android
- Até ~1,5 MB. Para comprimir: `ffmpeg -i entrada.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart <id>.mp4`
- A miniatura no plano mostra o **centro** do vídeo em quadrado: manter a pessoa ao centro.

## Gerar (imagem → vídeo)
1. Criar **uma** imagem de referência do atleta e usá-la em todos os exercícios (mesma pessoa, roupa e fundo).
2. Gerar o vídeo a partir dessa imagem, com câmara fixa e o exercício descrito passo a passo.
3. **Revisão técnica obrigatória** antes de publicar: a IA erra muitas vezes a postura.
