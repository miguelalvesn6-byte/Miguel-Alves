// Plano Miguel — off-season de força e potência para CICLISMO e CORRIDA (6 semanas × 2 sessões = 12 sessões).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura fixa, com relógio em todos os blocos (≤55 min no papel para caber em 60 min reais com transições):
//   1 Aquecimento (5 min: ergómetro + mobilidade; a rampa de cargas está nas primeiras voltas da força)
//   2 Pliometria (3 exercícios dinâmicos: 1 elástico de contacto curto + 1 salto máximo + 1 exercício de potência balístico/carregado)
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
  const POT = (t) => `Potência · Objetivo: ${t}`;

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
    "Acumulação: búlgaro com halteres e GHD em E2MOM, pliometria de aterragem com lançamento de bola medicinal e a peça de referência do bloco.",
    "Búlgaro a RIR 3 (técnica, começa pela perna mais fraca); GHD só até à horizontal. Regista os metros do SkiErg por ronda e os wall balls (9 kg a 3 m, anca abaixo do joelho): repetes na semana 6.",
    80,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("pogo", "3 × 20", "30 s", EL("rigidez do tornozelo e aterragem leve (primer elástico)")),
        i("salto-contramovimento", "4 × 5 (1.º salto = teste)", "45 s", MAX("potência vertical e aterragem estável; altura de referência")),
        i("lancamento-medicinal-scoop", "3 × 4 (bola de 4 kg, mede a melhor)", "40 s", POT("potência balística da extensão da anca; distância de referência"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro", "8/perna · voltas 1–2 leves, 3–8 a RIR 3", "resto do minuto", OBJ("força unilateral de joelho e anca para a pedalada e o apoio da corrida")),
        i("ghd-abdominais", "10 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen (tronco rígido)"))
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(false))
    ]);

  S(1, "B", "7",
    "Acumulação: técnica do peso morto em E2MOM com GHD, saltos sobre a linha, salto em comprimento e swings explosivos, e um EMOM de corpo inteiro que começa no remo.",
    "Cada repetição do peso morto parte do chão parado; se as voltas de trabalho ficarem a RPE ≤6, +5–10 kg na semana 3.",
    84,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 10, [
        i("saltos-linha", "3 × 24", "30 s", EL("reatividade do tornozelo com contacto curto")),
        i("salto-comprimento", "4 × 3 (melhor marca = teste)", "45 s", MAX("potência horizontal da anca e aterragem fixa; marca de referência")),
        i("kettlebell-swing", "3 × 8 explosivos (24 kg)", "45 s", POT("potência balística da extensão da anca"))
      ]),
      b(3, "Força", 16, [
        i("peso-morto", "4 reps · voltas 1–2 rampa (50%, 60%), 3–8 a ≈70% (RPE 7)", "resto do minuto", OBJ("força de extensão da anca (cadeia posterior)")),
        i("ghd-abdominais", "10 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen (tronco rígido)"))
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
    "Acumulação: agachamento a ≈72–75% com GHD em E2MOM, saltos laterais na caixa, patinador e passe de peito com bola medicinal, e AMRAP controlados.",
    "Primeira semana de agachamento com barra: se as voltas de trabalho ficarem a RPE ≤6, +5 kg na semana 3. AMRAP: o mesmo número de voltas nos 3 blocos.",
    84,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 9, [
        i("salto-caixa-lateral", "3 × 16 contínuos", "30 s", EL("reatividade lateral do tornozelo")),
        i("saltos-patinador", "3 × 6/lado (fixa 2 s)", "45 s", MAX("potência lateral e controlo da aterragem numa perna")),
        i("passe-peito-medicinal", "3 × 5 (bola de 4–5 kg)", "45 s", POT("potência balística de empurrar com transferência das pernas"))
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "5 reps · voltas 1–2 rampa (50%, 60%), 3–8 a ≈72–75% (RPE 7)", "resto do minuto", OBJ("força máxima de extensão do joelho e da anca")),
        i("ghd-abdominais", "12 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen (tronco rígido na posição aero)"))
      ]),
      b(4, "Condicionamento", 15, [
        i("air-bike", "12/10 cal", "—", OBJ("motor de pernas e braços")),
        i("sandbag-carry", "40 m", "—", OBJ("rigidez do tronco com carga ao ombro")),
        i("thruster-halteres", "8 reps (2 × 15 kg)", "—", OBJ("agachar e empurrar num só movimento")),
        i("elevacoes", "6 reps", "90 s (fim do bloco)", OBJ("força de puxar vertical"))
      ])
    ]);

  S(2, "B", "7–8",
    "Acumulação: búlgaro com barra e GHD em E2MOM, corda e pogo a avançar e um E2MOM com BikeErg, trenó, devil press e suitcase carry.",
    "Búlgaro com barra a RIR 2; GHD controlado até à horizontal. E2MOM de condicionamento com 20–40 s de folga por janela.",
    96,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("pogo-frente", "3 × 20", "30 s", EL("rigidez do tornozelo a avançar")),
        i("salto-afundo", "3 × 8 (4/perna)", "45 s", MAX("potência unilateral alternada e troca rápida de pernas")),
        i("salto-agachamento", "3 × 4 com 2 × 8 kg", "60 s", POT("potência com carga leve (força-velocidade)"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro-barra", "6/perna · voltas 1–2 leves, 3–8 a RIR 2", "resto do minuto", OBJ("força unilateral pesada de joelho e anca")),
        i("ghd-abdominais", "12 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen"))
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
    "Intensificação: agachamento em triplas a ≈85% com GHD, hurdle hops contínuos, depth jump para caixa e lançamento rotacional, e um chipper que começa no remo.",
    "Tripla a RPE ≤7 → +5 kg na volta seguinte; RPE 9 → −5%. Agachamento sempre com batentes.",
    62,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 10, [
        i("saltos-barreiras", "5 × 10 contínuos (30–40 cm)", "30 s", EL("rigidez reativa em saltos contínuos (hurdle hops)")),
        i("depth-jump-caixa", "3 × 4 (queda de 30 cm → caixa de 50–60 cm)", "60 s", MAX("força reativa transformada em salto vertical máximo")),
        i("lancamento-rotacional", "2 × 5/lado (bola de 4–6 kg)", "45 s", POT("potência rotacional da anca e do tronco"))
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
    "Intensificação: peso morto em triplas a ≈85% com GHD, hurdle hops e rondas de 3 min com air bike, arranco e sandbag.",
    "Tripla a RPE ≤7 → +5–10 kg; RPE 9 → −5%. Reset em cada repetição do peso morto.",
    70,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 10, [
        i("saltos-barreiras-laterais", "4 × 10", "30 s", EL("reatividade lateral e estabilidade da anca")),
        i("salto-caixa-unipodal", "3 × 3/perna (caixa de 30–40 cm)", "45 s", MAX("potência unilateral vertical e aterragem estável")),
        i("salto-trap-bar", "3 × 4 @ 20–30% 1RM", "60 s", POT("potência com carga (força-velocidade)"))
      ]),
      b(3, "Força", 18, [
        i("peso-morto", "voltas 1–3 rampa (50% × 5, 65% × 3, 75% × 2) · voltas 4–9: 3 reps a ≈82–85% (RPE 8)", "resto do minuto", OBJ("força máxima de extensão da anca")),
        i("ghd-abdominais", "14 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen"))
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
    75,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 10, [
        i("saltos-zigzag", "3 × 8/perna", "30 s", EL("reatividade unilateral com mudança de direção")),
        i("salto-caixa-continuo", "3 × 5 (caixa de 40–50 cm)", "60 s", MAX("potência vertical repetida com contacto curto")),
        i("salto-agachamento", "3 × 4 com 2 × 12 kg", "60 s", POT("potência com carga (força-velocidade)"))
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
    "Intensificação: peso morto em duplas a 87–88% com GHD, salto com trap bar (potência) e densidade com remo, búlgaros, flexões e swings pesados.",
    "Salto com trap bar com 20–30% do 1RM do peso morto: altura máxima. Swings com 32 kg, cada repetição explosiva. Densidade: o mesmo número de voltas nos 2 blocos.",
    70,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 10, [
        i("saltos-barreiras", "4 × 10 contínuos (40–50 cm)", "30 s", EL("rigidez reativa com barreiras mais altas")),
        i("triplo-salto", "3 × 2/perna", "60 s", MAX("potência unilateral horizontal (saltos para distância)")),
        i("salto-trap-bar", "3 × 4 @ 25–30% 1RM", "60 s", POT("potência com carga (força-velocidade)"))
      ]),
      b(3, "Força", 18, [
        i("peso-morto", "voltas 1–3 rampa (50% × 5, 65% × 3, 78% × 2) · voltas 4–9: 2 reps a ≈87–88% (RPE 8–8,5)", "resto do minuto", OBJ("força máxima de extensão da anca")),
        i("ghd-abdominais", "15 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen"))
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
    "Pico de potência: agachamento pesado-leve com GHD carregado, bounding máximo, depth jump para comprimento e lançamento pesado de bola medicinal, e intervalos curtos em air bike e BikeErg.",
    "Volume mínimo, intensidade máxima, recuperação completa. Séries leves à máxima velocidade intencional; se a 1.ª dupla for RPE 9,5, baixa 5%.",
    30,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 10, [
        i("multisaltos", "3 × 6 (bounds máximos)", "60 s", EL("bounding com intenção máxima e contacto curto")),
        i("depth-jump-comprimento", "3 × 4 (queda de 30 cm, mede a melhor)", "60 s", MAX("força reativa transformada em salto horizontal máximo")),
        i("lancamento-medicinal-cima", "3 × 3 (bola de 6–8 kg, para trás)", "60 s", POT("potência máxima de extensão tripla (balístico mais pesado)"))
      ]),
      b(3, "Força", 16, [
        i("agachamento-barra", "voltas 1–2 rampa (60% × 3, 80% × 1) · voltas 3–5: 2 reps a ≈88–90% · voltas 6–8: 3 reps a 60% à máxima velocidade", "resto do minuto", OBJ("expressão de força máxima e de velocidade (pesado-leve)")),
        i("ghd-abdominais", "10 reps com 5 kg ao peito", "resto do minuto", OBJ("força máxima dos flexores da anca e do abdómen"))
      ]),
      b(4, "Condicionamento", 12, [
        i("air-bike", "30 s forte (intervalos ímpares)", "90 s", OBJ("potência máxima de pernas e braços")),
        i("bike-erg", "30 s forte a 95–110 rpm (intervalos pares)", "90 s", OBJ("potência de pedalada a cadência alta")),
        i("treno-empurrar", "15 m pesado (após os ímpares)", "—", OBJ("força de extensão da anca e do joelho")),
        i("elevacoes", "5 explosivas (após os pares)", "—", OBJ("potência de puxar vertical"))
      ])
    ]);

  S(5, "B", "8–9",
    "Pico de potência: búlgaro com barra pesado-leve (unilateral explosivo) com GHD carregado, bounds unipodais e salto com trap bar, e rondas com remo, sandbag e swings pesados.",
    "Saltos máximos com recuperação completa. Na parte leve do búlgaro, sobe o mais rápido possível com a mesma técnica.",
    45,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 10, [
        i("saltos-patinador", "2 × 6/lado contínuos e máximos", "45 s", EL("reatividade lateral com intenção máxima")),
        i("salto-caixa-unipodal", "3 × 2/perna (caixa de 40–50 cm)", "60 s", MAX("potência unilateral vertical máxima")),
        i("salto-trap-bar", "3 × 3 @ 30–35% 1RM", "75 s", POT("potência com a carga mais alta do bloco"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro-barra", "voltas 1–2 rampa · voltas 3–5: 4/perna pesado (RPE 8) · voltas 6–8: 3/perna a ≈50% à máxima velocidade", "resto do minuto", OBJ("potência unilateral de joelho e anca (pesado-leve)")),
        i("ghd-abdominais", "10 reps com 5 kg ao peito", "resto do minuto", OBJ("força máxima dos flexores da anca e do abdómen"))
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
      b(2, "Pliometria", 9, [
        i("pogo", "Teste 10/5: 2 × 10 (contam os 5 melhores) + 2 × 20 de manutenção", "40 s", EL("medir e manter a força reativa (RSI = altura ÷ tempo de contacto)")),
        i("salto-contramovimento", "3 × 1 (reteste)", "60 s", MAX("medir a potência vertical")),
        i("lancamento-medicinal-scoop", "3 × 3 (reteste, bola de 4 kg)", "45 s", POT("medir a potência balística da anca"))
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
    26,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 9, [
        i("drop-jump", "Teste RSI: 3 × 1 (caixa de 30 cm) + 2 × 10 rebound baixos", "60 s", EL("medir e manter a força reativa (RSI)")),
        i("salto-comprimento", "3 × 1 (reteste)", "60 s", MAX("medir a potência horizontal")),
        i("kettlebell-swing", "2 × 6 explosivos (24 kg)", "45 s", POT("manter a potência balística da anca"))
      ]),
      b(3, "Força", 15, [
        i("peso-morto", "50% × 5 · 65% × 3 · 75% × 2 · 85% × 1 · TESTE 3 reps @ RPE 9 (≈90–92%)", "resto da janela", OBJ("estimar o 1RM de peso morto")),
        i("ghd-abdominais", "8 reps", "resto da janela", OBJ("manter a força do tronco"))
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
      { n: 1, foco: "Acumulação e técnica", notas: "E2MOM 16: búlgaro + GHD (A) e peso morto ≈70% + GHD (B). Pliometria: aterragem, pogo/linha, CMJ e comprimento (testes) + scoop toss e swings explosivos (~80–85 contactos). Peça de referência (A) e EMOM 16 (B)." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "E2MOM 16: agachamento ≈72–75% + GHD (A) e búlgaro com barra + GHD (B). Pliometria: caixa lateral contínua, patinador com fixação, pogo a avançar, saltos em afundo + passe de peito e salto carregado leve (~85–95 contactos). AMRAP 3 × 4 min (A) e E2MOM 16 (B)." },
      { n: 3, foco: "Intensificação", notas: "E2MOM 18: triplas a ≈85% no agachamento (+ GHD) e no peso morto (+ GHD). Pliometria: hurdle hops contínuos e laterais, depth jump para caixa, salto à caixa unipodal + lançamento rotacional e trap bar (~60–70 contactos). Chipper (A) e 5 rondas de 3 min (B)." },
      { n: 4, foco: "Intensificação + entrada da potência", notas: "E2MOM 18: agachamento 85–87% (+ GHD) e peso morto 87–88% (+ GHD). Pliometria: zigue-zague, caixa contínua, triplo salto + salto carregado e trap bar (~70–75 contactos); swings pesados no condicionamento. EMOM 16 (A) e densidade 2 × 7 min (B)." },
      { n: 5, foco: "Pico de expressão de potência", notas: "E2MOM 16 pesado-leve: agachamento (A) e búlgaro com barra (B). Pliometria: bounding máximo, depth jump para comprimento, caixa unipodal alta, patinador contínuo + lançamento de 6–8 kg e trap bar a 30–35% (~30–45 contactos). Intervalos 6 × 30 s (A) e 3 rondas explosivas (B)." },
      { n: 6, foco: "Descarga + testes", notas: "E3MOM 15 com tripla de teste (RPE 9) → 1RM estimado. Testes elásticos (10/5 no Dia A, RSI no Dia B) e reteste dos saltos máximos, da peça de referência e dos wall balls (A); AMRAP leve (B)." }
    ],
    cobertura: "Em cada semana: pernas pesadas bilaterais (agachamento, peso morto) e unilaterais (búlgaro com halteres ou barra) em E2MOM; core com GHD em todas as sessões (10 → 15 reps, 5 kg ao peito na semana 5); força elástica de contacto curto (corda, pogo, linha, hurdle hops, rebound/drop jumps, bounding) e saltos máximos dinâmicos (laterais, unilaterais, contínuos, depth jumps); potência em todas as sessões (lançamentos de bola medicinal, swings explosivos, salto carregado, salto com trap bar) e pesado-leve na semana 5; transporte (farmer, sandbag, suitcase); membros superiores através de movimentos funcionais; motor sem corrida (air bike, BikeErg, remo; SkiErg na peça de referência).",
    regras: [
      "Pliometria em três partes: ELÁSTICO (contacto <0,25 s, tornozelo rígido, descanso curto — pogo, linha, caixa lateral, hurdle hops, zigue-zague, bounding), MÁXIMO (um salto de cada vez com intenção máxima e aterragem fixa — CMJ, comprimento, patinador, saltos em afundo, depth jump para caixa/comprimento, caixa unipodal, triplo salto) e POTÊNCIA (balístico ou carregado com recuperação completa — lançamentos de bola medicinal, swings explosivos, salto carregado, salto com trap bar). A força elástica devolve energia em cada apoio da corrida; o máximo e a potência levam a força do ginásio para o salto. Progressão: S1–2 aprender a aterrar + elástico de baixa intensidade + balístico leve; S3–4 contínuo, unilateral e lateral, depth jump para caixa; S5 pico (depth jump para comprimento, bounds máximos, balístico mais pesado, volume mínimo); S6 testes (10/5 ou RSI + reteste do CMJ, do comprimento e do lançamento).",
      "Potência: há um exercício de potência em todas as sessões (no bloco de pliometria), com carga a subir ao longo do bloco: bola de 4 kg e swings de 24 kg nas semanas 1–2, trap bar a 20–30% e salto com halteres nas semanas 3–4, bola de 6–8 kg e trap bar a 30–35% na semana 5; mais o pesado-leve no agachamento e no búlgaro na semana 5. Cada repetição à máxima velocidade; se a velocidade cair visivelmente, a série termina.",
      "Sessões cronometradas: cada bloco tem relógio (E2MOM, rondas, séries com descanso fixo) no formato do bloco. Se o bloco acabar, passa ao seguinte — não estendas. Transições e carregar a barra cabem nos ~5 min que sobram até aos 60.",
      "Força em E2MOM: no minuto ímpar o exercício de pernas, no par o core. As primeiras voltas são a rampa (não há séries de aquecimento fora do relógio). Se uma volta de trabalho não deixar pelo menos 20 s de descanso no minuto, a carga está alta. No búlgaro faz as duas pernas no mesmo minuto, começando pela mais fraca.",
      "Sequência força → potência: semanas 1–3 a força domina e a pliometria é de qualidade, sem fadiga; a potência entra na semana 4 e expressa-se na semana 5; semana 6 descarga e testes. Sem base de força, o trabalho de potência rende pouco.",
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Volta a RPE 1 abaixo do alvo → +2,5–5% na seguinte. No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o levantamento e faz só core nos minutos que faltam.",
      "Nunca até à falha: RIR 2 nos levantamentos principais; só os testes da semana 6 chegam a RPE 9.",
      "Pliometria: descanso curto e fixo nos elásticos (30 s; 45–60 s na semana 5) e recuperação completa nos máximos e na potência (45–75 s). Se o contacto ficar longo, a aterragem ruidosa ou a altura cair >10%, termina o exercício. Dor no Aquiles >3/10 ou que piora no dia seguinte → corta os saltos dessa semana. Sem duplos na corda → corda simples com o dobro dos saltos.",
      "Condicionamento = qualidade, não velocidade: começa sempre no ergómetro; EMOM/E2MOM com 15–40 s de folga; AMRAP e densidade com o mesmo número de voltas em todos os blocos; rondas com a mesma produção (≤5% de queda). Wall balls: 9 kg a 3 m, anca abaixo do joelho, só contam repetições válidas.",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas): 2 voltas de trabalho a menos na força (faz só o core nesses minutos) e corta uma ronda/volta no condicionamento.",
      "Segurança: agachamento e búlgaro com barra com batentes ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões; dor aguda ou articular → parar.",
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
      Pliometria: "10 séries · elástico 30 s · máximo 45 s · potência 40 s · 80 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro (as duas pernas), min par GHD · voltas 1–2 leves",
      Condicionamento: "Referência · 4 rondas (SkiErg → flexões → farmer → elevações) · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s1-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "10 séries · elástico 30 s · máximo 45 s · potência 45 s · 84 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar peso morto, min par GHD · voltas 1–2 rampa",
      Condicionamento: "EMOM 16 min · 4 voltas · min 1 remo, min 2 KB clean & press, min 3 farmer, min 4 flexões"
    },
    "off-s2-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "9 séries · elástico 30 s · máximo 45 s · potência 45 s · 84 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar agachamento, min par GHD · voltas 1–2 rampa",
      Condicionamento: "3 blocos de AMRAP 4 min · 90 s entre blocos · air bike → sandbag → thrusters → elevações"
    },
    "off-s2-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "9 séries · elástico 30 s · máximo 45 s · potência 60 s · 96 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro com barra (as duas pernas), min par GHD · voltas 1–2 leves",
      Condicionamento: "E2MOM 16 min · 8 janelas de 2 min · ímpar: BikeErg 45 s + trenó · par: devil press + suitcase carry"
    },
    "off-s3-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "10 séries · elástico 30 s · máximo 60 s · potência 45 s · 62 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD · voltas 1–3 rampa",
      Condicionamento: "Chipper · 1 passagem: remo → trenó → sandbag ao ombro → remada invertida → farmer · limite 16 min"
    },
    "off-s3-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "10 séries · elástico 30 s · máximo 45 s · potência 60 s · 70 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par GHD · voltas 1–3 rampa",
      Condicionamento: "5 rondas de 3 min · air bike → arranco → sandbag · trabalho ≈2 min + descanso até fechar a janela"
    },
    "off-s4-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "9 séries · elástico 30 s · máximo 60 s · potência 60 s · 75 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD · voltas 1–3 rampa",
      Condicionamento: "EMOM 16 min · 4 voltas · min 1 BikeErg, min 2 trenó para trás, min 3 devil press, min 4 elevações"
    },
    "off-s4-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "10 séries · elástico 30 s · máximo 60 s · potência 60 s · 70 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par GHD · voltas 1–3 rampa",
      Condicionamento: "Densidade 2 × 7 min · 1 min entre blocos · remo → búlgaro → flexões → swings pesados · máximo de voltas com técnica perfeita"
    },
    "off-s5-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "9 séries · recuperação completa (60 s) · 30 contactos de intensidade máxima",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar agachamento, min par GHD com 5 kg",
      Condicionamento: "6 intervalos · 30 s forte : 90 s · ímpares air bike + trenó, pares BikeErg + elevações"
    },
    "off-s5-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "8 séries · recuperação completa (45–75 s) · 45 contactos de intensidade máxima",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar búlgaro com barra, min par GHD com 5 kg",
      Condicionamento: "3 rondas · 2 min de descanso entre rondas · remo → sandbag ao ombro → swings → farmer → flexões · limite 15 min"
    },
    "off-s6-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "10 séries · teste 10/5 + reteste do CMJ e do lançamento · 40–60 s de descanso · 63 contactos",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + GHD em cada janela",
      Condicionamento: "Referência (reteste da semana 1) · 4 rondas · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s6-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "9 séries · teste RSI + reteste do salto em comprimento · 30–60 s de descanso · 26 contactos (descarga)",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + GHD em cada janela",
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
