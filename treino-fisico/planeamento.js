// Planeamento base: 2 sessões por semana em cada fase da época, para 3 níveis.
// Todas as sessões seguem a mesma estrutura (máx. 60 min):
//   1 Mobilidade → 2 Técnica de corrida → 3 Pliometria → 4 Força inferior (agachamento + peso morto) → 5 Força superior e core
//
// Como ler as tabelas: cada item é it(exercício, dose, descanso).
// - Se o exercício ou a dose for uma lista de 3, é [básico, avançado, elite].
// - null na lista de exercícios = esse nível não faz este exercício.

(function () {
  const NIVEIS = [
    { id: "basico", nome: "Básico", descricao: "Menos de 1 ano de treino de força ou a regressar. Técnica primeiro, cargas moderadas, deixar 3 repetições na reserva." },
    { id: "avancado", nome: "Avançado", descricao: "1–3 anos de treino de força consistente. Domina agachamento e peso morto com barra. Deixar 2 repetições na reserva." },
    { id: "elite", nome: "Elite", descricao: "Mais de 3 anos de força, técnica sólida com cargas altas e historial de pliometria sem lesões. Deixar 1–2 repetições na reserva." }
  ];

  const it = (ex, dose, descanso) => ({ ex, dose, descanso: descanso || "—" });
  const pick = (v, n) => (Array.isArray(v) ? v[n] : v);
  const bloco = (n, titulo, min, itens) => ({ n, titulo, min, itens });

  // Converte a definição de uma sessão (com variantes por nível) na sessão de um nível.
  function paraNivel(blocos, n) {
    return blocos.map((b) => ({
      titulo: `${b.n} · ${b.titulo} (${b.min} min)`,
      itens: b.itens
        .map((x) => ({ ex: pick(x.ex, n), dose: pick(x.dose, n), descanso: pick(x.descanso, n) }))
        .filter((x) => x.ex)
    }));
  }

  const FASES = [
    // ------------------------------------------------------------------
    {
      id: "prep-geral", nome: "Preparatória geral", semanas: "6–8 semanas", semanasNum: 8,
      objetivo: "Adaptar tendões e músculos, aprender a técnica e construir a base de força.",
      rpe: ["6", "6", "7"],
      dias: [
        {
          foco: "Agachamento",
          blocos: [
            bloco(1, "Mobilidade", 8, [it("gato-camelo", "8"), it("worlds-greatest", "3/lado"), it("tornozelo-parede", "10/lado"), it("anca-90-90", "5/lado")]),
            bloco(2, "Técnica de corrida", 8, [
              it(["marcha-joelhos", "tornozelos", "tornozelos"], ["2 × 20 m", "2 × 15 m", "2 × 15 m"]),
              it("skipping-a", "2 × 20 m"),
              it(["bracos-sentado", "skipping-b", "skipping-b"], ["2 × 20 s", "2 × 20 m", "2 × 20 m"]),
              it([null, "progressivos", "progressivos"], [null, "3 × 60 m", "4 × 80 m"], "volta a andar")
            ]),
            bloco(3, "Pliometria", 8, [
              it("saltar-corda", ["2 × 30 s", "3 × 30 s", "3 × 45 s"], "30 s"),
              it("pogo", ["2 × 10", "2 × 15", "3 × 15"], "45 s"),
              it("salto-contramovimento", ["2 × 3", "3 × 4", "3 × 5"], "60 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 20, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["3 × 10", "4 × 8", "4 × 6"], "90 s"),
              it(["peso-morto-romeno", "peso-morto-romeno", "peso-morto"], ["3 × 10", "3 × 8", "3 × 6"], "90 s"),
              it("split-squat-bulgaro", ["2 × 8/perna", "3 × 8/perna", "3 × 8/perna"], "60 s"),
              it("gemeos-em-pe", ["2 × 12/perna", "3 × 12/perna", "3 × 15/perna"], "45 s")
            ]),
            bloco(5, "Força superior e core", 14, [
              it("remada-haltere", ["3 × 10/braço", "3 × 10/braço", "4 × 8/braço"], "45 s"),
              it(["flexoes", "flexoes", "supino-haltere"], ["3 × 8", "3 × 12", "4 × 8"], "45 s"),
              it(["dead-bug", "dead-bug", "rollout"], ["2 × 8/lado", "3 × 8/lado", "3 × 8"], "30 s"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "3 × 40 s/lado"], "30 s")
            ])
          ]
        },
        {
          foco: "Peso morto",
          blocos: [
            bloco(1, "Mobilidade", 8, [it("rotacao-toracica", "8/lado"), it("flexor-anca", "45 s/lado"), it("isquios-ativo", "8/perna"), it("cars-anca", "3/sentido")]),
            bloco(2, "Técnica de corrida", 8, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m", "2 × 20 m/perna"]),
              it("calcanhares-gluteos", "2 × 20 m"),
              it([null, "carioca", "carioca"], [null, "1 × 20 m/lado", "2 × 20 m/lado"]),
              it("progressivos", ["3 × 60 m", "4 × 60 m", "4 × 80 m"], "volta a andar")
            ]),
            bloco(3, "Pliometria", 8, [
              it("pogo", ["2 × 10", "2 × 15", "2 × 20"], "45 s"),
              it("saltos-linha", ["2 × 10 s", "3 × 10 s", "3 × 15 s"], "45 s"),
              it("salto-comprimento", ["2 × 3", "3 × 3", "4 × 3"], "60 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 20, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 10", "4 × 6", "4 × 5"], ["90 s", "2 min", "2 min"]),
              it(["agachamento-goblet", "agachamento-goblet", "agachamento-frontal"], ["3 × 10", "3 × 10", "3 × 6"], "90 s"),
              it("hip-thrust", ["3 × 10", "3 × 10", "3 × 8"], "60 s"),
              it("gemeos-sentado", ["2 × 12", "3 × 12", "3 × 10"], "45 s")
            ]),
            bloco(5, "Força superior e core", 14, [
              it(["remada-elastico", "puxada-frente", "elevacoes"], ["3 × 12", "3 × 10", "4 × 6"], "60 s"),
              it("rotacao-externa-elastico", "2 × 15/braço"),
              it("ytw", "1 × 8 cada letra"),
              it("pallof", ["2 × 10/lado", "3 × 10/lado", "3 × 12/lado"], "30 s"),
              it(["bird-dog", "bird-dog", "hollow"], ["2 × 8/lado", "2 × 8/lado", "3 × 25 s"], "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "prep-especifica", nome: "Preparatória específica", semanas: "6–8 semanas", semanasNum: 8,
      objetivo: "Desenvolver a força máxima e a reatividade: cargas mais altas, menos repetições.",
      rpe: ["7", "7", "8"],
      dias: [
        {
          foco: "Agachamento",
          blocos: [
            bloco(1, "Mobilidade", 7, [it("worlds-greatest", "3/lado"), it("agachamento-profundo", "2 × 30 s"), it("tornozelo-parede", "10/lado")]),
            bloco(2, "Técnica de corrida", 8, [
              it("tornozelos", "2 × 15 m"),
              it("skipping-a", "2 × 20 m"),
              it(["calcanhares-gluteos", "skipping-b", "skipping-b"], "2 × 20 m"),
              it(["wall-drill-a", "perna-esticada", "perna-esticada"], ["2 × 5/perna", "2 × 20 m", "2 × 20 m"]),
              it([null, "wall-drill-a", "wall-drill-trocas"], [null, "2 × 5/perna", "3 × 3 trocas"])
            ]),
            bloco(3, "Pliometria", 9, [
              it(["pogo", "pogo-frente", "pogo-frente"], ["2 × 15", "2 × 15 m", "3 × 15 m"], "45 s"),
              it(["salto-contramovimento", "salto-caixa", "salto-caixa"], ["3 × 4", "3 × 5", "4 × 5"], "90 s"),
              it([null, "saltos-unipodais", "saltos-unipodais"], [null, "2 × 8/perna", "3 × 8/perna"], "60 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 22, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["4 × 8", "4 × 5", "5 × 4"], ["90 s", "2–3 min", "3 min"]),
              it(["peso-morto-romeno", "peso-morto", "peso-morto"], ["3 × 8", "3 × 5", "4 × 4"], ["90 s", "2–3 min", "3 min"]),
              it("split-squat-bulgaro", ["3 × 8/perna", "3 × 6/perna", "3 × 5/perna"], "90 s"),
              it(["gemeos-em-pe", "gemeos-sentado", "gemeos-sentado"], ["3 × 12/perna", "3 × 10", "4 × 8"], "60 s")
            ]),
            bloco(5, "Força superior e core", 14, [
              it(["remada-invertida", "elevacoes", "elevacoes"], ["3 × 10", "4 × 5", "5 × 5"], "90 s"),
              it("press-ombro", ["3 × 10", "3 × 8", "4 × 6"], "60 s"),
              it(["dead-bug", "rollout", "rollout"], ["3 × 8/lado", "3 × 8", "3 × 10"], "45 s")
            ])
          ]
        },
        {
          foco: "Peso morto",
          blocos: [
            bloco(1, "Mobilidade", 7, [it("gato-camelo", "8"), it("sapo", "10"), it("rotacao-toracica", "6/lado"), it("tornozelo-parede", "8/lado")]),
            bloco(2, "Técnica de corrida", 8, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a-unilateral", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m/perna", "2 × 20 m/perna"]),
              it(["calcanhares-gluteos", "skipping-altura", "skipping-altura"], "2 × 20 m"),
              it("progressivos", ["3 × 60 m", "4 × 80 m", "5 × 100 m"], "volta a andar")
            ]),
            bloco(3, "Pliometria", 9, [
              it("pogo-lateral", ["2 × 15", "2 × 20", "3 × 20"], "45 s"),
              it("saltos-patinador", ["2 × 5/lado", "3 × 5/lado", "3 × 6/lado"], "60 s"),
              it(["salto-comprimento", "salto-comprimento-unipodal", "triplo-salto"], ["3 × 3", "2 × 3/perna", "3 × 2/perna"], "90 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 22, [
              it("peso-morto-trap-bar", ["4 × 6", "4 × 5", "5 × 3"], ["2 min", "2–3 min", "3 min"]),
              it(["agachamento-goblet", "agachamento-frontal", "agachamento-frontal"], ["3 × 8", "3 × 6", "4 × 4"], "2 min"),
              it("peso-morto-unilateral", ["2 × 8/perna", "3 × 6/perna", "3 × 6/perna"], "60 s"),
              it("nordic", ["2 × 3", "2 × 5", "3 × 5"], "90 s")
            ]),
            bloco(5, "Força superior e core", 14, [
              it(["remada-cabo", "remada-haltere", "remada-invertida"], ["3 × 10", "3 × 8/braço", "4 × 8 (pés elevados)"], "60 s"),
              it(["flexoes", "supino-haltere", "supino-haltere"], ["3 × 10", "3 × 8", "4 × 6"], "60 s"),
              it("chop-elastico", ["2 × 10/lado", "3 × 10/lado", "3 × 12/lado"], "30 s"),
              it("suitcase-carry", ["2 × 15 m/lado", "2 × 20 m/lado", "3 × 20 m/lado"], "45 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "pre-competitiva", nome: "Pré-competitiva", semanas: "4–6 semanas", semanasNum: 5,
      objetivo: "Converter a força em potência: menos volume, movimentos rápidos e pliometria mais intensa.",
      rpe: ["7", "7", "8"],
      dias: [
        {
          foco: "Agachamento + potência",
          blocos: [
            bloco(1, "Mobilidade", 6, [it("balanco-pernas-frente", "10/perna"), it("balanco-pernas-lado", "10/perna"), it("worlds-greatest", "3/lado")]),
            bloco(2, "Técnica de corrida", 9, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-altura", "skipping-altura"], "2 × 20 m"),
              it("queda-frente", ["3 × 15 m", "3 × 15 m", "4 × 15 m"]),
              it(["progressivos", "wall-drill-trocas", "wall-drill-trocas"], ["3 × 60 m", "3 × 3 trocas", "4 × 3 trocas"])
            ]),
            bloco(3, "Pliometria", 10, [
              it("pogo", ["2 × 15", "2 × 15", "2 × 20"], "45 s"),
              it(["salto-caixa", "drop-jump", "drop-jump"], ["3 × 4", "3 × 4", "4 × 4"], "2 min"),
              it(["saltos-unipodais", "saltos-barreiras", "saltos-barreiras"], ["2 × 6/perna", "3 × 5", "4 × 5"], "90 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 20, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["3 × 6 rápido", "3 × 3 rápido", "4 × 3 rápido"], "2 min"),
              it("salto-contramovimento", ["3 × 3 (logo a seguir)", "3 × 3 (logo a seguir)", "4 × 3 (logo a seguir)"], "2 min"),
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 6", "3 × 4", "4 × 3"], "2 min")
            ]),
            bloco(5, "Força superior e core", 12, [
              it("lancamento-medicinal-cima", ["3 × 6", "3 × 8", "4 × 8"], "60 s"),
              it("bracada-elastico-dupla", ["2 × 12", "3 × 12", "3 × 15"], "45 s"),
              it(["prancha-toques", "lancamento-rotacional", "lancamento-rotacional"], ["2 × 8/lado", "2 × 6/lado", "3 × 6/lado"], "45 s")
            ])
          ]
        },
        {
          foco: "Peso morto + potência",
          blocos: [
            bloco(1, "Mobilidade", 6, [it("gato-camelo", "8"), it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado")]),
            bloco(2, "Técnica de corrida", 9, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a-unilateral", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m/perna", "2 × 20 m/perna"]),
              it("pes-rapidos", ["2 × 6 s", "3 × 8 s", "4 × 8 s"], "45 s"),
              it("progressivos", ["3 × 80 m", "4 × 100 m", "5 × 100 m"], "volta a andar")
            ]),
            bloco(3, "Pliometria", 10, [
              it("pogo-frente", ["2 × 15 m", "3 × 15 m", "3 × 15 m"], "45 s"),
              it(["saltos-patinador", "multisaltos", "multisaltos"], ["3 × 5/lado", "3 × 20 m", "3 × 25 m"], "90 s"),
              it(["salto-comprimento", "triplo-salto", "triplo-salto"], ["3 × 3", "2 × 2/perna", "3 × 2/perna"], "90 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 20, [
              it("peso-morto-trap-bar", ["3 × 5", "3 × 3 rápido", "4 × 3 rápido"], "2 min"),
              it("salto-agachamento", ["3 × 4", "3 × 4", "4 × 4"], "90 s"),
              it(["split-squat-bulgaro", "salto-afundo", "salto-afundo"], ["2 × 6/perna", "3 × 4/perna", "3 × 5/perna"], "90 s"),
              it("kettlebell-swing", ["2 × 12", "2 × 12", "2 × 15"], "60 s")
            ]),
            bloco(5, "Força superior e core", 12, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["3 × 8/braço", "3 × 5 rápidas", "4 × 5 rápidas"], "90 s"),
              it("bracada-elastico-crol", ["3 × 30 s", "3 × 45 s", "4 × 45 s"], "45 s"),
              it("pallof-isometrico", ["2 × 20 s/lado", "3 × 20 s/lado", "3 × 30 s/lado"], "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "competitiva", nome: "Competitiva", semanas: "Época de provas", semanasNum: 8,
      objetivo: "Manter a força e a reatividade com pouco volume para chegar fresco às provas.",
      rpe: ["6", "6", "7"],
      nota: "Na semana de uma prova A faz só o Dia 1, pelo menos 4–5 dias antes da prova.",
      dias: [
        {
          foco: "Manutenção principal",
          blocos: [
            bloco(1, "Mobilidade", 5, [it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado")]),
            bloco(2, "Técnica de corrida", 6, [it("tornozelos", "1 × 15 m"), it("skipping-a", "2 × 20 m"), it("progressivos", "3 × 80 m", "volta a andar")]),
            bloco(3, "Pliometria", 6, [
              it("pogo", "2 × 15", "45 s"),
              it(["salto-contramovimento", "saltos-unipodais", "saltos-unipodais"], ["2 × 3", "2 × 6/perna", "3 × 6/perna"], "60 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 15, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["2 × 6", "3 × 4", "3 × 3"], "2 min"),
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["2 × 6", "2 × 4", "3 × 3"], "2 min")
            ]),
            bloco(5, "Força superior e core", 10, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["2 × 8/braço", "2 × 5", "3 × 5"], "90 s"),
              it("rotacao-externa-90", "2 × 12/braço"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "2 × 40 s/lado"])
            ])
          ]
        },
        {
          foco: "Leve (semanas sem prova)",
          blocos: [
            bloco(1, "Mobilidade", 6, [it("gato-camelo", "8"), it("flexor-anca", "45 s/lado"), it("rotacao-toracica", "6/lado")]),
            bloco(2, "Técnica de corrida", 6, [it("tornozelos", "1 × 15 m"), it("pes-rapidos", "3 × 6 s"), it("progressivos", "3 × 80 m", "volta a andar")]),
            bloco(3, "Pliometria", 5, [
              it("pogo-lateral", "2 × 15", "45 s"),
              it(["salto-comprimento", "salto-comprimento", "salto-comprimento-unipodal"], ["2 × 3", "2 × 3", "2 × 3/perna"], "60 s")
            ]),
            bloco(4, "Força inferior — agachamento e peso morto", 13, [
              it(["ponte-glutea", "hip-thrust", "hip-thrust"], ["2 × 12", "2 × 8", "3 × 6"], "60 s"),
              it(["agachamento-goblet", "peso-morto-unilateral", "peso-morto-unilateral"], ["2 × 8", "2 × 6/perna", "2 × 6/perna"], "60 s"),
              it("gemeos-em-pe", ["2 × 12/perna", "2 × 12/perna", "2 × 10/perna"], "45 s")
            ]),
            bloco(5, "Força superior e core", 10, [
              it("band-pull-apart", "2 × 15"),
              it(["remada-elastico", "remada-invertida", "remada-invertida"], ["2 × 12", "2 × 10", "3 × 8"], "45 s"),
              it(["dead-bug", "pallof", "pallof"], ["2 × 8/lado", "2 × 10/lado", "2 × 12/lado"], "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "transicao", nome: "Transição", semanas: "2–4 semanas", semanasNum: 3,
      objetivo: "Recuperar depois da época ou de uma paragem: corrigir desequilíbrios, mobilidade e força leve.",
      rpe: ["4", "5", "5"],
      dias: [
        {
          foco: "Mobilidade e controlo",
          blocos: [
            bloco(1, "Mobilidade", 10, [it("gato-camelo", "8"), it("rotacao-toracica", "8/lado"), it("flexor-anca", "45 s/lado"), it("anca-90-90", "5/lado"), it("tornozelo-parede", "10/lado")]),
            bloco(2, "Técnica de corrida", 7, [it("marcha-joelhos", "2 × 20 m"), it("tornozelos", "2 × 15 m"), it("bracos-sentado", "2 × 20 s")]),
            bloco(3, "Pliometria", 5, [it("saltar-corda", "3 × 30 s", "30 s"), it("pogo", ["2 × 10", "2 × 12", "2 × 15"], "60 s")]),
            bloco(4, "Força inferior — agachamento e peso morto", 15, [
              it("agachamento-goblet", ["3 × 10 leve", "3 × 10 leve", "3 × 10"], "60 s"),
              it("peso-morto-romeno", ["3 × 10 leve", "3 × 10 leve", "3 × 10"], "60 s"),
              it("ponte-glutea", "2 × 15")
            ]),
            bloco(5, "Força superior e core", 10, [it("remada-elastico", "3 × 12", "30 s"), it("flexao-serratil", "2 × 10"), it("bird-dog", "2 × 8/lado"), it("prancha-frontal", "2 × 30 s")])
          ]
        },
        {
          foco: "Força leve e equilíbrio",
          blocos: [
            bloco(1, "Mobilidade", 10, [it("cars-anca", "3/sentido"), it("worlds-greatest", "3/lado"), it("figura-4", "30 s/lado"), it("alongamento-gemeos", "30 s/perna"), it("bastao-ombros", "10")]),
            bloco(2, "Técnica de corrida", 7, [it("tornozelos", "2 × 15 m"), it("skipping-a", "2 × 20 m"), it("calcanhares-gluteos", "2 × 20 m")]),
            bloco(3, "Pliometria", 5, [it("pogo", "2 × 10", "60 s"), it("saltos-linha", ["2 × 8 s", "2 × 10 s", "2 × 10 s"], "60 s")]),
            bloco(4, "Força inferior — agachamento e peso morto", 15, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 8 leve", "3 × 8 leve", "3 × 8"], "90 s"),
              it("step-up", "2 × 10/perna", "45 s"),
              it("equilibrio-unipodal", "2 × 30 s/perna")
            ]),
            bloco(5, "Força superior e core", 10, [it("remada-invertida", ["2 × 8", "3 × 10", "3 × 10"], "45 s"), it("ytw", "1 × 8 cada letra"), it("pallof", "2 × 10/lado", "30 s")])
          ]
        }
      ]
    }
  ];

  // Gera as sessões: uma por fase × nível × dia.
  const geradas = [];
  FASES.forEach((f) => {
    f.sessoes = {};
    NIVEIS.forEach((nv, n) => {
      f.sessoes[nv.id] = f.dias.map((d, di) => {
        const blocos = paraNivel(d.blocos, n);
        const id = `${f.id}-${nv.id}-dia${di + 1}`;
        geradas.push({
          id,
          nome: `${f.nome} · ${nv.nome} · Dia ${di + 1}`,
          fase: f.nome,
          nivel: nv.id,
          faseId: f.id,
          dia: di + 1,
          foco: d.foco,
          local: f.id === "transicao" ? "Ginásio ou casa" : "Ginásio",
          duracao: d.blocos.reduce((t, b) => t + b.min, 0),
          frequencia: `Dia ${di + 1} de 2 por semana · foco: ${d.foco.toLowerCase()}`,
          rpe: f.rpe[n],
          objetivo: f.objetivo,
          nota: [nv.descricao, f.nota].filter(Boolean).join(" "),
          blocos,
          completa: true
        });
        return id;
      });
    });
  });

  SESSOES.unshift(...geradas);
  window.PLANEAMENTO = { niveis: NIVEIS, fases: FASES };
})();
