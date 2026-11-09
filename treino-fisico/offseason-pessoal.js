// Plano Miguel — off-season de força e potência (6 semanas × 2 sessões = 12 sessões).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura de cada sessão: Aquecimento → Pliometria → Força → Condicionamento (formato diferente em cada sessão, qualidade) → Final (desafio variado).
// Dia A = agachamento + unilateral + membros superiores + core anti-extensão.
// Dia B = peso morto + afundo + membros superiores + core anti-rotação.
// Em cada semana, A + B cobrem: empurrar (horizontal e vertical), puxar (horizontal e vertical), agachar, dobradiça da anca,
// unilateral, transporte, core (anti-extensão, anti-rotação, flexão) e um motor monoestrutural (SkiErg, remo, air bike) — sem corrida no condicionamento.
// Periodização dos levantamentos principais: S1–S2 acumulação → S3–S4 intensificação (contraste) → S5 pico de potência → S6 descarga + testes.
// Percentagens referem-se ao 1RM estimado; o RPE/RIR manda sempre (ver regras em PROGRAMA_OFFSEASON).

(function () {
  const i = (ex, dose, descanso, nota) => (nota ? { ex, dose, descanso, nota } : { ex, dose, descanso });
  const b = (n, nome, min, itens) => ({ titulo: `${n} · ${nome} (${min} min)`, min, itens });

  // Aquecimento curto (5 min): motor fácil, uma mobilidade dirigida e a rampa de aproximação.
  const AQUEC_A = (aprox) => [
    i("ski-erg", "2 min fácil", "—", "Ritmo de conversa. Sem SkiErg: remo-ergómetro ou bicicleta."),
    i("worlds-greatest", "2/lado", "—"),
    i("agachamento-barra", aprox, "45 s", "Séries de aproximação (rampa). As restantes aproximações estão no início do bloco de força.")
  ];
  const AQUEC_B = (aprox) => [
    i("remo-ergometro", "2 min fácil", "—", "Ritmo de conversa, 20–22 pancadas/min."),
    i("kettlebell-swing", "1 × 10 leve", "—", "16–20 kg: ativar a dobradiça da anca antes do peso morto."),
    i("peso-morto", aprox, "45 s", "Séries de aproximação (rampa). As restantes estão no início do bloco de força.")
  ];
  const WB_2MIN = "Padrão: bola 9 kg a alvo de 3 m (6 kg/2,7 m se necessário). Anca abaixo do joelho e bola acima do alvo — só contam repetições válidas. Pára ao 2.º no-rep seguido, se a lombar arredondar no fundo ou se os ombros doerem. Regista o número.";
  const WB_SEGUIDO = "Mesmo padrão (9 kg, 3 m, anca abaixo do joelho). Uma série só: termina quando pousares a bola, falhares o alvo 2 vezes seguidas ou a técnica se degradar. Regista o número.";
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
      nota: `${nota} Pliometria: ~${contactos} contactos no bloco 2.`,
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
    "Acumulação: técnica do agachamento com carga moderada e volume alto, teste inicial do salto vertical e a peça de condicionamento de referência (benchmark) do bloco.",
    "Carga moderada, técnica perfeita, 3 repetições na reserva. Se a 4.ª série de agachamento ficar a RPE ≤6, sobe 5 kg na semana 2; se passar RPE 8, mantém. Regista os metros do SkiErg em cada ronda e o número de wall balls: repetes os dois na semana 6.",
    90,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("saltos-duplos-corda", "3 × 15", "60 s", "Sem duplos consistentes: 3 × 30 s de corda simples com 1 duplo a cada 4 saltos."),
        i("pogo", "3 × 10", "60 s", "Joelhos quase esticados, contacto curto e silencioso."),
        i("salto-contramovimento", "3 × 1 (teste inicial)", "60 s", "Mede a altura (app tipo My Jump ou marca na parede). Fica com a melhor das 3."),
        i("salto-caixa", "4 × 3", "90 s", "Caixa 50–60 cm. Aterra em silêncio em meio agachamento e desce a andar.")
      ]),
      b(3, "Força", 26, [
        i("agachamento-barra", "4 × 6 @ RPE 7 (≈70–72%)", "2–3 min", "Aproximação: 55% × 3, 65% × 2. Tempo 3-1-X nas 2 primeiras séries. Barra sobre o meio do pé, joelhos na linha dos pés."),
        i("split-squat-bulgaro", "3 × 8/perna @ RIR 3", "—", "Superset com o press: búlgaro → press → 60–90 s. Começa pela perna mais fraca."),
        i("press-ombro", "3 × 8 @ RIR 2–3", "60–90 s", "Empurrar vertical. De pé, glúteos e abdómen apertados, sem arquear a lombar."),
        i("rollout", "3 × 8", "45 s", "Core anti-extensão. Só até onde a lombar não cede. Sem roda: barra com discos ou fitball.")
      ]),
      b(4, "Condicionamento", 24, [
        i("ski-erg", "1 min", "—", "REFERÊNCIA · 5 RONDAS (qualidade, não velocidade) · 2 min entre rondas. SkiErg a RPE 7 (≈ritmo de 2 km). Regista os metros: a 5.ª ronda não deve ficar mais de 5% abaixo da 1.ª. Sem SkiErg: remo 1 min."),
        i("supino-barra", "12 reps", "—", "≈55% do 1RM (RIR 3–4), sempre com batentes. Sem banco/rack: supino com halteres."),
        i("ghd-abdominais", "15 reps", "—", "Só até à horizontal. Sem GHD: 15 abdominais no AbMat ou 10 crunch invertido."),
        i("elevacoes", "12 reps", "2 min (fim da ronda)", "Amplitude completa; divide em séries (6 + 6) para manter a qualidade. Sem 12 limpas: elevações assistidas.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo em 2 min", "—", WB_2MIN + " Referência para a semana 6."),
        ...ALONG_A
      ])
    ]);

  S(1, "B", "7",
    "Acumulação: técnica do peso morto e do afundo, teste inicial do salto em comprimento e um EMOM de corpo inteiro com remo, clean & press, transporte e flexão do tronco.",
    "Cada repetição do peso morto parte do chão parado (sem toque e volta). Se a 4.ª série ficar a RPE ≤6, sobe 5–10 kg na semana 2; se passar RPE 8, mantém. EMOM: cada minuto deve deixar 15–25 s de descanso; se não deixar, baixa as repetições. Guarda 48–72 h entre o Dia A e o Dia B.",
    88,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("corda-alternada", "2 × 30 (15/pé)", "60 s"),
        i("pogo-lateral", "2 × 10", "60 s"),
        i("salto-comprimento", "4 × 2", "90 s", "Aterra e fixa 2 s. Mede a melhor marca (teste inicial, repetes na semana 6).")
      ]),
      b(3, "Força", 26, [
        i("peso-morto", "4 × 5 @ RPE 7 (≈70–72%)", "3 min", "Aproximação: 55% × 3, 65% × 2. Costas neutras, barra encostada às pernas."),
        i("afundo-atras", "3 × 8/perna @ RIR 3", "—", "Superset com a remada: afundo → remada → 60–90 s."),
        i("remada-haltere", "3 × 10/braço @ RIR 2", "60–90 s", "Puxar horizontal. Apoio num banco, cotovelo para a anca."),
        i("pallof", "3 × 10/lado", "30 s", "Core anti-rotação.")
      ]),
      b(4, "Condicionamento", 20, [
        i("remo-ergometro", "Min 1: 14/12 cal", "—", "EMOM 20 min (5 voltas de 4 minutos), RPE 7. Sem remo: air bike ou SkiErg com as mesmas calorias."),
        i("kettlebell-clean-press", "Min 2: 5/braço", "—", "16–20 kg. Empurrar vertical + dobradiça da anca. Sem kettlebell: haltere."),
        i("farmer-carry", "Min 3: 40 m", "—", "2 × 28–32 kg, tronco alto. Sem kettlebells pesados: halteres ou trap bar."),
        i("elevacao-joelhos-suspenso", "Min 4: 10 reps", "resto do minuto", "Flexão do tronco, sem balanço. Alternativa: crunch invertido.")
      ]),
      b(5, "Final", 5, [
        i("air-bike", "Máximo de calorias em 1 min", "—", "Arranque controlado nos primeiros 10 s e depois sobe. Regista as calorias (repetes na semana 5). Sem air bike: remo máximo de metros em 1 min."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 2 — ACUMULAÇÃO (mais carga) =======================
  S(2, "A", "7–8",
    "Acumulação: mais carga no agachamento, elevações como acessório de puxar vertical e blocos de AMRAP a ritmo controlado com air bike, flexões, remada invertida e toes to bar.",
    "Sobe a carga de acordo com o RPE da semana 1 (+2,5–5%). AMRAP controlado: escolhe um ritmo que consigas repetir nos 4 blocos (as voltas por bloco não podem cair mais de meia volta). O final tem saltos: conta ~20–30 contactos extra.",
    96,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("saltos-duplos-corda", "3 × 15", "60 s"),
        i("pogo", "3 × 12", "60 s"),
        i("salto-caixa", "5 × 3", "90 s", "Caixa 60 cm. Reset completo entre saltos.")
      ]),
      b(3, "Força", 26, [
        i("agachamento-barra", "4 × 5 @ RPE 7–8 (≈75%)", "2–3 min", "Aproximação: 55% × 3, 65% × 2. Tempo 3-0-X."),
        i("split-squat-bulgaro", "3 × 8/perna @ RIR 2", "—", "Superset com as elevações; +2 kg por haltere."),
        i("elevacoes", "3 × 6–8 @ RIR 2", "60–90 s", "Puxar vertical, estritas. Se fizeres 8 fáceis, +5 kg de lastro."),
        i("dead-bug", "3 × 8/lado", "30 s", "Core anti-extensão: lombar colada ao chão, expira a fundo em cada repetição.")
      ]),
      b(4, "Condicionamento", 22, [
        i("air-bike", "12/10 cal", "—", "4 BLOCOS DE AMRAP 4 min a ritmo controlado (RPE 7) · 2 min entre blocos. Regista as voltas. Sem air bike: remo 15/12 cal."),
        i("flexoes", "10 reps", "—", "Empurrar horizontal; peito ao chão, corpo em prancha."),
        i("remada-invertida", "10 reps", "—", "Puxar horizontal, nas argolas ou numa barra baixa (TRX serve)."),
        i("toes-to-bar", "8 reps", "2 min (fim do bloco)", "Flexão do tronco. Alternativa: elevação de joelhos suspenso.")
      ]),
      b(5, "Final", 5, [
        i("burpee-salto-comprimento", "Máximo em 2 min", "—", "Cada salto aterra fixo e com os joelhos alinhados; se a aterragem ficar descontrolada, termina. Espaço de 15–20 m (ida e volta). Regista o número."),
        ...ALONG_A
      ])
    ]);

  S(2, "B", "7–8",
    "Acumulação: mais carga no peso morto e no afundo, landmine press para o ombro e um E2MOM com remo, thrusters, SkiErg e transporte de sandbag.",
    "Peso morto +5–10 kg em relação à semana 1 se ficou a RPE ≤7. Nada de falha. E2MOM: cada janela de 2 min deve deixar 20–40 s de descanso. Se a corrida intensa foi na véspera, fica no limite inferior de carga.",
    102,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 10, [
        i("corda-alternada", "2 × 30 (15/pé)", "60 s"),
        i("saltos-unipodais", "3 × 5/perna", "60 s", "Saltos no sítio numa perna, joelho alinhado com o pé."),
        i("salto-comprimento", "4 × 3", "90 s", "Aterra e fixa 2 s em cada salto.")
      ]),
      b(3, "Força", 26, [
        i("peso-morto", "4 × 5 @ RPE 7–8 (≈75%)", "3 min", "Aproximação: 55% × 3, 65% × 2."),
        i("afundo-atras", "3 × 8/perna @ RIR 2", "—", "Superset com o landmine press."),
        i("landmine-press", "3 × 8/braço @ RIR 2", "60–90 s", "Empurrar vertical/inclinado, meio ajoelhado. Sem landmine: press de ombro com haltere a uma mão."),
        i("pallof-isometrico", "3 × 20 s/lado", "30 s", "Core anti-rotação.")
      ]),
      b(4, "Condicionamento", 20, [
        i("remo-ergometro", "Janela ímpar: 250 m", "—", "E2MOM 20 min (5 pares de janelas de 2 min), RPE 7. Janela ímpar = 250 m de remo + 8 thrusters; janela par = 200 m de SkiErg + 40 m de sandbag."),
        i("thruster-halteres", "Janela ímpar: 8 reps", "resto da janela", "2 × 15 kg. Agachar + empurrar vertical. Alternativa: wall ball 10 reps."),
        i("ski-erg", "Janela par: 200 m", "—", "RPE 7, ritmo constante. Sem SkiErg: 12/9 cal de air bike."),
        i("sandbag-carry", "Janela par: 40 m", "resto da janela", "Ao ombro (troca a meio). Sem sandbag: kettlebell em goblet ou farmer carry.")
      ]),
      b(5, "Final", 5, [
        i("kettlebell-swing", "Máximo sem pousar (24 kg)", "—", "Swing russo até à altura dos ombros. Termina quando a anca deixar de estender por completo ou a lombar perder a posição neutra. Regista o número."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 3 — INTENSIFICAÇÃO (contraste) =======================
  S(3, "A", "8",
    "Intensificação: agachamento pesado em séries de 3 com saltos à caixa (contraste), supino pesado e uma escada ascendente de devil press, step-ups e GHD com SkiErg entre degraus.",
    "Contraste: 20–30 s depois de cada série de agachamento, 3 saltos máximos à caixa; depois 2–3 min. Carga pelo RPE: série a RPE ≤7 → +5 kg; RPE 9 → −5%. Escada: o SkiErg entre degraus é a ritmo moderado, para manter a técnica dos halteres.",
    72,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "3 × 15", "60 s"),
        i("drop-jump", "4 × 3", "90 s", "Caixa 30 cm. Contacto mínimo, salto máximo.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "5 × 3 @ RPE 8 (≈82–85%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2. Nunca falhar: 2 repetições na reserva."),
        i("salto-caixa", "5 × 3", "2–3 min", "Contraste: logo a seguir a cada série de agachamento. Caixa 60 cm, salto máximo."),
        i("split-squat-bulgaro", "3 × 6/perna @ RIR 2", "—", "Superset com o supino."),
        i("supino-barra", "3 × 5 @ RIR 2 (≈80%)", "90 s", "Empurrar horizontal pesado, com batentes."),
        i("stir-the-pot", "2 × 8/sentido", "30 s", "Core anti-extensão na fitball.")
      ]),
      b(4, "Condicionamento", 20, [
        i("devil-press", "2-4-6-8-10", "—", "ESCADA ASCENDENTE (qualidade) · cap 18 min. Em cada degrau: devil press, step-ups e GHD com o número de repetições do degrau; depois 150 m de SkiErg. 2 × 12,5–15 kg. Alternativa: burpee + haltere snatch."),
        i("step-up", "2-4-6-8-10/perna", "—", "Caixa à altura do joelho, halteres leves. Unilateral; sobe só com a perna de cima."),
        i("ghd-abdominais", "2-4-6-8-10", "—", "Flexão do tronco. Sem GHD: abdominais no AbMat."),
        i("ski-erg", "150 m após cada degrau", "—", "RPE 6–7. Sem SkiErg: 200 m de remo.")
      ]),
      b(5, "Final", 5, [
        i("elevacoes", "Máximo de estritas (1 série)", "—", "Sem kipping, braços esticados em baixo e queixo acima da barra. Termina na primeira repetição incompleta. Regista o número."),
        ...ALONG_A
      ])
    ]);

  S(3, "B", "8",
    "Intensificação: peso morto pesado com salto em comprimento (contraste), remada no cabo e um chipper de uma passagem com remo, trenó, arranco com kettlebell, sandbag e turkish get-up.",
    "Contraste: 20–30 s depois de cada série de peso morto, 2 saltos em comprimento máximos; depois 3 min. Chipper: uma passagem a RPE 7–8, sem pressa — cada estação feita com técnica perfeita. Não faças esta sessão nas 48 h antes do treino longo de corrida.",
    66,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 20 (10/pé)", "60 s"),
        i("saltos-barreiras", "4 × 4", "90 s", "Barreiras de 30–45 cm, contactos curtos.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "5 × 3 @ RPE 8 (≈82–85%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2."),
        i("salto-comprimento", "5 × 2", "3 min", "Contraste: logo a seguir a cada série de peso morto."),
        i("afundo-atras", "3 × 6/perna @ RIR 2", "—", "Superset com a remada; halteres pesados."),
        i("remada-cabo", "3 × 10 @ RIR 2", "60–90 s", "Puxar horizontal. Sem cabo: remada com haltere ou elástico."),
        i("landmine-rotacao", "2 × 6/lado", "30 s", "Core anti-rotação, controlado.")
      ]),
      b(4, "Condicionamento", 20, [
        i("remo-ergometro", "500 m", "—", "CHIPPER (uma passagem, qualidade) · cap 18 min: 500 m de remo → 4 × 15 m de trenó → 20 arrancos com kettlebell → 60 m de sandbag → 3 turkish get-ups/lado → 300 m de remo."),
        i("treno-empurrar", "4 × 15 m", "—", "Peso corporal no trenó (ajusta para passos contínuos). Sem trenó: empurrar um prato pesado em relva sintética ou 30 s de air bike pesada."),
        i("kettlebell-snatch", "20 (10/braço)", "—", "20–24 kg. Alternativa: haltere snatch."),
        i("sandbag-carry", "60 m", "—", "Em abraço. Sem sandbag: farmer carry pesado."),
        i("turkish-get-up", "3/lado", "—", "12–16 kg, devagar."),
        i("remo-ergometro", "300 m", "—", "Último bloco a RPE 8.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo sem pousar a bola (1 série)", "—", WB_SEGUIDO),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 4 — INTENSIFICAÇÃO (mais pesado) =======================
  S(4, "A", "8–8,5",
    "Intensificação: agachamento a 85–87% com saltos à caixa (contraste), supino pesado e um EMOM com air bike, arranco com haltere, subida à corda e battle rope.",
    "Semana mais pesada do bloco. Se dormiste mal ou a variabilidade cardíaca está baixa, faz 3 séries em vez de 4. Duas séries seguidas a RPE 9 → termina o exercício. EMOM: a subida à corda é técnica — se a pega falhar, troca para elevações.",
    64,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "2 × 20", "60 s"),
        i("drop-jump", "4 × 3", "2 min", "Caixa 40 cm se a semana 3 teve contactos curtos; senão 30 cm.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "4 × 3 @ RPE 8–8,5 (≈85–87%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 82% × 1."),
        i("salto-caixa", "4 × 3", "3 min", "Contraste. Procura saltar mais alto, não mais rápido."),
        i("split-squat-bulgaro", "3 × 5/perna @ RIR 2", "—", "Superset com o supino."),
        i("supino-barra", "3 × 4 @ RIR 2 (≈85%)", "90 s", "Empurrar horizontal pesado, com batentes."),
        i("rollout", "3 × 10", "45 s", "Core anti-extensão; mais amplitude que na semana 1.")
      ]),
      b(4, "Condicionamento", 24, [
        i("air-bike", "Min 1: 12/9 cal", "—", "EMOM 24 min (6 voltas de 4 minutos), RPE 7–8. Sem air bike: remo 14/11 cal."),
        i("haltere-snatch", "Min 2: 8 alternados", "—", "22,5 kg. Dobradiça da anca + empurrar vertical. Alternativa: kettlebell snatch."),
        i("subida-corda", "Min 3: 1 subida", "—", "Puxar vertical. Sem corda: 5 elevações com toalha."),
        i("battle-rope", "Min 4: 30 s", "resto do minuto", "Ondas alternadas, amplitude constante. Sem corda: 8 slams de bola medicinal.")
      ]),
      b(5, "Final", 5, [
        i("hollow", "Máximo em isometria (1 série)", "—", "Lombar colada ao chão, braços acima da cabeça. Termina quando a lombar descolar. Regista o tempo."),
        ...ALONG_A
      ])
    ]);

  S(4, "B", "8–8,5",
    "Intensificação: peso morto a 85–87% com salto com trap bar (força-velocidade), elevações com lastro e um bloco de densidade com trenó, sandbag ao ombro, gatinhar em urso e remada invertida.",
    "Salto com trap bar com 20–30% do 1RM do peso morto: altura máxima, não carga. Densidade: em cada bloco de 6 min faz o máximo de voltas com técnica perfeita a RPE 7 — o número de voltas deve ser igual nos 3 blocos.",
    68,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 20 (10/pé)", "60 s"),
        i("multisaltos", "4 × 4", "90 s", "Bounds longos e ritmados.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "4 × 3 @ RPE 8–8,5 (≈85–87%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 82% × 1."),
        i("salto-trap-bar", "4 × 3 @ 20–30% 1RM", "3 min", "Contraste. Sem trap bar: salto com agachamento com 2 halteres leves."),
        i("afundo-atras", "3 × 5/perna @ RIR 2", "—", "Superset com as elevações."),
        i("elevacoes", "4 × 4 lastradas (+7,5–10 kg) @ RIR 2", "90 s", "Puxar vertical pesado. Sem cinto: haltere entre os pés."),
        i("pallof", "3 × 10/lado", "30 s", "Core anti-rotação; elástico mais forte que na semana 1.")
      ]),
      b(4, "Condicionamento", 22, [
        i("treno-puxar", "20 m", "—", "DENSIDADE: 3 blocos de 6 min · 1 min 30 s entre blocos · máximo de voltas com técnica perfeita (RPE 7). Trenó de costas com arnês ou mão sobre mão. Sem trenó: 10 remadas com elástico forte."),
        i("sandbag-clean", "5 reps", "—", "Alterna o ombro. Sem sandbag: 8 kettlebell swings pesados."),
        i("gatinhar-urso", "15 m", "—", "Core anti-extensão/rotação; anca baixa e quieta."),
        i("remada-invertida", "8 reps", "—", "Pés elevados. Alternativa: remada no TRX.")
      ]),
      b(5, "Final", 5, [
        i("farmer-carry", "Distância máxima em 2 min", "—", "2 × 32 kg. Pousar é permitido, mas o tempo não para. Tronco alto e passos curtos. Regista os metros."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 5 — PICO DE POTÊNCIA =======================
  S(5, "A", "8–9",
    "Pico de potência: pesado-leve no agachamento (duplas a 88–90% + saltos + séries rápidas a 60%), supino e remada pesados e intervalos de potência aeróbia curtos a alternar air bike e SkiErg.",
    "Intensidade mais alta com o volume mais baixo. Séries leves à máxima velocidade intencional; se a barra abrandar, termina. Se a 1.ª dupla for RPE 9,5, baixa 5%. Intervalos: os watts do último devem ficar a ≤5% do primeiro; se caírem mais, pára aí.",
    45,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "2 × 15", "60 s"),
        i("drop-jump", "3 × 3", "2 min", "Caixa 40–50 cm; contacto mínimo.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "3 × 2 @ RPE 8,5–9 (≈88–90%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 85% × 1."),
        i("salto-caixa", "3 × 2", "3 min", "Contraste: 2 saltos máximos depois de cada dupla."),
        i("agachamento-barra", "2 × 3 @ 60% (máxima velocidade)", "2 min", "Parte leve do pesado-leve."),
        i("supino-barra", "3 × 3 @ RIR 2 (≈87%)", "—", "Superset com a remada; com batentes."),
        i("remada-haltere", "3 × 6/braço @ RIR 2", "90 s", "Puxar horizontal pesado."),
        i("dead-bug", "2 × 8/lado", "30 s", "Core anti-extensão com haltere leve nas mãos.")
      ]),
      b(4, "Condicionamento", 16, [
        i("air-bike", "Intervalos ímpares: 30 s forte", "90 s", "INTERVALOS DE POTÊNCIA AERÓBIA: 8 × (30 s forte : 90 s), RPE 8–9. Ímpares na air bike, pares no SkiErg. Nos primeiros 20 s de cada recuperação: 5 slams (ímpares) ou 5 toes to bar (pares); o resto é recuperação."),
        i("ski-erg", "Intervalos pares: 30 s forte", "90 s", "Sem SkiErg: remo."),
        i("slam-medicinal", "5 reps (após os ímpares)", "—", "Bola de 8–10 kg. Flexão do tronco explosiva."),
        i("toes-to-bar", "5 reps (após os pares)", "—", "Alternativa: elevação de joelhos suspenso.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo em 2 min", "—", WB_2MIN),
        ...ALONG_A
      ])
    ]);

  S(5, "B", "8–9",
    "Pico de potência: peso morto a 88–90% com salto com trap bar leve, elevações e press pesados e rondas de qualidade com remo, trenó, burpees e suitcase carry.",
    "Volume baixo: 3 duplas pesadas e saltos máximos. Se a 1.ª dupla subir devagar (RPE 9,5), baixa 5%. Rondas: o remo é forte mas controlado, com a mesma divisão nas 3 rondas. Não faças esta sessão nas 48 h antes de uma corrida intensa ou do treino longo.",
    51,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 15 (≈8/pé)", "60 s"),
        i("salto-comprimento-unipodal", "3 × 2/perna", "90 s", "Aterra nas duas pernas e fixa.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "3 × 2 @ RPE 8,5–9 (≈88–90%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 85% × 1."),
        i("salto-trap-bar", "3 × 3 @ 20% 1RM", "3 min", "Contraste: altura máxima."),
        i("afundo-atras", "2 × 5/perna @ RIR 2", "60 s"),
        i("elevacoes", "3 × 3 lastradas (+10–12,5 kg)", "—", "Superset com o press."),
        i("press-ombro", "3 × 5 @ RIR 2", "90 s", "Empurrar vertical pesado, de pé."),
        i("landmine-rotacao", "2 × 5/lado", "30 s", "Core anti-rotação, mais rápido na ida e controlado na volta.")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "400 m", "—", "3 RONDAS (qualidade) · 3 min entre rondas, RPE 8 (≈ritmo de 2 km). Sem remo: 400 m de SkiErg."),
        i("treno-empurrar", "2 × 15 m pesado", "—", "Sem trenó: empurrar um prato pesado ou 20 s de air bike a fundo."),
        i("burpee", "8 reps", "—", "Peito ao chão e salto completo."),
        i("suitcase-carry", "30 m/lado", "3 min (fim da ronda)", "Kettlebell pesado de um só lado, tronco sem inclinar.")
      ]),
      b(5, "Final", 5, [
        i("air-bike", "Máximo de calorias em 1 min (reteste)", "—", "Compara com a semana 1. Sem air bike: remo máximo de metros em 1 min."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 6 — DESCARGA + TESTES =======================
  S(6, "A", "6 (teste: 9)",
    "Descarga e teste: reteste do salto vertical, série máxima de 3 no agachamento para estimar o 1RM e repetição da peça de referência da semana 1.",
    "Volume total ~50%, mas o teste é a sério. Agachamento: aproximação 50% × 5, 65% × 3, 75% × 2, 85% × 1 e uma série de 3 a RPE 9 (sem falha). Só tentas outra (+2,5–5 kg) se a primeira foi RPE ≤8 com técnica perfeita. 1RM estimado ≈ carga × 1,10. Condicionamento: as mesmas 5 rondas e cargas da semana 1 — compara metros, divisões das elevações e RPE.",
    43,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "2 × 10", "60 s"),
        i("pogo", "2 × 10", "60 s"),
        i("salto-contramovimento", "3 × 1 (reteste)", "90 s", "Mesmo método de medição da semana 1.")
      ]),
      b(3, "Força", 22, [
        i("agachamento-barra", "Teste: 1 série máxima de 3 @ RPE 9 (≈90–92%)", "3–4 min", "Sempre com batentes ou ajudante. Regista carga, RPE e e1RM."),
        i("split-squat-bulgaro", "2 × 6/perna @ RIR 4", "—", "Superset com o press; leve."),
        i("press-ombro", "2 × 6 @ RIR 4", "60 s", "Leve: só manter o padrão."),
        i("rollout", "2 × 8", "30 s", "Core anti-extensão.")
      ]),
      b(4, "Condicionamento", 24, [
        i("ski-erg", "1 min", "—", "REFERÊNCIA (reteste) · 5 RONDAS iguais à semana 1 · 2 min entre rondas. Compara os metros por ronda com a mesma RPE 7."),
        i("supino-barra", "12 reps", "—", "Mesma carga da semana 1."),
        i("ghd-abdominais", "15 reps", "—", "Sem GHD: abdominais no AbMat."),
        i("elevacoes", "12 reps", "2 min (fim da ronda)", "Regista quantas divisões precisaste.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo em 2 min (reteste)", "—", WB_2MIN + " Compara com a semana 1."),
        ...ALONG_A
      ])
    ]);

  S(6, "B", "6 (teste: 9)",
    "Descarga e teste: reteste do salto em comprimento, série máxima de 3 no peso morto e um AMRAP leve de corpo inteiro para fechar o bloco.",
    "Faz este teste pelo menos 72 h depois do Dia A. Peso morto: aproximação 50% × 5, 65% × 3, 75% × 2, 85% × 1 e uma série de 3 a RPE 9; se as costas arredondarem, a série termina aí. 1RM estimado ≈ carga × 1,10. AMRAP a RPE 6 — é descarga.",
    53,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 15 (≈8/pé)", "60 s"),
        i("pogo-lateral", "2 × 10", "60 s"),
        i("salto-comprimento", "3 × 1 (reteste)", "90 s", "Mesmo piso e calçado da semana 1.")
      ]),
      b(3, "Força", 22, [
        i("peso-morto", "Teste: 1 série máxima de 3 @ RPE 9 (≈90–92%)", "3–4 min", "Regista carga, RPE e e1RM."),
        i("afundo-atras", "2 × 6/perna @ RIR 4", "—", "Superset com a remada; leve."),
        i("remada-haltere", "2 × 8/braço @ RIR 3", "60 s"),
        i("pallof", "2 × 10/lado", "30 s", "Core anti-rotação.")
      ]),
      b(4, "Condicionamento", 15, [
        i("remo-ergometro", "200 m", "—", "AMRAP 12 min a RPE 6 (descarga, conversa possível). Sem remo: 200 m de SkiErg ou 1 min de air bike fácil."),
        i("farmer-carry", "40 m", "—"),
        i("turkish-get-up", "1/lado", "—", "Leve e lento."),
        i("flexoes", "10 reps", "—"),
        i("remada-invertida", "10 reps", "—")
      ]),
      b(5, "Final", 5, [
        i("kettlebell-swing", "Máximo sem pousar (24 kg, reteste)", "—", "Mesmo padrão da semana 2. Compara."),
        ...ALONG_B
      ])
    ]);

  SESSOES.push(...sessoes);

  window.PROGRAMA_OFFSEASON = {
    id: "off-season-pessoal",
    nome: "Plano Miguel · Off-season força e potência (6 semanas)",
    objetivo: "Aumentar a força máxima (agachamento e peso morto) e a potência (saltos, força-velocidade) sem comprometer o treino de resistência, com condicionamento híbrido de corpo inteiro — uma peça diferente em cada sessão, sempre com qualidade antes da velocidade. 2 sessões por semana, ≤75 min.",
    sessoes: sessoes.map((s) => s.id),
    semanas: [
      { n: 1, foco: "Acumulação e técnica", notas: "Agachamento 4 × 6 / peso morto 4 × 5 a RPE 7 (≈70–72%). Testes iniciais de salto. Condicionamento: rondas de referência (A) e EMOM 20 (B). Finais: wall balls 2 min, calorias na air bike 1 min." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "4 × 5 a RPE 7–8 (≈75%). Condicionamento: 4 AMRAP de 4 min controlados (A) e E2MOM 20 com remo/thrusters/SkiErg/sandbag (B). Finais: burpees com salto em comprimento, swings sem pousar." },
      { n: 3, foco: "Intensificação · contraste", notas: "5 × 3 a RPE 8 (≈82–85%) com saltos em contraste. Condicionamento: escada 2–10 (A) e chipper com trenó (B). Finais: elevações estritas máximas, wall balls sem pousar." },
      { n: 4, foco: "Intensificação (mais pesado)", notas: "4 × 3 a RPE 8–8,5 (≈85–87%). Condicionamento: EMOM 24 com corda e battle rope (A) e densidade 3 × 6 min (B). Finais: hollow máximo, farmer carry 2 min." },
      { n: 5, foco: "Pico de potência", notas: "Pesado-leve: 3 × 2 a ≈88–90% + contraste + séries rápidas. Condicionamento: intervalos 8 × 30 s : 90 s (A) e rondas com remo e trenó (B). Finais: wall balls 2 min, reteste da air bike." },
      { n: 6, foco: "Descarga + testes", notas: "Volume ~50%. Série máxima de 3 (RPE 9) no agachamento e no peso morto → 1RM estimado; reteste dos saltos, da peça de referência e dos wall balls (A); AMRAP leve e reteste dos swings (B)." }
    ],
    cobertura: "Em cada semana, Dia A + Dia B cobrem: empurrar horizontal (supino, flexões, burpees) e vertical (press, landmine, thrusters, devil press, arrancos); puxar horizontal (remadas) e vertical (elevações, corda, SkiErg); agachar; dobradiça da anca; unilateral (búlgaro, afundo, step-up); transporte (farmer, sandbag, suitcase); core anti-extensão (Dia A), anti-rotação (Dia B) e flexão; e um motor monoestrutural (SkiErg, remo, air bike) — sem corrida no condicionamento.",
    regras: [
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Série a RPE 1 abaixo do alvo → +2,5–5% (inferiores +5 kg, superiores +2,5 kg). No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o exercício.",
      "Nunca até à falha nos levantamentos principais: RIR 2–3 nas semanas 1–4; só os testes da semana 6 chegam a RPE 9.",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas da resistência): uma série a menos e limite inferior da RPE; no condicionamento, corta uma volta/ronda.",
      "Pliometria antes da força, fresco e com recuperação completa. Se o contacto ficar longo, a aterragem ruidosa ou a altura cair >10%, termina o exercício.",
      "Contraste (semanas 3–5): 20–30 s entre a série pesada e os saltos; 2–3 min antes da série seguinte.",
      "Condicionamento = qualidade, não velocidade, qualquer que seja o formato: EMOM/E2MOM com 15–40 s de folga por janela; AMRAP e densidade com o mesmo número de voltas em todos os blocos; rondas e intervalos com produção a ≤5% da 1.ª. Se cair mais, alarga o descanso ou corta uma ronda.",
      "Finais máximos com padrão fixo: só contam repetições válidas; termina ao 2.º no-rep ou quando a técnica se degradar. Regista sempre o resultado.",
      "Segurança: supino e agachamento com batentes ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões; corda com descida controlada; dor aguda ou articular → parar.",
      "Alternativas: sem GHD → AbMat; sem SkiErg → remo; sem air bike → remo ou bicicleta; sem trenó → empurrar prato ou air bike; sem sandbag → kettlebell em goblet/farmer; sem corda de subir → elevações com toalha; sem battle rope → slams; sem trap bar → salto com halteres leves.",
      "Falhaste uma semana inteira? Repete-a. Falhaste uma sessão? Faz a seguinte normalmente."
    ],
    interferencia: "Força e potência em off-season com a resistência em volume moderado e intensidade sobretudo baixa (Z1–Z2). Separa o Dia A e o Dia B por 48–72 h (ex.: terça e sexta). Se juntares força e resistência no mesmo dia, resistência de manhã e força à tarde, com pelo menos 6 h de intervalo; corrida ou bicicleta fácil depois da força é aceitável, intervalos intensos não. Nada de força pesada nas 24–48 h antes da série chave de corrida ou do treino longo, e nunca o Dia B (peso morto) na véspera do longo de corrida. O condicionamento não tem corrida (motor = SkiErg, remo, air bike, trenó), para não somar impacto à corrida da semana. Conta a pliometria e a corrida em conjunto: semana de muito volume de corrida → corta 25–30% dos contactos. Na semana 6 baixa também o volume de resistência. Proteína 1,6–2,0 g/kg/dia e hidratos de carbono à volta das sessões."
  };
})();

