// Plano Miguel — off-season de força e potência para CICLISMO e CORRIDA (6 semanas × 2 sessões = 12 sessões).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura fixa, com relógio em todos os blocos (≤55 min no papel para caber em 60 min reais com transições):
//   1 Aquecimento (5 min: ergómetro + mobilidade; a rampa de cargas está nas primeiras voltas da força)
//   2 Pliometria (2–3 exercícios: ≥1 elástico de contacto curto + 1 salto máximo/exercício de potência)
//   3 Força (só 2 exercícios — pernas + core — em E2MOM/E3MOM: o bloco dura exatamente o tempo indicado)
//   4 Condicionamento (começa num ergómetro, depois transporte/movimentos funcionais com carga e membros superiores)
// Notas dos exercícios = só o objetivo. Relógio, voltas e descansos estão no formato de cada bloco (mapa FORMATO no fim);
// segurança, alternativas e progressões estão na nota da sessão e em PROGRAMA_OFFSEASON.regras.
// Força → potência: S1–S2 acumulação, S3–S4 intensificação (≥85%) com exercícios de potência a entrar na S4,
// S5 pico de expressão de potência, S6 descarga + testes. Sem corrida no condicionamento.

(function () {
  const i = (ex, dose, descanso, nota) => (nota ? { ex, dose, descanso, nota } : { ex, dose, descanso });
  const b = (n, nome, min, itens) => ({ titulo: `${n} · ${nome} (${min} min)`, min, itens });
  const OBJ = (t) => `Objetivo: ${t}`;
  const EL = (t) => `Elástico · Objetivo: ${t}`;
  const MAX = (t) => `Máximo · Objetivo: ${t}`;

  const AQUEC_A = [
    i("bike-erg", "3 min fácil (85–90 rpm)", "—", OBJ("subir a temperatura e a frequência cardíaca com o padrão da pedalada")),
    i("worlds-greatest", "3/lado", "—", OBJ("mobilidade da anca, tornozelo e coluna torácica para agachar"))
  ];
  const AQUEC_B = [
    i("remo-ergometro", "3 min fácil (20–22 pancadas/min)", "—", OBJ("subir a temperatura com extensão da anca e puxada")),
    i("cars-anca", "5/lado + 5 swings leves", "—", OBJ("mobilidade da anca e ativação da dobradiça antes do levantamento"))
  ];
  const INTERF_A = "Dia A num dia sem bicicleta intensa ou ≥6 h depois dela; nunca na véspera do longo de bicicleta.";
  const INTERF_B = "Dia B nunca nas 48 h antes da série chave ou do longo de corrida; no dia seguinte só resistência fácil.";

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
    i("ski-erg", "1 min a RPE 7", "—", OBJ("motor de corpo inteiro com ritmo constante (referência)")),
    i("flexoes", "12 reps", "—", OBJ("força de empurrar e estabilidade do tronco em prancha")),
    i("farmer-carry", "40 m (2 × 28–32 kg)", "—", OBJ("força de pega e rigidez do tronco sob carga")),
    i("elevacoes", "8 reps", "90 s (fim da ronda)", OBJ("força de puxar vertical")),
    i("wall-ball", reteste ? "Máximo em 1 min (reteste)" : "Máximo em 1 min (teste)", "—", OBJ("potência-resistência de pernas e ombros (agachar + lançar)"))
  ];

  // ======================= SEMANA 1 — ACUMULAÇÃO / TÉCNICA =======================
  S(1, "A", "7",
    "Acumulação: búlgaro com halteres e GHD em E2MOM, introdução à força elástica e a peça de referência do bloco.",
    "Búlgaro a RIR 3 (técnica, começa pela perna mais fraca); GHD só até à horizontal. Regista os metros do SkiErg por ronda e os wall balls (9 kg a 3 m, anca abaixo do joelho): repetes na semana 6.",
    99,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltar-corda", "2 × 30", "30 s", EL("rigidez do tornozelo e contacto curto (\"chão quente\")")),
        i("pogo", "2 × 15", "30 s", EL("reatividade do tornozelo e do tendão de Aquiles")),
        i("salto-contramovimento", "3 × 3 (1.º salto = teste)", "60 s", MAX("potência vertical de pernas; altura de referência"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro", "8/perna · voltas 1–2 leves, 3–8 a RIR 3", "resto do minuto", OBJ("força unilateral de joelho e anca para a pedalada e o apoio da corrida")),
        i("ghd-abdominais", "10 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen (tronco rígido)"))
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(false))
    ]);

  S(1, "B", "7",
    "Acumulação: técnica do peso morto em E2MOM com Pallof, força elástica de passada e um EMOM de corpo inteiro que começa no remo.",
    "Cada repetição do peso morto parte do chão parado; se as voltas de trabalho ficarem a RPE ≤6, +5–10 kg na semana 3.",
    99,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("corda-alternada", "2 × 30 (15/pé)", "30 s", EL("contacto curto na passada de corrida")),
        i("saltos-linha", "2 × 15", "30 s", EL("reatividade e coordenação do tornozelo")),
        i("salto-comprimento", "3 × 3 (melhor marca = teste)", "60 s", MAX("potência horizontal da anca; marca de referência"))
      ]),
      b(3, "Força", 16, [
        i("peso-morto", "4 reps · voltas 1–2 rampa (50%, 60%), 3–8 a ≈70% (RPE 7)", "resto do minuto", OBJ("força de extensão da anca (cadeia posterior)")),
        i("pallof", "10/lado", "resto do minuto", OBJ("anti-rotação: tronco estável na bicicleta e na corrida"))
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "14/12 cal", "—", OBJ("motor com extensão da anca e puxada")),
        i("kettlebell-clean-press", "5/braço (16–20 kg)", "—", OBJ("potência da anca e empurrar acima da cabeça")),
        i("farmer-carry", "40 m (2 × 28–32 kg)", "—", OBJ("força de pega e rigidez do tronco")),
        i("flexoes", "12 reps", "resto do minuto", OBJ("força de empurrar horizontal"))
      ])
    ]);

  // ======================= SEMANA 2 — ACUMULAÇÃO (mais carga) =======================
  S(2, "A", "7–8",
    "Acumulação: agachamento a ≈72–75% com rollout em E2MOM, força elástica de introdução e AMRAP controlados.",
    "Primeira semana de agachamento com barra: se as voltas de trabalho ficarem a RPE ≤6, +5 kg na semana 3. AMRAP: o mesmo número de voltas nos 3 blocos.",
    106,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltos-duplos-corda", "2 × 30", "30 s", EL("rigidez do tornozelo com contacto curto")),
        i("pogo-lateral", "2 × 15", "30 s", EL("reatividade e estabilidade lateral do tornozelo")),
        i("salto-caixa", "4 × 4", "60 s", MAX("potência vertical de pernas"))
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "5 reps · voltas 1–2 rampa (50%, 60%), 3–8 a ≈72–75% (RPE 7)", "resto do minuto", OBJ("força máxima de extensão do joelho e da anca")),
        i("rollout", "8 reps", "resto do minuto", OBJ("anti-extensão: tronco rígido na posição aero"))
      ]),
      b(4, "Condicionamento", 15, [
        i("air-bike", "12/10 cal", "—", OBJ("motor de pernas e braços")),
        i("sandbag-carry", "40 m", "—", OBJ("rigidez do tronco com carga ao ombro")),
        i("thruster-halteres", "8 reps (2 × 15 kg)", "—", OBJ("agachar e empurrar num só movimento")),
        i("elevacoes", "6 reps", "90 s (fim do bloco)", OBJ("força de puxar vertical"))
      ])
    ]);

  S(2, "B", "7–8",
    "Acumulação: búlgaro com barra e Copenhagen em E2MOM, corda e pogo a avançar e um E2MOM com BikeErg, trenó, devil press e suitcase carry.",
    "Búlgaro com barra a RIR 2; Copenhagen com o joelho apoiado se a virilha reclamar. E2MOM de condicionamento com 20–40 s de folga por janela.",
    119,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("corda-alternada", "2 × 40 (20/pé)", "30 s", EL("contacto curto na passada de corrida")),
        i("pogo-frente", "2 × 15", "30 s", EL("rigidez do tornozelo a avançar")),
        i("salto-comprimento", "3 × 3", "60 s", MAX("potência horizontal da anca"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro-barra", "6/perna · voltas 1–2 leves, 3–8 a RIR 2", "resto do minuto", OBJ("força unilateral pesada de joelho e anca")),
        i("copenhagen", "20 s/lado", "resto do minuto", OBJ("força dos adutores e do core lateral (prevenção da virilha)"))
      ]),
      b(4, "Condicionamento", 16, [
        i("bike-erg", "45 s forte", "—", OBJ("potência sustentada de pedalada")),
        i("treno-empurrar", "2 × 15 m", "resto da janela", OBJ("extensão da anca e do joelho com carga")),
        i("devil-press", "6 reps (2 × 12,5–15 kg)", "—", OBJ("potência da anca e empurrar acima da cabeça")),
        i("suitcase-carry", "30 m/lado", "resto da janela", OBJ("anti-flexão lateral do tronco"))
      ])
    ]);

  // ======================= SEMANA 3 — INTENSIFICAÇÃO (≥85%) =======================
  S(3, "A", "8",
    "Intensificação: agachamento em triplas a ≈85% com GHD, força elástica intensificada e um chipper que começa no remo.",
    "Tripla a RPE ≤7 → +5 kg na volta seguinte; RPE 9 → −5%. Agachamento sempre com batentes.",
    67,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltos-unipodais", "2 × 10/perna", "30 s", EL("rigidez e reatividade do tornozelo numa perna")),
        i("drop-jump", "3 × 6 (caixa 20–25 cm)", "45 s", EL("ressalto rápido (rebound): contacto <0,25 s")),
        i("salto-caixa", "3 × 3", "60 s", MAX("potência vertical de pernas"))
      ]),
      b(3, "Força", 18, [
        i("agachamento-barra", "voltas 1–3 rampa (50% × 5, 65% × 3, 75% × 2) · voltas 4–9: 3 reps a ≈85% (RPE 8)", "resto do minuto", OBJ("força máxima de extensão do joelho e da anca")),
        i("ghd-abdominais", "12 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen"))
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "500 m", "—", OBJ("motor com extensão da anca e puxada")),
        i("treno-empurrar", "4 × 15 m", "—", OBJ("extensão da anca e do joelho com carga")),
        i("sandbag-clean", "10 reps", "—", OBJ("potência da anca a levantar carga do chão")),
        i("remada-invertida", "15 reps", "—", OBJ("força de puxar horizontal")),
        i("farmer-carry", "60 m (2 × 32 kg)", "—", OBJ("força de pega e rigidez do tronco"))
      ])
    ]);

  S(3, "B", "8",
    "Intensificação: peso morto em triplas a ≈85% com Pallof isométrico, hurdle hops e rondas de 3 min com air bike, arranco e sandbag.",
    "Tripla a RPE ≤7 → +5–10 kg; RPE 9 → −5%. Reset em cada repetição do peso morto.",
    87,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("corda-alternada", "2 × 30 (15/pé)", "30 s", EL("contacto curto na passada de corrida")),
        i("saltos-barreiras", "3 × 6 (30–45 cm)", "45 s", EL("rigidez reativa a saltar barreiras (hurdle hops)")),
        i("salto-comprimento", "3 × 3", "60 s", MAX("potência horizontal da anca"))
      ]),
      b(3, "Força", 18, [
        i("peso-morto", "voltas 1–3 rampa (50% × 5, 65% × 3, 75% × 2) · voltas 4–9: 3 reps a ≈82–85% (RPE 8)", "resto do minuto", OBJ("força máxima de extensão da anca")),
        i("pallof-isometrico", "20 s/lado", "resto do minuto", OBJ("anti-rotação sob tensão contínua"))
      ]),
      b(4, "Condicionamento", 15, [
        i("air-bike", "10/8 cal", "—", OBJ("motor de pernas e braços")),
        i("haltere-snatch", "6 alternados (20–22,5 kg)", "—", OBJ("potência da anca até acima da cabeça")),
        i("sandbag-carry", "30 m", "resto dos 3 min", OBJ("rigidez do tronco com carga em abraço"))
      ])
    ]);

  // ======================= SEMANA 4 — INTENSIFICAÇÃO + ENTRADA DA POTÊNCIA =======================
  S(4, "A", "8–8,5",
    "Intensificação: agachamento a 85–87% com GHD, rebound jumps e salto com agachamento carregado (primeiro exercício de potência) e um EMOM com BikeErg e trenó.",
    "Semana mais pesada: com sono curto ou variabilidade cardíaca baixa, faz 4 voltas de trabalho e só core nas restantes. Salto carregado com halteres leves: a velocidade manda, não a carga.",
    76,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("saltos-unipodais", "2 × 12/perna", "30 s", EL("rigidez do tornozelo numa perna, mais rápido que na semana 3")),
        i("drop-jump", "4 × 5 (caixa 30 cm)", "45 s", EL("ressalto rápido com contacto <0,25 s")),
        i("salto-agachamento", "2 × 4 com 2 × 10 kg", "60 s", MAX("potência com carga leve (força-velocidade)"))
      ]),
      b(3, "Força", 18, [
        i("agachamento-barra", "voltas 1–3 rampa (50% × 5, 65% × 3, 78% × 2) · voltas 4–9: 3 reps a ≈85–87% (RPE 8–8,5)", "resto do minuto", OBJ("força máxima de extensão do joelho e da anca")),
        i("ghd-abdominais", "12 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen"))
      ]),
      b(4, "Condicionamento", 16, [
        i("bike-erg", "40 s forte", "—", OBJ("potência de pedalada")),
        i("treno-puxar", "20 m para trás", "—", OBJ("força do quadríceps em meio agachamento (ciclismo)")),
        i("devil-press", "5 reps", "—", OBJ("potência da anca e empurrar acima da cabeça")),
        i("elevacoes", "5 reps", "resto do minuto", OBJ("força de puxar vertical"))
      ])
    ]);

  S(4, "B", "8–8,5",
    "Intensificação: peso morto em duplas a 87–88% com Copenhagen, salto com trap bar (potência) e densidade com remo, búlgaros, flexões e swings pesados.",
    "Salto com trap bar com 20–30% do 1RM do peso morto: altura máxima. Swings com 32 kg, cada repetição explosiva. Densidade: o mesmo número de voltas nos 2 blocos.",
    70,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("saltos-linha", "2 × 20 (10/perna)", "30 s", EL("reatividade do tornozelo numa perna")),
        i("saltos-barreiras", "3 × 6 (40–50 cm)", "45 s", EL("rigidez reativa com barreiras mais altas")),
        i("salto-trap-bar", "3 × 4 @ 20–30% 1RM", "60 s", MAX("potência com carga (força-velocidade)"))
      ]),
      b(3, "Força", 18, [
        i("peso-morto", "voltas 1–3 rampa (50% × 5, 65% × 3, 78% × 2) · voltas 4–9: 2 reps a ≈87–88% (RPE 8–8,5)", "resto do minuto", OBJ("força máxima de extensão da anca")),
        i("copenhagen", "25 s/lado", "resto do minuto", OBJ("força dos adutores e do core lateral"))
      ]),
      b(4, "Condicionamento", 15, [
        i("remo-ergometro", "200 m", "—", OBJ("motor com extensão da anca e puxada")),
        i("split-squat-bulgaro", "6/perna (halteres)", "—", OBJ("força unilateral sob fadiga moderada")),
        i("flexoes", "12 reps", "—", OBJ("força de empurrar horizontal")),
        i("kettlebell-swing", "10 reps (32 kg)", "—", OBJ("potência da extensão da anca"))
      ])
    ]);

  // ======================= SEMANA 5 — PICO DE EXPRESSÃO DE POTÊNCIA =======================
  S(5, "A", "8–9",
    "Pico de potência: agachamento pesado-leve com toes to bar, drop jumps de 30 cm, bounding e lançamentos de bola medicinal, e intervalos curtos em air bike e BikeErg.",
    "Volume mínimo, intensidade máxima, recuperação completa. Séries leves à máxima velocidade intencional; se a 1.ª dupla for RPE 9,5, baixa 5%.",
    24,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("drop-jump", "3 × 4 (caixa 30 cm)", "75 s", EL("pico de força reativa: contacto mínimo e salto máximo (RSI)")),
        i("multisaltos", "2 × 6", "60 s", EL("bounding: passada saltada longa com contacto curto")),
        i("lancamento-medicinal-cima", "3 × 3 (bola de 4–6 kg, para trás por cima da cabeça)", "60 s", MAX("potência de extensão tripla (tornozelo, joelho, anca)"))
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "voltas 1–2 rampa (60% × 3, 80% × 1) · voltas 3–5: 2 reps a ≈88–90% · voltas 6–8: 3 reps a 60% à máxima velocidade", "resto do minuto", OBJ("expressão de força máxima e de velocidade (pesado-leve)")),
        i("toes-to-bar", "8 reps", "resto do minuto", OBJ("flexão do tronco e controlo em suspensão"))
      ]),
      b(4, "Condicionamento", 12, [
        i("air-bike", "30 s forte (intervalos ímpares)", "90 s", OBJ("potência máxima de pernas e braços")),
        i("bike-erg", "30 s forte a 95–110 rpm (intervalos pares)", "90 s", OBJ("potência de pedalada a cadência alta")),
        i("treno-empurrar", "15 m pesado (após os ímpares)", "—", OBJ("força de extensão da anca e do joelho")),
        i("elevacoes", "5 explosivas (após os pares)", "—", OBJ("potência de puxar vertical"))
      ])
    ]);

  S(5, "B", "8–9",
    "Pico de potência: búlgaro com barra pesado-leve (unilateral explosivo) com rotação landmine, bounds unipodais e salto com trap bar, e rondas com remo, sandbag e swings pesados.",
    "Saltos máximos com recuperação completa. Na parte leve do búlgaro, sobe o mais rápido possível com a mesma técnica.",
    33,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("multisaltos", "2 × 6 unipodais (3/perna)", "75 s", EL("bounds numa perna com intenção máxima")),
        i("saltos-barreiras", "3 × 5 (45–50 cm)", "60 s", EL("rigidez reativa com intenção máxima")),
        i("salto-trap-bar", "2 × 3 @ 20% 1RM", "60 s", MAX("potência com carga (força-velocidade)"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro-barra", "voltas 1–2 rampa · voltas 3–5: 4/perna pesado (RPE 8) · voltas 6–8: 3/perna a ≈50% à máxima velocidade", "resto do minuto", OBJ("potência unilateral de joelho e anca (pesado-leve)")),
        i("landmine-rotacao", "6/lado", "resto do minuto", OBJ("anti-rotação e transferência anca-tronco"))
      ]),
      b(4, "Condicionamento", 15, [
        i("remo-ergometro", "300 m", "—", OBJ("motor com extensão da anca e puxada")),
        i("sandbag-clean", "5 explosivos", "—", OBJ("potência da anca a levantar carga do chão")),
        i("kettlebell-swing", "10 reps (32 kg)", "—", OBJ("potência da extensão da anca")),
        i("farmer-carry", "40 m (2 × 32 kg)", "—", OBJ("força de pega e rigidez do tronco")),
        i("flexoes", "8 explosivas", "2 min (fim da ronda)", OBJ("potência de empurrar"))
      ])
    ]);

  // ======================= SEMANA 6 — DESCARGA + TESTES =======================
  S(6, "A", "6 (teste: 9)",
    "Descarga e teste: teste 10/5, reteste do salto vertical, tripla máxima no agachamento (1RM estimado) e repetição da peça de referência da semana 1.",
    "Tripla a RPE 9, sem falha, sempre com batentes. 1RM estimado ≈ carga × 1,10. Referência com as cargas da semana 1: compara metros, divisões, RPE e wall balls.",
    63,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 7, [
        i("pogo", "Teste 10/5: 2 × 10 (contam os 5 melhores)", "60 s", EL("medir a força reativa (RSI = altura ÷ tempo de contacto)")),
        i("saltar-corda", "2 × 20", "30 s", EL("manter a rigidez do tornozelo")),
        i("salto-contramovimento", "3 × 1 (reteste)", "60 s", MAX("medir a potência vertical"))
      ]),
      b(3, "Força", 15, [
        i("agachamento-barra", "50% × 5 · 65% × 3 · 75% × 2 · 85% × 1 · TESTE 3 reps @ RPE 9 (≈90–92%)", "resto da janela", OBJ("estimar o 1RM de agachamento")),
        i("ghd-abdominais", "8 reps", "resto da janela", OBJ("manter a força do tronco"))
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(true))
    ]);

  S(6, "B", "6 (teste: 9)",
    "Descarga e teste: teste RSI, reteste do salto em comprimento, tripla máxima no peso morto e um AMRAP leve.",
    "Teste pelo menos 72 h depois do Dia A. Tripla a RPE 9; se as costas arredondarem, a série termina aí. 1RM estimado ≈ carga × 1,10. AMRAP a RPE 6.",
    66,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 30 (15/pé)", "30 s", EL("manter o contacto curto da passada")),
        i("drop-jump", "Teste RSI: 3 × 1 (caixa 30 cm)", "60 s", EL("medir a força reativa (RSI)")),
        i("salto-comprimento", "3 × 1 (reteste)", "60 s", MAX("medir a potência horizontal"))
      ]),
      b(3, "Força", 15, [
        i("peso-morto", "50% × 5 · 65% × 3 · 75% × 2 · 85% × 1 · TESTE 3 reps @ RPE 9 (≈90–92%)", "resto da janela", OBJ("estimar o 1RM de peso morto")),
        i("pallof", "8/lado", "resto da janela", OBJ("manter a anti-rotação"))
      ]),
      b(4, "Condicionamento", 10, [
        i("remo-ergometro", "200 m fácil", "—", OBJ("motor leve de recuperação")),
        i("farmer-carry", "40 m", "—", OBJ("força de pega e rigidez do tronco")),
        i("kettlebell-clean-press", "3/braço leve", "—", OBJ("manter o padrão de potência da anca e empurrar")),
        i("remada-invertida", "8 reps", "—", OBJ("força de puxar horizontal"))
      ])
    ]);

  SESSOES.push(...sessoes);

  window.PROGRAMA_OFFSEASON = {
    id: "off-season-pessoal",
    nome: "Plano Miguel · Off-season força e potência (6 semanas)",
    objetivo: "Off-season para ciclismo e corrida em sessões curtas e cronometradas (≤55 min no papel, ≈60 min reais): força máxima primeiro (agachamento, peso morto e búlgaro; ≥85% nas semanas 3–4) e depois a potência (exercícios de potência a partir da semana 4, pico na semana 5), força elástica de contacto curto para a corrida, core (GHD, anti-extensão, anti-rotação, adutores) e um condicionamento funcional de corpo inteiro que começa sempre num ergómetro — sem corrida. 2 sessões por semana.",
    sessoes: sessoes.map((s) => s.id),
    semanas: [
      { n: 1, foco: "Acumulação e técnica", notas: "E2MOM 16: búlgaro + GHD (A) e peso morto ≈70% + Pallof (B). Força elástica de introdução (~100 contactos). Peça de referência (A) e EMOM 16 (B)." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "E2MOM 16: agachamento ≈72–75% + rollout (A) e búlgaro com barra + Copenhagen (B). ~105–120 contactos. AMRAP 3 × 4 min (A) e E2MOM 16 (B)." },
      { n: 3, foco: "Intensificação", notas: "E2MOM 18: triplas a ≈85% no agachamento (+ GHD) e no peso morto (+ Pallof isométrico). Força elástica intensificada (pogo unipodal, rebound jumps, hurdle hops). Chipper (A) e 5 rondas de 3 min (B)." },
      { n: 4, foco: "Intensificação + entrada da potência", notas: "E2MOM 18: agachamento 85–87% (+ GHD) e peso morto 87–88% (+ Copenhagen). Potência: salto com agachamento carregado, salto com trap bar, swings pesados. EMOM 16 (A) e densidade 2 × 7 min (B)." },
      { n: 5, foco: "Pico de expressão de potência", notas: "E2MOM 16 pesado-leve: agachamento (A) e búlgaro com barra (B). Drop jumps de 30 cm, bounding, lançamentos de bola medicinal, salto com trap bar, swings pesados. Intervalos 6 × 30 s (A) e 3 rondas explosivas (B)." },
      { n: 6, foco: "Descarga + testes", notas: "E3MOM 15 com tripla de teste (RPE 9) → 1RM estimado. Testes elásticos (10/5 no Dia A, RSI no Dia B) e reteste dos saltos máximos, da peça de referência e dos wall balls (A); AMRAP leve (B)." }
    ],
    cobertura: "Em cada semana: pernas pesadas bilaterais (agachamento, peso morto) e unilaterais (búlgaro com halteres ou barra) em E2MOM; core em todas as sessões (GHD, rollout, toes to bar, Pallof, rotação landmine, Copenhagen); força elástica de contacto curto (corda, pogo, linha, hurdle hops, rebound/drop jumps, bounding) e saltos máximos; potência a partir da semana 4 (salto carregado, salto com trap bar, lançamentos de bola medicinal, swings pesados, pesado-leve); transporte (farmer, sandbag, suitcase); membros superiores através de movimentos funcionais; motor sem corrida (air bike, BikeErg, remo; SkiErg na peça de referência).",
    regras: [
      "Força elástica: a pliometria separa o trabalho ELÁSTICO (ciclo alongamento-encurtamento rápido, contacto <0,25 s, tornozelo rígido — pogo, corda, hurdle hops, rebound/drop jumps baixos, bounding) do salto MÁXIMO (intenção máxima — caixa, comprimento, CMJ, trap bar, lançamentos). A força elástica devolve energia em cada apoio da corrida e treina-se com contactos curtos e descanso curto e fixo; os saltos máximos fazem-se com recuperação completa. Progressão: S1–2 introdução, S3–4 intensificação, S5 pico (intenção máxima, volume mínimo), S6 manutenção e testes (10/5 ou RSI + reteste do CMJ/comprimento).",
      "Potência: entra na semana 4 (salto com agachamento carregado, salto com trap bar a 20–30% do 1RM, swings de 32 kg) e atinge o pico na semana 5 (pesado-leve no agachamento e no búlgaro, drop jumps de 30 cm, lançamentos de bola medicinal). Cada repetição de potência é feita à máxima velocidade; se a velocidade cair visivelmente, a série termina.",
      "Sessões cronometradas: cada bloco tem relógio (E2MOM, rondas, séries com descanso fixo) no formato do bloco. Se o bloco acabar, passa ao seguinte — não estendas. Transições e carregar a barra cabem nos ~5 min que sobram até aos 60.",
      "Força em E2MOM: no minuto ímpar o exercício de pernas, no par o core. As primeiras voltas são a rampa (não há séries de aquecimento fora do relógio). Se uma volta de trabalho não deixar pelo menos 20 s de descanso no minuto, a carga está alta. No búlgaro faz as duas pernas no mesmo minuto, começando pela mais fraca.",
      "Sequência força → potência: semanas 1–3 a força domina e a pliometria é de qualidade, sem fadiga; a potência entra na semana 4 e expressa-se na semana 5; semana 6 descarga e testes. Sem base de força, o trabalho de potência rende pouco.",
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Volta a RPE 1 abaixo do alvo → +2,5–5% na seguinte. No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o levantamento e faz só core nos minutos que faltam.",
      "Nunca até à falha: RIR 2 nos levantamentos principais; só os testes da semana 6 chegam a RPE 9.",
      "Pliometria: descanso curto e fixo nos elásticos (30 s; 45 s nos rebound/hurdle hops; 60–75 s na semana 5) e recuperação completa nos máximos (60–90 s). Se o contacto ficar longo, a aterragem ruidosa ou a altura cair >10%, termina o exercício. Dor no Aquiles >3/10 ou que piora no dia seguinte → corta os saltos dessa semana. Sem duplos na corda → corda simples com o dobro dos saltos.",
      "Condicionamento = qualidade, não velocidade: começa sempre no ergómetro; EMOM/E2MOM com 15–40 s de folga; AMRAP e densidade com o mesmo número de voltas em todos os blocos; rondas com a mesma produção (≤5% de queda). Wall balls: 9 kg a 3 m, anca abaixo do joelho, só contam repetições válidas.",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas): 2 voltas de trabalho a menos na força (faz só o core nesses minutos) e corta uma ronda/volta no condicionamento.",
      "Segurança: agachamento e búlgaro com barra com batentes ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões; Copenhagen com joelho apoiado se a virilha doer; dor aguda ou articular → parar.",
      "Alternativas: sem GHD → abdominais no AbMat; sem SkiErg → remo; sem air bike → BikeErg ou bicicleta estática; sem BikeErg → air bike; sem trenó → empurrar prato ou wall sit; sem sandbag → kettlebell em goblet/farmer; sem trap bar → salto com halteres leves; sem bola medicinal → salto com agachamento carregado.",
      "Falhaste uma semana inteira? Repete-a. Falhaste uma sessão? Faz a seguinte normalmente."
    ],
    interferencia: "A resistência de off-season fica em volume moderado e sobretudo em Z1–Z2, com no máximo 1 sessão intensa de bicicleta e 1 de corrida por semana. Separa o Dia A e o Dia B por 48–72 h (ex.: terça e sexta). No mesmo dia: resistência intensa de manhã e força ≥6 h depois (nunca força antes de intervalos). Coloca a força nos dias de treino intenso (dia duro mais duro, dia fácil mais fácil). Nunca força na véspera do treino longo de bicicleta (Dia A) nem nas 48 h antes da série chave ou do longo de corrida (Dia B). No dia a seguir à força, só bicicleta ou corrida fácil. Conta a pliometria e a corrida em conjunto: semana com mais volume de corrida → corta 25–30% dos contactos. Na semana 6 baixa também o volume de resistência. Proteína 1,6–2,0 g/kg/dia (≈0,4 g/kg depois da força) e hidratos de carbono à volta das sessões."
  };
})();

