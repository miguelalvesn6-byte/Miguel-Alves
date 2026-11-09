// Plano Miguel — off-season de força e potência para CICLISMO e CORRIDA (6 semanas × 2 sessões = 12 sessões).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura fixa, com relógio em todos os blocos (≤55 min no papel para caber em 60 min reais com transições):
//   1 Aquecimento (5 min: ergómetro + mobilidade; a rampa de cargas está nas primeiras voltas da força)
//   2 Pliometria (2–3 exercícios: ≥1 elástico de contacto curto + 1 salto máximo quando faz sentido)
//   3 Força (só 2 exercícios — pernas + core — em E2MOM/E3MOM: o bloco dura exatamente o tempo indicado)
//   4 Condicionamento (começa num ergómetro, depois transporte/movimentos funcionais com carga e membros superiores)
// Dia A = agachamento; Dia B = peso morto. Força → potência: S1–S2 acumulação, S3–S4 intensificação (≥85%),
// S5 pico de expressão de potência (pesado-leve + pliometria intensa), S6 descarga + testes. Sem corrida no condicionamento.
// O formato de cada bloco (relógio, voltas, descanso) está no mapa FORMATO no fim do ficheiro.

(function () {
  const i = (ex, dose, descanso, nota) => (nota ? { ex, dose, descanso, nota } : { ex, dose, descanso });
  const b = (n, nome, min, itens) => ({ titulo: `${n} · ${nome} (${min} min)`, min, itens });

  // Aquecimento: 5 min reais. A rampa de cargas faz parte das primeiras voltas do E2MOM de força.
  const AQUEC_A = [
    i("bike-erg", "3 min fácil", "—", "Relógio: 0:00–3:00 BikeErg a 85–90 rpm, ritmo de conversa; 3:00–5:00 mobilidade. Sem BikeErg: air bike ou bicicleta estática."),
    i("worlds-greatest", "2 min (3/lado)", "—", "Anca, tornozelo e coluna torácica antes do agachamento.")
  ];
  const AQUEC_B = [
    i("remo-ergometro", "3 min fácil", "—", "Relógio: 0:00–3:00 remo a 20–22 pancadas/min; 3:00–5:00 mobilidade. Sem remo: air bike."),
    i("cars-anca", "2 min (5/lado) + 5 swings leves", "—", "Ativar a dobradiça da anca antes do peso morto (kettlebell de 16–20 kg).")
  ];
  const INTERF_A = "Interferência: Dia A num dia sem bicicleta intensa ou ≥6 h depois dela; nunca na véspera do longo de bicicleta.";
  const INTERF_B = "Interferência: Dia B nunca nas 48 h antes da série chave ou do longo de corrida; no dia seguinte só resistência fácil.";
  const RAMPA_A = "As primeiras voltas são a rampa (aproximação) — não há séries de aquecimento fora do relógio.";

  const sessoes = [];
  const S = (sem, dia, rpe, objetivo, nota, contactos, blocos) => {
    const duracao = blocos.reduce((t, x) => t + x.min, 0);
    sessoes.push({
      id: `off-s${sem}-dia${dia === "A" ? 1 : 2}`,
      nome: `Plano Miguel · Semana ${sem} · Dia ${dia}`,
      fase: "Off-season (força e potência)",
      local: "Ginásio",
      duracao,
      frequencia: `Semana ${sem} · Dia ${dia}`,
      rpe,
      objetivo,
      nota: `${nota} ${dia === "A" ? INTERF_A : INTERF_B} Pliometria: ${contactos} contactos.`,
      contactos,
      blocos: blocos.map(({ titulo, itens }) => ({ titulo, itens })),
      programa: "off-season-pessoal",
      semana: sem,
      completa: false,
      casa: false
    });
  };

  // Peça de referência (semana 1 e semana 6, Dia A): ideia original do Miguel, adaptada.
  const REFERENCIA = (reteste) => [
    i("ski-erg", "1 min", "—", `${reteste ? "REFERÊNCIA (reteste da semana 1)" : "REFERÊNCIA"} · 4 RONDAS · 90 s entre rondas, depois 1 min de wall balls máximos. Relógio corrido, limite 20 min. SkiErg a RPE 7; regista os metros de cada ronda (a 4.ª a ≤5% da 1.ª). Sem SkiErg: remo 1 min.`),
    i("flexoes", "12 reps", "—", "Peito ao chão, corpo em prancha (substitui o supino da versão original)."),
    i("farmer-carry", "40 m", "—", "2 × 28–32 kg, tronco alto."),
    i("elevacoes", "8 reps", "90 s (fim da ronda)", "Amplitude completa; divide se precisares."),
    i("wall-ball", "Teste: máximo em 1 min (depois da 4.ª ronda)", "—", "9 kg a 3 m, anca abaixo do joelho; só contam repetições válidas. Regista o número" + (reteste ? " e compara com a semana 1." : " (reteste na semana 6)."))
  ];

  // ======================= SEMANA 1 — ACUMULAÇÃO / TÉCNICA =======================
  S(1, "A", "7",
    "Acumulação: técnica do agachamento com volume moderado, introdução à força elástica (corda, pogo, contacto curto) e a peça de referência do bloco.",
    "Carga moderada, 3 repetições na reserva. Se as séries de trabalho ficarem a RPE ≤6, +5 kg na semana 2; se passarem RPE 8, mantém.",
    99,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltar-corda", "2 × 30", "30 s", "elástico (contacto curto) · Relógio: 7 séries. Corda simples com tornozelos rígidos e \"chão quente\": contacto curto e silencioso, joelhos quase esticados."),
        i("pogo", "2 × 15", "30 s", "elástico (contacto curto) · Saltos pequenos e rápidos no sítio; o calcanhar não toca no chão."),
        i("salto-contramovimento", "3 × 3", "60 s", "máximo · Recuperação completa. O 1.º salto é o teste inicial: mede a altura (app ou marca na parede).")
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "Min ímpar: 5 reps · voltas 1–2 rampa (50%, 60%) · voltas 3–8 a ≈70% (RPE 7)", "resto do minuto", "E2MOM 16 min (8 voltas): no minuto ímpar agachamento, no minuto par GHD. " + RAMPA_A),
        i("ghd-abdominais", "Min par: 10 reps", "resto do minuto", "Só até à horizontal. Sem GHD: abdominais no AbMat.")
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(false))
    ]);

  S(1, "B", "7",
    "Acumulação: técnica do peso morto, pliometria de passada (corda alternada) e um EMOM de corpo inteiro que começa no remo.",
    "Cada repetição do peso morto parte do chão parado. Se as séries de trabalho ficarem a RPE ≤6, +5–10 kg na semana 2. EMOM: cada minuto deve deixar 15–25 s de folga.",
    99,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("corda-alternada", "2 × 30 (15/pé)", "30 s", "elástico (contacto curto) · Relógio: 7 séries. Passada de corrida na corda, contacto curto debaixo da anca."),
        i("saltos-linha", "2 × 15", "30 s", "elástico (contacto curto) · Frente e trás sobre uma linha, \"chão quente\"."),
        i("salto-comprimento", "3 × 3", "60 s", "máximo · Aterra e fixa. A melhor marca da 1.ª série é o teste inicial.")
      ]),
      b(3, "Força", 16, [
        i("peso-morto", "Min ímpar: 4 reps · voltas 1–2 rampa (50%, 60%) · voltas 3–8 a ≈70–72% (RPE 7)", "resto do minuto", "E2MOM 16 min (8 voltas): minuto ímpar peso morto, minuto par Pallof. " + RAMPA_A),
        i("pallof", "Min par: 10/lado", "resto do minuto", "Anti-rotação: tronco estável na bicicleta e na corrida.")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "Min 1: 14/12 cal", "—", "EMOM 16 min (4 voltas de 4 minutos), RPE 7. Sem remo: air bike."),
        i("kettlebell-clean-press", "Min 2: 5/braço", "—", "16–20 kg. Sem kettlebell: haltere."),
        i("farmer-carry", "Min 3: 40 m", "—", "2 × 28–32 kg."),
        i("flexoes", "Min 4: 12 reps", "resto do minuto")
      ])
    ]);

  // ======================= SEMANA 2 — ACUMULAÇÃO (mais carga) =======================
  S(2, "A", "7–8",
    "Acumulação: mais carga no agachamento, força elástica de introdução (duplos, pogo) e AMRAP controlados com air bike, sandbag, thrusters e elevações.",
    "Sobe a carga de acordo com o RPE da semana 1 (+2,5–5%). AMRAP: o mesmo número de voltas nos 3 blocos.",
    106,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltos-duplos-corda", "2 × 30", "30 s", "elástico (contacto curto) · Relógio: 8 séries. Tornozelos rígidos, salto baixo e rápido. Sem duplos: corda simples × 60."),
        i("pogo-lateral", "2 × 15", "30 s", "elástico (contacto curto) · De um lado para o outro de uma linha, contacto mínimo."),
        i("salto-caixa", "4 × 4", "60 s", "máximo · Caixa 60 cm, máxima altura, reset entre saltos.")
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "Min ímpar: 4 reps · voltas 1–2 rampa (50%, 65%) · voltas 3–8 a ≈75–77% (RPE 7–8)", "resto do minuto", "E2MOM 16 min (8 voltas): minuto ímpar agachamento, minuto par rollout. " + RAMPA_A),
        i("rollout", "Min par: 8 reps", "resto do minuto", "Anti-extensão (posição aero). Sem roda: fitball.")
      ]),
      b(4, "Condicionamento", 15, [
        i("air-bike", "12/10 cal", "—", "3 BLOCOS DE AMRAP 4 min (RPE 7) · 90 s entre blocos. Regista as voltas. Sem air bike: BikeErg 45 s."),
        i("sandbag-carry", "40 m", "—", "Ao ombro, troca a meio. Sem sandbag: kettlebell em goblet."),
        i("thruster-halteres", "8 reps", "—", "2 × 15 kg."),
        i("elevacoes", "6 reps", "90 s (fim do bloco)")
      ])
    ]);

  S(2, "B", "7–8",
    "Acumulação: mais carga no peso morto, saltos unipodais e um E2MOM com BikeErg, trenó, devil press e suitcase carry.",
    "Peso morto +5–10 kg se a semana 1 ficou a RPE ≤7. E2MOM de condicionamento: cada janela deve deixar 20–40 s de folga.",
    119,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("corda-alternada", "2 × 40 (20/pé)", "30 s", "elástico (contacto curto) · Relógio: 7 séries. Contacto curto debaixo da anca."),
        i("pogo-frente", "2 × 15", "30 s", "elástico (contacto curto) · Pogos a avançar, corpo alto, tornozelos rígidos."),
        i("salto-comprimento", "3 × 3", "60 s", "máximo · Recuperação completa.")
      ]),
      b(3, "Força", 16, [
        i("peso-morto", "Min ímpar: 4 reps · voltas 1–2 rampa (50%, 65%) · voltas 3–8 a ≈75% (RPE 7–8)", "resto do minuto", "E2MOM 16 min (8 voltas): minuto ímpar peso morto, minuto par Copenhagen. " + RAMPA_A),
        i("copenhagen", "Min par: 20 s/lado", "resto do minuto", "Adutores e core lateral. Regressão: joelho apoiado.")
      ]),
      b(4, "Condicionamento", 16, [
        i("bike-erg", "Janela ímpar: 45 s forte", "—", "E2MOM 16 min (8 janelas de 2 min), RPE 7–8. Janela ímpar = 45 s de BikeErg + 2 × 15 m de trenó; janela par = 6 devil press + 30 m de suitcase carry/lado. Sem BikeErg: air bike."),
        i("treno-empurrar", "Janela ímpar: 2 × 15 m", "resto da janela", "Sem trenó: empurrar prato pesado."),
        i("devil-press", "Janela par: 6 reps", "—", "2 × 12,5–15 kg."),
        i("suitcase-carry", "Janela par: 30 m/lado", "resto da janela", "Tronco sem inclinar.")
      ])
    ]);

  // ======================= SEMANA 3 — INTENSIFICAÇÃO (≥85%) =======================
  S(3, "A", "8",
    "Intensificação: agachamento a ≈85% em triplas (a força pesada é o estímulo com mais efeito na economia), drop jumps e um chipper que começa no remo.",
    "Carga pelo RPE: tripla a RPE ≤7 → +5 kg na volta seguinte; RPE 9 → −5%. Pliometria: força elástica mais intensa (pogo unipodal, rebound jumps de 20–25 cm).",
    67,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltos-unipodais", "2 × 10/perna", "30 s", "elástico (contacto curto) · Relógio: 8 séries. Pogo numa perna: tornozelo rígido, joelho alinhado, contacto <0,25 s."),
        i("drop-jump", "3 × 6", "45 s", "elástico (contacto curto) · Rebound jumps de caixa baixa (20–25 cm): cai e ressalta logo, o mais curto possível — não é para saltar o mais alto possível."),
        i("salto-caixa", "3 × 3", "60 s", "máximo · Máxima altura, recuperação completa.")
      ]),
      b(3, "Força", 18, [
        i("agachamento-barra", "Min ímpar: voltas 1–3 rampa (50% × 5, 65% × 3, 75% × 2) · voltas 4–9: 3 reps a ≈85% (RPE 8)", "resto do minuto", "E2MOM 18 min (9 voltas): minuto ímpar agachamento, minuto par elevação de joelhos. " + RAMPA_A),
        i("elevacao-joelhos-suspenso", "Min par: 10 reps", "resto do minuto", "Sem balanço. Alternativa: crunch invertido.")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "500 m", "—", "CHIPPER · 1 passagem pela ordem · limite 16 min, RPE 7–8: 500 m de remo → 4 × 15 m de trenó → 10 sandbag ao ombro → 15 remadas invertidas → 60 m de farmer carry."),
        i("treno-empurrar", "4 × 15 m", "—", "Sem trenó: empurrar prato pesado."),
        i("sandbag-clean", "10 reps", "—", "Alterna o ombro. Sem sandbag: kettlebell swing."),
        i("remada-invertida", "15 reps", "—", "Argolas, barra baixa ou TRX."),
        i("farmer-carry", "60 m", "—", "2 × 32 kg.")
      ])
    ]);

  S(3, "B", "8",
    "Intensificação: peso morto a ≈85% em triplas, saltos de barreiras e rondas de 3 min com air bike, arranco com haltere e sandbag.",
    "Tripla a RPE ≤7 → +5–10 kg; RPE 9 → −5%. Não faças esta sessão nas 48 h antes do longo de corrida.",
    87,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("corda-alternada", "2 × 30 (15/pé)", "30 s", "elástico (contacto curto) · Relógio: 8 séries."),
        i("saltos-barreiras", "3 × 6", "45 s", "elástico (contacto curto) · Hurdle hops: barreiras de 30–45 cm, contactos curtos e rígidos entre barreiras."),
        i("salto-comprimento", "3 × 3", "60 s", "máximo · Recuperação completa.")
      ]),
      b(3, "Força", 18, [
        i("peso-morto", "Min ímpar: voltas 1–3 rampa (50% × 5, 65% × 3, 75% × 2) · voltas 4–9: 3 reps a ≈85% (RPE 8)", "resto do minuto", "E2MOM 18 min (9 voltas): minuto ímpar peso morto, minuto par Pallof isométrico. " + RAMPA_A),
        i("pallof-isometrico", "Min par: 20 s/lado", "resto do minuto", "Anti-rotação.")
      ]),
      b(4, "Condicionamento", 15, [
        i("air-bike", "10/8 cal", "—", "5 RONDAS de 3 min (trabalho ≈2 min + descanso até fechar os 3 min), RPE 7–8. Sem air bike: BikeErg 40 s."),
        i("haltere-snatch", "6 alternados", "—", "20–22,5 kg."),
        i("sandbag-carry", "30 m", "resto dos 3 min", "Em abraço.")
      ])
    ]);

  // ======================= SEMANA 4 — INTENSIFICAÇÃO (mais pesado) =======================
  S(4, "A", "8–8,5",
    "Intensificação: agachamento a 85–87%, drop jumps e saltos com joelhos ao peito e um EMOM com BikeErg, trenó para trás, devil press e elevações.",
    "Semana mais pesada. Dormiste mal ou variabilidade cardíaca baixa → fica nas 2 voltas de rampa + 4 de trabalho e faz core nas restantes. Duas triplas seguidas a RPE 9 → baixa 5%.",
    74,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltos-unipodais", "2 × 12/perna", "30 s", "elástico (contacto curto) · Relógio: 8 séries. Pogo unipodal mais rápido que na semana 3."),
        i("drop-jump", "4 × 5", "45 s", "elástico (contacto curto) · Rebound jumps de 30 cm: contacto <0,25 s, depois ressalto alto."),
        i("salto-caixa", "2 × 3", "60 s", "máximo · Recuperação completa.")
      ]),
      b(3, "Força", 18, [
        i("agachamento-barra", "Min ímpar: voltas 1–3 rampa (50% × 5, 65% × 3, 78% × 2) · voltas 4–9: 3 reps a ≈85–87% (RPE 8–8,5)", "resto do minuto", "E2MOM 18 min (9 voltas): minuto ímpar agachamento, minuto par GHD. " + RAMPA_A),
        i("ghd-abdominais", "Min par: 12 reps", "resto do minuto", "Sem GHD: abdominais no AbMat.")
      ]),
      b(4, "Condicionamento", 16, [
        i("bike-erg", "Min 1: 40 s forte", "—", "EMOM 16 min (4 voltas de 4 minutos), RPE 7–8. Sem BikeErg: air bike."),
        i("treno-puxar", "Min 2: 20 m para trás", "—", "Em meio agachamento — quadríceps (ciclismo). Sem trenó: 40 s de wall sit."),
        i("devil-press", "Min 3: 5 reps", "—"),
        i("elevacoes", "Min 4: 5 reps", "resto do minuto")
      ])
    ]);

  S(4, "B", "8–8,5",
    "Intensificação: peso morto a 85–88% em duplas, multissaltos e salto com trap bar e um bloco de densidade com remo, sandbag, flexões e swings.",
    "Salto com trap bar com 20–30% do 1RM do peso morto: altura máxima, não carga. Densidade: o mesmo número de voltas nos 2 blocos.",
    70,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("saltos-linha", "2 × 20 (10/perna)", "30 s", "elástico (contacto curto) · Relógio: 8 séries. Saltos sobre a linha numa perna."),
        i("saltos-barreiras", "3 × 6", "45 s", "elástico (contacto curto) · Barreiras mais altas que na semana 3 (40–50 cm), sem perder o contacto curto."),
        i("salto-trap-bar", "3 × 4 @ 20–30% 1RM", "60 s", "máximo · Força-velocidade. Sem trap bar: salto com 2 halteres leves.")
      ]),
      b(3, "Força", 18, [
        i("peso-morto", "Min ímpar: voltas 1–3 rampa (50% × 5, 65% × 3, 78% × 2) · voltas 4–9: 2 reps a ≈87–88% (RPE 8–8,5)", "resto do minuto", "E2MOM 18 min (9 voltas): minuto ímpar peso morto, minuto par Copenhagen. " + RAMPA_A),
        i("copenhagen", "Min par: 25 s/lado", "resto do minuto")
      ]),
      b(4, "Condicionamento", 15, [
        i("remo-ergometro", "200 m", "—", "DENSIDADE: 2 blocos de 7 min · 1 min entre blocos · máximo de voltas com técnica perfeita (RPE 7). Sem remo: air bike 10/8 cal."),
        i("sandbag-carry", "30 m", "—", "Ao ombro."),
        i("flexoes", "12 reps", "—"),
        i("kettlebell-swing", "12 reps", "—", "24 kg, potência da anca.")
      ])
    ]);

  // ======================= SEMANA 5 — PICO DE EXPRESSÃO DE POTÊNCIA =======================
  S(5, "A", "8–9",
    "Pico de potência: pesado-leve no agachamento (duplas a 88–90% e depois triplas rápidas a 60%), drop jumps mais altos e intervalos curtos de potência em air bike e BikeErg.",
    "Volume mínimo, intensidade máxima, recuperação completa. Séries leves à máxima velocidade intencional. Se a 1.ª dupla for RPE 9,5, baixa 5%.",
    28,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("drop-jump", "3 × 4", "75 s", "elástico (contacto curto) · Relógio: 7 séries. Drop jump de 30 cm com intenção máxima: contacto mínimo e salto máximo (RSI). Pico da época."),
        i("multisaltos", "2 × 6", "60 s", "elástico (contacto curto) · Bounding: passadas saltadas longas e reativas, contacto curto."),
        i("salto-caixa", "2 × 2", "60 s", "máximo · Máxima altura.")
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "Min ímpar: voltas 1–2 rampa (60% × 3, 80% × 1) · voltas 3–5: 2 reps a ≈88–90% · voltas 6–8: 3 reps a 60% (máxima velocidade)", "resto do minuto", "E2MOM 16 min (8 voltas): minuto ímpar agachamento (pesado-leve), minuto par toes to bar. " + RAMPA_A),
        i("toes-to-bar", "Min par: 8 reps", "resto do minuto", "Alternativa: elevação de joelhos suspenso.")
      ]),
      b(4, "Condicionamento", 12, [
        i("air-bike", "Intervalos ímpares: 30 s forte", "90 s", "6 INTERVALOS · 30 s forte : 90 s, RPE 8–9. Ímpares na air bike, pares na BikeErg (95–110 rpm). Na recuperação: 15 m de trenó pesado (ímpares) ou 5 elevações explosivas (pares)."),
        i("bike-erg", "Intervalos pares: 30 s forte", "90 s", "Sem BikeErg: bicicleta estática."),
        i("treno-empurrar", "15 m pesado (após os ímpares)", "—", "Sem trenó: empurrar prato."),
        i("elevacoes", "5 explosivas (após os pares)", "—")
      ])
    ]);

  S(5, "B", "8–9",
    "Pico de potência: pesado-leve no peso morto, saltos unipodais em comprimento e com trap bar e rondas de qualidade com remo, sandbag ao ombro, farmer e flexões explosivas.",
    "Volume baixo, saltos máximos com recuperação completa. Se a 1.ª dupla subir devagar (RPE 9,5), baixa 5%.",
    33,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("multisaltos", "2 × 6 unipodais (3/perna)", "75 s", "elástico (contacto curto) · Relógio: 7 séries. Bounds numa perna, máxima intenção, contacto curto."),
        i("saltos-barreiras", "3 × 5", "60 s", "elástico (contacto curto) · Barreiras de 45–50 cm, intenção máxima."),
        i("salto-trap-bar", "2 × 3 @ 20% 1RM", "60 s", "máximo · Altura máxima.")
      ]),
      b(3, "Força", 16, [
        i("peso-morto", "Min ímpar: voltas 1–2 rampa (60% × 3, 80% × 1) · voltas 3–5: 2 reps a ≈88–90% · voltas 6–8: 3 reps a 60% (máxima velocidade)", "resto do minuto", "E2MOM 16 min (8 voltas): minuto ímpar peso morto (pesado-leve), minuto par rotação landmine. " + RAMPA_A),
        i("landmine-rotacao", "Min par: 6/lado", "resto do minuto", "Anti-rotação/transferência anca-tronco.")
      ]),
      b(4, "Condicionamento", 15, [
        i("remo-ergometro", "300 m", "—", "3 RONDAS · 2 min de descanso entre rondas, RPE 8 · limite 15 min. Sem remo: air bike 15/12 cal."),
        i("sandbag-clean", "5 reps", "—", "Explosivo, alterna o ombro."),
        i("farmer-carry", "40 m", "—", "2 × 32 kg."),
        i("flexoes", "8 explosivas", "2 min (fim da ronda)", "Mãos saem do chão.")
      ])
    ]);

  // ======================= SEMANA 6 — DESCARGA + TESTES =======================
  S(6, "A", "6 (teste: 9)",
    "Descarga e teste: reteste do salto vertical, série máxima de 3 no agachamento (1RM estimado) e repetição da peça de referência da semana 1.",
    "Volume ~50%, mas o teste é a sério: tripla a RPE 9, sem falha. 1RM estimado ≈ carga × 1,10. Referência: as mesmas cargas da semana 1 — compara metros do SkiErg, divisões das elevações, RPE e wall balls.",
    63,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 7, [
        i("pogo", "Teste 10/5: 2 × 10 saltos", "60 s", "elástico (contacto curto) · TESTE: 10 pogos seguidos o mais altos e rápidos possível; conta os 5 melhores (app de saltos: altura ÷ tempo de contacto = RSI). Relógio: 7 séries."),
        i("saltar-corda", "2 × 20", "30 s", "elástico (contacto curto) · Manutenção, tornozelos rígidos."),
        i("salto-contramovimento", "3 × 1 (reteste)", "60 s", "máximo · Mesmo método de medição da semana 1.")
      ]),
      b(3, "Força", 15, [
        i("agachamento-barra", "Volta 1: 50% × 5 · 2: 65% × 3 · 3: 75% × 2 · 4: 85% × 1 · 5: TESTE 3 reps @ RPE 9 (≈90–92%)", "resto da janela", "E3MOM 15 min (5 voltas de 3 min): agachamento no início de cada janela, GHD logo a seguir. Sempre com batentes. Regista carga, RPE e e1RM."),
        i("ghd-abdominais", "8 reps (depois de cada agachamento)", "resto da janela", "Leve.")
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(true))
    ]);

  S(6, "B", "6 (teste: 9)",
    "Descarga e teste: reteste do salto em comprimento, série máxima de 3 no peso morto e um AMRAP leve para fechar o bloco.",
    "Faz este teste pelo menos 72 h depois do Dia A. Tripla a RPE 9; se as costas arredondarem, a série termina aí. 1RM estimado ≈ carga × 1,10. AMRAP a RPE 6.",
    66,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 30 (15/pé)", "30 s", "elástico (contacto curto) · Manutenção. Relógio: 8 séries."),
        i("drop-jump", "Teste RSI: 3 × 1 (30 cm)", "60 s", "elástico (contacto curto) · TESTE: drop jump de 30 cm; RSI = altura do salto ÷ tempo de contacto (app). Fica com o melhor."),
        i("salto-comprimento", "3 × 1 (reteste)", "60 s", "máximo · Mesmo piso e calçado da semana 1.")
      ]),
      b(3, "Força", 15, [
        i("peso-morto", "Volta 1: 50% × 5 · 2: 65% × 3 · 3: 75% × 2 · 4: 85% × 1 · 5: TESTE 3 reps @ RPE 9 (≈90–92%)", "resto da janela", "E3MOM 15 min (5 voltas de 3 min): peso morto no início de cada janela, Pallof logo a seguir. Regista carga, RPE e e1RM."),
        i("pallof", "8/lado (depois de cada peso morto)", "resto da janela")
      ]),
      b(4, "Condicionamento", 10, [
        i("remo-ergometro", "200 m", "—", "AMRAP 10 min a RPE 6 (descarga, conversa possível). Sem remo: BikeErg 1 min fácil."),
        i("farmer-carry", "40 m", "—"),
        i("kettlebell-clean-press", "3/braço", "—", "Leve."),
        i("remada-invertida", "8 reps", "—")
      ])
    ]);

  SESSOES.push(...sessoes);

  window.PROGRAMA_OFFSEASON = {
    id: "off-season-pessoal",
    nome: "Plano Miguel · Off-season força e potência (6 semanas)",
    objetivo: "Off-season para ciclismo e corrida em sessões curtas e cronometradas (≤55 min no papel, ≈60 min reais): força máxima primeiro (agachamento e peso morto ≥85% nas semanas 3–4) e só depois a expressão de potência (semana 5), pliometria com mais contactos por exercício para a rigidez reativa da corrida, core para a posição aero e um condicionamento funcional de corpo inteiro que começa sempre num ergómetro — sem corrida. 2 sessões por semana.",
    sessoes: sessoes.map((s) => s.id),
    semanas: [
      { n: 1, foco: "Acumulação e técnica", notas: "E2MOM 16: 6 séries de trabalho a ≈70%. Força elástica de introdução (corda, pogo, linha; ~100 contactos) + salto máximo. Peça de referência (A) e EMOM 16 (B)." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "E2MOM 16: 6 séries a ≈75%. Força elástica de introdução (~105–120 contactos). AMRAP 3 × 4 min (A) e E2MOM 16 com BikeErg e trenó (B)." },
      { n: 3, foco: "Intensificação", notas: "E2MOM 18: 6 triplas a ≈85%. Força elástica intensificada: pogo unipodal, rebound jumps baixos, hurdle hops (~65–90 contactos). Chipper (A) e 5 rondas de 3 min (B)." },
      { n: 4, foco: "Intensificação (mais pesado)", notas: "E2MOM 18: triplas a 85–87% (A) e duplas a 87–88% (B). EMOM 16 (A) e densidade 2 × 7 min (B)." },
      { n: 5, foco: "Pico de expressão de potência", notas: "E2MOM 16 pesado-leve: 3 duplas a 88–90% + 3 triplas rápidas a 60%. Pico elástico: drop jumps de 30 cm e bounding, intenção máxima, ~30 contactos. Intervalos 6 × 30 s (A) e 3 rondas explosivas (B)." },
      { n: 6, foco: "Descarga + testes", notas: "E3MOM 15 com tripla de teste (RPE 9) → 1RM estimado. Testes elásticos (10/5 no Dia A, RSI no Dia B) e reteste dos saltos máximos, da peça de referência e dos wall balls (A); AMRAP leve (B)." }
    ],
    cobertura: "Em cada semana: agachar pesado (Dia A) e dobradiça da anca pesada (Dia B) em E2MOM; core em todas as sessões (anti-extensão, anti-rotação, flexão, adutores com Copenhagen); pliometria reativa contada (corda, pogo, drop jumps, barreiras, multissaltos, saltos unipodais e com trap bar) — também a capacidade dos gémeos e do Aquiles; extensão da anca e do joelho com potência (trenó, swings, sandbag, saltos); transporte (farmer, sandbag, suitcase); membros superiores através de movimentos funcionais (flexões, elevações, remadas invertidas, devil press, thrusters, clean & press, arrancos); motor sem corrida (air bike, BikeErg, remo; SkiErg na peça de referência).",
    regras: [
      "Força elástica: a pliometria separa o trabalho ELÁSTICO (ciclo alongamento-encurtamento rápido, contacto <0,25 s, tornozelo rígido — pogo, corda, hurdle hops, rebound/drop jumps baixos, bounding) do salto MÁXIMO (contramovimento lento, intenção máxima — caixa, comprimento, CMJ, trap bar). A força elástica é a que devolve energia em cada apoio da corrida (rigidez do tornozelo e do tendão de Aquiles) e é treinada com contactos curtos e descanso curto e fixo; os saltos máximos fazem-se com recuperação completa. Progressão: S1–2 introdução (pogo, linha, corda, \"chão quente\"), S3–4 intensificação (hurdle hops, rebound jumps de 20–30 cm, pogo unipodal), S5 pico (drop jumps de 30 cm, bounding, intenção máxima, volume mínimo), S6 manutenção e testes (10/5 ou RSI + reteste do CMJ/comprimento).",
      "Sessões cronometradas: cada bloco tem relógio (E2MOM, rondas, séries com descanso fixo). Se o bloco acabar, passa ao seguinte — não estendas. Transições e carregar a barra cabem nos ~5 min que sobram até aos 60.",
      "Força em E2MOM: no minuto ímpar o levantamento, no par o core. As primeiras voltas são a rampa; as restantes são de trabalho à carga indicada. Se uma volta de trabalho não deixar pelo menos 20 s de descanso no minuto, a carga está alta.",
      "Sequência força → potência: semanas 1–4 a força domina e a pliometria é de qualidade, sem fadiga; a potência expressa-se na semana 5 (pesado-leve, saltos mais altos, menos volume); semana 6 descarga e testes. Sem base de força, o trabalho de potência rende pouco.",
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Série a RPE 1 abaixo do alvo → +2,5–5% na volta seguinte. No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o levantamento e faz só core nos minutos que faltam.",
      "Nunca até à falha: RIR 2 nos levantamentos principais; só os testes da semana 6 chegam a RPE 9.",
      "Pliometria: descanso curto e fixo nos elásticos (30 s; 45 s nos rebound/hurdle hops; 60–75 s na semana 5) e recuperação completa nos máximos (60–90 s). Se o contacto ficar longo, a aterragem ruidosa ou a altura cair >10%, termina o exercício. Dor no Aquiles >3/10 ou que piora no dia seguinte → corta os saltos dessa semana.",
      "Condicionamento = qualidade, não velocidade: começa sempre no ergómetro; EMOM/E2MOM com 15–40 s de folga; AMRAP e densidade com o mesmo número de voltas em todos os blocos; rondas com a mesma produção (≤5% de queda).",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas): 2 voltas de trabalho a menos na força (faz só o core nesses minutos) e corta uma ronda/volta no condicionamento.",
      "Segurança: agachamento com batentes ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões; dor aguda ou articular → parar.",
      "Alternativas: sem GHD → AbMat; sem SkiErg → remo; sem air bike → BikeErg ou bicicleta estática; sem BikeErg → air bike; sem trenó → empurrar prato ou wall sit; sem sandbag → kettlebell em goblet/farmer; sem trap bar → salto com halteres leves.",
      "Falhaste uma semana inteira? Repete-a. Falhaste uma sessão? Faz a seguinte normalmente."
    ],
    interferencia: "A resistência de off-season fica em volume moderado e sobretudo em Z1–Z2, com no máximo 1 sessão intensa de bicicleta e 1 de corrida por semana. Separa o Dia A e o Dia B por 48–72 h (ex.: terça e sexta). No mesmo dia: resistência intensa de manhã e força ≥6 h depois (nunca força antes de intervalos). Coloca a força nos dias de treino intenso (dia duro mais duro, dia fácil mais fácil). Nunca força na véspera do treino longo de bicicleta (Dia A) nem nas 48 h antes da série chave ou do longo de corrida (Dia B). No dia a seguir à força, só bicicleta ou corrida fácil. Conta a pliometria e a corrida em conjunto: semana com mais volume de corrida → corta 25–30% dos contactos. Na semana 6 baixa também o volume de resistência. Proteína 1,6–2,0 g/kg/dia (≈0,4 g/kg depois da força) e hidratos de carbono à volta das sessões."
  };
})();

