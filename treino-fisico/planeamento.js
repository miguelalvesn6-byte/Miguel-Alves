// Planeamento da época: 2 sessões por semana em cada fase, para 3 níveis e 2 modalidades
// (Triatlo e Corrida). Todas as sessões seguem a mesma estrutura (máx. 60 min):
//   1 Mobilidade → 2 Técnica de corrida → 3 Pliometria → 4 Força inferior (agachamento + peso morto) → 5 Força superior e core
//
// Como ler as tabelas: cada item é it(exercício, dose, descanso).
// - Se o exercício, a dose ou o descanso for uma lista de 3, é [básico, avançado, elite].
// - null na lista de exercícios = esse nível não faz este exercício.
// - "contactos" de cada fase = alvo de contactos de pliometria (aterragens) por sessão: [básico, avançado, elite].
//   O número real de cada sessão é calculado automaticamente (ver CONTACTOS) e escrito na nota da sessão.
//
// Estrutura exposta:
//   window.PLANEAMENTO.niveis                     — 3 níveis
//   window.PLANEAMENTO.fases                      — fases do TRIATLO (compatibilidade com a app)
//   window.PLANEAMENTO.modalidades.triatlo.fases  — as mesmas fases do triatlo
//   window.PLANEAMENTO.modalidades.corrida.fases  — fases da CORRIDA (ids "cor-…")
//   window.PLANEAMENTO.guia[modalidade]           — como encadear as fases numa época com provas A/B/C
//
// Princípios (resumo): força pesada 2×/semana melhora a economia de corrida e de pedalada (Rønnestad & Mujika 2014;
// Blagrove 2018; Beattie 2014; Balsalobre-Fernández 2016); pliometria progressiva por contactos (NSCA);
// carga pesada lenta e isometria para tendões (Beyer 2015; Rio 2015) com monitorização da dor (Silbernagel 2007);
// força e Copenhaga/nordic reduzem lesões (Lauersen 2014; Harøy 2019; van der Horst 2015).

