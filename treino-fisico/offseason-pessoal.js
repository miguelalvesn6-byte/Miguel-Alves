// Off-season pessoal — força e potência (6 semanas × 2 sessões = 12 sessões).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura de cada sessão: Aquecimento → Pliometria → Força → Condicionamento em rondas (qualidade) → Final (wall balls máximos).
// Dia A = agachamento (+ empurrar/puxar em cima, GHD); Dia B = peso morto e afundos (+ swing, transportes).
// Periodização: S1–S2 acumulação/técnica → S3–S4 intensificação (contraste força + pliometria) → S5 pico de potência → S6 descarga + testes.
// Percentagens referem-se ao 1RM estimado; o RPE/RIR manda sempre (ver regras em PROGRAMA_OFFSEASON).

(function () {
  const i = (ex, dose, descanso, nota) => (nota ? { ex, dose, descanso, nota } : { ex, dose, descanso });
  const b = (n, nome, min, itens) => ({ titulo: `${n} · ${nome} (${min} min)`, min, itens });

  const AQUEC_A = (aprox) => [
    i("ski-erg", "3 min fácil", "—", "Ritmo de conversa, resistência (damper) 4–5. Sem SkiErg: remo-ergómetro ou bicicleta."),
    i("worlds-greatest", "3/lado", "—"),
    i("tornozelo-parede", "10/lado", "—"),
    i("monster-walk", "2 × 10 passos/lado", "—"),
    i("agachamento-goblet", "2 × 5", "—", "Pausa de 2 s no fundo: joelhos para fora, tronco alto."),
    i("agachamento-barra", aprox, "60 s", "Séries de aproximação (rampa). As restantes aproximações estão no início do bloco de força.")
  ];
  const AQUEC_B = (aprox) => [
    i("remo-ergometro", "3 min fácil", "—", "Ritmo de conversa, 20–22 pancadas/min."),
    i("cars-anca", "5/lado", "—"),
    i("isquios-ativo", "8/perna", "—"),
    i("ponte-glutea", "2 × 10", "—"),
    i("kettlebell-swing", "2 × 10 leve", "—", "16–20 kg: aprender/ativar a dobradiça da anca antes do peso morto."),
    i("peso-morto", aprox, "60 s", "Séries de aproximação (rampa). As restantes estão no início do bloco de força.")
  ];
  const FINAL = (wb, nota, along) => [
    i("wall-ball", wb, "—", nota),
    ...along
  ];
  const WB_A = "Padrão: bola 9 kg a alvo de 3 m (6 kg/2,7 m se necessário). Anca abaixo do joelho em cada repetição e bola acima do alvo — só contam repetições válidas. Pára ao 2.º no-rep seguido, se a lombar arredondar no fundo ou se os ombros doerem. Regista o número.";
  const WB_B = "Mesmo padrão (9 kg, 3 m, anca abaixo do joelho). Uma série só: termina quando pousares a bola, falhares o alvo 2 vezes seguidas ou a técnica se degradar. Regista o número.";
  const ALONG_A = [i("figura-4", "30 s/lado", "—"), i("alongamento-gemeos", "30 s/lado", "—")];
  const ALONG_B = [i("sapo", "45 s", "—"), i("alongamento-soleo", "30 s/lado", "—")];

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
      nota: `${nota} Pliometria: ~${contactos} contactos nesta sessão.`,
      contactos,
      blocos: blocos.map(({ titulo, itens }) => ({ titulo, itens })),
      programa: "off-season-pessoal",
      semana: sem,
      completa: false,
      casa: false
    });
  };

  // ======================= SEMANA 1 — ACUMULAÇÃO / TÉCNICA =======================
  S(1, "A", "7",
    "Acumulação: rever a técnica do agachamento com carga moderada e volume alto, testar o salto vertical de partida e fazer o condicionamento de referência (benchmark) do bloco.",
    "Carga moderada, técnica perfeita, 3 repetições na reserva. Se a 4.ª série de agachamento ficar a RPE ≤6, sobe 5 kg na semana 2; se passar RPE 8, mantém a carga. Regista os metros do SkiErg em cada ronda e o número de wall balls: é o benchmark que repetes na semana 6.",
    90,
    [
      b(1, "Aquecimento", 10, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("saltos-duplos-corda", "3 × 15", "60 s", "Sem duplos consistentes: 3 × 30 s de corda simples com 1 duplo a cada 4 saltos."),
        i("pogo", "3 × 10", "60 s", "Joelhos quase esticados, contacto curto e silencioso."),
        i("salto-contramovimento", "3 × 1 (teste inicial)", "60 s", "Mede a altura (app tipo My Jump ou marca na parede). Fica com a melhor das 3."),
        i("salto-caixa", "4 × 3", "90 s", "Caixa 50–60 cm. Aterra em silêncio em meio agachamento e desce a andar. Termina a série se a aterragem ficar mais funda do que a posição de partida.")
      ]),
      b(3, "Força", 25, [
        i("agachamento-barra", "4 × 6 @ RPE 7 (≈70–72%)", "2–3 min", "Aproximação: 55% × 3, 65% × 2. Tempo 3-1-X (3 s a descer, 1 s de pausa no fundo nas 2 primeiras séries). Barra sobre o meio do pé, joelhos na linha dos pés."),
        i("split-squat-bulgaro", "3 × 8/perna @ RIR 3", "90 s", "Halteres. Começa pela perna mais fraca; a outra faz as mesmas repetições."),
        i("gemeos-pesado", "3 × 10 @ RIR 2", "—", "Em superset com o búlgaro, no descanso. 2 s em cima, 3 s a descer.")
      ]),
      b(4, "Condicionamento", 24, [
        i("ski-erg", "1 min", "—", "5 RONDAS (qualidade, não velocidade) · 2 min de descanso entre rondas. SkiErg a RPE 7 (≈ritmo de 2 km). Regista os metros: a 5.ª ronda não deve ficar mais de 5% abaixo da 1.ª."),
        i("supino-barra", "12 reps", "—", "≈55% do 1RM (RIR 3–4), sempre com batentes de segurança. Se a última ronda ficar a RIR <2, baixa 5 kg."),
        i("ghd-abdominais", "15 reps", "—", "Só até à horizontal. Sem GHD: 15 abdominais no AbMat ou 10 crunch invertido."),
        i("elevacoes", "12 reps", "2 min (fim da ronda)", "Amplitude completa (braços esticados em baixo, queixo acima da barra). Divide em séries (ex.: 6 + 6) para manter a qualidade. Sem 12 limpas: elevações assistidas.")
      ]),
      b(5, "Final", 5, FINAL("Máximo em 2 min", WB_A, ALONG_A))
    ]);

  S(1, "B", "7",
    "Acumulação: rever o peso morto convencional e o afundo com volume moderado, testar o salto em comprimento de partida e construir capacidade com rondas de qualidade.",
    "Cada repetição do peso morto parte do chão parado (sem toque e volta). Se a 4.ª série ficar a RPE ≤6, sobe 5–10 kg na semana 2; se passar RPE 8, mantém. Guarda 48–72 h entre o Dia A e o Dia B.",
    88,
    [
      b(1, "Aquecimento", 10, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("corda-alternada", "2 × 30 (15/pé)", "60 s"),
        i("pogo-lateral", "2 × 10", "60 s"),
        i("salto-comprimento", "4 × 2", "90 s", "Aterra e fixa 2 s. Mede a melhor marca (teste inicial, repete na semana 6).")
      ]),
      b(3, "Força", 25, [
        i("peso-morto", "4 × 5 @ RPE 7 (≈70–72%)", "3 min", "Aproximação: 55% × 3, 65% × 2. Costas neutras, barra encostada às pernas. Pega mista só se a pega dupla falhar."),
        i("afundo-atras", "3 × 8/perna @ RIR 3", "90 s", "Halteres. Tronco alto, peso na perna da frente."),
        i("pallof", "3 × 10/lado", "—", "Em superset com o afundo.")
      ]),
      b(4, "Condicionamento", 20, [
        i("remo-ergometro", "250 m", "—", "4 RONDAS (qualidade) · 2 min entre rondas. Remo a RPE 7 (≈ritmo de 2 km); regista o tempo de cada 250 m."),
        i("supino-haltere", "12 reps", "—", "RIR 3. Alternativa: 15 flexões."),
        i("kettlebell-swing", "15 reps", "—", "24 kg, swing russo (até à altura do peito). Potência da anca; lombar neutra — se a lombar cansar, troca por 10 reps."),
        i("elevacao-joelhos-suspenso", "12 reps", "—", "Sem balanço."),
        i("farmer-carry", "40 m", "2 min (fim da ronda)", "2 × 28–32 kg, passos curtos, tronco alto.")
      ]),
      b(5, "Final", 5, FINAL("Máximo sem pousar a bola (1 série)", WB_B, ALONG_B))
    ]);

  // ======================= SEMANA 2 — ACUMULAÇÃO (mais carga) =======================
  S(2, "A", "7–8",
    "Acumulação: subir a carga do agachamento mantendo o volume, mais contactos de pliometria e o mesmo condicionamento com mais carga/metros.",
    "Sobe a carga de acordo com o RPE da semana 1 (+2,5–5%). A técnica não muda: se o tempo de descida encurtar ou o tronco cair, a carga está alta. Condicionamento: mesmas 5 rondas, +2,5 kg no supino e procura +2–3% de metros no SkiErg com a mesma RPE.",
    96,
    [
      b(1, "Aquecimento", 10, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("saltos-duplos-corda", "3 × 15", "60 s"),
        i("pogo", "3 × 12", "60 s"),
        i("salto-caixa", "5 × 3", "90 s", "Caixa 60 cm. Reset completo entre saltos (não é contínuo).")
      ]),
      b(3, "Força", 25, [
        i("agachamento-barra", "4 × 5 @ RPE 7–8 (≈75%)", "2–3 min", "Aproximação: 55% × 3, 65% × 2. Tempo 3-0-X."),
        i("split-squat-bulgaro", "3 × 8/perna @ RIR 2", "90 s", "+2 kg por haltere em relação à semana 1."),
        i("gemeos-pesado", "3 × 8 @ RIR 2", "—", "Superset com o búlgaro.")
      ]),
      b(4, "Condicionamento", 24, [
        i("ski-erg", "1 min", "—", "5 RONDAS (qualidade, não velocidade) · 2 min entre rondas. RPE 7; tenta +2–3% de metros em relação à semana 1."),
        i("supino-barra", "12 reps", "—", "≈57–60% do 1RM (+2,5 kg). RIR 2–3 na última ronda."),
        i("ghd-abdominais", "15 reps", "—", "Até à horizontal ou ligeiramente abaixo se a semana 1 correu sem dor lombar."),
        i("elevacoes", "12 reps", "2 min (fim da ronda)", "Menos divisões que na semana 1 (ex.: 8 + 4).")
      ]),
      b(5, "Final", 5, FINAL("Máximo em 2 min", WB_A, ALONG_A))
    ]);

  S(2, "B", "7–8",
    "Acumulação: mais carga no peso morto e no afundo, saltos unipodais e rondas com SkiErg, press unilateral e puxada horizontal.",
    "Peso morto +5–10 kg em relação à semana 1 se ficou a RPE ≤7. Nada de falha: o objetivo é volume de qualidade. Se o treino de corrida da véspera foi intenso, fica no limite inferior de carga.",
    102,
    [
      b(1, "Aquecimento", 10, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("corda-alternada", "2 × 30 (15/pé)", "60 s"),
        i("saltos-unipodais", "3 × 5/perna", "60 s", "Saltos no sítio numa perna, joelho alinhado com o pé."),
        i("salto-comprimento", "4 × 3", "90 s", "Aterra e fixa 2 s em cada salto.")
      ]),
      b(3, "Força", 25, [
        i("peso-morto", "4 × 5 @ RPE 7–8 (≈75%)", "3 min", "Aproximação: 55% × 3, 65% × 2."),
        i("afundo-atras", "3 × 8/perna @ RIR 2", "90 s"),
        i("pallof", "3 × 10/lado", "—", "Superset com o afundo.")
      ]),
      b(4, "Condicionamento", 20, [
        i("ski-erg", "1 min", "—", "4 RONDAS (qualidade) · 2 min entre rondas. RPE 7."),
        i("landmine-press", "10/braço", "—", "RIR 3, ajoelhado ou em pé."),
        i("kettlebell-swing", "15 reps", "—", "24 kg."),
        i("remada-invertida", "12 reps", "—", "Corpo em prancha, peito à barra."),
        i("farmer-carry", "40 m", "2 min (fim da ronda)", "2 × 32 kg.")
      ]),
      b(5, "Final", 5, FINAL("Máximo sem pousar a bola (1 série)", WB_B, ALONG_B))
    ]);

  // ======================= SEMANA 3 — INTENSIFICAÇÃO (contraste) =======================
  S(3, "A", "8",
    "Intensificação: agachamento pesado em séries de 3 emparelhado com saltos à caixa (método de contraste), menos contactos mas de maior intensidade, e rondas mais curtas e mais carregadas.",
    "Contraste: 20–30 s depois de cada série de agachamento, 3 saltos máximos à caixa; depois 2–3 min de descanso. Se a altura/qualidade dos saltos cair, corta a última série de saltos. Carga do agachamento pelo RPE: série a RPE ≤7 → +5 kg na seguinte; RPE 9 → −5%.",
    72,
    [
      b(1, "Aquecimento", 10, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "3 × 15", "60 s"),
        i("drop-jump", "4 × 3", "90 s", "Caixa 30 cm. Contacto mínimo e salto máximo; se o calcanhar bater com força, a caixa está alta.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "5 × 3 @ RPE 8 (≈82–85%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2. Nunca chegar a falhar: deixa 2 repetições na reserva."),
        i("salto-caixa", "5 × 3", "2–3 min", "Contraste: logo a seguir a cada série de agachamento. Caixa 60 cm, salto máximo, aterragem suave."),
        i("split-squat-bulgaro", "3 × 6/perna @ RIR 2", "90 s", "Mais pesado que nas semanas 1–2."),
        i("gemeos-pesado", "3 × 8 @ RIR 2", "—", "Superset com o búlgaro.")
      ]),
      b(4, "Condicionamento", 20, [
        i("ski-erg", "45 s forte", "—", "4 RONDAS (qualidade) · 2 min entre rondas. RPE 8: watts médios ~10% acima da semana 1, iguais em todas as rondas."),
        i("supino-barra", "8 reps", "—", "≈70% do 1RM, RIR 2–3."),
        i("ghd-abdominais", "12 reps", "—"),
        i("elevacoes", "6–8 reps lastradas (+5 kg)", "2 min (fim da ronda)", "Estritas, sem kipping. Sem cinto de lastro: haltere entre os pés ou elevações lentas (3 s a descer).")
      ]),
      b(5, "Final", 5, FINAL("Máximo em 2 min", WB_A, ALONG_A))
    ]);

  S(3, "B", "8",
    "Intensificação: peso morto pesado em séries de 3 em contraste com salto em comprimento, saltos de barreiras e trabalho excêntrico dos isquiotibiais.",
    "Contraste: 20–30 s depois de cada série de peso morto, 2 saltos em comprimento máximos; depois 3 min. Afundo pesado: se o joelho da frente cair para dentro, baixa a carga. Não faças esta sessão nas 48 h antes do treino longo de corrida.",
    66,
    [
      b(1, "Aquecimento", 10, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 20 (10/pé)", "60 s"),
        i("saltos-barreiras", "4 × 4", "90 s", "Barreiras de 30–45 cm, contactos curtos entre barreiras.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "5 × 3 @ RPE 8 (≈82–85%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2."),
        i("salto-comprimento", "5 × 2", "3 min", "Contraste: logo a seguir a cada série de peso morto. Máxima distância, aterragem fixa."),
        i("afundo-atras", "3 × 6/perna @ RIR 2", "90 s", "Halteres pesados."),
        i("nordic", "2 × 4", "—", "Superset com o afundo; descida o mais lenta possível.")
      ]),
      b(4, "Condicionamento", 20, [
        i("remo-ergometro", "200 m forte", "—", "4 RONDAS (qualidade) · 2 min entre rondas. RPE 8, tempos iguais em todas as rondas."),
        i("supino-haltere", "10 reps", "—", "Halteres mais pesados que na semana 1 (RIR 2)."),
        i("kettlebell-swing", "12 reps", "—", "28–32 kg, explosivo."),
        i("elevacoes", "6 reps", "—", "Estritas."),
        i("farmer-carry", "30 m pesado", "2 min (fim da ronda)", "2 × 36–40 kg.")
      ]),
      b(5, "Final", 5, FINAL("Máximo sem pousar a bola (1 série)", WB_B, ALONG_B))
    ]);

  // ======================= SEMANA 4 — INTENSIFICAÇÃO (mais pesado) =======================
  S(4, "A", "8–8,5",
    "Intensificação: agachamento a 85–87% em contraste com saltos à caixa, drop jumps mais altos e rondas com supino e elevações mais pesados.",
    "Semana mais pesada do bloco. Se dormiste mal ou a variabilidade cardíaca está baixa, faz 3 séries em vez de 4 e fica no limite inferior. Duas séries seguidas a RPE 9 → termina o exercício.",
    64,
    [
      b(1, "Aquecimento", 10, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "2 × 20", "60 s"),
        i("drop-jump", "4 × 3", "2 min", "Caixa 40 cm se a semana 3 teve contactos curtos; senão mantém 30 cm.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "4 × 3 @ RPE 8–8,5 (≈85–87%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 82% × 1."),
        i("salto-caixa", "4 × 3", "3 min", "Contraste. Mesma caixa da semana 3; procura saltar mais alto, não mais rápido."),
        i("split-squat-bulgaro", "3 × 5/perna @ RIR 2", "90 s"),
        i("gemeos-pesado", "3 × 6 @ RIR 2", "—", "Superset; mais carga que na semana 3.")
      ]),
      b(4, "Condicionamento", 22, [
        i("ski-erg", "45 s forte", "—", "4 RONDAS (qualidade) · 2 min 30 s entre rondas. RPE 8."),
        i("supino-barra", "6 reps", "—", "≈75% do 1RM, RIR 2."),
        i("ghd-abdominais", "10 reps", "—", "Opção: bola medicinal de 4 kg ao peito."),
        i("elevacoes", "5 reps lastradas (+7,5–10 kg)", "2 min 30 s (fim da ronda)", "Estritas; se não completares as 5 limpas, tira 2,5 kg.")
      ]),
      b(5, "Final", 5, FINAL("Máximo em 2 min", WB_A, ALONG_A))
    ]);

  S(4, "B", "8–8,5",
    "Intensificação: peso morto a 85–87% em contraste com salto com trap bar (força-velocidade), multissaltos e transportes pesados.",
    "Salto com trap bar com 20–30% do 1RM do peso morto: o objetivo é altura máxima, não carga. Se a lombar estiver carregada depois do peso morto, troca o swing por 6 slams de bola medicinal.",
    68,
    [
      b(1, "Aquecimento", 10, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 20 (10/pé)", "60 s"),
        i("multisaltos", "4 × 4", "90 s", "Bounds longos e ritmados; troca por saltos em comprimento se a técnica falhar.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "4 × 3 @ RPE 8–8,5 (≈85–87%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 82% × 1."),
        i("salto-trap-bar", "4 × 3 @ 20–30% 1RM", "3 min", "Contraste. Sem trap bar: salto com agachamento com 2 halteres leves (10–15 kg)."),
        i("afundo-atras", "3 × 5/perna @ RIR 2", "90 s"),
        i("nordic", "2 × 5", "—", "Superset com o afundo.")
      ]),
      b(4, "Condicionamento", 22, [
        i("ski-erg", "45 s forte", "—", "4 RONDAS (qualidade) · 2 min 30 s entre rondas. RPE 8."),
        i("landmine-press", "8/braço", "—", "Mais pesado que na semana 2, RIR 2."),
        i("kettlebell-swing", "12 reps", "—", "32 kg."),
        i("remada-invertida", "10 reps", "—", "Pés elevados ou colete de lastro."),
        i("suitcase-carry", "30 m/lado", "2 min 30 s (fim da ronda)", "Kettlebell pesado só de um lado; tronco sem inclinar.")
      ]),
      b(5, "Final", 5, FINAL("Máximo sem pousar a bola (1 série)", WB_B, ALONG_B))
    ]);

  // ======================= SEMANA 5 — PICO DE POTÊNCIA =======================
  S(5, "A", "8–9",
    "Pico de potência: método pesado-leve — séries duplas a 88–90% seguidas de saltos (contraste) e de séries rápidas a 60%. Volume baixo, intensidade máxima, condicionamento curto e explosivo.",
    "Intensidade mais alta do bloco com o volume mais baixo. Cada repetição das séries leves é feita à máxima velocidade intencional; se a barra abrandar visivelmente, termina. Nada de falha nem de \"grind\": se a 1.ª dupla for RPE 9,5, baixa 5% nas restantes.",
    45,
    [
      b(1, "Aquecimento", 10, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "2 × 15", "60 s"),
        i("drop-jump", "3 × 3", "2 min", "Caixa 40–50 cm; cada contacto o mais curto possível.")
      ]),
      b(3, "Força", 26, [
        i("agachamento-barra", "3 × 2 @ RPE 8,5–9 (≈88–90%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 85% × 1."),
        i("salto-caixa", "3 × 2", "3 min", "Contraste: 2 saltos máximos depois de cada dupla pesada."),
        i("agachamento-barra", "2 × 3 @ 60% (máxima velocidade)", "2 min", "Parte leve do pesado-leve: descida controlada, subida explosiva."),
        i("split-squat-bulgaro", "2 × 5/perna @ RIR 2", "90 s")
      ]),
      b(4, "Condicionamento", 16, [
        i("ski-erg", "30 s máximo de watts", "—", "3 RONDAS (qualidade de potência) · 3 min entre rondas. RPE 9 no SkiErg; os watts da 3.ª ronda devem ficar a ≤5% da 1.ª."),
        i("supino-barra", "5 reps explosivas @ 60%", "—", "Descida controlada, subida o mais rápida possível."),
        i("ghd-abdominais", "8 reps", "—"),
        i("elevacoes", "3–5 reps explosivas", "3 min (fim da ronda)", "Peito à barra; termina antes de perder velocidade.")
      ]),
      b(5, "Final", 5, FINAL("Máximo em 2 min", WB_A, ALONG_A))
    ]);

  S(5, "B", "8–9",
    "Pico de potência: peso morto a 88–90% em contraste com salto com trap bar leve, saltos unipodais em comprimento e condicionamento curto e explosivo.",
    "Volume baixo: 3 duplas pesadas e saltos de qualidade máxima. Se o peso morto da 1.ª dupla subir devagar (RPE 9,5), baixa 5%. Não faças esta sessão nas 48 h antes de uma corrida intensa ou do treino longo.",
    51,
    [
      b(1, "Aquecimento", 10, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 15 (≈8/pé)", "60 s"),
        i("salto-comprimento-unipodal", "3 × 2/perna", "90 s", "Aterra nas duas pernas e fixa.")
      ]),
      b(3, "Força", 26, [
        i("peso-morto", "3 × 2 @ RPE 8,5–9 (≈88–90%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 85% × 1."),
        i("salto-trap-bar", "3 × 3 @ 20% 1RM", "3 min", "Contraste: altura máxima."),
        i("afundo-atras", "2 × 5/perna @ RIR 2", "90 s")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "30 s máximo de watts", "—", "3 RONDAS (qualidade de potência) · 3 min entre rondas."),
        i("slam-medicinal", "6 reps máximas", "—", "Bola de 8–10 kg."),
        i("landmine-press", "5/braço explosivas", "—"),
        i("kettlebell-swing", "10 reps potentes", "—", "32 kg."),
        i("elevacoes", "5 reps", "3 min (fim da ronda)", "Estritas.")
      ]),
      b(5, "Final", 5, FINAL("Máximo sem pousar a bola (1 série)", WB_B, ALONG_B))
    ]);

  // ======================= SEMANA 6 — DESCARGA + TESTES =======================
  S(6, "A", "6 (teste: 9)",
    "Descarga e teste: reteste do salto vertical, série máxima de 3 no agachamento para estimar o 1RM e repetição do condicionamento de referência da semana 1.",
    "Volume total ~50%, mas o teste é a sério. Agachamento: aproximação 50% × 5, 65% × 3, 75% × 2, 85% × 1 e uma série de 3 a RPE 9 (sem falha, sem \"grind\"). Só tentas outra série (+2,5–5 kg) se a primeira foi RPE ≤8 com técnica perfeita. 1RM estimado ≈ carga × 1,10. Condicionamento: mesmas 5 rondas e cargas da semana 1 — compara metros do SkiErg, divisões das elevações e RPE.",
    43,
    [
      b(1, "Aquecimento", 10, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "2 × 10", "60 s"),
        i("pogo", "2 × 10", "60 s"),
        i("salto-contramovimento", "3 × 1 (reteste)", "90 s", "Mesmo método de medição da semana 1; fica com a melhor.")
      ]),
      b(3, "Força", 22, [
        i("agachamento-barra", "Teste: 1 série máxima de 3 @ RPE 9 (≈90–92%)", "3–4 min", "Tem sempre batentes de segurança ou ajudante. Regista carga, RPE e e1RM."),
        i("split-squat-bulgaro", "2 × 6/perna @ RIR 4", "60 s", "Leve: só manter o padrão.")
      ]),
      b(4, "Condicionamento", 24, [
        i("ski-erg", "1 min", "—", "BENCHMARK: 5 RONDAS iguais à semana 1 (qualidade, não velocidade) · 2 min entre rondas. Compara metros por ronda com a mesma RPE 7."),
        i("supino-barra", "12 reps", "—", "Mesma carga da semana 1."),
        i("ghd-abdominais", "15 reps", "—"),
        i("elevacoes", "12 reps", "2 min (fim da ronda)", "Regista quantas divisões precisaste.")
      ]),
      b(5, "Final", 5, FINAL("Máximo em 2 min (reteste)", WB_A + " Compara com a semana 1.", ALONG_A))
    ]);

  S(6, "B", "6 (teste: 9)",
    "Descarga e teste: reteste do salto em comprimento, série máxima de 3 no peso morto para estimar o 1RM e condicionamento leve para fechar o bloco.",
    "Faz este teste pelo menos 72 h depois do Dia A. Peso morto: aproximação 50% × 5, 65% × 3, 75% × 2, 85% × 1 e uma série de 3 a RPE 9, sem perder a posição neutra das costas (se arredondar, a série termina aí). 1RM estimado ≈ carga × 1,10. Condicionamento a RPE 6 — é descarga.",
    53,
    [
      b(1, "Aquecimento", 10, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 15 (≈8/pé)", "60 s"),
        i("pogo-lateral", "2 × 10", "60 s"),
        i("salto-comprimento", "3 × 1 (reteste)", "90 s", "Mesmo piso e calçado da semana 1; fica com a melhor marca.")
      ]),
      b(3, "Força", 22, [
        i("peso-morto", "Teste: 1 série máxima de 3 @ RPE 9 (≈90–92%)", "3–4 min", "Regista carga, RPE e e1RM."),
        i("afundo-atras", "2 × 6/perna @ RIR 4", "60 s", "Leve.")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "250 m", "—", "3 RONDAS a RPE 6 · 2 min entre rondas (estrutura da semana 1, uma ronda a menos)."),
        i("supino-haltere", "12 reps", "—", "Carga da semana 1."),
        i("kettlebell-swing", "15 reps", "—", "24 kg."),
        i("elevacao-joelhos-suspenso", "12 reps", "—"),
        i("farmer-carry", "40 m", "2 min (fim da ronda)")
      ]),
      b(5, "Final", 5, FINAL("Máximo sem pousar a bola (reteste)", WB_B + " Compara com a semana 1.", ALONG_B))
    ]);

  SESSOES.push(...sessoes);

  window.PROGRAMA_OFFSEASON = {
    id: "off-season-pessoal",
    nome: "Plano Miguel · Off-season força e potência (6 semanas)",
    objetivo: "Aumentar a força máxima (agachamento e peso morto) e a potência (saltos, força-velocidade) sem comprometer o treino de resistência, com condicionamento híbrido em rondas de qualidade. 2 sessões por semana, ≤75 min.",
    sessoes: sessoes.map((s) => s.id),
    semanas: [
      { n: 1, foco: "Acumulação e técnica", notas: "Agachamento 4 × 6 / peso morto 4 × 5 a RPE 7 (≈70–72%). Testes iniciais de salto e benchmark de condicionamento. ~90 contactos/sessão." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "4 × 5 a RPE 7–8 (≈75%). Mesmo volume, +2,5–5% de carga, ~100 contactos/sessão." },
      { n: 3, foco: "Intensificação · contraste", notas: "5 × 3 a RPE 8 (≈82–85%) emparelhado com saltos (contraste). Menos contactos (~65–70), mais intensos (drop jumps, barreiras)." },
      { n: 4, foco: "Intensificação (mais pesado)", notas: "4 × 3 a RPE 8–8,5 (≈85–87%) + saltos/trap bar jump. Rondas mais curtas e mais carregadas." },
      { n: 5, foco: "Pico de potência", notas: "Pesado-leve: 3 × 2 a ≈88–90% + contraste + séries rápidas a 60%. Volume mais baixo do bloco (~45–50 contactos), condicionamento explosivo de 30 s." },
      { n: 6, foco: "Descarga + testes", notas: "Volume ~50%. Série máxima de 3 (RPE 9) no agachamento e no peso morto → 1RM estimado; reteste do salto vertical, do salto em comprimento, do benchmark de condicionamento e dos wall balls." }
    ],
    regras: [
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Série a RPE 1 abaixo do alvo → +2,5–5% na série ou sessão seguinte (inferiores +5 kg, superiores +2,5 kg). No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o exercício.",
      "Nunca treinar até à falha nos levantamentos principais. RIR 2–3 nas semanas 1–4; só a série de teste da semana 6 chega a RPE 9.",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas do treino de resistência): faz uma série a menos e fica no limite inferior da RPE.",
      "Pliometria antes da força, fresco e com recuperação completa. Cada contacto conta: se o contacto ficar longo, a aterragem ruidosa ou a altura cair >10%, termina o exercício.",
      "Contraste (semanas 3–5): 20–30 s entre a série pesada e os saltos; 2–3 min antes da série seguinte. Os saltos são máximos, nunca em fadiga.",
      "Condicionamento = qualidade, não velocidade: todas as rondas com a mesma técnica e a mesma produção (metros/watts a ≤5% da 1.ª ronda). Se cair mais, alarga o descanso para 3 min ou corta uma ronda.",
      "Wall balls: 9 kg a 3 m, anca abaixo do joelho, bola acima do alvo; só contam repetições válidas; pára ao 2.º no-rep seguido ou se a lombar arredondar.",
      "Segurança: supino e agachamento sempre com batentes de segurança ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões e nunca com dor lombar; dor aguda ou articular → parar.",
      "Alternativas: sem GHD → abdominais no AbMat ou crunch invertido; sem SkiErg → remo-ergómetro (mesmo tempo) ou air bike; sem trap bar → salto com agachamento com halteres leves; sem duplos na corda → corda simples com duplos a cada 3–5 saltos.",
      "Falhaste uma semana inteira? Repete-a em vez de saltar para a seguinte. Falhaste uma sessão? Faz a seguinte normalmente."
    ],
    interferencia: "Força e potência em off-season com a resistência em volume moderado e intensidade sobretudo baixa (Z1–Z2). Separa o Dia A e o Dia B por 48–72 h (ex.: terça e sexta). Se tiveres de juntar força e resistência no mesmo dia, faz a resistência de manhã e a força à tarde, com pelo menos 6 h de intervalo; corrida ou bicicleta fácil depois da força é aceitável, intervalos intensos não. Nada de força pesada nas 24–48 h antes da série chave de corrida ou do treino longo, e nunca o Dia B (peso morto) na véspera do longo de corrida. No dia a seguir à força: resistência fácil ou natação (ajuda a recuperar). Conta a pliometria e a corrida em conjunto: semana de muito volume de corrida → corta 25–30% dos contactos. Na semana 6 (testes) baixa também o volume de resistência. Proteína 1,6–2,0 g/kg/dia e hidratos de carbono à volta das sessões."
  };
})();
