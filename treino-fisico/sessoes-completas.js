// Sessões completas (máx. 60 min), sempre com a mesma estrutura:
//   1 Mobilidade → 2 Técnica de corrida → 3 Pliometria → 4 Força inferior (agachamento + peso morto) → 5 Força superior e core
// Aparecem primeiro nas listas (campo completa: true).

(function () {
  const i = (ex, dose, descanso) => ({ ex, dose, descanso: descanso || "—" });
  const b = (n, titulo, min, itens) => ({ titulo: `${n} · ${titulo} (${min} min)`, itens });
  const completas = [];
  const s = (id, nome, fase, local, frequencia, rpe, objetivo, nota, blocos) => {
    const duracao = blocos.reduce((t, x) => t + Number(x.titulo.match(/\((\d+) min\)/)[1]), 0);
    completas.push({ id, nome, fase, local, duracao, frequencia, rpe, objetivo, nota, blocos, completa: true });
  };

  s("completa-base-a", "Sessão completa — Base A", "Preparatória geral", "Ginásio", "2× por semana (alternar com Base B)", "6",
    "Primeiras semanas da época: aprender os movimentos e construir a base de força com cargas moderadas.",
    "Força: deixa 2–3 repetições na reserva. Pliometria: aterragens suaves e silenciosas.",
    [
      b(1, "Mobilidade", 8, [i("gato-camelo", "8"), i("worlds-greatest", "3/lado"), i("tornozelo-parede", "10/lado"), i("anca-90-90", "5/lado")]),
      b(2, "Técnica de corrida", 8, [i("marcha-joelhos", "2 × 20 m"), i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 20 m"), i("calcanhares-gluteos", "2 × 20 m")]),
      b(3, "Pliometria", 7, [i("saltar-corda", "3 × 30 s", "30 s"), i("pogo", "2 × 15", "45 s"), i("salto-contramovimento", "3 × 3", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 20, [i("agachamento-goblet", "4 × 8", "90 s"), i("peso-morto-romeno", "4 × 8", "90 s"), i("split-squat-bulgaro", "2 × 8/perna", "60 s")]),
      b(5, "Força superior e core", 15, [i("remada-haltere", "3 × 10/braço", "45 s"), i("flexoes", "3 × 10", "45 s"), i("dead-bug", "2 × 8/lado", "30 s"), i("prancha-lateral", "2 × 30 s/lado", "30 s")])
    ]);

  s("completa-base-b", "Sessão completa — Base B", "Preparatória geral", "Ginásio", "2× por semana (alternar com Base A)", "6",
    "Segunda sessão da base: variantes do agachamento e do peso morto e mais trabalho de ombro para a natação.",
    "Trap bar: se não houver, usa peso morto com kettlebell. Core sem prender a respiração.",
    [
      b(1, "Mobilidade", 8, [i("rotacao-toracica", "8/lado"), i("flexor-anca", "45 s/lado"), i("isquios-ativo", "8/perna"), i("cars-anca", "3/sentido")]),
      b(2, "Técnica de corrida", 8, [i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 20 m"), i("bracos-sentado", "2 × 20 s"), i("progressivos", "3 × 60 m", "volta a andar")]),
      b(3, "Pliometria", 7, [i("pogo", "2 × 15", "45 s"), i("saltos-linha", "2 × 10 s", "45 s"), i("salto-comprimento", "3 × 3", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 20, [i("peso-morto-trap-bar", "4 × 6", "2 min"), i("agachamento-goblet", "3 × 10", "90 s"), i("gemeos-em-pe", "3 × 12/perna", "45 s")]),
      b(5, "Força superior e core", 15, [i("puxada-frente", "3 × 10", "60 s"), i("rotacao-externa-elastico", "2 × 15/braço"), i("ytw", "1 × 8 cada letra"), i("pallof", "3 × 10/lado", "30 s")])
    ]);

  s("completa-forca-a", "Sessão completa — Força A", "Preparatória específica", "Ginásio", "2× por semana (alternar com Força B)", "7",
    "Desenvolver a força máxima com barra: agachamento e peso morto pesados, pliometria intermédia.",
    "Faz 2 séries de aproximação antes das séries pesadas. Deixa 1–2 repetições na reserva.",
    [
      b(1, "Mobilidade", 7, [i("worlds-greatest", "3/lado"), i("agachamento-profundo", "2 × 30 s"), i("tornozelo-parede", "10/lado")]),
      b(2, "Técnica de corrida", 8, [i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 20 m"), i("skipping-b", "2 × 20 m"), i("perna-esticada", "2 × 20 m")]),
      b(3, "Pliometria", 9, [i("pogo-frente", "2 × 15 m", "45 s"), i("salto-caixa", "3 × 4", "90 s"), i("saltos-unipodais", "2 × 8/perna", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 22, [i("agachamento-barra", "4 × 5", "2–3 min"), i("peso-morto", "3 × 5", "2–3 min"), i("gemeos-sentado", "3 × 10", "45 s")]),
      b(5, "Força superior e core", 14, [i("elevacoes", "4 × 5", "90 s"), i("press-ombro", "3 × 8", "60 s"), i("rollout", "3 × 8", "45 s")])
    ]);

  s("completa-forca-b", "Sessão completa — Força B", "Preparatória específica", "Ginásio", "2× por semana (alternar com Força A)", "7",
    "Força máxima com variantes: agachamento frontal e trap bar, mais trabalho unilateral.",
    "Agachamento frontal: cotovelos altos. Se a técnica falhar, baixa a carga.",
    [
      b(1, "Mobilidade", 7, [i("gato-camelo", "8"), i("sapo", "10"), i("rotacao-toracica", "6/lado"), i("tornozelo-parede", "8/lado")]),
      b(2, "Técnica de corrida", 8, [i("tornozelos", "2 × 15 m"), i("skipping-a-unilateral", "2 × 20 m/perna"), i("wall-drill-a", "2 × 5/perna"), i("progressivos", "3 × 80 m", "volta a andar")]),
      b(3, "Pliometria", 9, [i("pogo-lateral", "2 × 20", "45 s"), i("saltos-patinador", "3 × 5/lado", "60 s"), i("salto-comprimento-unipodal", "2 × 3/perna", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 22, [i("agachamento-frontal", "4 × 5", "2–3 min"), i("peso-morto-trap-bar", "4 × 5", "2–3 min"), i("peso-morto-unilateral", "2 × 6/perna", "60 s")]),
      b(5, "Força superior e core", 14, [i("remada-invertida", "3 × 8", "60 s"), i("supino-haltere", "3 × 8", "60 s"), i("chop-elastico", "2 × 10/lado", "30 s"), i("suitcase-carry", "2 × 20 m/lado", "45 s")])
    ]);

  s("completa-potencia", "Sessão completa — Potência", "Pré-competitiva", "Ginásio com pista ou relva", "1–2× por semana", "7",
    "Transformar a força em potência: menos repetições, pliometria avançada e técnica a velocidade alta.",
    "Qualidade máxima em cada repetição: rápido e explosivo. Recuperação completa. Não fazer na semana de prova A.",
    [
      b(1, "Mobilidade", 6, [i("balanco-pernas-frente", "10/perna"), i("balanco-pernas-lado", "10/perna"), i("worlds-greatest", "3/lado")]),
      b(2, "Técnica de corrida", 9, [i("tornozelos", "2 × 15 m"), i("skipping-altura", "2 × 20 m"), i("wall-drill-trocas", "3 × 3 trocas"), i("queda-frente", "3 × 15 m")]),
      b(3, "Pliometria", 10, [i("pogo", "2 × 15", "45 s"), i("drop-jump", "3 × 4", "2 min"), i("saltos-barreiras", "3 × 5", "90 s")]),
      b(4, "Força inferior — agachamento e peso morto", 20, [i("agachamento-barra", "3 × 3 rápidos", "2–3 min"), i("salto-contramovimento", "3 × 3 (logo a seguir)", "2 min"), i("peso-morto-trap-bar", "3 × 3", "2 min")]),
      b(5, "Força superior e core", 12, [i("lancamento-medicinal-cima", "3 × 6", "60 s"), i("bracada-elastico-dupla", "3 × 12", "45 s"), i("lancamento-rotacional", "2 × 6/lado", "45 s")])
    ]);

  s("completa-competitiva", "Sessão completa — Manutenção competitiva", "Competitiva", "Ginásio", "1× por semana", "6",
    "Manter força e reatividade em época de provas com pouco volume e pouca fadiga.",
    "Pesado mas com poucas séries. Não fazer nos 4–5 dias antes de uma prova A.",
    [
      b(1, "Mobilidade", 5, [i("worlds-greatest", "3/lado"), i("tornozelo-parede", "8/lado")]),
      b(2, "Técnica de corrida", 6, [i("tornozelos", "1 × 15 m"), i("skipping-a", "2 × 20 m"), i("progressivos", "3 × 80 m", "volta a andar")]),
      b(3, "Pliometria", 6, [i("pogo", "2 × 15", "45 s"), i("saltos-unipodais", "2 × 6/perna", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 15, [i("agachamento-barra", "3 × 4", "2 min"), i("peso-morto-trap-bar", "2 × 4", "2 min")]),
      b(5, "Força superior e core", 10, [i("elevacoes", "2 × 5", "90 s"), i("rotacao-externa-90", "2 × 12/braço"), i("prancha-lateral", "2 × 30 s/lado")])
    ]);

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

  s("completa-regresso", "Sessão completa — Regresso / transição", "Transição ou regresso após paragem", "Ginásio ou casa", "2× por semana", "5",
    "Retomar depois de férias, doença ou lesão: tudo leve, com foco em técnica e controlo.",
    "Nenhuma série perto da falha. Se houver dor acima de 3/10, para e fala com o treinador.",
    [
      b(1, "Mobilidade", 10, [i("gato-camelo", "8"), i("rotacao-toracica", "8/lado"), i("flexor-anca", "45 s/lado"), i("anca-90-90", "5/lado"), i("tornozelo-parede", "10/lado")]),
      b(2, "Técnica de corrida", 7, [i("marcha-joelhos", "2 × 20 m"), i("tornozelos", "2 × 15 m"), i("bracos-sentado", "2 × 20 s")]),
      b(3, "Pliometria", 5, [i("saltar-corda", "3 × 30 s", "30 s"), i("pogo", "2 × 10", "60 s")]),
      b(4, "Força inferior — agachamento e peso morto", 16, [i("agachamento-goblet", "3 × 10 leve", "60 s"), i("peso-morto-romeno", "3 × 10 leve", "60 s"), i("ponte-glutea", "2 × 15")]),
      b(5, "Força superior e core", 12, [i("remada-elastico", "3 × 12", "30 s"), i("flexao-serratil", "2 × 10"), i("bird-dog", "2 × 8/lado"), i("prancha-frontal", "2 × 30 s")])
    ]);

  // Ficam no início da lista.
  SESSOES.unshift(...completas);
})();