// Formato de cada bloco com relógio (voltas, tempo, descanso, ordem das estações), mostrado em destaque no topo do bloco.
// Chave: id da sessão → nome do bloco (Aquecimento, Pliometria, Força, Condicionamento).
(function () {
  const AQ_A = "5 min · 0:00–3:00 BikeErg fácil · 3:00–5:00 mobilidade";
  const AQ_B = "5 min · 0:00–3:00 remo fácil · 3:00–5:00 mobilidade + 5 swings leves";
  const FORMATO = {
    "off-s1-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "7 séries · elásticos com 30 s de descanso fixo, máximo com 60 s · 99 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro (as duas pernas), min par GHD · voltas 1–2 leves",
      Condicionamento: "Referência · 4 rondas (SkiErg → flexões → farmer → elevações) · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s1-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "7 séries · elásticos com 30 s de descanso fixo, máximo com 60 s · 99 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar peso morto, min par Pallof · voltas 1–2 rampa",
      Condicionamento: "EMOM 16 min · 4 voltas · min 1 remo, min 2 KB clean & press, min 3 farmer, min 4 flexões"
    },
    "off-s2-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "8 séries · elásticos com 30 s de descanso fixo, máximo com 60 s · 106 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar agachamento, min par rollout · voltas 1–2 rampa",
      Condicionamento: "3 blocos de AMRAP 4 min · 90 s entre blocos · air bike → sandbag → thrusters → elevações"
    },
    "off-s2-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "7 séries · elásticos com 30 s de descanso fixo, máximo com 60 s · 119 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro com barra (as duas pernas), min par Copenhagen · voltas 1–2 leves",
      Condicionamento: "E2MOM 16 min · 8 janelas de 2 min · ímpar: BikeErg 45 s + trenó · par: devil press + suitcase carry"
    },
    "off-s3-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "8 séries · elásticos com 30–45 s de descanso, máximo com 60 s · 67 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD · voltas 1–3 rampa",
      Condicionamento: "Chipper · 1 passagem: remo → trenó → sandbag ao ombro → remada invertida → farmer · limite 16 min"
    },
    "off-s3-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "8 séries · elásticos com 30–45 s de descanso, máximo com 60 s · 87 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par Pallof isométrico · voltas 1–3 rampa",
      Condicionamento: "5 rondas de 3 min · air bike → arranco → sandbag · trabalho ≈2 min + descanso até fechar a janela"
    },
    "off-s4-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "8 séries · elásticos com 30–45 s de descanso, potência com 60 s · 76 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD · voltas 1–3 rampa",
      Condicionamento: "EMOM 16 min · 4 voltas · min 1 BikeErg, min 2 trenó para trás, min 3 devil press, min 4 elevações"
    },
    "off-s4-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "8 séries · elásticos com 30–45 s de descanso, potência com 60 s · 70 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par Copenhagen · voltas 1–3 rampa",
      Condicionamento: "Densidade 2 × 7 min · 1 min entre blocos · remo → búlgaro → flexões → swings pesados · máximo de voltas com técnica perfeita"
    },
    "off-s5-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "8 séries · recuperação completa (60–75 s) · 24 contactos + 9 lançamentos",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar agachamento, min par toes to bar",
      Condicionamento: "6 intervalos · 30 s forte : 90 s · ímpares air bike + trenó, pares BikeErg + elevações"
    },
    "off-s5-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "7 séries · recuperação completa (60–75 s) · 33 contactos",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar búlgaro com barra, min par rotação landmine",
      Condicionamento: "3 rondas · 2 min de descanso entre rondas · remo → sandbag ao ombro → swings → farmer → flexões · limite 15 min"
    },
    "off-s6-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "7 séries · teste 10/5 + reteste do CMJ · 30–60 s de descanso · 63 contactos",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + GHD em cada janela",
      Condicionamento: "Referência (reteste da semana 1) · 4 rondas · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s6-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "8 séries · teste RSI + reteste do salto em comprimento · 30–60 s de descanso · 66 contactos",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + Pallof em cada janela",
      Condicionamento: "AMRAP 10 min · leve (RPE 6) · remo → farmer → KB clean & press → remada invertida"
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
