// Sessão completa sem nível, para treinar em casa ou em viagem (mesma estrutura de 5 blocos).
// As sessões por fase e nível estão em planeamento.js.

(function () {
  const i = (ex, dose, descanso) => ({ ex, dose, descanso: descanso || "—" });
  const b = (n, titulo, min, itens) => ({ titulo: `${n} · ${titulo} (${min} min)`, itens });
  const completas = [];
  const s = (id, nome, fase, local, frequencia, rpe, objetivo, nota, blocos) => {
    const duracao = blocos.reduce((t, x) => t + Number(x.titulo.match(/\((\d+) min\)/)[1]), 0);
    completas.push({ id, nome, fase, local, duracao, frequencia, rpe, objetivo, nota, blocos, completa: false });
  };

  s("completa-casa", "Sessão completa — Em casa", "Qualquer fase", "Casa: halteres ou kettlebell, elástico", "1–2× por semana", "6",
    "A mesma estrutura sem ginásio, para quem treina em casa ou está em viagem.",
    "Se só tiveres um peso, faz o agachamento goblet e o peso morto romeno com esse peso e aumenta as repetições.",
    [
      b(1, "Mobilidade", 8, [i("gato-camelo", "8"), i("worlds-greatest", "3/lado"), i("figura-4", "30 s/lado"), i("tornozelo-parede", "10/lado")]),
      b(2, "Técnica de corrida", 8, [i("marcha-joelhos", "2 × 15 m"), i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 15 m"), i("pes-rapidos", "3 × 6 s")]),
      b(3, "Pliometria", 7, [i("saltar-corda", "3 × 30 s", "30 s"), i("pogo", "2 × 15", "45 s"), i("salto-agachamento", "3 × 5", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 18, [i("agachamento-goblet", "4 × 12", "60 s"), i("peso-morto-romeno", "4 × 12", "60 s"), i("peso-morto-unilateral", "2 × 8/perna", "45 s")]),
      b(5, "Força superior e core", 14, [i("remada-elastico", "3 × 15", "30 s"), i("flexoes", "3 × 12", "45 s"), i("band-pull-apart", "2 × 15"), i("hollow", "3 × 25 s", "30 s")])
    ]);

  SESSOES.push(...completas);
})();
