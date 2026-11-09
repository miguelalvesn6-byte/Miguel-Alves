// Plano Miguel — off-season de força e potência para TRIATLETA (6 semanas × 2 sessões = 12 sessões, ≤60 min cada).
// Atleta: treinador de triatlo/endurance experiente, com prática de treino de força e condicionamento híbrido.
// Estrutura: 1 Aquecimento (5 min) → 2 Pliometria → 3 Força → 4 Condicionamento (formato diferente em cada sessão, qualidade) → 5 Final.
// Dia A = agachamento + búlgaro + puxar para a natação (dorsal) + gémeos/sóleo + core anti-extensão.
// Dia B = peso morto + afundo/step-up + membros superiores + anti-rotação + isquiotibiais/adutores + coifa dos rotadores.
// Especificidade do triatlo: natação (dorsal, omoplata, rotadores externos, SkiErg); ciclismo (extensão da anca e do joelho,
// força unilateral, rigidez do tronco para a posição aero); corrida (gémeos/sóleo/Aquiles, rigidez reativa, isquiotibiais e adutores).
// Periodização: S1–S2 acumulação → S3–S4 intensificação (≥85%, contraste) → S5 pico de potência → S6 descarga + testes.
// Percentagens referem-se ao 1RM estimado; o RPE/RIR manda sempre (ver regras em PROGRAMA_OFFSEASON).
// Sem corrida no condicionamento nem nos finais (o motor é SkiErg, remo, air bike, trenó).

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
  const ALONG_A = [i("alongamento-gemeos", "30 s/lado", "—")];
  const ALONG_B = [i("figura-4", "30 s/lado", "—")];
  const INTERF_A = "Interferência: faz o Dia A num dia sem bicicleta intensa; se houver treino de resistência no mesmo dia, resistência de manhã e força ≥6 h depois. Nunca na véspera do treino longo de bicicleta.";
  const INTERF_B = "Interferência: o Dia B (peso morto, pliometria de corrida) nunca nas 48 h antes da série chave de corrida ou do longo de corrida; natação fácil no dia seguinte ajuda a recuperar.";

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
      nota: `${nota} ${dia === "A" ? INTERF_A : INTERF_B} Pliometria: ~${contactos} contactos.`,
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
    "Acumulação: técnica do agachamento (extensão do joelho e da anca para o ciclismo), puxar de braços estendidos para a natação, capacidade dos gémeos e a peça de referência do bloco.",
    "Carga moderada, 3 repetições na reserva. Se a 4.ª série de agachamento ficar a RPE ≤6, sobe 5 kg na semana 2; se passar RPE 8, mantém. Regista os metros do SkiErg em cada ronda e os wall balls: repetes os dois na semana 6.",
    77,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "3 × 15", "45 s", "Sem duplos consistentes: corda simples com 1 duplo a cada 4 saltos."),
        i("pogo", "2 × 10", "45 s", "Rigidez do tornozelo: joelhos quase esticados, contacto curto e silencioso."),
        i("salto-contramovimento", "3 × 1 (teste inicial)", "45 s", "Mede a altura (app tipo My Jump ou marca na parede). Fica com a melhor."),
        i("salto-caixa", "3 × 3", "60 s", "Caixa 50–60 cm, aterragem silenciosa.")
      ]),
      b(3, "Força", 26, [
        i("agachamento-barra", "4 × 6 @ RPE 7 (≈70–72%)", "2–3 min", "Aproximação: 55% × 3, 65% × 2. Tempo 3-1-X nas 2 primeiras séries."),
        i("split-squat-bulgaro", "3 × 8/perna @ RIR 3", "—", "Superset 1 (com o pulldown). Força unilateral para a pedalada; começa pela perna mais fraca."),
        i("pulldown-bracos-estendidos", "3 × 12 @ RIR 2", "60 s", "Natação: dorsal na fase de puxada, omoplatas para baixo. Sem cabo: elástico preso em cima."),
        i("gemeos-pesado", "3 × 10 @ RIR 2", "—", "Superset 2 (com o rollout). Joelho esticado, 2 s em cima, 3 s a descer — capacidade do gémeo/Aquiles para a corrida."),
        i("rollout", "3 × 8", "45 s", "Core anti-extensão (posição aero). Sem roda: fitball.")
      ]),
      b(4, "Condicionamento", 16, [
        i("ski-erg", "1 min", "—", "REFERÊNCIA · 4 RONDAS (qualidade, não velocidade) · 90 s entre rondas. SkiErg a RPE 7 (motor de natação). Regista os metros: a 4.ª ronda não deve ficar mais de 5% abaixo da 1.ª. Sem SkiErg: remo 1 min."),
        i("supino-barra", "10 reps", "—", "≈55% do 1RM (RIR 3–4), com batentes. Omoplatas juntas, cotovelos a ~45°. Sem banco/rack: supino com halteres."),
        i("ghd-abdominais", "12 reps", "—", "Só até à horizontal. Sem GHD: 12 abdominais no AbMat."),
        i("elevacoes", "10 reps", "90 s (fim da ronda)", "Amplitude completa (natação: dorsal). Divide em séries se preciso. Sem 10 limpas: elevações assistidas.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo em 2 min", "—", WB_2MIN + " Referência para a semana 6."),
        ...ALONG_A
      ])
    ]);

  S(1, "B", "7",
    "Acumulação: técnica do peso morto (extensão da anca), afundo, remada, anti-rotação, adutores e rotadores externos do ombro, mais um EMOM de corpo inteiro.",
    "Cada repetição do peso morto parte do chão parado. Se a 4.ª série ficar a RPE ≤6, sobe 5–10 kg na semana 2. EMOM: cada minuto deve deixar 15–25 s de folga.",
    86,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 30 (15/pé)", "45 s", "Passada de corrida na corda: contacto curto debaixo da anca."),
        i("pogo-lateral", "2 × 10", "45 s"),
        i("salto-comprimento", "3 × 2", "60 s", "Aterra e fixa 2 s. Mede a melhor marca (teste inicial).")
      ]),
      b(3, "Força", 26, [
        i("peso-morto", "4 × 5 @ RPE 7 (≈70–72%)", "3 min", "Aproximação: 55% × 3, 65% × 2. Costas neutras, barra encostada às pernas."),
        i("afundo-atras", "3 × 8/perna @ RIR 3", "—", "Tri-set: afundo → remada → Pallof → 60 s."),
        i("remada-haltere", "3 × 10/braço @ RIR 2", "—", "Puxar horizontal; cotovelo para a anca."),
        i("pallof", "3 × 10/lado", "60 s", "Anti-rotação: tronco estável em cima da bicicleta e na corrida."),
        i("copenhagen", "2 × 20 s/lado", "—", "Superset (com a rotação externa). Adutores — prevenção de lesões na virilha. Regressão: joelho apoiado."),
        i("rotacao-externa-90", "2 × 12/braço", "45 s", "Coifa dos rotadores para a natação: lento, sem dor.")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "Min 1: 14/12 cal", "—", "EMOM 16 min (4 voltas de 4 minutos), RPE 7. Sem remo: air bike ou SkiErg."),
        i("kettlebell-clean-press", "Min 2: 5/braço", "—", "16–20 kg. Estabilidade acima da cabeça. Sem kettlebell: haltere."),
        i("farmer-carry", "Min 3: 40 m", "—", "2 × 28–32 kg, tronco alto. Sem kettlebells: halteres ou trap bar."),
        i("elevacao-joelhos-suspenso", "Min 4: 10 reps", "resto do minuto", "Sem balanço. Alternativa: crunch invertido.")
      ]),
      b(5, "Final", 5, [
        i("air-bike", "Máximo de calorias em 1 min", "—", "Arranque controlado nos primeiros 10 s. Regista as calorias (reteste na semana 5). Sem air bike: remo máximo de metros em 1 min."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 2 — ACUMULAÇÃO (mais carga) =======================
  S(2, "A", "7–8",
    "Acumulação: mais carga no agachamento, elevações para a força de puxada na natação, sóleo (joelho fletido) para a corrida e AMRAP controlados de corpo inteiro.",
    "Sobe a carga de acordo com o RPE da semana 1 (+2,5–5%). AMRAP: o mesmo número de voltas nos 3 blocos (não pode cair mais de meia volta). O final tem saltos: conta ~20–30 contactos extra.",
    93,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("saltos-duplos-corda", "3 × 15", "45 s"),
        i("pogo", "3 × 12", "45 s"),
        i("salto-caixa", "4 × 3", "60 s", "Caixa 60 cm. Reset completo entre saltos.")
      ]),
      b(3, "Força", 26, [
        i("agachamento-barra", "4 × 5 @ RPE 7–8 (≈75%)", "2–3 min", "Aproximação: 55% × 3, 65% × 2. Tempo 3-0-X."),
        i("split-squat-bulgaro", "3 × 8/perna @ RIR 2", "—", "Superset 1 (com as elevações); +2 kg por haltere."),
        i("elevacoes", "3 × 6–8 @ RIR 2", "60 s", "Estritas. Se 8 forem fáceis, +5 kg de lastro."),
        i("gemeos-sentado", "3 × 12 @ RIR 2", "—", "Superset 2 (com o dead bug). Sóleo — o músculo mais carregado na corrida. Sem máquina: haltere em cima dos joelhos."),
        i("dead-bug", "3 × 8/lado", "45 s", "Anti-extensão: lombar colada, expira a fundo.")
      ]),
      b(4, "Condicionamento", 15, [
        i("air-bike", "12/10 cal", "—", "3 BLOCOS DE AMRAP 4 min (RPE 7) · 90 s entre blocos. Regista as voltas. Sem air bike: remo 15/12 cal."),
        i("flexoes", "10 reps", "—", "Empurrar horizontal com serrátil: no topo, afasta as omoplatas."),
        i("remada-invertida", "10 reps", "—", "Argolas, barra baixa ou TRX."),
        i("toes-to-bar", "8 reps", "90 s (fim do bloco)", "Alternativa: elevação de joelhos suspenso.")
      ]),
      b(5, "Final", 5, [
        i("burpee-salto-comprimento", "Máximo em 2 min", "—", "Cada salto aterra fixo e com os joelhos alinhados; aterragem descontrolada → termina. Regista o número."),
        ...ALONG_A
      ])
    ]);

  S(2, "B", "7–8",
    "Acumulação: mais carga no peso morto, step-up com subida do joelho (ciclismo e corrida), remada, nórdicos (isquiotibiais) e face pull para o ombro do nadador, mais um E2MOM.",
    "Peso morto +5–10 kg em relação à semana 1 se ficou a RPE ≤7. Nada de falha. E2MOM: cada janela de 2 min deve deixar 20–40 s de folga.",
    99,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 8, [
        i("corda-alternada", "2 × 30 (15/pé)", "45 s"),
        i("saltos-unipodais", "3 × 5/perna", "45 s", "Saltos no sítio numa perna, joelho alinhado com o pé."),
        i("salto-comprimento", "3 × 3", "60 s")
      ]),
      b(3, "Força", 26, [
        i("peso-morto", "4 × 5 @ RPE 7–8 (≈75%)", "3 min", "Aproximação: 55% × 3, 65% × 2."),
        i("step-up-joelho", "3 × 8/perna @ RIR 2", "—", "Tri-set: step-up → remada → Pallof → 60 s. Halteres, caixa à altura do joelho; extensão completa da anca em cima."),
        i("remada-haltere", "3 × 8/braço @ RIR 2", "—", "Mais pesada que na semana 1."),
        i("pallof-isometrico", "3 × 20 s/lado", "60 s", "Anti-rotação."),
        i("nordic", "2 × 5", "—", "Superset (com o face pull). Isquiotibiais excêntricos — a melhor prevenção de roturas. Descida o mais lenta possível."),
        i("face-pull", "2 × 15", "45 s", "Rotação externa + retração: saúde do ombro na natação.")
      ]),
      b(4, "Condicionamento", 16, [
        i("remo-ergometro", "Janela ímpar: 250 m", "—", "E2MOM 16 min (4 pares de janelas de 2 min), RPE 7. Janela ímpar = 250 m de remo + 8 thrusters; janela par = 200 m de SkiErg + 40 m de sandbag."),
        i("thruster-halteres", "Janela ímpar: 8 reps", "resto da janela", "2 × 15 kg. Alternativa: wall ball 10 reps."),
        i("ski-erg", "Janela par: 200 m", "—", "RPE 7. Sem SkiErg: 12/9 cal de air bike."),
        i("sandbag-carry", "Janela par: 40 m", "resto da janela", "Ao ombro (troca a meio). Sem sandbag: kettlebell em goblet.")
      ]),
      b(5, "Final", 5, [
        i("kettlebell-swing", "Máximo sem pousar (24 kg)", "—", "Termina quando a anca deixar de estender por completo ou a lombar perder a posição neutra. Regista o número."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 3 — INTENSIFICAÇÃO (≥85%, contraste) =======================
  S(3, "A", "8",
    "Intensificação: agachamento a ≈85% com saltos à caixa (contraste — a força pesada é a que mais melhora a economia), elevações com lastro, gémeos pesados e uma escada de corpo inteiro.",
    "Contraste: 20–30 s depois de cada série de agachamento, 3 saltos máximos à caixa; depois 2–3 min. Carga pelo RPE: série a RPE ≤7 → +5 kg; RPE 9 → −5%.",
    57,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 7, [
        i("saltos-duplos-corda", "2 × 15", "45 s"),
        i("drop-jump", "4 × 3", "60 s", "Caixa 30 cm. Contacto mínimo, salto máximo — rigidez reativa para a corrida.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "5 × 3 @ RPE 8 (≈85%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2. Nunca falhar: 2 repetições na reserva."),
        i("salto-caixa", "5 × 3", "2–3 min", "Contraste: logo a seguir a cada série de agachamento."),
        i("split-squat-bulgaro", "3 × 6/perna @ RIR 2", "—", "Superset 1 (com as elevações)."),
        i("elevacoes", "3 × 5 lastradas (+5–7,5 kg) @ RIR 2", "60 s", "Força de puxada para a natação. Sem cinto: haltere entre os pés."),
        i("gemeos-pesado", "3 × 6 @ RIR 2", "—", "Superset 2. Pesado (smith ou máquina): a força máxima do tríceps sural protege o Aquiles."),
        i("stir-the-pot", "2 × 8/sentido", "45 s", "Anti-extensão na fitball.")
      ]),
      b(4, "Condicionamento", 14, [
        i("devil-press", "2-4-6-8", "—", "ESCADA ASCENDENTE (qualidade) · limite 14 min. Em cada degrau: devil press, step-ups e GHD com o número do degrau; depois 150 m de SkiErg. 2 × 12,5–15 kg. Alternativa: burpee + haltere snatch."),
        i("step-up", "2-4-6-8/perna", "—", "Caixa à altura do joelho, halteres leves."),
        i("ghd-abdominais", "2-4-6-8", "—", "Sem GHD: abdominais no AbMat."),
        i("ski-erg", "150 m após cada degrau", "—", "RPE 6–7. Sem SkiErg: 200 m de remo.")
      ]),
      b(5, "Final", 5, [
        i("elevacoes", "Máximo de estritas (1 série)", "—", "Sem kipping, braços esticados em baixo e queixo acima da barra. Termina na primeira repetição incompleta."),
        ...ALONG_A
      ])
    ]);

  S(3, "B", "8",
    "Intensificação: peso morto a ≈85% com salto em comprimento (contraste), afundo pesado, remada no cabo, adutores, YTW para as omoplatas e um chipper com trenó.",
    "Contraste: 20–30 s depois de cada série de peso morto, 2 saltos em comprimento máximos; depois 3 min. Chipper: uma passagem a RPE 7–8, cada estação com técnica perfeita.",
    62,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 7, [
        i("corda-alternada", "2 × 20 (10/pé)", "45 s"),
        i("saltos-barreiras", "3 × 4", "60 s", "Barreiras de 30–45 cm, contactos curtos.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "5 × 3 @ RPE 8 (≈85%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2."),
        i("salto-comprimento", "5 × 2", "2–3 min", "Contraste: logo a seguir a cada série de peso morto."),
        i("afundo-atras", "3 × 6/perna @ RIR 2", "—", "Tri-set: afundo → remada → rotação landmine → 60 s. Halteres pesados."),
        i("remada-cabo", "3 × 10 @ RIR 2", "—", "Sem cabo: remada com haltere."),
        i("landmine-rotacao", "2 × 6/lado", "60 s", "Anti-rotação/transferência anca-tronco."),
        i("copenhagen-dinamico", "2 × 6/lado", "—", "Superset (com o YTW). Adutores."),
        i("ytw", "2 × 6 de cada letra", "45 s", "Trapézio inferior e omoplatas — postura de nado.")
      ]),
      b(4, "Condicionamento", 14, [
        i("remo-ergometro", "400 m", "—", "CHIPPER (uma passagem, qualidade) · limite 14 min: 400 m de remo → 3 × 15 m de trenó → 16 arrancos com kettlebell → 40 m de sandbag → 2 turkish get-ups/lado."),
        i("treno-empurrar", "3 × 15 m", "—", "Extensão da anca e do joelho, como na pedalada em pé. Sem trenó: empurrar prato pesado ou 30 s de air bike pesada."),
        i("kettlebell-snatch", "16 (8/braço)", "—", "20–24 kg. Alternativa: haltere snatch."),
        i("sandbag-carry", "40 m", "—", "Em abraço. Sem sandbag: farmer carry pesado."),
        i("turkish-get-up", "2/lado", "—", "12–16 kg, devagar: estabilidade do ombro acima da cabeça.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo sem pousar a bola (1 série)", "—", WB_SEGUIDO),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 4 — INTENSIFICAÇÃO (mais pesado) =======================
  S(4, "A", "8–8,5",
    "Intensificação: agachamento a 85–87% com saltos à caixa, pulldown para a natação, isometria pesada dos gémeos e um EMOM com air bike, arranco, corda e battle rope.",
    "Semana mais pesada do bloco. Se dormiste mal ou a variabilidade cardíaca está baixa, faz 3 séries em vez de 4. Duas séries seguidas a RPE 9 → termina o exercício.",
    54,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 7, [
        i("saltos-duplos-corda", "2 × 15", "45 s"),
        i("drop-jump", "4 × 3", "60 s", "Caixa 40 cm se a semana 3 teve contactos curtos; senão 30 cm.")
      ]),
      b(3, "Força", 27, [
        i("agachamento-barra", "4 × 3 @ RPE 8–8,5 (≈85–87%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 82% × 1."),
        i("salto-caixa", "4 × 3", "2–3 min", "Contraste. Mais alto, não mais rápido."),
        i("split-squat-bulgaro", "3 × 5/perna @ RIR 2", "—", "Superset 1 (com o pulldown). Pesado."),
        i("pulldown-bracos-estendidos", "3 × 10 @ RIR 2", "60 s", "Mais carga que na semana 1."),
        i("isometria-gemeos", "3 × 30 s", "—", "Superset 2. Isometria pesada (smith/máquina) com o joelho esticado — tendão de Aquiles."),
        i("rollout", "3 × 10", "45 s", "Anti-extensão, mais amplitude.")
      ]),
      b(4, "Condicionamento", 16, [
        i("air-bike", "Min 1: 12/9 cal", "—", "EMOM 16 min (4 voltas de 4 minutos), RPE 7–8. Sem air bike: remo 14/11 cal."),
        i("haltere-snatch", "Min 2: 8 alternados", "—", "22,5 kg. Alternativa: kettlebell snatch."),
        i("subida-corda", "Min 3: 1 subida", "—", "Puxar vertical. Sem corda: 5 elevações com toalha."),
        i("battle-rope", "Min 4: 30 s", "resto do minuto", "Resistência dos ombros (natação). Sem corda: 8 slams.")
      ]),
      b(5, "Final", 5, [
        i("hollow", "Máximo em isometria (1 série)", "—", "Lombar colada ao chão, braços acima da cabeça (posição de deslize). Termina quando a lombar descolar. Regista o tempo."),
        ...ALONG_A
      ])
    ]);

  S(4, "B", "8–8,5",
    "Intensificação: peso morto a 85–87% com salto com trap bar (força-velocidade), elevações com lastro, nórdicos, rotadores externos e um bloco de densidade com trenó.",
    "Salto com trap bar com 20–30% do 1RM do peso morto: altura máxima, não carga. Densidade: o mesmo número de voltas nos 2 blocos.",
    64,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 7, [
        i("corda-alternada", "2 × 20 (10/pé)", "45 s"),
        i("multisaltos", "3 × 4", "60 s", "Bounds longos e ritmados.")
      ]),
      b(3, "Força", 28, [
        i("peso-morto", "4 × 3 @ RPE 8–8,5 (≈85–87%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 82% × 1."),
        i("salto-trap-bar", "4 × 3 @ 20–30% 1RM", "2–3 min", "Contraste. Sem trap bar: salto com 2 halteres leves."),
        i("afundo-atras", "3 × 5/perna @ RIR 2", "—", "Tri-set: afundo → elevações → Pallof → 60 s."),
        i("elevacoes", "3 × 4 lastradas (+7,5–10 kg) @ RIR 2", "—", "Sem cinto: haltere entre os pés."),
        i("pallof", "3 × 10/lado", "60 s", "Elástico mais forte que na semana 1."),
        i("nordic", "2 × 4", "—", "Superset (com a rotação externa)."),
        i("rotacao-externa-90", "2 × 10/braço", "45 s", "Mais carga que na semana 1, sem compensar com o tronco.")
      ]),
      b(4, "Condicionamento", 14, [
        i("treno-puxar", "20 m", "—", "DENSIDADE: 2 blocos de 6 min · 90 s entre blocos · máximo de voltas com técnica perfeita (RPE 7). Mão sobre mão ou de costas. Sem trenó: 10 remadas com elástico forte."),
        i("sandbag-clean", "5 reps", "—", "Alterna o ombro. Sem sandbag: 8 kettlebell swings pesados."),
        i("flexoes", "10 reps", "—", "Pés elevados se forem fáceis."),
        i("gatinhar-urso", "15 m", "—", "Anca baixa e quieta."),
        i("remada-invertida", "8 reps", "—", "Alternativa: remada no TRX.")
      ]),
      b(5, "Final", 5, [
        i("farmer-carry", "Distância máxima em 2 min", "—", "2 × 32 kg. Pousar é permitido, o tempo não para. Regista os metros."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 5 — PICO DE POTÊNCIA =======================
  S(5, "A", "8–9",
    "Pico de potência: pesado-leve no agachamento (duplas a 88–90% + saltos + séries rápidas a 60%), elevações explosivas, gémeos e intervalos curtos de potência aeróbia em SkiErg e air bike.",
    "Intensidade mais alta com o volume mais baixo. Séries leves à máxima velocidade intencional. Se a 1.ª dupla for RPE 9,5, baixa 5%. Intervalos: os watts do último devem ficar a ≤5% do primeiro.",
    39,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 7, [
        i("saltos-duplos-corda", "2 × 12", "45 s"),
        i("drop-jump", "3 × 3", "90 s", "Caixa 40–50 cm; contacto mínimo.")
      ]),
      b(3, "Força", 28, [
        i("agachamento-barra", "3 × 2 @ RPE 8,5–9 (≈88–90%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 85% × 1."),
        i("salto-caixa", "3 × 2", "2–3 min", "Contraste: 2 saltos máximos depois de cada dupla."),
        i("agachamento-barra", "2 × 3 @ 60% (máxima velocidade)", "2 min", "Parte leve do pesado-leve."),
        i("split-squat-bulgaro", "2 × 5/perna @ RIR 2", "—", "Superset (com as elevações)."),
        i("elevacoes", "3 × 3 explosivas", "60 s", "Peito à barra, máxima velocidade na subida."),
        i("gemeos-pesado", "2 × 6 @ RIR 2", "—", "Superset (com o dead bug)."),
        i("dead-bug", "2 × 8/lado", "30 s", "Com haltere leve nas mãos.")
      ]),
      b(4, "Condicionamento", 12, [
        i("ski-erg", "Intervalos ímpares: 30 s forte", "90 s", "INTERVALOS DE POTÊNCIA AERÓBIA: 6 × (30 s forte : 90 s), RPE 8–9. Ímpares no SkiErg (puxada de natação), pares na air bike. Nos primeiros 20 s de cada recuperação: 5 slams (ímpares) ou 5 toes to bar (pares)."),
        i("air-bike", "Intervalos pares: 30 s forte", "90 s", "Sem air bike: remo."),
        i("slam-medicinal", "5 reps (após os ímpares)", "—", "Bola de 8–10 kg."),
        i("toes-to-bar", "5 reps (após os pares)", "—", "Alternativa: elevação de joelhos suspenso.")
      ]),
      b(5, "Final", 5, [
        i("wall-ball", "Máximo em 2 min", "—", WB_2MIN),
        ...ALONG_A
      ])
    ]);

  S(5, "B", "8–9",
    "Pico de potência: peso morto a 88–90% com salto com trap bar leve, press de ombro, adutores, face pull e rondas de qualidade com remo, trenó, burpees e suitcase carry.",
    "Volume baixo: 3 duplas pesadas e saltos máximos. Se a 1.ª dupla subir devagar (RPE 9,5), baixa 5%. Rondas: remo forte mas controlado, a mesma divisão nas 3 rondas.",
    51,
    [
      b(1, "Aquecimento", 5, AQUEC_B("barra × 5 · 40% × 5")),
      b(2, "Pliometria", 7, [
        i("corda-alternada", "2 × 15 (≈8/pé)", "45 s"),
        i("salto-comprimento-unipodal", "3 × 2/perna", "60 s", "Aterra nas duas pernas e fixa.")
      ]),
      b(3, "Força", 27, [
        i("peso-morto", "3 × 2 @ RPE 8,5–9 (≈88–90%)", "20–30 s → saltos", "Aproximação: 50% × 5, 65% × 3, 75% × 2, 85% × 1."),
        i("salto-trap-bar", "3 × 3 @ 20% 1RM", "2–3 min", "Contraste: altura máxima."),
        i("afundo-atras", "2 × 5/perna @ RIR 2", "—", "Tri-set: afundo → press → rotação landmine → 60 s."),
        i("press-ombro", "3 × 5 @ RIR 2", "—", "De pé ou meio ajoelhado, costelas para baixo: estabilidade acima da cabeça."),
        i("landmine-rotacao", "2 × 5/lado", "60 s"),
        i("copenhagen", "2 × 20 s/lado", "—", "Superset (com o face pull)."),
        i("face-pull", "2 × 12", "45 s")
      ]),
      b(4, "Condicionamento", 14, [
        i("remo-ergometro", "300 m", "—", "3 RONDAS (qualidade) · 2 min entre rondas, RPE 8. Sem remo: 300 m de SkiErg."),
        i("treno-empurrar", "2 × 15 m pesado", "—", "Sem trenó: empurrar prato pesado ou 20 s de air bike a fundo."),
        i("burpee", "6 reps", "—", "Peito ao chão e salto completo."),
        i("suitcase-carry", "30 m/lado", "2 min (fim da ronda)", "Kettlebell pesado de um só lado, tronco sem inclinar.")
      ]),
      b(5, "Final", 5, [
        i("air-bike", "Máximo de calorias em 1 min (reteste)", "—", "Compara com a semana 1. Sem air bike: remo máximo de metros em 1 min."),
        ...ALONG_B
      ])
    ]);

  // ======================= SEMANA 6 — DESCARGA + TESTES =======================
  S(6, "A", "6 (teste: 9)",
    "Descarga e teste: reteste do salto vertical, série máxima de 3 no agachamento para estimar o 1RM e repetição da peça de referência da semana 1.",
    "Volume total ~50%, mas o teste é a sério. Agachamento: aproximação 50% × 5, 65% × 3, 75% × 2, 85% × 1 e uma série de 3 a RPE 9 (sem falha). 1RM estimado ≈ carga × 1,10. Condicionamento: as mesmas 4 rondas e cargas da semana 1 — compara metros, divisões das elevações e RPE.",
    43,
    [
      b(1, "Aquecimento", 5, AQUEC_A("barra × 8 · 40% × 5")),
      b(2, "Pliometria", 6, [
        i("saltos-duplos-corda", "2 × 10", "45 s"),
        i("pogo", "2 × 10", "45 s"),
        i("salto-contramovimento", "3 × 1 (reteste)", "60 s", "Mesmo método de medição da semana 1.")
      ]),
      b(3, "Força", 20, [
        i("agachamento-barra", "Teste: 1 série máxima de 3 @ RPE 9 (≈90–92%)", "3–4 min", "Sempre com batentes ou ajudante. Regista carga, RPE e e1RM."),
        i("split-squat-bulgaro", "2 × 6/perna @ RIR 4", "—", "Superset (com o pulldown); leve."),
        i("pulldown-bracos-estendidos", "2 × 12 @ RIR 3", "45 s"),
        i("gemeos-sentado", "2 × 12 @ RIR 3", "—", "Superset (com o rollout)."),
        i("rollout", "2 × 8", "30 s")
      ]),
      b(4, "Condicionamento", 16, [
        i("ski-erg", "1 min", "—", "REFERÊNCIA (reteste) · 4 RONDAS iguais à semana 1 · 90 s entre rondas. Compara os metros por ronda com a mesma RPE 7."),
        i("supino-barra", "10 reps", "—", "Mesma carga da semana 1."),
        i("ghd-abdominais", "12 reps", "—", "Sem GHD: abdominais no AbMat."),
        i("elevacoes", "10 reps", "90 s (fim da ronda)", "Regista quantas divisões precisaste.")
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
      b(2, "Pliometria", 6, [
        i("corda-alternada", "2 × 15 (≈8/pé)", "45 s"),
        i("pogo-lateral", "2 × 10", "45 s"),
        i("salto-comprimento", "3 × 1 (reteste)", "60 s", "Mesmo piso e calçado da semana 1.")
      ]),
      b(3, "Força", 20, [
        i("peso-morto", "Teste: 1 série máxima de 3 @ RPE 9 (≈90–92%)", "3–4 min", "Regista carga, RPE e e1RM."),
        i("afundo-atras", "2 × 6/perna @ RIR 4", "—", "Tri-set leve: afundo → remada → Pallof."),
        i("remada-haltere", "2 × 8/braço @ RIR 3", "—"),
        i("pallof", "2 × 10/lado", "45 s"),
        i("rotacao-externa-elastico", "2 × 15", "30 s", "Coifa dos rotadores, leve.")
      ]),
      b(4, "Condicionamento", 10, [
        i("remo-ergometro", "200 m", "—", "AMRAP 10 min a RPE 6 (descarga, conversa possível). Sem remo: 200 m de SkiErg."),
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
    objetivo: "Off-season de triatleta: aumentar a força máxima (agachamento e peso morto ≥85% na intensificação — o estímulo com mais efeito na economia de corrida e de ciclismo) e a potência/rigidez reativa (pliometria), blindar o ombro do nadador, os gémeos/sóleo/Aquiles, os isquiotibiais e os adutores, e manter um condicionamento híbrido de corpo inteiro sem corrida. 2 sessões por semana, ≤60 min.",
    sessoes: sessoes.map((s) => s.id),
    semanas: [
      { n: 1, foco: "Acumulação e técnica", notas: "Agachamento 4 × 6 / peso morto 4 × 5 a RPE 7 (≈70–72%). Testes iniciais de salto. Condicionamento: rondas de referência (A) e EMOM 16 (B)." },
      { n: 2, foco: "Acumulação (mais carga)", notas: "4 × 5 a RPE 7–8 (≈75%). Condicionamento: 3 AMRAP de 4 min controlados (A) e E2MOM 16 (B)." },
      { n: 3, foco: "Intensificação · contraste", notas: "5 × 3 a ≈85% com saltos em contraste. Condicionamento: escada 2–8 (A) e chipper com trenó (B)." },
      { n: 4, foco: "Intensificação (mais pesado)", notas: "4 × 3 a 85–87% + saltos/trap bar jump. Condicionamento: EMOM 16 com corda e battle rope (A) e densidade 2 × 6 min (B)." },
      { n: 5, foco: "Pico de potência", notas: "Pesado-leve: 3 × 2 a 88–90% + contraste + séries rápidas a 60%. Condicionamento: intervalos 6 × 30 s : 90 s (A) e 3 rondas com remo e trenó (B)." },
      { n: 6, foco: "Descarga + testes", notas: "Volume ~50%. Série máxima de 3 (RPE 9) no agachamento e no peso morto → 1RM estimado; reteste dos saltos, da peça de referência, dos wall balls, da air bike (S5) e dos swings." }
    ],
    cobertura: "Em cada semana, Dia A + Dia B cobrem: natação — dorsal (elevações, pulldown de braços estendidos, SkiErg), omoplata e rotadores externos (face pull, YTW, rotação externa), estabilidade acima da cabeça (press, clean & press, turkish get-up); ciclismo — extensão do joelho e da anca (agachamento, peso morto, trenó), força unilateral (búlgaro, afundo, step-up), rigidez do tronco (anti-extensão no Dia A, anti-rotação no Dia B); corrida — gémeos com joelho esticado e sóleo, rigidez reativa (pogo, drop jumps, corda), isquiotibiais (nórdicos) e adutores (Copenhagen). Também empurrar horizontal e vertical, puxar horizontal e vertical, transporte, flexão do tronco e um motor monoestrutural (SkiErg, remo, air bike) — sem corrida no condicionamento.",
    regras: [
      "O RPE manda, não a percentagem: as % são do 1RM estimado (se não o tiveres, usa a carga de 5RM × 1,15). Série a RPE 1 abaixo do alvo → +2,5–5% (inferiores +5 kg, superiores +2,5 kg). No alvo (±0,5) → mantém. 1 acima → −5%. 2 acima ou técnica a falhar → termina o exercício.",
      "Nas semanas 3–5 a carga principal tem de chegar a ≥85%: é a força pesada (não o volume) que melhora a economia sem ganho de massa relevante. Nunca até à falha: RIR 2 nos levantamentos principais; só os testes da semana 6 chegam a RPE 9.",
      "Dia mau (sono curto, variabilidade cardíaca baixa, pernas pesadas do treino de resistência): uma série a menos e limite inferior da RPE; no condicionamento, corta uma volta/ronda.",
      "Pliometria antes da força, fresco e com recuperação completa. Se o contacto ficar longo, a aterragem ruidosa ou a altura cair >10%, termina. Dor no Aquiles >3/10 ou que piora no dia seguinte → corta os saltos dessa semana e mantém os gémeos pesados.",
      "Contraste (semanas 3–5): 20–30 s entre a série pesada e os saltos; 2–3 min antes da série seguinte.",
      "Ombro do nadador: rotação externa, face pull e YTW sempre sem dor e lentos; supino e press com omoplatas estáveis. Dor anterior no ombro → troca o supino por flexões e o press por landmine press.",
      "Condicionamento = qualidade, não velocidade, qualquer que seja o formato: EMOM/E2MOM com 15–40 s de folga; AMRAP e densidade com o mesmo número de voltas em todos os blocos; rondas e intervalos com produção a ≤5% da 1.ª.",
      "Finais máximos com padrão fixo: só contam repetições válidas; termina ao 2.º no-rep ou quando a técnica se degradar. Regista sempre o resultado.",
      "Segurança: supino e agachamento com batentes ou ajudante; peso morto com reset em cada repetição; GHD só até à horizontal nas primeiras sessões; dor aguda ou articular → parar.",
      "Alternativas: sem GHD → AbMat; sem SkiErg → remo; sem air bike → remo ou bicicleta; sem trenó → empurrar prato ou air bike; sem sandbag → kettlebell em goblet/farmer; sem corda de subir → elevações com toalha; sem battle rope → slams; sem trap bar → salto com halteres leves; sem cabo → elástico.",
      "Falhaste uma semana inteira? Repete-a. Falhaste uma sessão? Faz a seguinte normalmente."
    ],
    interferencia: "A resistência de off-season fica em volume moderado e sobretudo em Z1–Z2, com no máximo 1 sessão intensa de bicicleta e 1 de corrida por semana. Separa o Dia A e o Dia B por 48–72 h (ex.: terça e sexta). No mesmo dia: resistência intensa de manhã e força ≥6 h depois (nunca força antes de intervalos). Coloca a força nos dias de treino intenso (dia duro mais duro, dia fácil mais fácil) ou em dias de natação/bicicleta fácil. Nunca força na véspera do treino longo de bicicleta (Dia A) nem nas 48 h antes da série chave ou do longo de corrida (Dia B). Natação fácil no dia a seguir à força ajuda a recuperar. Conta a pliometria e a corrida em conjunto: semana com mais volume de corrida → corta 25–30% dos contactos. Na semana 6 baixa também o volume de resistência. Proteína 1,6–2,0 g/kg/dia (≈0,4 g/kg depois da força) e hidratos de carbono à volta das sessões."
  };
})();

// Formato do condicionamento, mostrado em destaque no topo do bloco (rondas, tempo, descanso).
(function () {
  const FORMATO = {
    "off-s1-dia1": "Referência · 4 rondas · 90 s de descanso entre rondas · qualidade, não velocidade",
    "off-s1-dia2": "EMOM 16 min · 4 voltas de 4 min (uma estação por minuto)",
    "off-s2-dia1": "3 blocos de AMRAP 4 min · 90 s entre blocos · ritmo controlado",
    "off-s2-dia2": "E2MOM 16 min · 4 pares de janelas de 2 min (alterna janela ímpar e par)",
    "off-s3-dia1": "Escada 2-4-6-8 repetições + 150 m de SkiErg · limite 14 min · qualidade",
    "off-s3-dia2": "Chipper · 1 passagem pela ordem · limite 14 min",
    "off-s4-dia1": "EMOM 16 min · 4 voltas de 4 min (uma estação por minuto)",
    "off-s4-dia2": "2 blocos de 6 min · 90 s entre blocos · máximo de voltas com técnica perfeita",
    "off-s5-dia1": "6 intervalos · 30 s forte : 90 s de recuperação (SkiErg / air bike)",
    "off-s5-dia2": "3 rondas · 2 min de descanso entre rondas",
    "off-s6-dia1": "Referência (reteste da semana 1) · 4 rondas · 90 s de descanso entre rondas",
    "off-s6-dia2": "AMRAP 10 min · leve (RPE 6)"
  };
  SESSOES.forEach((s) => {
    if (!FORMATO[s.id]) return;
    const b = s.blocos.find((x) => /Condicionamento/.test(x.titulo));
    if (b) b.formato = FORMATO[s.id];
  });
})();