// Formato de cada bloco com relógio (voltas, tempo, descanso), mostrado em destaque no topo do bloco.
// Chave: id da sessão → nome do bloco (Aquecimento, Pliometria, Força, Condicionamento).
(function () {
  const AQ_A = "5 min · 3 min de BikeErg fácil + 2 min de mobilidade";
  const AQ_B = "5 min · 3 min de remo fácil + 2 min de mobilidade";
  const FORMATO = {
    "off-s1-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "3 exercícios · 2 elásticos (30 s de descanso fixo) + 1 máximo (60 s) · 99 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar agachamento, min par GHD (voltas 1–2 rampa)",
      Condicionamento: "Referência · 4 rondas · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s1-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "3 exercícios · 2 elásticos (30 s de descanso fixo) + 1 máximo (60 s) · 99 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar peso morto, min par Pallof (voltas 1–2 rampa)",
      Condicionamento: "EMOM 16 min · 4 voltas de 4 min (uma estação por minuto)"
    },
    "off-s2-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "3 exercícios · 2 elásticos (30 s de descanso fixo) + 1 máximo (60 s) · 106 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar agachamento, min par rollout (voltas 1–2 rampa)",
      Condicionamento: "3 blocos de AMRAP 4 min · 90 s entre blocos · ritmo controlado"
    },
    "off-s2-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "3 exercícios · 2 elásticos (30 s de descanso fixo) + 1 máximo (60 s) · 119 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar peso morto, min par Copenhagen (voltas 1–2 rampa)",
      Condicionamento: "E2MOM 16 min · 8 janelas de 2 min (alterna janela ímpar e par)"
    },
    "off-s3-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "3 exercícios · 2 elásticos (30–45 s) + 1 máximo (60 s) · 8 séries · 67 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par elevação de joelhos (voltas 1–3 rampa)",
      Condicionamento: "Chipper · 1 passagem pela ordem · limite 16 min"
    },
    "off-s3-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "3 exercícios · 2 elásticos (30–45 s) + 1 máximo (60 s) · 8 séries · 87 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par Pallof isométrico (voltas 1–3 rampa)",
      Condicionamento: "5 rondas de 3 min · trabalho ≈2 min + descanso até fechar a janela"
    },
    "off-s4-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "3 exercícios · 2 elásticos (30–45 s) + 1 máximo (60 s) · 8 séries · 74 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD (voltas 1–3 rampa)",
      Condicionamento: "EMOM 16 min · 4 voltas de 4 min (uma estação por minuto)"
    },
    "off-s4-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "3 exercícios · 2 elásticos (30–45 s) + 1 máximo (60 s) · 8 séries · 70 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par Copenhagen (voltas 1–3 rampa)",
      Condicionamento: "2 blocos de densidade de 7 min · 1 min entre blocos · máximo de voltas com técnica perfeita"
    },
    "off-s5-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "3 exercícios · 2 elásticos + 1 máximo · 60–75 s de descanso (recuperação completa) · 7 séries · 28 contactos",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar agachamento, min par toes to bar",
      Condicionamento: "6 intervalos · 30 s forte : 90 s (air bike / BikeErg)"
    },
    "off-s5-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "3 exercícios · 2 elásticos + 1 máximo · 60–75 s de descanso (recuperação completa) · 7 séries · 33 contactos",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar peso morto, min par rotação landmine",
      Condicionamento: "3 rondas · 2 min de descanso entre rondas · limite 15 min"
    },
    "off-s6-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "3 exercícios · 2 elásticos (30 s) + 1 máximo (60 s) · teste 10/5 + reteste do CMJ · 63 contactos",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + GHD",
      Condicionamento: "Referência (reteste da semana 1) · 4 rondas · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s6-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "3 exercícios · 2 elásticos + 1 máximo · teste RSI + reteste do salto em comprimento · 66 contactos",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + Pallof",
      Condicionamento: "AMRAP 10 min · leve (RPE 6)"
    }
  };
  SESSOES.forEach((s) => {
    const f = FORMATO[s.id];
    if (!f) return;
    s.blocos.forEach((b) => {
      const nome = b.titulo.replace(/^\d+\s*·\s*/, "").replace(/\s*\(.*$/, "");
      if (f[nome]) b.formato = f[nome];
    });
  });
})();