// Formato do condicionamento, mostrado em destaque no topo do bloco (rondas, tempo, descanso).
(function () {
  const FORMATO = {
    "off-s1-dia1": "5 rondas · 2 min de descanso entre rondas · qualidade, não velocidade",
    "off-s1-dia2": "EMOM 20 min · 5 voltas de 4 min (uma estação por minuto)",
    "off-s2-dia1": "4 blocos de AMRAP 4 min · 2 min entre blocos · ritmo controlado",
    "off-s2-dia2": "E2MOM 20 min · 5 pares de janelas de 2 min (alterna janela A e B)",
    "off-s3-dia1": "Escada 2-4-6-8-10 repetições · limite 18 min · qualidade",
    "off-s3-dia2": "Chipper · 1 passagem pela ordem · limite 18 min",
    "off-s4-dia1": "EMOM 24 min · 6 voltas de 4 min (uma estação por minuto)",
    "off-s4-dia2": "3 blocos de 6 min · 1 min 30 s entre blocos · máximo de voltas com técnica perfeita",
    "off-s5-dia1": "8 intervalos · 30 s forte : 90 s de recuperação",
    "off-s5-dia2": "3 rondas · 3 min de descanso entre rondas",
    "off-s6-dia1": "5 rondas (reteste da semana 1) · 2 min de descanso entre rondas",
    "off-s6-dia2": "AMRAP 12 min · leve (RPE 6)"
  };
  SESSOES.forEach((s) => {
    if (!FORMATO[s.id]) return;
    const b = s.blocos.find((x) => /Condicionamento/.test(x.titulo));
    if (b) b.formato = FORMATO[s.id];
  });
})();
