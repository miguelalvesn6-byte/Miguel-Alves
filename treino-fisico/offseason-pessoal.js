// Plano Miguel — off-season de força e potência para CICLISMO e CORRIDA (6 semanas × 2 sessões = 12 sessões).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura fixa, com relógio em todos os blocos (≈47–60 min no papel; a pliometria é longa de propósito — ajusta a força/condicionamento se precisares):
//   1 Aquecimento (5 min: ergómetro + mobilidade; a rampa de cargas está nas primeiras voltas da força)
//   2 Pliometria específica de corrida (15–21 min, 6 exercícios, 80–200 contactos): primer elástico de tornozelo (tornozelos, pogo)
//     → reativo/elástico (hurdle hops, pogo a uma perna, skipping, tesouras, zigue-zague) → máximo unilateral/horizontal/RSI
//     (bounds, triplo salto, depth/drop jumps, caixas) → 1 exercício de potência (lançamento, swing, step-up explosivo, salto carregado).
//     Dia A = vertical/rigidez/RSI; Dia B = horizontal/bounding. S1–2 volume baixo-intensidade, S3–4 intensificação, S5 pico, S6 testes.
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
    "Acumulação: búlgaro com halteres e GHD em E2MOM, pliometria técnica de rigidez (tornozelos, pogo, pogo a uma perna) com testes de CMJ, triplo salto a uma perna e scoop toss, e a peça de referência do bloco.",
    "Búlgaro a RIR 3 (técnica, começa pela perna mais fraca); GHD só até à horizontal. Regista o CMJ, o triplo salto de cada perna e o scoop toss, os metros do SkiErg por ronda e os wall balls (9 kg a 3 m, anca abaixo do joelho): repetes tudo na semana 6.",
    170,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 17, [
        i("tornozelos", "2 × 20 apoios (≈10 m)", "20 s (volta a andar)", EL("tornozelo rígido e pé a aterrar debaixo da anca (primer)")),
        i("pogo", "3 × 20", "30 s", EL("rigidez do tornozelo com contacto curto e corpo alto")),
        i("saltos-unipodais", "2 × 10/perna no sítio", "30 s", EL("rigidez do tornozelo numa perna, como no apoio da corrida")),
        i("salto-contramovimento", "4 × 3 (5 s entre saltos; melhor salto da 1.ª série = teste)", "60 s", MAX("potência vertical e aterragem estável; altura de referência")),
        i("triplo-salto", "3 × 1/perna (teste: melhor marca de cada perna)", "60 s", MAX("potência unilateral horizontal e diferença entre pernas; marca de referência")),
        i("lancamento-medicinal-scoop", "3 × 4 (bola de 4 kg, mede a melhor)", "45 s", POT("potência balística da extensão da anca; distância de referência"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro", "8/perna · voltas 1–2 leves, 3–8 a RIR 3", "resto do minuto", OBJ("força unilateral de joelho e anca para a pedalada e o apoio da corrida")),
        i("ghd-abdominais", "10 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen (tronco rígido)"))
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(false))
    ]);

  S(1, "B", "7",
    "Acumulação: técnica do peso morto em E2MOM com GHD, pliometria horizontal (pogo a avançar, skipping em altura, saltos em tesoura) com testes de salto em comprimento e 5 bounds, swings explosivos, e um EMOM de corpo inteiro que começa no remo.",
    "Cada repetição do peso morto parte do chão parado; se as voltas de trabalho ficarem a RPE ≤6, +5–10 kg na semana 3. Bounds numa pista de 20–30 m; regista a melhor marca do comprimento e dos 5 bounds (repetes na semana 6).",
    161,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 20, [
        i("pogo-frente", "3 × 20 (≈15 m)", "30 s", EL("rigidez do tornozelo a avançar com o pé debaixo da anca (primer)")),
        i("skipping-altura", "3 × 8 skips (4/perna)", "45 s (volta a andar)", EL("impulso do tornozelo e da anca com joelho alto e braço oposto")),
        i("salto-afundo", "3 × 10 cíclicos (5/perna)", "45 s", EL("troca rápida de pernas em tesoura com tronco alto (padrão da passada)")),
        i("salto-comprimento", "4 × 2 (melhor marca = teste)", "60 s", MAX("potência horizontal da anca e aterragem fixa; marca de referência")),
        i("multisaltos", "3 × 5 bounds a partir de parado (teste: melhor distância)", "75 s (volta a andar)", MAX("potência horizontal alternada (bounding); distância de referência dos 5 bounds")),
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
    "Acumulação: búlgaro com barra pesado (poucas repetições) com GHD em E2MOM, pliometria de volume (tornozelos, pogo lateral, hurdle hops, pogo a uma perna a avançar, saltos à caixa contínuos) com lançamento rotacional à parede, e AMRAP controlados com SkiErg.",
    "Búlgaro pesado: 4/perna com a carga mais alta que mantém a técnica (RIR 2); se ficar fácil, sobe 2,5–5 kg na volta seguinte. AMRAP: o mesmo número de voltas nos 3 blocos.",
    180,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 16, [
        i("tornozelos", "2 × 20 apoios (≈10 m)", "20 s (volta a andar)", EL("tornozelo rígido e pé a aterrar debaixo da anca (primer)")),
        i("pogo-lateral", "2 × 20", "30 s", EL("rigidez lateral do tornozelo com contacto curto")),
        i("saltos-barreiras", "5 × 6 barreiras (30 cm)", "45 s", EL("rigidez reativa em saltos contínuos (hurdle hops)")),
        i("saltos-unipodais", "2 × 10/perna a avançar (≈5 m)", "30 s", EL("rigidez reativa numa perna a avançar (apoio da corrida)")),
        i("salto-caixa-continuo", "3 × 5 (caixa de 50 cm)", "60 s", MAX("potência vertical repetida com ressalto curto no chão")),
        i("lancamento-rotacional", "3 × 4/lado (bola de 4–6 kg)", "45 s", POT("potência rotacional da anca e do tronco"))
      ]),
      b(3, "Força", 16, [
        i("split-squat-bulgaro-barra", "4/perna · voltas 1–2 rampa leve, 3–8 pesado a RIR 2 (RPE 8)", "resto do minuto", OBJ("força máxima unilateral de joelho e anca")),
        i("ghd-abdominais", "12 reps", "resto do minuto", OBJ("força dos flexores da anca e do abdómen (tronco rígido na posição aero)"))
      ]),
      b(4, "Condicionamento", 15, [
        i("ski-erg", "12/10 cal", "—", OBJ("motor de corpo inteiro")),
        i("farmer-carry", "40 m (2 halteres de 28–32 kg)", "—", OBJ("força de pega e rigidez do tronco sob carga")),
        i("thruster-halteres", "8 reps (2 × 15 kg)", "—", OBJ("agachar e empurrar num só movimento")),
        i("elevacoes", "6 reps", "90 s (fim do bloco)", OBJ("força de puxar vertical"))
      ])
    ]);

  S(2, "B", "7–8",
    "Acumulação: búlgaro com barra e GHD em E2MOM, pliometria horizontal de volume (pogo a avançar, skipping em comprimento, tesouras, patinador, bounds a 80%) com step-up explosivo, e um E2MOM com BikeErg, trenó, devil press e suitcase carry.",
    "Búlgaro com barra a RIR 2; GHD controlado até à horizontal. Bounds a 80%: passada longa e fluida, sem procurar a marca. E2MOM de condicionamento com 20–40 s de folga por janela.",
    198,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 19, [
        i("pogo-frente", "2 × 20 (≈15 m)", "30 s", EL("rigidez do tornozelo a avançar com o pé debaixo da anca (primer)")),
        i("skipping-distancia", "3 × 8 skips (4/perna, ≈20–25 m)", "45 s (volta a andar)", EL("impulso horizontal da anca com aterragem ativa debaixo do corpo")),
        i("salto-afundo", "3 × 8 cíclicos (4/perna)", "45 s", EL("troca rápida de pernas em tesoura com tronco alto (padrão da passada)")),
        i("saltos-patinador", "3 × 5/lado (fixa 1 s)", "45 s", MAX("potência lateral e controlo da aterragem numa perna")),
        i("multisaltos", "4 × 8 apoios (bounds alternados a 80%)", "60 s (volta a andar)", EL("elasticidade da passada longa com o pé a aterrar debaixo da anca")),
        i("step-up-explosivo", "3 × 4/perna (2 × 8 kg, caixa de 40 cm)", "60 s", POT("potência unilateral da anca com o joelho a subir (impulsão da passada)"))
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
    "Intensificação: agachamento em triplas a ≈85% com GHD, pliometria reativa (hurdle hops a 40 cm, hurdle hops a uma perna, depth jump para caixa, caixa unipodal) com salto carregado, e um chipper que começa no remo.",
    "Tripla a RPE ≤7 → +5 kg na volta seguinte; RPE 9 → −5%. Agachamento sempre com batentes.",
    148,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 20, [
        i("pogo", "2 × 20", "30 s", EL("rigidez do tornozelo com contacto curto e corpo alto (primer)")),
        i("saltos-barreiras", "4 × 6 barreiras (40 cm)", "45 s", EL("rigidez reativa em saltos contínuos mais altos (hurdle hops)")),
        i("saltos-barreiras-unipodais", "3 × 5 barreiras/perna (15 cm)", "45 s", EL("rigidez reativa numa perna com contacto curto (apoio da corrida)")),
        i("depth-jump-caixa", "3 × 4 (queda de 30 cm → caixa de 50–60 cm)", "60 s", MAX("força reativa transformada em salto vertical máximo")),
        i("salto-caixa-unipodal", "3 × 3/perna (caixa de 40 cm)", "60 s", MAX("potência unilateral vertical e aterragem estável")),
        i("salto-agachamento", "3 × 4 com 2 × 12 kg", "60 s", POT("potência com carga leve (força-velocidade)"))
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
    "Intensificação simples: pliometria com saltos (incluindo salto à caixa com extensão completa) e drop jumps (cai da caixa e salta logo do chão), peso morto pesado em 3 × 3 com GHD 3 × 12, e 4 rondas de corpo inteiro com SkiErg, sandbag, afundos com sandbag, burpees com salto, floor press e wall walks.",
    "Peso morto: rampa até à carga de trabalho e depois 3 × 3 pesado (RPE 8; reset em cada repetição). Drop jump: deixa-te cair da caixa (não saltes dela) e sai do chão o mais rápido possível. Os 40 burpees com salto em comprimento do condicionamento são contactos extra.",
    116,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 14, [
        i("pogo", "3 × 20", "30 s", EL("rigidez do tornozelo e contacto curto (primer)")),
        i("salto-caixa", "3 × 5 (caixa de 50–60 cm: aterra e estende por completo joelhos e anca em cima da caixa; desce a andar)", "45 s", MAX("potência vertical com extensão completa de joelho e anca")),
        i("salto-comprimento", "3 × 3", "60 s", MAX("potência horizontal da anca com aterragem fixa")),
        i("drop-jump", "4 × 4 (caixa de 30–40 cm: cai e salta logo do chão)", "60 s", MAX("força reativa: contacto curto e salto máximo depois da queda"))
      ]),
      b(3, "Força", 15, [
        i("peso-morto", "rampa (50% × 5, 65% × 3, 75% × 2) · depois 3 × 3 pesado a ≈85–88% (RPE 8)", "2–3 min (o GHD entra no descanso)", OBJ("força máxima de extensão da anca")),
        i("ghd-abdominais", "3 × 12", "logo a seguir ao peso morto", OBJ("força dos flexores da anca e do abdómen"))
      ]),
      b(4, "Condicionamento", 20, [
        i("ski-erg", "15 cal", "—", OBJ("motor de corpo inteiro")),
        i("sandbag-carry", "40 m", "—", OBJ("rigidez do tronco com carga em abraço")),
        i("afundo-andar", "10 reps com sandbag ao ombro ou em abraço", "—", OBJ("força unilateral de pernas sob carga")),
        i("burpee-salto-comprimento", "10 reps", "—", OBJ("potência horizontal de pernas sob fadiga")),
        i("floor-press", "10 reps (2 halteres, carga moderada)", "—", OBJ("força de empurrar horizontal")),
        i("wall-walk", "3 reps", "fim da ronda", OBJ("força dos ombros e rigidez do tronco em pino"))
      ])
    ]);

  // ======================= SEMANA 4 — INTENSIFICAÇÃO + ENTRADA DA POTÊNCIA =======================
  S(4, "A", "8–8,5",
    "Intensificação: agachamento a 85–87% com GHD, pliometria reativa (hurdle hops a 45–50 cm e a uma perna, drop jump para RSI, saltos em série por 4 caixas) com step-up explosivo carregado, e um EMOM com BikeErg e trenó.",
    "Semana mais pesada: com sono curto ou variabilidade cardíaca baixa, faz 4 voltas de trabalho e só core nas restantes. Step-up explosivo com halteres leves: a velocidade manda, não a carga.",
    141,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 21, [
        i("saltos-linha", "2 × 15 (frente e trás)", "30 s", EL("reatividade do tornozelo com contacto curto (primer)")),
        i("saltos-barreiras", "3 × 6 barreiras (45–50 cm)", "60 s", EL("rigidez reativa com barreiras mais altas")),
        i("saltos-barreiras-unipodais", "3 × 6 barreiras/perna (20 cm)", "60 s", EL("rigidez reativa numa perna com contacto curto (apoio da corrida)")),
        i("drop-jump", "3 × 3 (caixa de 30 cm, contacto <0,2 s)", "60 s", MAX("força reativa vertical com contacto mínimo (RSI)")),
        i("saltos-caixas-serie", "3 × 4 caixas em fila (40–50 cm)", "75 s", MAX("potência vertical repetida de caixa em caixa com contacto curto")),
        i("step-up-explosivo", "3 × 3/perna (2 × 10–12 kg, caixa de 40 cm)", "60 s", POT("potência unilateral da anca com o joelho a subir (impulsão da passada)"))
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
    "Intensificação: peso morto em duplas a 87–88% com GHD, pliometria horizontal (skipping em comprimento máximo, patinador contínuo, bounds máximos de 10 apoios, triplo salto) com salto com trap bar, e densidade com remo, búlgaros, flexões e swings pesados.",
    "Salto com trap bar com 25–30% do 1RM do peso morto: altura máxima. Swings com 32 kg, cada repetição explosiva. Densidade: o mesmo número de voltas nos 2 blocos.",
    149,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 20, [
        i("pogo-frente", "2 × 15 (≈12 m)", "30 s", EL("rigidez do tornozelo a avançar com o pé debaixo da anca (primer)")),
        i("skipping-distancia", "2 × 8 skips máximos (≈25–30 m)", "60 s (volta a andar)", EL("impulso horizontal da anca com aterragem ativa debaixo do corpo")),
        i("saltos-patinador", "3 × 5/lado contínuos (sem fixar)", "45 s", EL("reatividade lateral contínua com apoio ativo")),
        i("multisaltos", "3 × 10 apoios (3 passos de balanço, distância máxima)", "90 s (volta a andar)", MAX("potência horizontal alternada mantida em 10 apoios")),
        i("triplo-salto", "3 × 1/perna (máximo)", "60 s", MAX("potência unilateral horizontal (hops para distância)")),
        i("salto-trap-bar", "3 × 3 @ 25–30% 1RM", "75 s", POT("potência com carga (força-velocidade)"))
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
    "Pico de potência: agachamento pesado-leve com GHD carregado, pliometria reativa máxima (hurdle hops a 50–60 cm, drop jump a uma perna, depth jump de 40 cm para caixa) com lançamento para trás de 6 kg, e intervalos curtos em air bike e BikeErg.",
    "Volume mínimo de saltos máximos, intensidade máxima, recuperação completa. Séries leves à máxima velocidade intencional; se a 1.ª dupla for RPE 9,5, baixa 5%.",
    127,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 20, [
        i("pogo", "2 × 15", "30 s", EL("rigidez do tornozelo com contacto curto e corpo alto (primer)")),
        i("saltos-unipodais", "2 × 10/perna no sítio", "30 s", EL("rigidez do tornozelo numa perna, como no apoio da corrida")),
        i("saltos-barreiras", "3 × 5 barreiras (50–60 cm, altura máxima)", "75 s", MAX("força reativa máxima em saltos contínuos")),
        i("drop-jump-unipodal", "2 × 3/perna (caixa de 20 cm)", "75 s", MAX("força reativa numa perna com contacto mínimo (RSI unilateral)")),
        i("depth-jump-caixa", "3 × 3 (queda de 40 cm → caixa de 60 cm)", "90 s", MAX("força reativa máxima transformada em salto vertical")),
        i("lancamento-medicinal-tras", "3 × 3 (bola de 6 kg, mede a melhor)", "75 s", POT("potência máxima de extensão tripla (balístico mais pesado)"))
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
    "Pico de potência: búlgaro com barra pesado-leve (unilateral explosivo) com GHD carregado, pliometria horizontal máxima (skipping em comprimento, bounds máximos medidos, depth jump para comprimento, triplo salto) com salto com trap bar, e rondas com remo, sandbag e swings pesados.",
    "Saltos máximos com recuperação completa: mede os bounds e o depth jump e compara com as semanas 3–4. Na parte leve do búlgaro, sobe o mais rápido possível com a mesma técnica.",
    111,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 21, [
        i("pogo-frente", "2 × 15 (≈12 m)", "30 s", EL("rigidez do tornozelo a avançar com o pé debaixo da anca (primer)")),
        i("skipping-distancia", "2 × 6 skips máximos (≈20–25 m)", "60 s (volta a andar)", EL("impulso horizontal da anca com aterragem ativa debaixo do corpo")),
        i("multisaltos", "3 × 8 apoios máximos (3 passos de balanço, mede a distância)", "90 s (volta a andar)", MAX("potência horizontal alternada máxima com contacto curto")),
        i("depth-jump-comprimento", "3 × 2 (queda de 40 cm, mede a melhor)", "75 s", MAX("força reativa transformada em salto horizontal máximo")),
        i("triplo-salto", "2 × 1/perna (máximo)", "75 s", MAX("potência unilateral horizontal máxima")),
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
    "Descarga e teste: teste 10/5, reteste do salto vertical, do triplo salto a uma perna e do scoop toss, tripla máxima no agachamento (1RM estimado) e repetição da peça de referência da semana 1.",
    "Pliometria de descarga: só os testes e pouco volume à volta deles. Tripla a RPE 9, sem falha, sempre com batentes. 1RM estimado ≈ carga × 1,10. Referência com as cargas da semana 1: compara metros, divisões, RPE e wall balls.",
    92,
    [
      b(1, "Aquecimento", 5, AQUEC_A),
      b(2, "Pliometria", 15, [
        i("tornozelos", "2 × 20 apoios (≈10 m)", "20 s (volta a andar)", EL("tornozelo rígido e pé a aterrar debaixo da anca (primer)")),
        i("pogo", "Teste 10/5: 2 × 10 (contam os 5 melhores)", "60 s", EL("medir a força reativa (RSI = altura ÷ tempo de contacto)")),
        i("saltos-barreiras", "2 × 5 barreiras (30 cm, fácil)", "45 s", EL("manter a rigidez reativa com volume baixo")),
        i("salto-contramovimento", "4 × 1 (reteste)", "45 s", MAX("medir a potência vertical")),
        i("triplo-salto", "3 × 1/perna (reteste)", "60 s", MAX("medir a potência unilateral horizontal e a diferença entre pernas")),
        i("lancamento-medicinal-scoop", "3 × 2 (reteste, bola de 4 kg)", "45 s", POT("medir a potência balística da anca"))
      ]),
      b(3, "Força", 15, [
        i("agachamento-barra", "50% × 5 · 65% × 3 · 75% × 2 · 85% × 1 · TESTE 3 reps @ RPE 9 (≈90–92%)", "resto da janela", OBJ("estimar o 1RM de agachamento")),
        i("ghd-abdominais", "8 reps", "resto da janela", OBJ("manter a força do tronco"))
      ]),
      b(4, "Condicionamento", 20, REFERENCIA(true))
    ]);

  S(6, "B", "6 (teste: 9)",
    "Descarga e teste: teste RSI no drop jump, reteste do salto em comprimento e dos 5 bounds, tripla máxima no peso morto e um AMRAP leve.",
    "Teste pelo menos 72 h depois do Dia A. Pliometria de descarga: só os testes e pouco volume à volta deles. Tripla a RPE 9; se as costas arredondarem, a série termina aí. 1RM estimado ≈ carga × 1,10. AMRAP a RPE 6.",
    80,
    [
      b(1, "Aquecimento", 5, AQUEC_B),
      b(2, "Pliometria", 17, [
        i("pogo-frente", "2 × 15 (≈12 m)", "30 s", EL("rigidez do tornozelo a avançar com o pé debaixo da anca (primer)")),
        i("skipping-altura", "2 × 6 skips (3/perna, fácil)", "45 s (volta a andar)", EL("impulso do tornozelo e da anca com joelho alto e braço oposto")),
        i("drop-jump", "Teste RSI: 4 × 1 (caixa de 30 cm, mede altura e tempo de contacto)", "60 s", MAX("medir a força reativa (RSI)")),
        i("salto-comprimento", "3 × 1 (reteste)", "60 s", MAX("medir a potência horizontal")),
        i("multisaltos", "3 × 5 bounds a partir de parado (reteste: melhor distância)", "75 s (volta a andar)", MAX("medir a potência horizontal alternada (5 bounds)")),
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
    objetivo: "Off-season para ciclismo e corrida em sessões cronometradas (≈47–60 min no papel): força máxima primeiro (agachamento, peso morto e búlgaro; ≥85% nas semanas 3–4) e depois a potência (exercícios de potência a partir da semana 4, pico na semana 5), um bloco longo de pliometria específica de corrida (rigidez do tornozelo, hurdle hops, bounding, hops a uma perna, depth/drop jumps; 80–200 contactos por sessão), core (GHD, anti-extensão, anti-rotação, adutores) e um condicionamento funcional de corpo inteiro que começa sempre num ergómetro — sem corrida. 2 sessões por semana.",
    sessoes: sessoes.map((s) => s.id),
    semanas: [
      { n: 1, foco: "Acumulação e técnica", notas: "E2MOM 16: búlgaro + GHD (A) e peso morto ≈70% + GHD (B). Pliometria técnica e de volume baixo-intensidade (tornozelos, pogo, pogo a uma perna, skipping em altura, tesouras) + testes: CMJ, triplo salto por perna e scoop (A), salto em comprimento e 5 bounds (B) (170 + 161 contactos). Peça de referência (A) e EMOM 16 (B)." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "E2MOM 16: búlgaro com barra pesado (4/perna) + GHD (A) e búlgaro com barra + GHD (B). Pliometria com o maior volume do bloco: pogo lateral, hurdle hops a 30 cm, pogo a uma perna a avançar, caixa contínua + lançamento rotacional (A); skipping em comprimento, tesouras, patinador, bounds a 80% + step-up explosivo (B) (180 + 198 contactos). AMRAP 3 × 4 min (A) e E2MOM 16 (B)." },
      { n: 3, foco: "Intensificação", notas: "E2MOM 18: triplas a ≈85% no agachamento (+ GHD) e no peso morto (+ GHD). Pliometria intensificada: hurdle hops a 40 cm e a uma perna, depth jump para caixa, caixa unipodal + salto carregado (A); zigue-zague, bounds máximos de 8 apoios, triplo salto + trap bar (B) (148 + 170 contactos). Chipper (A) e 5 rondas de 3 min (B)." },
      { n: 4, foco: "Intensificação + entrada da potência", notas: "E2MOM 18: agachamento 85–87% (+ GHD) e peso morto 87–88% (+ GHD). Pliometria mais reativa e unilateral: hurdle hops a 45–50 cm e a uma perna (20 cm), drop jump (RSI), 4 caixas em série + step-up explosivo (A); skipping máximo, patinador contínuo, bounds de 10 apoios, triplo salto + trap bar (B) (141 + 149 contactos); swings pesados no condicionamento. EMOM 16 (A) e densidade 2 × 7 min (B)." },
      { n: 5, foco: "Pico de expressão de potência", notas: "E2MOM 16 pesado-leve: agachamento (A) e búlgaro com barra (B). Pliometria de pico, poucos saltos máximos com recuperação completa: hurdle hops a 50–60 cm, drop jump a uma perna, depth jump de 40 cm + lançamento para trás de 6 kg (A); bounds máximos medidos, depth jump para comprimento, triplo salto + trap bar a 30–35% (B) (127 + 111 contactos, só 57 e 48 máximos). Intervalos 6 × 30 s (A) e 3 rondas explosivas (B)." },
      { n: 6, foco: "Descarga + testes", notas: "E3MOM 15 com tripla de teste (RPE 9) → 1RM estimado. Pliometria de descarga (92 + 80 contactos): teste 10/5 e reteste do CMJ, do triplo salto e do scoop (A); teste RSI no drop jump e reteste do comprimento e dos 5 bounds (B). Reteste da peça de referência e dos wall balls (A); AMRAP leve (B)." }
    ],
    cobertura: "Em cada semana: pernas pesadas bilaterais (agachamento, peso morto) e unilaterais (búlgaro com halteres ou barra) em E2MOM; core com GHD em todas as sessões (10 → 15 reps, 5 kg ao peito na semana 5); pliometria específica de corrida em todas as sessões (15–21 min): rigidez do tornozelo (tornozelos, pogo no sítio, a avançar, lateral e a uma perna, saltos sobre a linha), reatividade contínua (hurdle hops a duas pernas e a uma perna, zigue-zague, patinador, tesouras, caixas contínuas e em série), padrão de passada (skipping em altura e em comprimento, bounds alternados) e saltos máximos unilaterais/horizontais/RSI (triplo salto, bounds medidos, depth jump para caixa e para comprimento, drop jump a duas pernas e a uma perna, caixa unipodal); Dia A mais vertical/reativo, Dia B mais horizontal; potência em todas as sessões (scoop toss, lançamento para trás, swings explosivos, step-up explosivo, salto carregado, salto com trap bar) e pesado-leve na semana 5; transporte (farmer, sandbag, suitcase); membros superiores através de movimentos funcionais; motor sem corrida (air bike, BikeErg, remo; SkiErg na peça de referência).",
    regras: [
      "Pliometria específica de corrida, sempre pela mesma ordem: 1) PRIMER ELÁSTICO de baixa intensidade (tornozelos, pogo) → 2) REATIVO/ELÁSTICO (contacto <0,2–0,25 s, contínuo: hurdle hops, pogo/hops a uma perna, skipping, tesouras, zigue-zague, patinador contínuo) → 3) MÁXIMO (um esforço de cada vez com intenção máxima: CMJ, comprimento, bounds, triplo salto, depth/drop jumps, caixas, caixa unipodal) → 4) POTÊNCIA (balístico ou carregado: lançamentos de bola medicinal, swings, step-up explosivo, salto carregado, trap bar). Dia A = vertical, rigidez e RSI; Dia B = horizontal, bounding e hops para distância.",
      "Progressão da pliometria: S1–2 acumulação e técnica (160–200 contactos/sessão, sobretudo de baixa intensidade, bounds a 80%, barreiras de 30 cm); S3–4 intensificação (140–170 contactos, mais unilateral, reativo e horizontal: hurdle hops a 40–50 cm e a uma perna, depth jump, drop jump, bounds máximos, triplo salto); S5 pico (110–130 contactos, só ≈50–60 máximos, barreiras de 50–60 cm, depth de 40 cm, drop jump a uma perna, recuperação completa); S6 descarga + testes (80–90 contactos). Se uma semana correr bem, não acrescentes saltos: sobe a qualidade (contacto mais curto, mais distância), não o volume.",
      "Contagem de contactos (é o número da sessão e do formato): conta cada apoio no chão ou na caixa — 1 por salto a pés juntos (pogo, barreira, CMJ, comprimento), 1 por apoio em tornozelos, skipping, bounds e hops (triplo salto = 3; 5 bounds = 5), 2 por repetição de depth/drop jump e de salto à caixa contínuo (queda + aterragem), 7 por passagem nas 4 caixas em série, 1 por repetição nos saltos carregados e no step-up explosivo. Lançamentos de bola medicinal e swings não contam.",
      "Técnica em todos os saltos: postura alta de corrida (anca alta, tronco direito, olhar em frente), pé a aterrar debaixo da anca na parte da frente do pé, tornozelo rígido, joelho alinhado com o pé, braços ativos como na corrida e \"chão quente\" — sai do chão o mais depressa possível. Qualidade antes da fadiga: se o contacto ficar longo, a aterragem ruidosa, o calcanhar bater ou a altura/distância cair >10%, a série termina aí (não completes as repetições).",
      "Descansos da pliometria: primer e elásticos 20–45 s (o tempo de voltar a andar nos exercícios de deslocamento); máximos 60–90 s (recuperação completa, mais longa na semana 5); potência 45–75 s. Bounds e skipping numa pista plana de 20–30 m (relvado, tartan ou piso de ginásio, nunca cimento); sapatilhas de corrida com pouco amortecimento e boa aderência; barreiras que caem se lhes tocares; caixas estáveis e antiderrapantes.",
      "Aquiles e gémeos: dor >3/10 durante os saltos ou rigidez matinal que piora no dia seguinte → nessa semana tira os exercícios unipodais e os máximos e corta 50% dos contactos; se persistir 2 sessões, só primer elástico até desaparecer. Aterragens a uma perna e depth/drop jumps só sem dor e com aterragem silenciosa nas semanas anteriores.",
      "Potência: há um exercício de potência em todas as sessões (no bloco de pliometria), com carga a subir ao longo do bloco: scoop toss de 4 kg, swings de 24 kg, lançamento para trás de 4–5 kg e step-up explosivo com 2 × 8 kg nas semanas 1–2, salto com 2 × 12 kg, trap bar a 20–30% e step-up com 2 × 10–12 kg nas semanas 3–4, lançamento para trás de 6 kg e trap bar a 30–35% na semana 5; mais o pesado-leve no agachamento e no búlgaro na semana 5. Cada repetição à máxima velocidade; se a velocidade cair visivelmente, a série termina.",
      "Sessões cronometradas: cada bloco tem relógio (E2MOM, rondas, séries com descanso fixo) no formato do bloco. Se o bloco acabar, passa ao seguinte — não estendas. Conta 5–8 min extra para transições, montar barreiras e caixas e carregar a barra.",
      "Força em E2MOM: no minuto ímpar o exercício de pernas, no par o core. As primeiras voltas são a rampa (não há séries de aquecimento fora do relógio). Se uma volta de trabalho não deixar pelo menos 20 s de descanso no minuto, a carga está alta. No búlgaro faz as duas pernas no mesmo minuto, começando pela mais fraca.",
      "Sequência força → potência: semanas 1–3 a força domina e a pliometria acumula volume de qualidade, sem fadiga; a potência entra na semana 4 e expressa-se na semana 5; semana 6 descarga e testes. Sem base de força, o trabalho de potência rende pouco.",
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Volta a RPE 1 abaixo do alvo → +2,5–5% na seguinte. No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o levantamento e faz só core nos minutos que faltam.",
      "Nunca até à falha: RIR 2 nos levantamentos principais; só os testes da semana 6 chegam a RPE 9.",
      "Condicionamento = qualidade, não velocidade: começa sempre no ergómetro; EMOM/E2MOM com 15–40 s de folga; AMRAP e densidade com o mesmo número de voltas em todos os blocos; rondas com a mesma produção (≤5% de queda). Wall balls: 9 kg a 3 m, anca abaixo do joelho, só contam repetições válidas.",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas): 2 voltas de trabalho a menos na força (faz só o core nesses minutos) e corta uma ronda/volta no condicionamento.",
      "Segurança: agachamento e búlgaro com barra com batentes ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões; dor aguda ou articular → parar.",
      "Alternativas: sem GHD → abdominais no AbMat; sem SkiErg → remo; sem air bike → BikeErg ou bicicleta estática; sem BikeErg → air bike; sem trenó → empurrar prato ou wall sit; sem sandbag → kettlebell em goblet/farmer; sem trap bar → salto com halteres leves; sem bola medicinal → salto com agachamento carregado; sem pista de 20–30 m para bounds e skipping → triplo salto e saltos a uma perna no espaço que houver (mesmo número de apoios); sem barreiras → linhas ou cones baixos.",
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
      Pliometria: "17 min · 17 séries · elástico 20–30 s · máximo 60 s · potência 45 s · 170 contactos · testes: CMJ, triplo salto, scoop",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro (as duas pernas), min par GHD · voltas 1–2 leves",
      Condicionamento: "Referência · 4 rondas (SkiErg → flexões → farmer → elevações) · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s1-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "20 min · 19 séries · elástico 30–45 s · máximo 60–75 s · potência 45 s · 161 contactos · testes: comprimento, 5 bounds",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar peso morto, min par GHD · voltas 1–2 rampa",
      Condicionamento: "EMOM 16 min · 4 voltas · min 1 remo, min 2 KB clean & press, min 3 farmer, min 4 flexões"
    },
    "off-s2-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "16 min · 17 séries · elástico 20–45 s · máximo 60 s · potência 45 s · 180 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro com barra pesado (as duas pernas), min par GHD · voltas 1–2 rampa",
      Condicionamento: "3 blocos de AMRAP 4 min · 90 s entre blocos · SkiErg → farmer com halteres → thrusters → elevações"
    },
    "off-s2-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "19 min · 18 séries · elástico 30–60 s · máximo 45 s · potência 60 s · 198 contactos",
      "Força": "E2MOM 16 min · 8 voltas · min ímpar búlgaro com barra (as duas pernas), min par GHD · voltas 1–2 leves",
      Condicionamento: "E2MOM 16 min · 8 janelas de 2 min · ímpar: BikeErg 45 s + trenó · par: devil press + suitcase carry"
    },
    "off-s3-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "20 min · 18 séries · elástico 30–45 s · máximo 60 s · potência 60 s · 148 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD · voltas 1–3 rampa",
      Condicionamento: "Chipper · 1 passagem: remo → trenó → sandbag ao ombro → remada invertida → farmer · limite 16 min"
    },
    "off-s3-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "14 min · 13 séries · elástico 30 s · máximo 45–60 s · 116 contactos",
      "Força": "Rampa + 3 séries · peso morto 3 reps pesado + GHD 12 reps · 2–3 min entre séries",
      Condicionamento: "4 rondas por tempo · SkiErg → sandbag → afundos com sandbag → burpees com salto → floor press → wall walks · limite 22 min"
    },
    "off-s4-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "21 min · 17 séries · elástico 30–60 s · máximo 60–75 s · potência 60 s · 141 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar agachamento, min par GHD · voltas 1–3 rampa",
      Condicionamento: "EMOM 16 min · 4 voltas · min 1 BikeErg, min 2 trenó para trás, min 3 devil press, min 4 elevações"
    },
    "off-s4-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "20 min · 16 séries · elástico 30–60 s · máximo 60–90 s · potência 75 s · 149 contactos",
      "Força": "E2MOM 18 min · 9 voltas · min ímpar peso morto, min par GHD · voltas 1–3 rampa",
      Condicionamento: "Densidade 2 × 7 min · 1 min entre blocos · remo → búlgaro → flexões → swings pesados · máximo de voltas com técnica perfeita"
    },
    "off-s5-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "20 min · 15 séries · elástico 30 s · máximo 75–90 s · potência 75 s · 127 contactos (57 máximos)",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar agachamento, min par GHD com 5 kg",
      Condicionamento: "6 intervalos · 30 s forte : 90 s · ímpares air bike + trenó, pares BikeErg + elevações"
    },
    "off-s5-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "21 min · 15 séries · elástico 30–60 s · máximo 75–90 s · potência 75 s · 111 contactos (48 máximos)",
      "Força": "E2MOM 16 min · 8 voltas · pesado-leve: min ímpar búlgaro com barra, min par GHD com 5 kg",
      Condicionamento: "3 rondas · 2 min de descanso entre rondas · remo → sandbag ao ombro → swings → farmer → flexões · limite 15 min"
    },
    "off-s6-dia1": {
      Aquecimento: AQ_A,
      Pliometria: "15 min · 16 séries · teste 10/5 + reteste do CMJ, do triplo salto e do scoop · 20–60 s · 92 contactos (descarga)",
      "Força": "E3MOM 15 min · 5 voltas · rampa até à tripla de teste (RPE 9) + GHD em cada janela",
      Condicionamento: "Referência (reteste da semana 1) · 4 rondas · 90 s entre rondas + 1 min de wall balls máximos · limite 20 min"
    },
    "off-s6-dia2": {
      Aquecimento: AQ_B,
      Pliometria: "17 min · 16 séries · teste RSI + reteste do comprimento e dos 5 bounds · 30–75 s · 80 contactos (descarga)",
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
