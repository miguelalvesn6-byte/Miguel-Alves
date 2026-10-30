// Técnica de corrida e pliometria — exercícios e sessões-modelo.
// Mesmo formato compacto de exercicios-extra.js:
//   id, nome, nome em inglês, categoria, material, disciplinas (N/C/R), músculos,
//   passos de execução, erros comuns, versão mais fácil, versão mais difícil, dose habitual

(function () {
  const D = { N: "natacao", C: "ciclismo", R: "corrida" };
  const ex = (id, nome, nomeEn, categoria, material, disc, musculos, execucao, erros, regressao, progressao, dose) =>
    EXERCICIOS.push({
      id, nome, nomeEn, categoria, material, musculos, execucao, erros, regressao, progressao, dose,
      disciplinas: disc.split("").map((c) => D[c]),
      video: ""
    });

  // Os exercícios de técnica que já existiam passam para a categoria nova.
  ["skipping-a", "skipping-b", "calcanhares-gluteos", "carioca", "marcha-joelhos"].forEach((id) => {
    const e = EXERCICIOS.find((x) => x.id === id);
    if (e) e.categoria = "tecnica";
  });

  // ================= TÉCNICA DE CORRIDA =================
  ex("tornozelos", "Tornozelos (ankling)", "ankling running drill", "tecnica", ["peso-corporal"], "R", "Pés, tornozelos, contacto com o solo",
    ["Passos muito curtos e rápidos, quase sem dobrar os joelhos.", "O pé aterra debaixo da anca, na parte da frente, e \"puxa\" o chão para trás.", "Tronco alto, braços curtos e rápidos."],
    ["Aterrar com o calcanhar", "Passos longos", "Inclinar para trás"], "Marcha nas pontas dos pés.", "Mais rápido, mantendo o contacto curto.", "3 × 15 m");
  ex("skipping-alto", "Skipping alto rápido", "high knees running drill", "tecnica", ["peso-corporal"], "R", "Flexores da anca, frequência de passada",
    ["Corrida no sítio ou a avançar devagar, joelhos à altura da anca.", "Contactos curtos na parte da frente do pé, debaixo do corpo.", "Braços a 90°, ritmo alto."],
    ["Inclinar o tronco para trás", "Joelhos baixos", "Aterrar à frente do corpo"], "Marcha com joelhos altos.", "Mais rápido ou 10 s máximos.", "3 × 15 m");
  ex("skipping-a-unilateral", "Skipping A unilateral", "single leg a skip", "tecnica", ["peso-corporal"], "R", "Coordenação, flexores da anca",
    ["Só uma perna faz o skipping A; a outra faz passos curtos normais.", "Ritmo: \"A — passo — passo — A\".", "Troca de perna na volta."],
    ["Perder o ritmo", "Tronco a balançar"], "Marcha A unilateral.", "Mais rápido.", "2 × 20 m por perna");
  ex("perna-esticada", "Corrida de pernas esticadas", "straight leg run drill", "tecnica", ["peso-corporal"], "R", "Isquiotibiais, glúteos, contacto ativo",
    ["Corre com as pernas quase esticadas, como uma tesoura.", "Puxa o pé para baixo e para trás, aterrando debaixo da anca.", "Tronco alto, ligeiramente à frente."],
    ["Inclinar para trás", "Bater com o calcanhar"], "Marcha de pernas esticadas.", "Mais rápido.", "3 × 20 m");
  ex("skipping-altura", "Skipping em altura (power skip)", "power skip", "tecnica", ["peso-corporal"], "R", "Glúteos, gémeos, coordenação braços-pernas",
    ["Skipping saltitado procurando a máxima altura em cada impulso.", "Joelho da perna livre sobe forte, braço oposto acompanha.", "Aterra suave e repete com a outra perna."],
    ["Procurar distância em vez de altura", "Braços sem coordenação"], "Skipping simples.", "Mais altura.", "3 × 20 m");
  ex("wall-drill-a", "Marcha A na parede", "wall drill a march", "tecnica", ["peso-corporal"], "R", "Postura, posição do joelho",
    ["Mãos na parede, corpo inclinado a ~45° em linha reta.", "Sobe um joelho à altura da anca com o pé fletido e mantém 2 s.", "Troca devagar, sem perder a linha do corpo."],
    ["Anca a dobrar", "Pé em ponta (sem fletir)"], "Menor inclinação.", "Trocas rápidas (wall switches).", "2 × 6 por perna");
  ex("wall-drill-trocas", "Trocas rápidas na parede", "wall drill switches", "tecnica", ["peso-corporal"], "R", "Potência e frequência de passada",
    ["Na posição da marcha A na parede.", "Troca de perna o mais rápido possível: 1, 2 ou 3 trocas seguidas.", "Pausa e repete."],
    ["Corpo a dobrar", "Pé de apoio a afundar"], "Uma troca de cada vez.", "Três trocas seguidas.", "4 × 3 trocas");
  ex("queda-frente", "Queda para a frente", "falling start lean drill", "tecnica", ["peso-corporal"], "R", "Inclinação corporal, arranque",
    ["De pé, direito, deixa o corpo cair para a frente a partir dos tornozelos.", "Quando sentires que vais cair, arranca em corrida rápida.", "Mantém o corpo em linha (não dobres a anca)."],
    ["Dobrar a anca em vez de inclinar o corpo todo", "Primeiro passo longo demais"], "Inclinação pequena.", "Arranques de 20 m.", "5 × 15 m");
  ex("bracos-sentado", "Braços sentado", "seated arm swing running", "tecnica", ["peso-corporal"], "R", "Ação dos braços",
    ["Sentado no chão, pernas esticadas, tronco direito.", "Balança os braços como a correr: mão à altura do queixo à frente, até à anca atrás.", "Cotovelos a 90°, ombros relaxados."],
    ["Cruzar os braços à frente do corpo", "Encolher os ombros"], "Mais lento.", "Rápido durante 10 s.", "3 × 20 s");
  ex("pes-rapidos", "Pés rápidos", "fast feet drill", "tecnica", ["peso-corporal"], "R", "Frequência, reatividade",
    ["Passos minúsculos e o mais rápidos possível, quase no sítio.", "Na parte da frente do pé, joelhos ligeiramente fletidos.", "No fim, sai em corrida 10 m."],
    ["Passos longos", "Calcanhares a tocar"], "Mais lento.", "Saída em sprint a um sinal.", "4 × 8 s");
  ex("progressivos", "Progressivos (acelerações)", "running strides", "tecnica", ["peso-corporal"], "R", "Técnica a velocidade alta, economia",
    ["Corrida de 80–100 m a acelerar aos poucos até ~90% da velocidade máxima.", "Mantém a técnica solta: tronco alto, braços relaxados, passada rápida.", "Volta a andar ou a trote."],
    ["Ficar tenso", "Ir ao máximo logo no início"], "60 m a 80%.", "Descalço em relva ou 120 m.", "3–6 × 60–100 m");
  ex("subidas-curtas", "Subidas curtas rápidas", "short hill sprints", "tecnica", ["peso-corporal"], "R", "Potência, força específica, postura",
    ["Subida com 6–10% de inclinação.", "8–10 s quase no máximo, joelhos altos e braços fortes.", "Desce a andar; recuperação completa."],
    ["Encurvar o tronco", "Passos curtos sem impulso"], "Subida mais suave ou 6 s.", "Mais repetições.", "6–8 × 10 s");
  ex("corrida-costas", "Corrida de costas", "backward running drill", "tecnica", ["peso-corporal"], "R", "Quadríceps, coordenação, joelhos",
    ["Corre para trás com passos curtos na parte da frente do pé.", "Tronco ligeiramente à frente, olha por cima do ombro."],
    ["Aterrar com o calcanhar", "Inclinar para trás"], "Andar para trás.", "Mais rápido ou a subir.", "2 × 20 m");
  ex("deslocamento-lateral", "Deslocamento lateral", "side shuffle drill", "tecnica", ["peso-corporal"], "R", "Glúteo médio, estabilidade lateral",
    ["Meio agachado, desloca-te de lado sem cruzar os pés.", "Pés nunca se juntam."],
    ["Pés a juntar", "Tronco a balançar"], "Mais lento.", "Mini-band nos tornozelos.", "2 × 20 m por lado");
  ex("cadencia-metronomo", "Corrida com metrónomo (cadência)", "running cadence metronome", "tecnica", ["peso-corporal"], "R", "Frequência de passada",
    ["Mede a tua cadência normal em corrida fácil (passos por minuto).", "Põe um metrónomo 5% acima e corre a acertar os passos com o som.", "Mantém a mesma velocidade, só com passos mais curtos e rápidos."],
    ["Acelerar em vez de encurtar a passada", "Aumentar mais de 5–10% de uma vez"], "+3%.", "+5–8%.", "4 × 2 min");
  ex("escada-agilidade", "Escada de agilidade", "agility ladder running drills", "tecnica", ["escada-agilidade"], "R", "Coordenação, frequência, pés",
    ["Um pé em cada quadrado, depois dois pés em cada, depois lateral.", "Contactos curtos e leves, olhar à frente.", "Braços coordenados com as pernas."],
    ["Olhar para os pés", "Pisar a escada"], "Mais devagar.", "Padrões mais complexos (in-in-out-out).", "3 × 2 padrões");

  // ================= PLIOMETRIA (mais exercícios) =================
  ex("pogo-lateral", "Pogo lateral", "lateral pogo jumps", "pliometria", ["peso-corporal"], "R", "Tornozelos, estabilidade lateral",
    ["Saltos pequenos e rápidos de um lado para o outro de uma linha.", "Joelhos quase esticados, contacto curto na parte da frente do pé."],
    ["Dobrar os joelhos", "Contacto longo"], "Pogo no sítio.", "Uma perna.", "3 × 20 contactos");
  ex("pogo-frente", "Pogo a avançar", "forward pogo hops", "pliometria", ["peso-corporal"], "R", "Rigidez do tornozelo, reatividade",
    ["Saltos de pogo a avançar uns 50–80 cm de cada vez.", "Corpo alto e direito, braços ritmados."],
    ["Aterrar com os calcanhares", "Saltos longos e lentos"], "Pogo no sítio.", "Uma perna.", "3 × 15 m");
  ex("saltos-linha", "Saltos sobre a linha (frente e trás)", "line hops forward backward", "pliometria", ["peso-corporal"], "R", "Reatividade, coordenação",
    ["Pés juntos, salta para a frente e para trás de uma linha.", "O mais rápido possível com contactos curtos."],
    ["Contacto longo", "Olhar para os pés"], "Mais devagar.", "Uma perna.", "3 × 15 s");
  ex("salto-contramovimento", "Salto vertical com contramovimento", "countermovement jump", "pliometria", ["peso-corporal"], "CR", "Glúteos, quadríceps, gémeos (potência)",
    ["De pé, desce rápido a um quarto de agachamento balançando os braços.", "Salta o mais alto possível.", "Aterra suave, joelhos alinhados, e estabiliza 2 s."],
    ["Joelhos para dentro na aterragem", "Descer demasiado fundo"], "Saltos pequenos.", "Saltos encadeados.", "4 × 5");
  ex("salto-tuck", "Salto com joelhos ao peito (tuck jump)", "tuck jump", "pliometria", ["peso-corporal"], "CR", "Potência, core",
    ["Salta e leva os joelhos ao peito no ar.", "Aterra suave e salta logo de novo."],
    ["Aterrar com as pernas esticadas", "Arredondar as costas"], "Salto de agachamento.", "Mais rápido entre saltos.", "3 × 6");
  ex("triplo-salto", "Triplo salto a uma perna", "triple hop single leg", "pliometria", ["peso-corporal"], "R", "Potência unilateral, estabilidade",
    ["Numa perna, faz três saltos seguidos para a frente o mais longe possível.", "Aterra o último e fica estável 2 s."],
    ["Joelho para dentro", "Perder o equilíbrio no fim"], "Um salto de cada vez com pausa.", "Mais distância.", "3 × 2 por perna");
  ex("salto-comprimento-unipodal", "Salto em comprimento a uma perna", "single leg broad jump", "pliometria", ["peso-corporal"], "R", "Glúteos, controlo da aterragem",
    ["Numa perna, salta para a frente e aterra na mesma perna.", "Fica estável 2 s, joelho alinhado com o pé."],
    ["Aterragem rígida", "Joelho para dentro"], "Saltos curtos.", "Mais distância.", "3 × 4 por perna");
  ex("salto-caixa-lateral", "Saltos laterais sobre caixa baixa", "lateral box hops", "pliometria", ["peso-corporal"], "CR", "Reatividade lateral, tornozelos",
    ["Ao lado de uma caixa baixa ou degrau (15–20 cm).", "Salta para cima e para o outro lado de forma contínua."],
    ["Bater com os pés", "Contacto longo"], "Linha no chão.", "Caixa um pouco mais alta.", "3 × 10");
  ex("saltos-zigzag", "Saltos em zigue-zague a uma perna", "single leg zigzag hops", "pliometria", ["peso-corporal"], "R", "Estabilidade do tornozelo e do joelho",
    ["Numa perna, salta em diagonal para a frente, para a esquerda e direita.", "Contactos controlados, joelho alinhado."],
    ["Joelho a cair para dentro", "Perder o ritmo"], "Duas pernas.", "Mais distância lateral.", "3 × 8 por perna");
  ex("saltos-escadas", "Saltos em escadas", "stair hops", "pliometria", ["peso-corporal"], "R", "Potência, reatividade",
    ["Sobe uma escada a saltar a pés juntos, um ou dois degraus de cada vez.", "Desce a andar."],
    ["Joelhos para dentro", "Contacto longo"], "Um degrau de cada vez.", "Uma perna ou dois degraus.", "4 × 8 degraus");

  // ================= SESSÕES — TÉCNICA DE CORRIDA =================
  const s = (id, nome, fase, local, duracao, frequencia, rpe, objetivo, nota, blocos) =>
    SESSOES.push({ id, nome, fase, local, duracao, frequencia, rpe, objetivo, nota, blocos });
  const i = (ex, dose, descanso) => ({ ex, dose, descanso: descanso || "—" });

  s("tecnica-iniciacao", "Técnica de corrida — iniciação", "Preparatória geral", "Pista, relva ou estrada plana", 15,
    "2× por semana, antes de corrida fácil", "3–4",
    "Aprender os movimentos base: postura alta, pé debaixo da anca, braços coordenados.",
    "Faz depois de 10 min de trote. Volta a andar entre exercícios. Qualidade acima de velocidade.",
    [{ titulo: "Exercícios", itens: [
      i("marcha-joelhos", "2 × 20 m"), i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 20 m"),
      i("calcanhares-gluteos", "2 × 20 m"), i("bracos-sentado", "2 × 20 s"), i("progressivos", "4 × 60 m", "volta a andar")
    ] }]);

  s("tecnica-intermedia", "Técnica de corrida — intermédia", "Preparatória", "Pista ou relva", 20,
    "2× por semana", "4–5",
    "Consolidar a técnica com exercícios mais rápidos e coordenados.",
    "Depois de 10–15 min de trote. Recuperação: volta a andar.",
    [{ titulo: "Exercícios", itens: [
      i("tornozelos", "2 × 15 m"), i("skipping-a", "2 × 20 m"), i("skipping-b", "2 × 20 m"), i("perna-esticada", "2 × 20 m"),
      i("carioca", "1 × 20 m/lado"), i("wall-drill-a", "2 × 6/perna"), i("progressivos", "6 × 80 m", "volta a andar")
    ] }]);

  s("tecnica-avancada", "Técnica de corrida — avançada", "Preparatória específica", "Pista", 25,
    "1–2× por semana", "5–6",
    "Técnica a velocidade alta e potência da passada.",
    "Faz antes de um treino de séries ou num dia de corrida de qualidade. Recuperação completa entre repetições.",
    [{ titulo: "Exercícios", itens: [
      i("tornozelos", "2 × 15 m"), i("skipping-a-unilateral", "2 × 20 m/perna"), i("skipping-b", "2 × 20 m"),
      i("skipping-altura", "3 × 20 m"), i("wall-drill-trocas", "4 × 3 trocas"), i("queda-frente", "4 × 15 m")
    ] },
    { titulo: "Velocidade", itens: [i("pes-rapidos", "3 × 8 s"), i("progressivos", "6 × 100 m", "volta a andar")] }]);

  s("tecnica-cadencia", "Cadência e passada", "Todo o ano", "Estrada ou pista", 30,
    "1× por semana (dentro de uma corrida fácil)", "4",
    "Aumentar a cadência para reduzir a passada demasiado longa e o impacto.",
    "Os blocos de metrónomo são feitos a meio de uma corrida fácil. Entre blocos, 2 min de corrida normal.",
    [{ titulo: "Antes", itens: [i("tornozelos", "2 × 15 m"), i("pes-rapidos", "3 × 8 s")] },
     { titulo: "Durante a corrida", itens: [i("cadencia-metronomo", "4 × 2 min", "2 min normal")] },
     { titulo: "No fim", itens: [i("progressivos", "4 × 80 m", "volta a andar")] }]);

  s("tecnica-subidas", "Subidas e técnica", "Preparatória", "Subida de 6–10%", 30,
    "1× por semana", "6–7",
    "Força específica de corrida e postura através de subidas curtas.",
    "Aquece 15 min. Descida a andar entre subidas (recuperação completa).",
    [{ titulo: "Técnica", itens: [i("skipping-a", "2 × 20 m"), i("skipping-altura", "2 × 20 m"), i("queda-frente", "3 × 15 m")] },
     { titulo: "Subidas", itens: [i("subidas-curtas", "8 × 10 s", "descer a andar")] }]);

  s("tecnica-pre-prova", "Ativação pré-prova (corrida)", "Competitiva", "Junto à partida ou na T2", 10,
    "Dia de prova ou véspera", "3–4",
    "Acordar o sistema nervoso sem cansar.",
    "Poucas repetições e muito soltas. Termina 10–15 min antes da partida.",
    [{ titulo: "Sequência", itens: [
      i("balanco-pernas-frente", "10/perna"), i("tornozelos", "1 × 15 m"), i("skipping-a", "1 × 20 m"),
      i("pes-rapidos", "2 × 6 s"), i("progressivos", "3 × 60 m")
    ] }]);

  // ================= SESSÕES — PLIOMETRIA (progressão) =================
  s("pliometria-iniciacao", "Pliometria — iniciação", "Preparatória geral", "Relva ou piso de borracha", 20,
    "1–2× por semana", "5",
    "Introduzir os saltos com pouco impacto e aprender a aterrar bem. ~80–100 contactos.",
    "Pré-requisito: conseguir 20 elevações de gémeos a uma perna e agachar bem. Para assim que a aterragem ficar pesada.",
    [{ titulo: "Aterragem e reatividade", itens: [
      i("saltar-corda", "3 × 30 s", "30 s"), i("pogo", "2 × 15", "60 s"), i("saltos-linha", "2 × 10 s", "60 s"),
      i("salto-contramovimento", "3 × 4", "60 s"), i("salto-comprimento", "3 × 3", "60 s")
    ] }]);

  s("pliometria-intermedia", "Pliometria — intermédia", "Preparatória", "Relva, pista ou piso de borracha", 25,
    "1–2× por semana", "6",
    "Aumentar a reatividade e introduzir saltos unilaterais. ~150 contactos.",
    "Faz depois de 4–6 semanas de iniciação sem dores. Recuperação completa: o objetivo é qualidade, não cansaço.",
    [{ titulo: "Bilateral", itens: [
      i("pogo-frente", "3 × 15 m", "60 s"), i("pogo-lateral", "2 × 20", "60 s"), i("salto-caixa", "3 × 5", "90 s")
    ] },
    { titulo: "Unilateral", itens: [
      i("saltos-unipodais", "3 × 10/perna", "60 s"), i("saltos-patinador", "3 × 6/lado", "60 s"), i("salto-comprimento-unipodal", "2 × 4/perna", "60 s")
    ] }]);

  s("pliometria-avancada", "Pliometria — avançada", "Preparatória específica", "Pista ou piso de borracha", 30,
    "1× por semana", "7",
    "Máxima reatividade e rigidez para a economia de corrida. ~160 contactos.",
    "Só para atletas com base de força e sem lesões recentes. Não fazer na semana de prova A.",
    [{ titulo: "Reatividade", itens: [
      i("pogo", "2 × 20", "60 s"), i("drop-jump", "3 × 5", "2 min"), i("saltos-barreiras", "4 × 5", "90 s")
    ] },
    { titulo: "Unilateral e horizontal", itens: [
      i("triplo-salto", "3 × 2/perna", "90 s"), i("saltos-zigzag", "2 × 8/perna", "60 s"), i("multisaltos", "4 × 30 m", "2 min")
    ] }]);

  s("pliometria-complexo", "Força + pliometria (complexo)", "Preparatória específica", "Ginásio", 40,
    "1× por semana", "7–8",
    "Juntar um exercício de força pesado com um salto logo a seguir para potenciar o salto.",
    "Faz o exercício de força, descansa 60–90 s, faz o salto. Repete o par 3–4 vezes com 2–3 min entre pares.",
    [{ titulo: "Par 1", itens: [i("agachamento-barra", "4 × 4", "60–90 s"), i("salto-contramovimento", "4 × 4", "2–3 min")] },
     { titulo: "Par 2", itens: [i("split-squat-bulgaro", "3 × 5/perna", "60 s"), i("salto-afundo", "3 × 4/perna", "2 min")] },
     { titulo: "Par 3", itens: [i("gemeos-em-pe", "3 × 8/perna", "60 s"), i("pogo", "3 × 15", "90 s")] }]);

  s("pliometria-unilateral", "Pliometria unilateral e estabilidade", "Todo o ano", "Relva ou piso de borracha", 20,
    "1× por semana", "5–6",
    "Melhorar a estabilidade do tornozelo, joelho e anca em apoio unipodal, como na corrida.",
    "Cada aterragem tem de ser controlada. Se o joelho fugir para dentro, reduz a distância.",
    [{ titulo: "Sequência", itens: [
      i("equilibrio-unipodal", "2 × 30 s/perna"), i("saltos-unipodais", "3 × 8/perna", "60 s"), i("salto-comprimento-unipodal", "3 × 3/perna", "60 s"),
      i("saltos-zigzag", "2 × 6/perna", "60 s"), i("hip-airplane", "2 × 5/perna")
    ] }]);

  s("pliometria-manutencao", "Pliometria — manutenção", "Competitiva", "Qualquer piso firme", 12,
    "1× por semana", "5",
    "Manter a reatividade em período de provas com pouco volume. ~40–50 contactos.",
    "Pode ser feito no aquecimento de um treino de corrida. Não fazer nos 3 dias antes de uma prova A.",
    [{ titulo: "Sequência", itens: [
      i("pogo", "2 × 15", "45 s"), i("saltos-unipodais", "2 × 6/perna", "60 s"), i("salto-contramovimento", "2 × 3", "60 s"), i("progressivos", "3 × 80 m")
    ] }]);
})();