(function () {
  const NIVEIS = [
    { id: "basico", nome: "Básico", descricao: "Menos de 1 ano de treino de força ou a regressar. Técnica primeiro, cargas moderadas, deixar 3 repetições na reserva." },
    { id: "avancado", nome: "Avançado", descricao: "1–3 anos de treino de força consistente. Domina agachamento e peso morto com barra. Deixar 2 repetições na reserva." },
    { id: "elite", nome: "Elite", descricao: "Mais de 3 anos de força, técnica sólida com cargas altas e historial de pliometria sem lesões. Deixar 1–2 repetições na reserva." }
  ];

  const it = (ex, dose, descanso) => ({ ex, dose, descanso: descanso || "—" });
  const pick = (v, n) => (Array.isArray(v) ? v[n] : v);
  const bloco = (n, titulo, min, itens) => ({ n, titulo, min, itens });
  const TIT = ["", "Mobilidade", "Técnica de corrida", "Pliometria", "Força inferior — agachamento e peso morto", "Força superior e core"];
  const B = (n, min, itens) => bloco(n, TIT[n], min, itens);

  // Contactos com o solo por repetição de cada exercício pliométrico.
  // número = contactos por repetição; { m } = contactos por metro; { s } = contactos por segundo.
  // A corda é aquecimento de baixa intensidade e não conta.
  const CONTACTOS = {
    "pogo": 1, "pogo-lateral": 1, "pogo-frente": { m: 1.5 }, "saltos-linha": { s: 2 }, "saltar-corda": 0,
    "snap-down": 1, "salto-contramovimento": 1, "salto-agachamento": 1, "salto-comprimento": 1, "salto-caixa": 1,
    "salto-tuck": 1, "salto-afundo": 1, "salto-trap-bar": 1, "drop-jump": 1, "saltos-barreiras": 1,
    "saltos-unipodais": 1, "saltos-patinador": 1, "salto-comprimento-unipodal": 1, "triplo-salto": 3,
    "saltos-zigzag": 1, "salto-caixa-lateral": 1, "saltos-escadas": 1,
    "multisaltos": { m: 0.5 }, "multisaltos-subida": { m: 0.5 }
  };
  function contactosItem(ex, dose) {
    const f = CONTACTOS[ex];
    if (f === undefined || !dose) return 0;
    const m = String(dose).match(/(\d+)\s*×\s*(\d+)(?:\s*[–-]\s*(\d+))?\s*(m|s)?(?![a-zçã])/i);
    if (!m) return 0;
    const series = Number(m[1]);
    const reps = m[3] ? (Number(m[2]) + Number(m[3])) / 2 : Number(m[2]);
    const lados = /\/(perna|lado)/.test(dose) ? 2 : 1;
    let k = 0;
    if (typeof f === "number") k = m[4] ? 0 : f;
    else if (m[4] === "m") k = f.m || 0;
    else if (m[4] === "s") k = f.s || 0;
    return series * reps * lados * k;
  }
  const contactosSessao = (blocos) =>
    Math.round(blocos.reduce((t, b) => t + b.itens.reduce((u, x) => u + contactosItem(x.ex, x.dose), 0), 0));

  // Converte a definição de uma sessão (com variantes por nível) na sessão de um nível.
  function paraNivel(blocos, n) {
    return blocos.map((b) => ({
      titulo: `${b.n} · ${b.titulo} (${b.min} min)`,
      itens: b.itens
        .map((x) => ({ ex: pick(x.ex, n), dose: pick(x.dose, n), descanso: pick(x.descanso, n) }))
        .filter((x) => x.ex)
    }));
  }

  const NOTA_PROVAS_TRI = "Provas A (objetivo da época): usa a fase Afinação nos 7–14 dias antes. Provas B: faz só o Dia 1 com uma série a menos em cada exercício, 4–5 dias antes, e nada de força nos 3 dias antes. Provas C (treino): treina normalmente, mas não faças força nas 48 h antes. Depois de um Ironman ou meio Ironman: 7–10 dias sem pliometria nem força pesada.";
  const NOTA_PROVAS_COR = "Provas A (objetivo da época): usa a fase Afinação nos 7–14 dias antes. Provas B: faz só o Dia 1 com uma série a menos em cada exercício, 4–5 dias antes, e nada de pliometria nos 3 dias antes. Provas C (treino): treina normalmente, mas não faças força nas 48 h antes. Depois de uma maratona: 10–14 dias sem pliometria nem força pesada (depois de 10 km/meia maratona: 4–7 dias).";

  // =====================================================================
  // TRIATLO — 3 desportos: carga total gerida com cuidado, pliometria moderada,
  // ombro e natação no seco, core para a posição aero, extensão da anca e quadríceps para o ciclismo.
  // =====================================================================
  const FASES_TRI = [
    {
      id: "prep-geral", nome: "Preparatória geral (adaptação)", semanas: "6–10 semanas", semanasNum: 8,
      objetivo: "Adaptar tendões e músculos à carga, aprender a técnica dos exercícios e construir força geral — com o ombro (natação) e o tronco para a posição aero (ciclismo) incluídos desde o início.",
      rpe: ["6", "6", "7"], contactos: [[40, 60], [60, 80], [80, 100]],
      nota: "Faz a força depois de um treino intenso (no mesmo dia) ou num dia fácil — nunca na véspera do treino longo de bicicleta ou da série chave de corrida. Sobe a carga quando completares todas as séries com as repetições na reserva indicadas para o teu nível.",
      dias: [
        {
          foco: "Agachamento",
          blocos: [
            B(1, 8, [it("gato-camelo", "8"), it("worlds-greatest", "3/lado"), it("tornozelo-parede", "10/lado"), it("anca-90-90", "5/lado")]),
            B(2, 8, [
              it(["marcha-joelhos", "tornozelos", "tornozelos"], ["2 × 20 m", "2 × 15 m", "2 × 15 m"]),
              it("skipping-a", "2 × 20 m"),
              it(["bracos-sentado", "skipping-b", "skipping-b"], ["2 × 20 s", "2 × 20 m", "2 × 20 m"]),
              it([null, "progressivos", "progressivos"], [null, "3 × 60 m", "4 × 80 m"], "volta a andar")
            ]),
            B(3, 8, [
              it("saltar-corda", ["2 × 30 s", "3 × 30 s", "3 × 30 s"], "30 s"),
              it("pogo", ["2 × 15", "3 × 15", "3 × 20"], "45 s"),
              it(["snap-down", "snap-down", "pogo-lateral"], ["2 × 4", "2 × 5", "2 × 10"], "45 s"),
              it("salto-contramovimento", ["2 × 4", "3 × 4", "3 × 5"], "60 s")
            ]),
            B(4, 20, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["3 × 10", "4 × 8", "4 × 6"], "90 s"),
              it(["peso-morto-romeno", "peso-morto-romeno", "peso-morto"], ["3 × 10", "3 × 8", "3 × 6"], "90 s"),
              it("split-squat-bulgaro", ["2 × 8/perna", "3 × 8/perna", "3 × 8/perna"], "60 s"),
              it("gemeos-em-pe", ["2 × 12/perna", "3 × 12/perna", "3 × 15/perna"], "45 s")
            ]),
            B(5, 14, [
              it("remada-haltere", ["3 × 10/braço", "3 × 10/braço", "4 × 8/braço"], "45 s"),
              it(["flexoes", "flexoes", "landmine-press"], ["3 × 8", "3 × 12", "3 × 8/braço"], "45 s"),
              it(["dead-bug", "dead-bug", "rollout"], ["2 × 8/lado", "3 × 8/lado", "3 × 8"], "30 s"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "3 × 40 s/lado"], "30 s")
            ])
          ]
        },
        {
          foco: "Peso morto + ombro",
          blocos: [
            B(1, 8, [it("rotacao-toracica", "8/lado"), it("flexor-anca", "45 s/lado"), it("isquios-ativo", "8/perna"), it("cars-anca", "3/sentido")]),
            B(2, 8, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m", "2 × 20 m/perna"]),
              it("calcanhares-gluteos", "2 × 20 m"),
              it([null, "carioca", "carioca"], [null, "1 × 20 m/lado", "2 × 20 m/lado"]),
              it("progressivos", ["3 × 60 m", "4 × 60 m", "4 × 80 m"], "volta a andar")
            ]),
            B(3, 8, [
              it("pogo", ["2 × 10", "2 × 15", "2 × 20"], "45 s"),
              it("saltos-linha", ["2 × 5 s", "2 × 8 s", "3 × 8 s"], "45 s"),
              it("salto-comprimento", ["2 × 3", "3 × 3", "3 × 4"], "60 s")
            ]),
            B(4, 20, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 10", "4 × 6", "4 × 5"], ["90 s", "2 min", "2 min"]),
              it(["agachamento-goblet", "agachamento-goblet", "agachamento-frontal"], ["3 × 10", "3 × 10", "3 × 6"], "90 s"),
              it("hip-thrust", ["3 × 10", "3 × 10", "3 × 8"], "60 s"),
              it("gemeos-sentado", ["2 × 12", "3 × 12", "3 × 10"], "45 s")
            ]),
            B(5, 14, [
              it(["remada-elastico", "puxada-frente", "elevacoes"], ["3 × 12", "3 × 10", "4 × 6"], "60 s"),
              it("rotacao-externa-elastico", "2 × 15/braço"),
              it("ytw", "1 × 8 cada letra"),
              it("pallof", ["2 × 10/lado", "3 × 10/lado", "3 × 12/lado"], "30 s"),
              it(["bird-dog", "extensao-lombar-45", "extensao-lombar-45"], ["2 × 8/lado", "2 × 12", "3 × 12"], "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "prep-especifica", nome: "Preparatória específica (força máxima)", semanas: "6–8 semanas", semanasNum: 6,
      objetivo: "Força máxima com cargas altas e poucas repetições: melhora a economia de pedalada e de corrida sem ganho relevante de massa muscular, mantendo a saúde do ombro.",
      rpe: ["7", "7", "8"], contactos: [[50, 70], [70, 90], [90, 110]],
      nota: "Força pesada 2×/semana (3–5 repetições perto de 85% do máximo nos níveis avançado e elite). Afasta a sessão pelo menos 6 h dos treinos de qualidade de bicicleta, ou faz noutro dia. Se o volume de natação/ciclismo subir muito, mantém as cargas e tira uma série.",
      dias: [
        {
          foco: "Agachamento + reatividade",
          blocos: [
            B(1, 7, [it("worlds-greatest", "3/lado"), it("agachamento-profundo", "2 × 30 s"), it("tornozelo-parede", "10/lado")]),
            B(2, 8, [
              it("tornozelos", "2 × 15 m"),
              it("skipping-a", "2 × 20 m"),
              it(["calcanhares-gluteos", "skipping-b", "skipping-b"], "2 × 20 m"),
              it(["wall-drill-a", "perna-esticada", "perna-esticada"], ["2 × 5/perna", "2 × 20 m", "2 × 20 m"]),
              it([null, "wall-drill-a", "wall-drill-trocas"], [null, "2 × 5/perna", "3 × 3 trocas"])
            ]),
            B(3, 9, [
              it(["pogo", "pogo-frente", "pogo-frente"], ["2 × 20", "2 × 15 m", "2 × 20 m"], "45 s"),
              it(["salto-contramovimento", "salto-caixa", "salto-caixa"], ["3 × 4", "3 × 5", "4 × 5"], "90 s"),
              it([null, "saltos-unipodais", "saltos-unipodais"], [null, "2 × 4/perna", "2 × 6/perna"], "60 s")
            ]),
            B(4, 22, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["4 × 8", "4 × 5", "5 × 4"], ["90 s", "2–3 min", "3 min"]),
              it(["peso-morto-romeno", "peso-morto", "peso-morto"], ["3 × 8", "3 × 5", "4 × 4"], ["90 s", "2–3 min", "3 min"]),
              it(["split-squat-bulgaro", "split-squat-bulgaro", "split-squat-bulgaro-barra"], ["3 × 8/perna", "3 × 6/perna", "3 × 5/perna"], "90 s"),
              it(["gemeos-em-pe", "gemeos-sentado", "gemeos-sentado"], ["3 × 12/perna", "3 × 10", "4 × 8"], "60 s")
            ]),
            B(5, 14, [
              it(["remada-invertida", "elevacoes", "elevacoes"], ["3 × 10", "4 × 5", "5 × 5"], "90 s"),
              it("landmine-press", ["3 × 10/braço", "3 × 8/braço", "4 × 6/braço"], "60 s"),
              it("rotacao-externa-90", ["2 × 12/braço", "2 × 12/braço", "2 × 15/braço"]),
              it(["dead-bug", "rollout", "rollout"], ["3 × 8/lado", "3 × 8", "3 × 10"], "45 s")
            ])
          ]
        },
        {
          foco: "Peso morto + posição aero",
          blocos: [
            B(1, 7, [it("gato-camelo", "8"), it("sapo", "10"), it("rotacao-toracica", "6/lado"), it("tornozelo-parede", "8/lado")]),
            B(2, 8, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a-unilateral", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m/perna", "2 × 20 m/perna"]),
              it(["calcanhares-gluteos", "skipping-altura", "skipping-altura"], "2 × 20 m"),
              it("progressivos", ["3 × 60 m", "4 × 80 m", "5 × 100 m"], "volta a andar")
            ]),
            B(3, 9, [
              it("pogo-lateral", ["2 × 15", "2 × 20", "2 × 20"], "45 s"),
              it("saltos-patinador", ["2 × 5/lado", "3 × 5/lado", "3 × 6/lado"], "60 s"),
              it(["salto-comprimento", "salto-comprimento-unipodal", "triplo-salto"], ["3 × 3", "2 × 3/perna", "2 × 2/perna"], "90 s")
            ]),
            B(4, 22, [
              it("peso-morto-trap-bar", ["4 × 6", "4 × 5", "5 × 3"], ["2 min", "2–3 min", "3 min"]),
              it(["step-up", "agachamento-frontal", "agachamento-frontal"], ["3 × 8/perna", "3 × 6", "4 × 4"], "2 min"),
              it("peso-morto-unilateral", ["2 × 8/perna", "3 × 6/perna", "3 × 6/perna"], "60 s"),
              it("nordic", ["2 × 3", "2 × 5", "3 × 5"], "90 s")
            ]),
            B(5, 14, [
              it(["remada-cabo", "remada-haltere", "remada-invertida"], ["3 × 10", "3 × 8/braço", "4 × 8 (pés elevados)"], "60 s"),
              it(["flexoes", "supino-haltere", "supino-haltere"], ["3 × 10", "3 × 8", "4 × 6"], "60 s"),
              it("extensao-lombar-45", ["2 × 10", "3 × 12", "3 × 12 (disco ao peito)"], "45 s"),
              it("suitcase-carry", ["2 × 15 m/lado", "2 × 20 m/lado", "3 × 20 m/lado"], "45 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "pre-competitiva", nome: "Pré-competitiva (potência)", semanas: "4–6 semanas", semanasNum: 4,
      objetivo: "Converter a força em potência: menos volume, intenção máxima de velocidade em cada repetição, pliometria reativa moderada e força específica da braçada.",
      rpe: ["7", "7", "8"], contactos: [[45, 65], [60, 80], [75, 105]],
      nota: "Coincide com os blocos de treino específico de prova: se a semana de bicicleta/corrida for muito dura, faz só o Dia 1. Mantém uma carga pesada (3 repetições) para não perder a força máxima.",
      dias: [
        {
          foco: "Agachamento + potência",
          blocos: [
            B(1, 6, [it("balanco-pernas-frente", "10/perna"), it("balanco-pernas-lado", "10/perna"), it("worlds-greatest", "3/lado")]),
            B(2, 9, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-altura", "skipping-altura"], "2 × 20 m"),
              it("queda-frente", ["3 × 15 m", "3 × 15 m", "4 × 15 m"]),
              it(["progressivos", "wall-drill-trocas", "wall-drill-trocas"], ["3 × 60 m", "3 × 3 trocas", "4 × 3 trocas"])
            ]),
            B(3, 10, [
              it("pogo", ["2 × 12", "2 × 15", "2 × 20"], "45 s"),
              it(["salto-caixa", "drop-jump", "drop-jump"], ["3 × 4", "3 × 4", "4 × 4"], "2 min"),
              it(["saltos-unipodais", "saltos-barreiras", "saltos-barreiras"], ["2 × 4/perna", "4 × 5", "4 × 5"], "90 s")
            ]),
            B(4, 20, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["3 × 6 (subida rápida)", "3 × 3 (subida rápida)", "4 × 3 (subida rápida)"], "2 min"),
              it("salto-contramovimento", ["3 × 3 (logo a seguir)", "3 × 3 (logo a seguir)", "4 × 3 (logo a seguir)"], "2 min"),
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 6", "3 × 4", "4 × 3"], "2 min")
            ]),
            B(5, 12, [
              it("lancamento-medicinal-cima", ["3 × 6", "3 × 8", "4 × 8"], "60 s"),
              it("bracada-elastico-dupla", ["2 × 12", "3 × 12", "3 × 15"], "45 s"),
              it(["prancha-toques", "lancamento-rotacional", "lancamento-rotacional"], ["2 × 8/lado", "2 × 6/lado", "3 × 6/lado"], "45 s")
            ])
          ]
        },
        {
          foco: "Peso morto + potência",
          blocos: [
            B(1, 6, [it("gato-camelo", "8"), it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado")]),
            B(2, 9, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a-unilateral", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m/perna", "2 × 20 m/perna"]),
              it("pes-rapidos", ["2 × 6 s", "3 × 8 s", "4 × 8 s"], "45 s"),
              it("progressivos", ["3 × 80 m", "4 × 100 m", "5 × 100 m"], "volta a andar")
            ]),
            B(3, 10, [
              it("pogo-frente", ["1 × 15 m", "2 × 12 m", "2 × 15 m"], "45 s"),
              it(["saltos-patinador", "multisaltos", "multisaltos"], ["2 × 4/lado", "2 × 20 m", "2 × 20 m"], "90 s"),
              it(["salto-comprimento", "salto-comprimento-unipodal", "triplo-salto"], ["2 × 3", "2 × 2/perna", "2 × 2/perna"], "90 s")
            ]),
            B(4, 20, [
              it("peso-morto-trap-bar", ["3 × 5", "3 × 3 (subida rápida)", "4 × 3 (subida rápida)"], "2 min"),
              it("salto-agachamento", ["2 × 4", "3 × 4", "3 × 4"], "90 s"),
              it(["split-squat-bulgaro", "step-up-joelho", "step-up-joelho"], ["2 × 6/perna", "3 × 5/perna (subida explosiva)", "3 × 6/perna (subida explosiva)"], "60 s"),
              it("kettlebell-swing", ["2 × 12", "2 × 12", "2 × 15"], "60 s")
            ]),
            B(5, 12, [
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
      id: "competitiva", nome: "Competitiva (manutenção)", semanas: "Época de provas", semanasNum: 8,
      objetivo: "Manter a força e a reatividade com pouco volume (1–2 sessões por semana chegam para não perder força) e chegar fresco às provas.",
      rpe: ["6", "6", "7"], contactos: [[25, 45], [30, 55], [35, 65]],
      nota: "Semanas sem prova: Dia 1 + Dia 2. Semanas com prova: só o Dia 1. " + NOTA_PROVAS_TRI,
      dias: [
        {
          foco: "Manutenção principal",
          blocos: [
            B(1, 5, [it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado")]),
            B(2, 6, [it("tornozelos", "1 × 15 m"), it("skipping-a", "2 × 20 m"), it("progressivos", "3 × 80 m", "volta a andar")]),
            B(3, 6, [
              it("pogo", "2 × 15", "45 s"),
              it(["salto-contramovimento", "saltos-unipodais", "saltos-unipodais"], ["2 × 3", "2 × 4/perna", "2 × 6/perna"], "60 s")
            ]),
            B(4, 15, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["2 × 6", "3 × 4", "3 × 3"], "2 min"),
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["2 × 6", "2 × 4", "3 × 3"], "2 min")
            ]),
            B(5, 10, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["2 × 8/braço", "2 × 5", "3 × 5"], "90 s"),
              it("rotacao-externa-90", "2 × 12/braço"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "2 × 40 s/lado"])
            ])
          ]
        },
        {
          foco: "Leve (semanas sem prova)",
          blocos: [
            B(1, 6, [it("gato-camelo", "8"), it("flexor-anca", "45 s/lado"), it("rotacao-toracica", "6/lado")]),
            B(2, 6, [it("tornozelos", "1 × 15 m"), it("pes-rapidos", "3 × 6 s"), it("progressivos", "3 × 80 m", "volta a andar")]),
            B(3, 5, [
              it("pogo-lateral", "2 × 15", "45 s"),
              it(["salto-comprimento", "salto-comprimento", "salto-comprimento-unipodal"], ["2 × 3", "2 × 3", "2 × 3/perna"], "60 s")
            ]),
            B(4, 13, [
              it(["ponte-glutea", "hip-thrust", "hip-thrust"], ["2 × 12", "2 × 8", "3 × 6"], "60 s"),
              it(["agachamento-goblet", "peso-morto-unilateral", "peso-morto-unilateral"], ["2 × 8", "2 × 6/perna", "2 × 6/perna"], "60 s"),
              it("gemeos-em-pe", ["2 × 12/perna", "2 × 12/perna", "2 × 10/perna"], "45 s")
            ]),
            B(5, 10, [
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
      id: "afinacao", nome: "Afinação (taper para prova A)", semanas: "7–14 dias antes da prova A", semanasNum: 2,
      objetivo: "Manter a força e a frescura neuromuscular enquanto o volume total cai: pouca quantidade, intensidade alta, zero dor muscular.",
      rpe: ["5", "5", "6"], contactos: [[15, 35], [20, 35], [20, 40]],
      nota: "Dia 1 entre 10 e 7 dias antes da prova; Dia 2 entre 4 e 3 dias antes (ou não fazer, se te sentires pesado). Nada de exercícios novos nem cargas novas. Taper de 2 semanas para Ironman; 7–10 dias para sprint/olímpico.",
      dias: [
        {
          foco: "Última sessão de força",
          blocos: [
            B(1, 5, [it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado"), it("rotacao-toracica", "5/lado")]),
            B(2, 6, [it("tornozelos", "1 × 15 m"), it("skipping-a", "2 × 20 m"), it("progressivos", "3 × 80 m", "volta a andar")]),
            B(3, 5, [
              it("pogo", ["2 × 10", "2 × 10", "2 × 12"], "45 s"),
              it(["salto-contramovimento", "salto-contramovimento", "drop-jump"], ["2 × 3", "3 × 3", "3 × 3"], "90 s")
            ]),
            B(4, 14, [
              it(["agachamento-goblet", "imtp", "imtp"], ["2 × 5", "3 × 5 s (máximo)", "4 × 5 s (máximo)"], "2 min"),
              it(["peso-morto-romeno", "agachamento-barra", "agachamento-barra"], ["2 × 5", "2 × 3 (~85%)", "2 × 2 (~85–90%)"], "2–3 min"),
              it("gemeos-em-pe", ["2 × 8/perna", "2 × 8/perna", "2 × 8/perna"], "45 s")
            ]),
            B(5, 8, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["2 × 6/braço", "2 × 4", "2 × 4"], "90 s"),
              it("rotacao-externa-90", "2 × 10/braço"),
              it("prancha-lateral", "2 × 20 s/lado")
            ])
          ]
        },
        {
          foco: "Ativação pré-prova",
          blocos: [
            B(1, 5, [it("balanco-pernas-frente", "10/perna"), it("balanco-pernas-lado", "10/perna"), it("circulos-bracos", "1 × 10")]),
            B(2, 6, [it("tornozelos", "1 × 15 m"), it("skipping-a", "1 × 20 m"), it("pes-rapidos", "2 × 6 s"), it("progressivos", ["3 × 60 m", "3 × 80 m", "3 × 80 m"], "volta a andar")]),
            B(3, 4, [
              it("pogo", "2 × 8", "45 s"),
              it("salto-contramovimento", ["2 × 2", "2 × 3", "2 × 3"], "60 s")
            ]),
            B(4, 8, [
              it(["ponte-glutea", "hip-thrust", "hip-thrust"], ["2 × 8", "2 × 5 (rápido)", "2 × 5 (rápido)"], "60 s"),
              it("soleo-isometrico-parede", "2 × 30 s", "45 s")
            ]),
            B(5, 5, [it("band-pull-apart", "1 × 15"), it("rotacao-externa-elastico", "1 × 12/braço"), it("dead-bug", "2 × 6/lado")])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "transicao", nome: "Transição", semanas: "2–4 semanas", semanasNum: 3,
      objetivo: "Recuperar depois da época ou de uma paragem: corrigir desequilíbrios, mobilidade, saúde do ombro e força leve.",
      rpe: ["4", "5", "5"], contactos: [[15, 40], [20, 45], [25, 50]],
      nota: "Sem falhas nem dor muscular forte. Bom momento para avaliar: elevações de gémeos a uma perna, agachamento a uma perna, rotação externa do ombro e prancha lateral.",
      dias: [
        {
          foco: "Mobilidade e controlo",
          blocos: [
            B(1, 10, [it("gato-camelo", "8"), it("rotacao-toracica", "8/lado"), it("flexor-anca", "45 s/lado"), it("anca-90-90", "5/lado"), it("tornozelo-parede", "10/lado")]),
            B(2, 7, [it("marcha-joelhos", "2 × 20 m"), it("tornozelos", "2 × 15 m"), it("bracos-sentado", "2 × 20 s")]),
            B(3, 5, [it("saltar-corda", "3 × 30 s", "30 s"), it("pogo", ["2 × 10", "2 × 12", "2 × 15"], "60 s")]),
            B(4, 15, [
              it("agachamento-goblet", ["3 × 10 leve", "3 × 10 leve", "3 × 10"], "60 s"),
              it("peso-morto-romeno", ["3 × 10 leve", "3 × 10 leve", "3 × 10"], "60 s"),
              it("ponte-glutea", "2 × 15")
            ]),
            B(5, 10, [it("remada-elastico", "3 × 12", "30 s"), it("flexao-serratil", "2 × 10"), it("bird-dog", "2 × 8/lado"), it("prancha-frontal", "2 × 30 s")])
          ]
        },
        {
          foco: "Força leve e equilíbrio",
          blocos: [
            B(1, 10, [it("cars-anca", "3/sentido"), it("worlds-greatest", "3/lado"), it("figura-4", "30 s/lado"), it("alongamento-gemeos", "30 s/perna"), it("bastao-ombros", "10")]),
            B(2, 7, [it("tornozelos", "2 × 15 m"), it("skipping-a", "2 × 20 m"), it("calcanhares-gluteos", "2 × 20 m")]),
            B(3, 5, [it("pogo", "2 × 10", "60 s"), it("saltos-linha", ["2 × 4 s", "2 × 5 s", "2 × 6 s"], "60 s")]),
            B(4, 15, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 8 leve", "3 × 8 leve", "3 × 8"], "90 s"),
              it("step-up", "2 × 10/perna", "45 s"),
              it("equilibrio-unipodal", "2 × 30 s/perna")
            ]),
            B(5, 10, [it("remada-invertida", ["2 × 8", "3 × 10", "3 × 10"], "45 s"), it("ytw", "1 × 8 cada letra"), it("pallof", "2 × 10/lado", "30 s")])
          ]
        }
      ]
    }
  ];

  // =====================================================================
  // CORRIDA — mais pliometria e técnica (progressão de dribles → wickets → velocidade),
  // capacidade gémeos–sóleo–Aquiles, isquiotibiais e anca, força unilateral; menos membros superiores.
  // =====================================================================
  const FASES_COR = [
    {
      id: "cor-prep-geral", nome: "Preparatória geral (adaptação)", semanas: "6–8 semanas", semanasNum: 6,
      objetivo: "Preparar tendões (Aquiles, rotuliano) e músculos para a carga, aprender a técnica de corrida e a aterragem, e construir força base com ênfase unilateral.",
      rpe: ["6", "6", "7"], contactos: [[60, 80], [80, 110], [100, 130]],
      nota: "Faz a força no dia das séries (depois delas) ou num dia fácil, com 48 h até ao próximo treino de qualidade. Tendão sensível: dor até 3/10 durante e sem piorar na manhã seguinte = podes continuar (modelo de Silbernagel).",
      dias: [
        {
          foco: "Agachamento + gémeos",
          blocos: [
            B(1, 7, [it("tornozelo-parede", "10/lado"), it("worlds-greatest", "3/lado"), it("anca-90-90", "5/lado"), it("balanco-pernas-frente", "10/perna")]),
            B(2, 9, [
              it(["marcha-joelhos", "tornozelos", "tornozelos"], ["2 × 20 m", "2 × 15 m", "2 × 15 m"]),
              it(["wall-drill-a", "dribles", "dribles"], ["2 × 6/perna", "2 × 20 m (altura do tornozelo)", "2 × 20 m (meio da canela)"]),
              it("skipping-a", "2 × 20 m"),
              it(["tornozelos", "skipping-b", "skipping-b"], ["2 × 15 m", "2 × 20 m", "2 × 20 m"]),
              it("progressivos", ["3 × 60 m", "4 × 80 m", "4 × 80 m"], "volta a andar")
            ]),
            B(3, 9, [
              it(["snap-down", "pogo", "pogo"], ["2 × 5", "3 × 15", "3 × 20"], "45 s"),
              it(["pogo", "pogo-lateral", "pogo-lateral"], ["2 × 15", "2 × 15", "2 × 15"], "45 s"),
              it(["saltos-linha", "saltos-unipodais", "saltos-unipodais"], ["2 × 6 s", "2 × 5/perna", "2 × 6/perna"], "60 s"),
              it("salto-contramovimento", ["2 × 4", "3 × 4", "3 × 4"], "60 s")
            ]),
            B(4, 22, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["3 × 10", "4 × 6", "4 × 5"], ["90 s", "2 min", "2–3 min"]),
              it(["split-squat-bulgaro", "split-squat-bulgaro", "split-squat-bulgaro-barra"], ["2 × 8/perna", "3 × 8/perna", "3 × 6/perna"], "60–90 s"),
              it(["gemeos-em-pe", "gemeos-pesado", "gemeos-pesado"], ["3 × 12/perna", "3 × 8 (3 s sobe, 3 s desce)", "4 × 6 (3 s sobe, 3 s desce)"], "60 s"),
              it("soleo-isometrico-parede", ["3 × 30 s", "3 × 45 s", "4 × 45 s (haltere nas coxas)"], "45 s")
            ]),
            B(5, 10, [
              it(["remada-haltere", "remada-haltere", "elevacoes"], ["2 × 10/braço", "3 × 8/braço", "3 × 6"], "45 s"),
              it("copenhagen", ["2 × 15 s/lado (joelho apoiado)", "2 × 20 s/lado", "3 × 25 s/lado"], "30 s"),
              it(["dead-bug", "pallof", "pallof"], ["2 × 8/lado", "2 × 10/lado", "3 × 10/lado"], "30 s")
            ])
          ]
        },
        {
          foco: "Peso morto + isquiotibiais",
          blocos: [
            B(1, 7, [it("flexor-anca", "45 s/lado"), it("isquios-ativo", "8/perna"), it("cars-anca", "3/sentido"), it("tornozelo-parede", "8/lado")]),
            B(2, 9, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m", "2 × 20 m/perna"]),
              it(["calcanhares-gluteos", "perna-esticada", "perna-esticada"], "2 × 20 m"),
              it(["bracos-sentado", "queda-frente", "queda-frente"], ["2 × 20 s", "3 × 15 m", "3 × 15 m"]),
              it("progressivos", ["3 × 60 m", "3 × 80 m", "4 × 100 m"], "volta a andar")
            ]),
            B(3, 9, [
              it(["pogo", "pogo-frente", "pogo-frente"], ["2 × 15", "2 × 15 m", "2 × 20 m"], "45 s"),
              it("salto-comprimento", ["3 × 3", "3 × 3", "3 × 4"], "60 s"),
              it("saltos-patinador", ["2 × 4/lado", "3 × 5/lado", "3 × 5/lado"], "60 s"),
              it(["pogo-lateral", "saltos-unipodais", "saltos-unipodais"], ["2 × 10", "2 × 6/perna", "2 × 6/perna"], "60 s")
            ]),
            B(4, 22, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 10", "4 × 6", "4 × 5"], ["90 s", "2 min", "2–3 min"]),
              it("peso-morto-unilateral", ["2 × 8/perna", "2 × 8/perna", "3 × 6/perna"], "60 s"),
              it(["ponte-isquios", "nordic", "nordic"], ["2 × 20 s/perna", "2 × 4", "3 × 5"], "90 s"),
              it("gemeos-sentado", ["2 × 12", "3 × 12", "3 × 10"], "45 s")
            ]),
            B(5, 10, [
              it(["remada-elastico", "remada-invertida", "remada-invertida"], ["2 × 12", "3 × 10", "3 × 10 (pés elevados)"], "45 s"),
              it(["marcha-psoas", "flexao-anca-elastico", "flexao-anca-elastico"], ["2 × 8/perna", "2 × 10/perna", "3 × 10/perna"], "30 s"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "3 × 30 s/lado"], "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "cor-prep-especifica", nome: "Preparatória específica (força máxima)", semanas: "6–8 semanas", semanasNum: 6,
      objetivo: "Força máxima e rigidez reativa: cargas altas e poucas repetições, pliometria unilateral e técnica a velocidade mais alta. É a fase com mais impacto na economia de corrida.",
      rpe: ["7", "7", "8"], contactos: [[65, 85], [95, 120], [115, 140]],
      nota: "Pliometria em relva, pista ou piso de borracha — nunca em cimento. Nas semanas de volume máximo de corrida mantém a carga e tira uma série. Os contactos sobem ~10% por semana dentro da fase.",
      dias: [
        {
          foco: "Agachamento + reatividade",
          blocos: [
            B(1, 6, [it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado"), it("balanco-pernas-lado", "10/perna")]),
            B(2, 9, [
              it("tornozelos", "2 × 15 m"),
              it("dribles", ["2 × 20 m (altura do tornozelo)", "2 × 20 m (meio da canela)", "2 × 20 m (abaixo do joelho)"]),
              it(["skipping-a", "skipping-b", "skipping-b"], "2 × 20 m"),
              it(["skipping-b", "wickets", "wickets"], ["2 × 20 m", "3 × 1 (6–8 barreiras)", "4 × 1 (8–10 barreiras)"], "volta a andar"),
              it("progressivos", ["3 × 80 m", "3 × 80 m", "4 × 100 m"], "volta a andar")
            ]),
            B(3, 10, [
              it("pogo", ["2 × 15", "2 × 20", "2 × 20"], "45 s"),
              it(["salto-caixa", "salto-caixa", "drop-jump"], ["3 × 4", "3 × 5", "3 × 5 (caixa 30 cm)"], "90 s"),
              it("saltos-unipodais", ["2 × 6/perna", "3 × 6/perna", "3 × 8/perna"], "60 s"),
              it(["salto-contramovimento", "saltos-barreiras", "saltos-barreiras"], ["2 × 4", "3 × 5", "4 × 5"], "90 s")
            ]),
            B(4, 23, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["4 × 8", "4 × 4", "5 × 3"], ["90 s", "2–3 min", "3 min"]),
              it(["split-squat-bulgaro", "split-squat-bulgaro-barra", "split-squat-bulgaro-barra"], ["3 × 8/perna", "3 × 6/perna", "3 × 5/perna"], "90 s"),
              it(["gemeos-em-pe", "gemeos-pesado", "gemeos-pesado"], ["3 × 12/perna (haltere)", "4 × 6", "4 × 5"], "90 s"),
              it(["soleo-isometrico-parede", "isometria-gemeos", "isometria-gemeos"], ["3 × 45 s", "4 × 30 s", "5 × 30 s"], "60 s")
            ]),
            B(5, 9, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["3 × 8/braço", "3 × 5", "4 × 5"], "90 s"),
              it(["copenhagen", "copenhagen-dinamico", "copenhagen-dinamico"], ["2 × 20 s/lado", "2 × 6/lado", "3 × 8/lado"], "30 s"),
              it(["pallof", "landmine-rotacao", "landmine-rotacao"], ["2 × 10/lado", "2 × 8/lado", "3 × 8/lado"], "30 s")
            ])
          ]
        },
        {
          foco: "Peso morto + isquiotibiais",
          blocos: [
            B(1, 6, [it("gato-camelo", "8"), it("flexor-anca", "45 s/lado"), it("isquios-ativo", "8/perna")]),
            B(2, 9, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a-unilateral", "skipping-a-unilateral", "skipping-altura"], ["2 × 20 m/perna", "2 × 20 m/perna", "3 × 20 m"]),
              it("perna-esticada", "2 × 20 m"),
              it(["queda-frente", "wall-drill-trocas", "wall-drill-trocas"], ["3 × 15 m", "3 × 3 trocas", "4 × 3 trocas"], "45 s"),
              it("progressivos", ["3 × 80 m", "4 × 100 m", "5 × 100 m"], "volta a andar")
            ]),
            B(3, 10, [
              it("pogo-frente", ["2 × 15 m", "2 × 15 m", "2 × 20 m"], "45 s"),
              it(["saltos-patinador", "multisaltos", "multisaltos"], ["2 × 4/lado", "3 × 20 m", "3 × 25 m"], "90 s"),
              it(["salto-comprimento", "salto-comprimento-unipodal", "triplo-salto"], ["3 × 3", "3 × 4/perna", "3 × 2/perna"], "90 s")
            ]),
            B(4, 23, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto"], ["4 × 8", "4 × 5", "4 × 3"], ["90 s", "2–3 min", "3 min"]),
              it("step-up-joelho", ["3 × 8/perna", "3 × 6/perna (haltere)", "3 × 6/perna (haltere pesado)"], "60–90 s"),
              it(["ponte-isquios", "nordic", "nordic"], ["3 × 20 s/perna", "3 × 4", "3 × 5"], "90 s"),
              it("peso-morto-unilateral", ["2 × 8/perna", "3 × 6/perna", "3 × 6/perna"], "60 s")
            ]),
            B(5, 9, [
              it(["remada-elastico", "remada-invertida", "remada-invertida"], ["3 × 12", "3 × 10", "3 × 10 (pés elevados)"], "45 s"),
              it(["marcha-psoas", "flexao-anca-elastico", "flexao-anca-elastico"], ["2 × 10/perna", "3 × 8/perna", "3 × 10/perna"], "30 s"),
              it(["prancha-lateral", "prancha-lateral-perna", "prancha-lateral-perna"], ["2 × 30 s/lado", "2 × 10/lado", "3 × 10/lado"], "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "cor-pre-competitiva", nome: "Pré-competitiva (potência e reatividade)", semanas: "4–6 semanas", semanasNum: 4,
      objetivo: "Converter a força em potência específica: menos volume, intenção máxima de velocidade, pliometria reativa de contacto curto e técnica à velocidade de prova.",
      rpe: ["7", "7", "8"], contactos: [[60, 80], [80, 105], [95, 125]],
      nota: "Menos contactos do que na fase anterior, mas mais intensos (drop jumps, barreiras, multisaltos). Alternativa ao Dia 2 numa semana sem ginásio: sessão \"Multisaltos em subida\". Mantém 48 h entre a pliometria e as séries mais rápidas.",
      dias: [
        {
          foco: "Agachamento + reatividade",
          blocos: [
            B(1, 6, [it("balanco-pernas-frente", "10/perna"), it("balanco-pernas-lado", "10/perna"), it("tornozelo-parede", "8/lado")]),
            B(2, 10, [
              it("tornozelos", "2 × 15 m"),
              it("dribles", ["2 × 20 m (meio da canela)", "2 × 20 m (abaixo do joelho)", "2 × 20 m (abaixo do joelho)"]),
              it(["skipping-b", "wickets", "wickets"], ["2 × 20 m", "4 × 1 (8 barreiras)", "5 × 1 (10 barreiras)"], "volta a andar"),
              it("queda-frente", ["3 × 15 m", "3 × 20 m", "4 × 20 m"]),
              it("progressivos", ["3 × 80 m", "4 × 100 m", "4 × 100 m"], "volta a andar")
            ]),
            B(3, 10, [
              it("pogo", ["2 × 15", "2 × 15", "2 × 20"], "45 s"),
              it(["salto-caixa", "drop-jump", "drop-jump"], ["3 × 4", "3 × 5", "4 × 5 (caixa 30–40 cm)"], "2 min"),
              it(["saltos-unipodais", "saltos-barreiras", "saltos-barreiras"], ["2 × 6/perna", "4 × 5", "4 × 6"], "90 s"),
              it([null, "saltos-unipodais", "saltos-unipodais"], [null, "2 × 6/perna", "2 × 6/perna"], "60 s")
            ]),
            B(4, 20, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["3 × 6 (subida rápida)", "3 × 3 (subida rápida)", "4 × 3 (subida rápida)"], "2 min"),
              it("salto-contramovimento", ["3 × 3 (logo a seguir)", "3 × 3 (logo a seguir)", "4 × 3 (logo a seguir)"], "2 min"),
              it(["gemeos-em-pe", "gemeos-pesado", "gemeos-pesado"], ["3 × 10/perna (haltere, subida rápida)", "3 × 6 (descida 3 s, subida rápida)", "4 × 5 (descida 3 s, subida rápida)"], "60 s")
            ]),
            B(5, 8, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["2 × 8/braço", "2 × 5", "3 × 5"], "90 s"),
              it(["copenhagen", "copenhagen-dinamico", "copenhagen-dinamico"], ["2 × 20 s/lado", "2 × 6/lado", "2 × 8/lado"], "30 s"),
              it(["dead-bug", "pallof-isometrico", "landmine-rotacao"], ["2 × 8/lado", "2 × 20 s/lado", "2 × 8/lado"], "30 s")
            ])
          ]
        },
        {
          foco: "Peso morto + potência horizontal",
          blocos: [
            B(1, 6, [it("gato-camelo", "8"), it("worlds-greatest", "3/lado"), it("flexor-anca", "30 s/lado")]),
            B(2, 10, [
              it("tornozelos", "2 × 15 m"),
              it(["skipping-a", "skipping-a-unilateral", "skipping-a-unilateral"], ["2 × 20 m", "2 × 20 m/perna", "2 × 20 m/perna"]),
              it(["perna-esticada", "skipping-altura", "skipping-altura"], "2 × 20 m"),
              it("pes-rapidos", ["2 × 6 s", "3 × 8 s", "4 × 8 s"], "45 s"),
              it("progressivos", ["3 × 80 m", "4 × 100 m", "5 × 100 m"], "volta a andar")
            ]),
            B(3, 10, [
              it("pogo-lateral", ["2 × 15", "2 × 15", "2 × 20"], "45 s"),
              it(["saltos-patinador", "multisaltos", "multisaltos"], ["2 × 6/lado", "2 × 25 m", "3 × 25 m"], "2 min"),
              it(["salto-comprimento", "triplo-salto", "triplo-salto"], ["2 × 4", "2 × 2/perna", "2 × 2/perna"], "90 s")
            ]),
            B(4, 20, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 6", "3 × 3 (subida rápida)", "4 × 3 (subida rápida)"], "2 min"),
              it(["kettlebell-swing", "salto-trap-bar", "salto-trap-bar"], ["3 × 10", "3 × 4 (20–30% do peso morto)", "4 × 4 (20–30% do peso morto)"], "90 s"),
              it(["split-squat-bulgaro", "step-up-joelho", "step-up-joelho"], ["2 × 6/perna", "3 × 5/perna (subida explosiva)", "3 × 5/perna (haltere, subida explosiva)"], "60 s"),
              it(["ponte-isquios", "nordic", "nordic"], ["2 × 20 s/perna", "2 × 4", "2 × 5"], "90 s")
            ]),
            B(5, 8, [
              it(["remada-elastico", "remada-invertida", "remada-invertida"], ["2 × 12", "2 × 10", "3 × 10"], "45 s"),
              it(["marcha-psoas", "flexao-anca-elastico", "flexao-anca-elastico"], ["2 × 8/perna", "2 × 8/perna (rápido)", "3 × 8/perna (rápido)"], "30 s"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "2 × 40 s/lado"])
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "cor-competitiva", nome: "Competitiva (manutenção)", semanas: "Época de provas", semanasNum: 8,
      objetivo: "Manter a força, a rigidez do tendão e a técnica com pouco volume para chegar fresco às provas.",
      rpe: ["6", "6", "7"], contactos: [[25, 50], [35, 60], [40, 70]],
      nota: "Semanas sem prova: Dia 1 + Dia 2. Semanas com prova: só o Dia 1. " + NOTA_PROVAS_COR,
      dias: [
        {
          foco: "Manutenção principal",
          blocos: [
            B(1, 5, [it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado")]),
            B(2, 7, [
              it("tornozelos", "1 × 15 m"),
              it(["skipping-a", "dribles", "dribles"], "2 × 20 m"),
              it(["skipping-b", "wickets", "wickets"], ["1 × 20 m", "2 × 1 (8 barreiras)", "3 × 1 (10 barreiras)"], "volta a andar"),
              it("progressivos", ["3 × 80 m", "3 × 80 m", "4 × 100 m"], "volta a andar")
            ]),
            B(3, 7, [
              it("pogo", ["2 × 10", "2 × 15", "2 × 15"], "45 s"),
              it(["salto-contramovimento", "saltos-unipodais", "drop-jump"], ["3 × 4", "3 × 4/perna", "3 × 4"], "90 s"),
              it([null, null, "saltos-unipodais"], [null, null, "2 × 5/perna"], "60 s")
            ]),
            B(4, 15, [
              it(["agachamento-goblet", "agachamento-barra", "agachamento-barra"], ["2 × 6", "3 × 3", "3 × 3"], "2–3 min"),
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["2 × 6", "2 × 3", "3 × 3"], "2–3 min"),
              it(["gemeos-em-pe", "gemeos-pesado", "gemeos-pesado"], ["2 × 10/perna", "2 × 6", "3 × 5"], "60 s")
            ]),
            B(5, 8, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["2 × 8/braço", "2 × 5", "2 × 5"], "90 s"),
              it("copenhagen", ["2 × 15 s/lado", "2 × 20 s/lado", "2 × 25 s/lado"], "30 s"),
              it("prancha-lateral", ["2 × 20 s/lado", "2 × 30 s/lado", "2 × 30 s/lado"])
            ])
          ]
        },
        {
          foco: "Leve (semanas sem prova)",
          blocos: [
            B(1, 6, [it("gato-camelo", "8"), it("flexor-anca", "45 s/lado"), it("anca-90-90", "5/lado")]),
            B(2, 6, [it("tornozelos", "1 × 15 m"), it("pes-rapidos", ["2 × 6 s", "3 × 6 s", "3 × 6 s"], "45 s"), it("progressivos", "3 × 80 m", "volta a andar")]),
            B(3, 5, [
              it("pogo-lateral", ["2 × 12", "2 × 15", "2 × 15"], "45 s"),
              it(["salto-comprimento", "salto-comprimento-unipodal", "salto-comprimento-unipodal"], ["2 × 4", "2 × 3/perna", "2 × 4/perna"], "60 s")
            ]),
            B(4, 13, [
              it(["ponte-glutea", "hip-thrust", "hip-thrust"], ["2 × 12", "2 × 8", "3 × 6"], "60 s"),
              it("peso-morto-unilateral", ["2 × 8/perna", "2 × 6/perna", "2 × 6/perna"], "60 s"),
              it("soleo-isometrico-parede", ["2 × 30 s", "2 × 45 s", "3 × 45 s"], "45 s")
            ]),
            B(5, 8, [
              it("band-pull-apart", "2 × 15"),
              it(["dead-bug", "pallof", "pallof"], ["2 × 8/lado", "2 × 10/lado", "2 × 12/lado"], "30 s"),
              it(["marcha-psoas", "flexao-anca-elastico", "flexao-anca-elastico"], "2 × 8/perna", "30 s")
            ])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "cor-afinacao", nome: "Afinação (taper para prova A)", semanas: "7–14 dias antes da prova A", semanasNum: 2,
      objetivo: "Manter a força e a rigidez do tendão enquanto o volume de corrida cai: pouca quantidade, intensidade alta, zero dor muscular.",
      rpe: ["5", "5", "6"], contactos: [[15, 35], [20, 40], [20, 45]],
      nota: "Dia 1 entre 10 e 7 dias antes da prova; Dia 2 entre 4 e 2 dias antes (ou não fazer, se te sentires pesado). Nada de exercícios novos nem cargas novas. Maratona: taper de 2 semanas; 10 km/meia: 7–10 dias.",
      dias: [
        {
          foco: "Última sessão de força",
          blocos: [
            B(1, 5, [it("worlds-greatest", "3/lado"), it("tornozelo-parede", "8/lado"), it("balanco-pernas-frente", "10/perna")]),
            B(2, 7, [
              it("tornozelos", "1 × 15 m"),
              it(["skipping-a", "dribles", "dribles"], "2 × 20 m"),
              it([null, "wickets", "wickets"], [null, "2 × 1 (8 barreiras)", "2 × 1 (10 barreiras)"], "volta a andar"),
              it("progressivos", "3 × 80 m", "volta a andar")
            ]),
            B(3, 6, [
              it("pogo", ["2 × 10", "2 × 12", "2 × 15"], "45 s"),
              it(["salto-contramovimento", "drop-jump", "drop-jump"], ["3 × 3", "3 × 3", "3 × 4"], "90 s")
            ]),
            B(4, 14, [
              it(["agachamento-goblet", "imtp", "imtp"], ["2 × 5", "3 × 5 s (máximo)", "4 × 5 s (máximo)"], "2 min"),
              it(["peso-morto-romeno", "agachamento-barra", "agachamento-barra"], ["2 × 5", "2 × 3 (~85%)", "2 × 2 (~85–90%)"], "2–3 min"),
              it(["gemeos-em-pe", "isometria-gemeos", "isometria-gemeos"], ["2 × 8/perna", "3 × 20 s", "3 × 20 s"], "60 s")
            ]),
            B(5, 6, [
              it(["remada-haltere", "elevacoes", "elevacoes"], ["2 × 6/braço", "2 × 4", "2 × 4"], "90 s"),
              it("prancha-lateral", "2 × 20 s/lado")
            ])
          ]
        },
        {
          foco: "Ativação pré-prova",
          blocos: [
            B(1, 5, [it("balanco-pernas-frente", "10/perna"), it("balanco-pernas-lado", "10/perna"), it("cars-anca", "2/sentido")]),
            B(2, 6, [it("tornozelos", "1 × 15 m"), it("skipping-a", "1 × 20 m"), it("pes-rapidos", "2 × 6 s"), it("progressivos", ["3 × 60 m", "3 × 80 m", "4 × 80 m"], "volta a andar")]),
            B(3, 4, [
              it("pogo", ["2 × 8", "2 × 10", "2 × 10"], "45 s"),
              it("salto-contramovimento", ["2 × 2", "2 × 3", "2 × 3"], "60 s")
            ]),
            B(4, 8, [
              it(["ponte-glutea", "hip-thrust", "hip-thrust"], ["2 × 8", "2 × 5 (rápido)", "2 × 5 (rápido)"], "60 s"),
              it("soleo-isometrico-parede", "2 × 30 s", "45 s")
            ]),
            B(5, 5, [it("dead-bug", "2 × 6/lado"), it("band-pull-apart", "1 × 15")])
          ]
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "cor-transicao", nome: "Transição", semanas: "2–4 semanas", semanasNum: 3,
      objetivo: "Recuperar da época: tendões em carga baixa, corrigir assimetrias, pés e tornozelos, mobilidade e força leve.",
      rpe: ["4", "5", "5"], contactos: [[20, 40], [20, 50], [25, 60]],
      nota: "Sem falhas nem dor muscular forte. Bom momento para avaliar: elevações de gémeos a uma perna (objetivo: 25+), agachamento a uma perna, ponte de isquiotibiais e salto a uma perna (diferença entre pernas < 10%).",
      dias: [
        {
          foco: "Mobilidade e tendões",
          blocos: [
            B(1, 10, [it("gato-camelo", "8"), it("rotacao-toracica", "6/lado"), it("flexor-anca", "45 s/lado"), it("anca-90-90", "5/lado"), it("tornozelo-parede", "10/lado")]),
            B(2, 6, [it("marcha-joelhos", "2 × 20 m"), it("tornozelos", "2 × 15 m"), it("bracos-sentado", "2 × 20 s")]),
            B(3, 5, [it("saltar-corda", "3 × 30 s", "30 s"), it("pogo", ["2 × 10", "2 × 12", "2 × 15"], "60 s")]),
            B(4, 15, [
              it("agachamento-goblet", ["3 × 10 leve", "3 × 10 leve", "3 × 10"], "60 s"),
              it("soleo-isometrico-parede", ["3 × 30 s", "3 × 45 s", "3 × 45 s"], "45 s"),
              it("gemeos-em-pe", "2 × 15/perna", "45 s"),
              it("tibial-raise", "2 × 15", "30 s")
            ]),
            B(5, 10, [it("remada-elastico", "3 × 12", "30 s"), it("bird-dog", "2 × 8/lado"), it("prancha-frontal", "2 × 30 s"), it("short-foot", "2 × 10 × 5 s")])
          ]
        },
        {
          foco: "Força leve e equilíbrio",
          blocos: [
            B(1, 10, [it("cars-anca", "3/sentido"), it("worlds-greatest", "3/lado"), it("figura-4", "30 s/lado"), it("alongamento-soleo", "30 s/perna"), it("isquios-ativo", "8/perna")]),
            B(2, 6, [it("tornozelos", "2 × 15 m"), it("skipping-a", "2 × 20 m"), it("calcanhares-gluteos", "2 × 20 m")]),
            B(3, 5, [it("pogo", ["2 × 8", "2 × 10", "2 × 12"], "60 s"), it("saltos-linha", ["2 × 4 s", "2 × 6 s", "2 × 6 s"], "60 s")]),
            B(4, 15, [
              it(["peso-morto-romeno", "peso-morto-trap-bar", "peso-morto-trap-bar"], ["3 × 8 leve", "3 × 8 leve", "3 × 8"], "90 s"),
              it("step-up", "2 × 10/perna", "45 s"),
              it("equilibrio-unipodal", "2 × 30 s/perna"),
              it("ponte-isquios", ["2 × 15 s/perna", "2 × 20 s/perna", "2 × 20 s/perna"], "45 s")
            ]),
            B(5, 10, [
              it("remada-invertida", ["2 × 8", "3 × 10", "3 × 10"], "45 s"),
              it("copenhagen", ["2 × 15 s/lado (joelho apoiado)", "2 × 15 s/lado", "2 × 20 s/lado"], "30 s"),
              it("pallof", "2 × 10/lado", "30 s")
            ])
          ]
        }
      ]
    }
  ];

  // Gera as sessões: uma por modalidade × fase × nível × dia.
  function gerar(fases, modalidade) {
    const cor = modalidade === "corrida";
    const geradas = [];
    fases.forEach((f) => {
      f.modalidade = modalidade;
      f.sessoes = {};
      NIVEIS.forEach((nv, n) => {
        f.sessoes[nv.id] = f.dias.map((d, di) => {
          const blocos = paraNivel(d.blocos, n);
          const id = `${f.id}-${nv.id}-dia${di + 1}`;
          const contactos = contactosSessao(blocos);
          const alvo = f.contactos ? f.contactos[n] : null;
          const notaContactos = `Pliometria: ~${contactos} contactos nesta sessão` + (alvo ? ` (alvo da fase para o teu nível: ${alvo[0]}–${alvo[1]}).` : ".");
          geradas.push({
            id,
            nome: `${cor ? "Corrida" : "Triatlo"} · ${f.nome} · ${nv.nome} · Dia ${di + 1}`,
            fase: cor ? `Corrida · ${f.nome}` : f.nome,
            modalidade,
            nivel: nv.id,
            faseId: f.id,
            dia: di + 1,
            foco: d.foco,
            local: f.id.endsWith("transicao") ? "Ginásio ou casa" : (cor ? "Ginásio + 30–40 m de pista, relva ou corredor" : "Ginásio"),
            duracao: d.blocos.reduce((t, b) => t + b.min, 0),
            frequencia: `Dia ${di + 1} de 2 por semana · foco: ${d.foco.toLowerCase()}`,
            rpe: f.rpe[n],
            objetivo: f.objetivo,
            nota: [nv.descricao, f.nota, notaContactos].filter(Boolean).join(" "),
            contactos,
            blocos,
            completa: true
          });
          return id;
        });
      });
    });
    return geradas;
  }

  const GUIA = {
    triatlo: {
      titulo: "Como encadear as fases (triatlo)",
      resumo: "2 sessões de força por semana fora da época de provas e 1–2 durante a época. Com 3 desportos, a força entra como complemento: nunca na véspera do treino longo de bicicleta ou da série chave de corrida, e o volume de pliometria fica abaixo do de um corredor.",
      sequencia: [
        "Outono/inverno: Transição (2–4 sem.) → Preparatória geral (6–10 sem.) → Preparatória específica (6–8 sem.).",
        "4–6 semanas antes da primeira prova importante: Pré-competitiva (potência).",
        "Época de provas: Competitiva (manutenção). Se houver um intervalo de 8+ semanas sem provas A/B, volta 3–4 semanas à Preparatória específica.",
        "Antes de cada prova A: Afinação (1–2 semanas). Depois da última prova da época: Transição."
      ],
      provas: {
        A: "Prova principal (1–3 por época): Afinação completa (Dia 1 a 7–10 dias, Dia 2 a 3–4 dias). Depois de um Ironman: 1–2 semanas de Transição antes de voltar à Competitiva.",
        B: "Prova importante mas não decisiva: na semana da prova só o Dia 1 da Competitiva, com uma série a menos, 4–5 dias antes.",
        C: "Prova de treino: treina normalmente, sem força nas 48 h antes."
      },
      descarga: "A cada 4.ª semana (3:1) faz uma série a menos em cada exercício e não vás perto da falha. Faz coincidir a descarga com a semana mais leve de natação/ciclismo/corrida."
    },
    corrida: {
      titulo: "Como encadear as fases (corrida)",
      resumo: "2 sessões de força e pliometria por semana durante quase todo o ano; 1–2 na época de provas. A força pesada e a pliometria são as ferramentas com mais impacto na economia de corrida, e a capacidade dos gémeos, do sóleo e dos isquiotibiais é a melhor prevenção de lesões.",
      sequencia: [
        "Base (inverno ou depois da última prova): Transição (2–4 sem.) → Preparatória geral (6–8 sem.) → Preparatória específica (6–8 sem.).",
        "4–6 semanas antes da prova A: Pré-competitiva (potência e reatividade), em paralelo com o treino específico de ritmo.",
        "Época de provas: Competitiva (manutenção). Maratona: as últimas 6–8 semanas antes do taper são de manutenção, para não somar fadiga às tiradas longas.",
        "Antes de cada prova A: Afinação (1–2 semanas). Depois da prova A: 1–2 semanas de Transição e regresso à Preparatória específica se houver outra prova A daqui a 12+ semanas."
      ],
      provas: {
        A: "Prova principal (2–3 por época): Afinação completa. Depois de uma maratona: 10–14 dias sem pliometria nem força pesada.",
        B: "Prova importante mas não decisiva: na semana da prova só o Dia 1 da Competitiva, com uma série a menos, 4–5 dias antes; sem pliometria nos 3 dias antes.",
        C: "Prova de treino ou corrida de controlo: treina normalmente, sem força nas 48 h antes."
      },
      descarga: "A cada 4.ª semana (3:1) faz uma série a menos em cada exercício e reduz os contactos de pliometria ~30%. Faz coincidir com a semana de menor volume de corrida."
    }
  };

  const geradasTri = gerar(FASES_TRI, "triatlo");
  const geradasCor = gerar(FASES_COR, "corrida");
  SESSOES.unshift(...geradasTri, ...geradasCor);

  window.PLANEAMENTO = {
    niveis: NIVEIS,
    fases: FASES_TRI, // compatibilidade: a app atual lê estas (triatlo)
    modalidades: {
      triatlo: { id: "triatlo", nome: "Triatlo", fases: FASES_TRI },
      corrida: { id: "corrida", nome: "Corrida", fases: FASES_COR }
    },
    guia: GUIA
  };
})();
