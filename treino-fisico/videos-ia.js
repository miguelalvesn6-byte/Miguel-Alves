// videos-ia.js — vídeos curtos (loop, sem som) com uma pessoa gerada por IA a fazer cada exercício.
// Mostrados em miniatura no plano da sessão e em tamanho maior na página do exercício.
// Os vídeos do YouTube (videos.js) continuam disponíveis como "vídeo explicativo".
//
// Para acrescentar um exercício:
//   1. Gerar o clip (5–8 s, câmara fixa, loop) e guardá-lo em treino-fisico/videos-ia/<id>.mp4
//      — ideal: 720p, H.264, sem som, < 1,5 MB (ver README.md desta pasta).
//   2. Acrescentar o id abaixo. O id é o mesmo de dados.js / exercicios-extra.js.
// Carregar depois dos ficheiros de exercícios.
(function () {
  const IDS = [
    "agachamento-goblet",
    "peso-morto-romeno",
    "remada-haltere",
    "prancha-lateral",
    "flexor-anca",
    "prancha-frontal",
    "copenhagen",
    "step-up",
  ];
  if (typeof EXERCICIOS === "undefined") return;
  const pasta = "../treino-fisico/videos-ia/";
  EXERCICIOS.forEach((e) => {
    if (IDS.includes(e.id)) e.videoIA = pasta + e.id + ".mp4";
  });
})();
