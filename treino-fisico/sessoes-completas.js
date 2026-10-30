// Sessões para treinar em casa ou em viagem (mesma estrutura de 5 blocos, máx. 60 min).
// - "Só peso do corpo" em 3 níveis: nenhum material (só uma cadeira/sofá, uma mesa e um corredor).
// - "Com halteres ou kettlebell" para quem tem algum material.
// As sessões por fase e nível do ginásio estão em planeamento.js.

(function () {
  const i = (ex, dose, descanso) => ({ ex, dose, descanso: descanso || "—" });
  const b = (n, titulo, min, itens) => ({ titulo: `${n} · ${titulo} (${min} min)`, itens });
  const completas = [];
  const s = (id, nome, fase, local, frequencia, rpe, objetivo, nota, blocos) => {
    const duracao = blocos.reduce((t, x) => t + Number(x.titulo.match(/\((\d+) min\)/)[1]), 0);
    completas.push({ id, nome, fase, local, duracao, frequencia, rpe, objetivo, nota, blocos, completa: false, casa: true, ordem: completas.length });
  };

  const LOCAL_PC = "Casa — sem material (cadeira ou sofá, mesa resistente, 15 m de corredor ou rua)";
  const NOTA_PC = "Não precisas de material. Split squat e agachamento a uma perna: usa uma cadeira ou o sofá. Remada invertida: deitado debaixo de uma mesa pesada e estável (encostada à parede, que não tombe), agarrado ao bordo do tampo entre as pernas da mesa. Técnica de corrida: num corredor, na rua ou no jardim.";

  s("casa-pc-basico", "Em casa · Só peso do corpo · Básico", "Qualquer fase", LOCAL_PC, "2× por semana", "5–6",
    "Treino completo em casa, sem material, para quem está a começar a força.",
    NOTA_PC + " Se as flexões forem difíceis, faz com os joelhos no chão.",
    [
      b(1, "Mobilidade", 8, [i("gato-camelo", "8"), i("worlds-greatest", "3/lado"), i("tornozelo-parede", "10/lado"), i("figura-4", "30 s/lado")]),
      b(2, "Técnica de corrida", 8, [i("marcha-joelhos", "2 × 15 m"), i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 15 m"), i("bracos-sentado", "2 × 20 s")]),
      b(3, "Pliometria", 7, [i("pogo", "2 × 10", "45 s"), i("saltos-linha", "2 × 10 s", "45 s"), i("salto-agachamento", "2 × 4", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 20, [
        i("afundo-atras", "3 × 10/perna", "60 s"), i("peso-morto-unilateral", "3 × 8/perna", "60 s"),
        i("ponte-unilateral", "3 × 10/perna", "45 s"), i("gemeos-em-pe", "3 × 15/perna", "45 s")
      ]),
      b(5, "Força superior e core", 14, [
        i("flexoes", "3 × 8", "45 s"), i("superman-alternado", "2 × 10/lado", "30 s"),
        i("dead-bug", "3 × 8/lado", "30 s"), i("prancha-lateral", "2 × 30 s/lado", "30 s")
      ])
    ]);

  s("casa-pc-avancado", "Em casa · Só peso do corpo · Avançado", "Qualquer fase", LOCAL_PC, "2× por semana", "6–7",
    "Treino completo em casa, sem material, para quem já tem base de força. Mais repetições e tempo sob tensão.",
    NOTA_PC + " Desce em 3 s no split squat e no peso morto a uma perna para compensar a falta de carga.",
    [
      b(1, "Mobilidade", 8, [i("worlds-greatest", "3/lado"), i("agachamento-profundo", "2 × 30 s"), i("cars-anca", "3/sentido"), i("tornozelo-parede", "10/lado")]),
      b(2, "Técnica de corrida", 8, [i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 20 m"), i("skipping-b", "2 × 20 m"), i("pes-rapidos", "3 × 8 s", "45 s")]),
      b(3, "Pliometria", 8, [i("pogo", "3 × 15", "45 s"), i("salto-agachamento", "3 × 5", "60 s"), i("saltos-patinador", "3 × 6/lado", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 20, [
        i("split-squat-bulgaro", "4 × 10/perna (descer em 3 s)", "60 s"), i("peso-morto-unilateral", "3 × 10/perna (descer em 3 s)", "60 s"),
        i("hip-thrust-unilateral", "3 × 12/perna", "45 s"), i("nordic", "2 × 4 (pés presos no sofá)", "90 s"),
        i("gemeos-em-pe", "3 × 20/perna", "45 s")
      ]),
      b(5, "Força superior e core", 14, [
        i("flexoes", "4 × 12–15", "45 s"), i("remada-invertida", "3 × 10 (debaixo da mesa)", "45 s"),
        i("ytw", "1 × 8 cada letra"), i("prancha-toques", "3 × 10/lado", "30 s"), i("hollow", "3 × 25 s", "30 s")
      ])
    ]);

  s("casa-pc-elite", "Em casa · Só peso do corpo · Elite", "Qualquer fase", LOCAL_PC, "2× por semana", "7–8",
    "Treino exigente sem material para atletas com muita base: exercícios a uma perna, pliometria reativa e progressões difíceis.",
    NOTA_PC + " Usa uma superfície macia para os saltos e para o nordic.",
    [
      b(1, "Mobilidade", 7, [i("worlds-greatest", "3/lado"), i("agachamento-profundo", "2 × 30 s"), i("balanco-pernas-frente", "10/perna"), i("tornozelo-parede", "8/lado")]),
      b(2, "Técnica de corrida", 8, [i("tornozelos", "2 × 15 m"), i("skipping-a-unilateral", "2 × 15 m/perna"), i("skipping-altura", "2 × 15 m"), i("wall-drill-trocas", "4 × 3 trocas", "45 s")]),
      b(3, "Pliometria", 9, [i("pogo", "3 × 20", "45 s"), i("salto-afundo", "3 × 6/perna", "60 s"), i("saltos-unipodais", "3 × 10/perna", "60 s"), i("salto-tuck", "3 × 6", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 20, [
        i("agachamento-unipodal-caixa", "4 × 6/perna (caixa baixa)", "60 s"), i("peso-morto-unilateral", "4 × 10/perna (pausa em baixo)", "60 s"),
        i("nordic", "3 × 5 (pés presos no sofá)", "90 s"), i("gemeos-em-pe", "3 × 20/perna (pausa 2 s em cima)", "45 s"),
        i("copenhagen", "2 × 20 s/lado", "45 s")
      ]),
      b(5, "Força superior e core", 14, [
        i("flexoes", "4 × 15–20 (pés elevados)", "45 s"), i("remada-invertida", "4 × 12 (pés elevados)", "45 s"),
        i("flexao-serratil", "2 × 12"), i("hollow", "3 × 30 s", "30 s"), i("prancha-lateral-perna", "3 × 10/lado", "30 s")
      ])
    ]);

  s("completa-casa", "Em casa · Com halteres ou kettlebell", "Qualquer fase", "Casa: halteres ou kettlebell, elástico", "1–2× por semana", "6",
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
