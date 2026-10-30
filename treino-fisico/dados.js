// Biblioteca de treino físico — dados editáveis.
//
// Para acrescentar um exercício, copia um bloco de EXERCICIOS e muda os campos.
// - id: só letras minúsculas, números e hífens (é usado no link do exercício)
// - categoria: "forca" | "core" | "mobilidade" | "prevencao" | "ativacao" | "pliometria" | "tecnica"
// - material: lista com "ginasio" | "halteres" | "elastico" | "peso-corporal" | "kettlebell" | "fitball" | "rolo" | "trx" | "bola-medicinal"
// - disciplinas: lista com "natacao" | "ciclismo" | "corrida"
// - video: link para um vídeo teu (YouTube, Drive...). Vazio = mostra pesquisa no YouTube.
//
// As sessões (SESSOES) referem os exercícios pelo id.

const EXERCICIOS = [
  // ---------- Força: membros inferiores ----------
  {
    id: "agachamento-goblet",
    nome: "Agachamento goblet",
    nomeEn: "goblet squat",
    categoria: "forca",
    material: ["halteres", "ginasio"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Quadríceps, glúteos, core",
    execucao: [
      "Segura um haltere ou kettlebell junto ao peito, cotovelos para baixo.",
      "Pés à largura dos ombros, pontas ligeiramente para fora.",
      "Desce sentando entre os calcanhares, tronco direito, joelhos na direção dos pés.",
      "Sobe empurrando o chão com o pé inteiro."
    ],
    erros: ["Joelhos a fugir para dentro", "Calcanhares a levantar", "Arredondar a lombar no fundo"],
    regressao: "Agachamento para uma cadeira/caixa, sem carga.",
    progressao: "Agachamento frontal com barra ou tempo de descida de 3 s.",
    dose: "3–4 × 6–10"
  },
  {
    id: "peso-morto-romeno",
    nome: "Peso morto romeno",
    nomeEn: "romanian deadlift dumbbell",
    categoria: "forca",
    material: ["halteres", "ginasio"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Isquiotibiais, glúteos, lombares",
    execucao: [
      "De pé, halteres à frente das coxas, joelhos ligeiramente fletidos.",
      "Leva a anca atrás mantendo as costas neutras e os halteres junto às pernas.",
      "Desce até sentires tensão nos isquiotibiais (normalmente a meio da tíbia).",
      "Sobe contraindo os glúteos, sem hiperestender a lombar."
    ],
    erros: ["Fletir demasiado os joelhos (vira agachamento)", "Arredondar as costas", "Halteres longe do corpo"],
    regressao: "Dobradiça da anca com um bastão nas costas, sem carga.",
    progressao: "Versão unilateral (peso morto romeno a uma perna).",
    dose: "3–4 × 6–10"
  },
  {
    id: "split-squat-bulgaro",
    nome: "Split squat búlgaro",
    nomeEn: "bulgarian split squat",
    categoria: "forca",
    material: ["halteres", "peso-corporal", "ginasio"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Quadríceps, glúteos, estabilizadores da anca",
    execucao: [
      "Pé de trás apoiado num banco, pé da frente cerca de um passo largo à frente.",
      "Desce na vertical até o joelho de trás quase tocar no chão.",
      "Mantém o joelho da frente alinhado com o 2.º dedo do pé.",
      "Sobe pela perna da frente. Faz todas as repetições e troca."
    ],
    erros: ["Joelho da frente a cair para dentro", "Tronco a rodar", "Empurrar com a perna de trás"],
    regressao: "Split squat com os dois pés no chão.",
    progressao: "Halteres mais pesados ou descida em 3 s.",
    dose: "3 × 6–10 por perna"
  },
  {
    id: "step-up",
    nome: "Step-up",
    nomeEn: "step up exercise",
    categoria: "forca",
    material: ["peso-corporal", "halteres"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Quadríceps, glúteos",
    execucao: [
      "Pé inteiro em cima de um banco/caixa à altura do joelho.",
      "Sobe empurrando só com a perna de cima até ficares de pé no banco.",
      "Desce devagar, controlando com a mesma perna."
    ],
    erros: ["Dar impulso com a perna de baixo", "Joelho a cair para dentro", "Descer de forma descontrolada"],
    regressao: "Caixa mais baixa, sem carga.",
    progressao: "Halteres ou caixa mais alta.",
    dose: "3 × 8–10 por perna"
  },
  {
    id: "hip-thrust",
    nome: "Hip thrust",
    nomeEn: "hip thrust",
    categoria: "forca",
    material: ["ginasio", "halteres", "peso-corporal"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Glúteos, isquiotibiais",
    execucao: [
      "Parte de cima das costas apoiada num banco, carga sobre a anca.",
      "Pés à largura da anca, canelas verticais no topo do movimento.",
      "Sobe a anca até o tronco ficar alinhado com as coxas; pausa 1 s.",
      "Queixo recolhido, costelas para baixo."
    ],
    erros: ["Arquear a lombar no topo", "Empurrar com as pontas dos pés"],
    regressao: "Ponte glútea no chão.",
    progressao: "Barra com mais carga ou versão unilateral.",
    dose: "3 × 8–12"
  },
  {
    id: "gemeos-em-pe",
    nome: "Elevação de gémeos em pé",
    nomeEn: "standing calf raise single leg",
    categoria: "forca",
    material: ["peso-corporal", "halteres"],
    disciplinas: ["corrida"],
    musculos: "Gémeos (gastrocnémio), tendão de Aquiles",
    execucao: [
      "Numa perna, na ponta de um degrau, joelho estendido. Apoia uma mão na parede.",
      "Sobe o mais alto possível (2 s), pausa 1 s em cima.",
      "Desce devagar (3 s) até abaixo do nível do degrau."
    ],
    erros: ["Movimento curto e rápido", "Rodar o pé para fora", "Dobrar o joelho"],
    regressao: "Duas pernas, no chão.",
    progressao: "Haltere na mão do lado que trabalha.",
    dose: "3 × 12–15 por perna"
  },
  {
    id: "gemeos-sentado",
    nome: "Elevação de gémeos sentado (sóleo)",
    nomeEn: "seated calf raise soleus",
    categoria: "forca",
    material: ["ginasio", "halteres"],
    disciplinas: ["corrida"],
    musculos: "Sóleo",
    execucao: [
      "Sentado, joelhos a 90°, pontas dos pés num degrau ou anilha.",
      "Carga sobre os joelhos (máquina, halteres ou barra).",
      "Sobe e desce em amplitude total, controlando a descida."
    ],
    erros: ["Carga demasiado leve (o sóleo aguenta muito)", "Amplitude curta"],
    regressao: "Sem carga, numa perna.",
    progressao: "Aumentar carga progressivamente.",
    dose: "3 × 10–15"
  },
  {
    id: "nordic",
    nome: "Nordic hamstring",
    nomeEn: "nordic hamstring curl",
    categoria: "prevencao",
    material: ["peso-corporal"],
    disciplinas: ["corrida"],
    musculos: "Isquiotibiais (excêntrico)",
    execucao: [
      "Ajoelhado numa superfície macia, calcanhares presos (parceiro ou barra).",
      "Corpo direito dos joelhos à cabeça.",
      "Inclina-te para a frente o mais devagar possível, travando com os isquiotibiais.",
      "Quando não aguentares, apara a queda com as mãos e volta à posição inicial."
    ],
    erros: ["Dobrar a anca", "Cair rápido logo no início"],
    regressao: "Amplitude parcial ou com elástico a ajudar.",
    progressao: "Descer mais e mais devagar.",
    dose: "2–3 × 4–6"
  },
  {
    id: "copenhagen",
    nome: "Prancha Copenhaga",
    nomeEn: "copenhagen plank",
    categoria: "prevencao",
    material: ["peso-corporal"],
    disciplinas: ["corrida", "ciclismo"],
    musculos: "Adutores, oblíquos",
    execucao: [
      "Prancha lateral com a perna de cima apoiada num banco (joelho ou pé).",
      "A perna de baixo fica no ar.",
      "Mantém o corpo alinhado, sem a anca cair."
    ],
    erros: ["Anca a descer", "Rodar o tronco para a frente"],
    regressao: "Joelho de cima apoiado no banco (alavanca curta).",
    progressao: "Pé apoiado e levantar/baixar a perna de baixo.",
    dose: "3 × 15–30 s por lado"
  },

  // ---------- Força: membros superiores / natação ----------
  {
    id: "remada-haltere",
    nome: "Remada com haltere a um braço",
    nomeEn: "one arm dumbbell row",
    categoria: "forca",
    material: ["halteres", "ginasio"],
    disciplinas: ["natacao"],
    musculos: "Grande dorsal, romboides, deltoide posterior",
    execucao: [
      "Mão e joelho do mesmo lado apoiados num banco, costas neutras.",
      "Puxa o haltere em direção à anca, cotovelo junto ao corpo.",
      "Desce em controlo até o braço estar estendido."
    ],
    erros: ["Rodar o tronco para puxar", "Encolher o ombro", "Puxar para o peito em vez da anca"],
    regressao: "Remada com elástico em pé.",
    progressao: "Mais carga ou pausa de 1 s em cima.",
    dose: "3 × 8–12 por braço"
  },
  {
    id: "pulldown-bracos-estendidos",
    nome: "Puxada com braços estendidos",
    nomeEn: "straight arm pulldown band",
    categoria: "forca",
    material: ["elastico", "ginasio"],
    disciplinas: ["natacao"],
    musculos: "Grande dorsal, tríceps (fase de tração da braçada)",
    execucao: [
      "Elástico preso acima da cabeça (ou polia alta). Tronco ligeiramente inclinado.",
      "Braços quase estendidos, puxa até às coxas num arco.",
      "Volta devagar até os braços estarem acima da cabeça."
    ],
    erros: ["Dobrar os cotovelos", "Arquear a lombar", "Encolher os ombros"],
    regressao: "Elástico mais leve, amplitude menor.",
    progressao: "Alternar braços imitando a braçada de crol.",
    dose: "3 × 12–15"
  },
  {
    id: "rotacao-externa-elastico",
    nome: "Rotação externa com elástico",
    nomeEn: "band external rotation shoulder",
    categoria: "prevencao",
    material: ["elastico"],
    disciplinas: ["natacao"],
    musculos: "Infraespinhoso, redondo menor (coifa dos rotadores)",
    execucao: [
      "Elástico preso à altura do cotovelo, cotovelo a 90° junto ao corpo (toalha entre braço e tronco).",
      "Roda o antebraço para fora sem afastar o cotovelo.",
      "Volta devagar."
    ],
    erros: ["Afastar o cotovelo do corpo", "Rodar o tronco", "Elástico demasiado forte"],
    regressao: "Elástico mais leve, amplitude menor.",
    progressao: "Rotação externa a 90° de abdução (braço ao nível do ombro).",
    dose: "2–3 × 15 por braço"
  },
  {
    id: "ytw",
    nome: "Y-T-W deitado",
    nomeEn: "prone Y T W shoulder",
    categoria: "prevencao",
    material: ["peso-corporal", "halteres"],
    disciplinas: ["natacao"],
    musculos: "Trapézio inferior e médio, deltoide posterior",
    execucao: [
      "Deitado de barriga para baixo (chão ou banco inclinado), polegares para cima.",
      "Levanta os braços em Y, depois em T, depois em W (cotovelos dobrados).",
      "Omoplatas para trás e para baixo em cada letra; pausa 2 s em cima."
    ],
    erros: ["Encolher os ombros para as orelhas", "Levantar a cabeça", "Usar balanço"],
    regressao: "Sem peso, uma letra de cada vez.",
    progressao: "Halteres de 0,5–2 kg.",
    dose: "1–2 × 8 de cada letra"
  },
  {
    id: "face-pull",
    nome: "Face pull com elástico",
    nomeEn: "band face pull",
    categoria: "forca",
    material: ["elastico", "ginasio"],
    disciplinas: ["natacao"],
    musculos: "Deltoide posterior, trapézio médio, rotadores externos",
    execucao: [
      "Elástico à altura dos olhos, pegas com as palmas para baixo.",
      "Puxa em direção à cara, afastando as mãos e rodando os braços para fora.",
      "Termina com os cotovelos altos e as mãos ao lado das orelhas."
    ],
    erros: ["Cotovelos baixos", "Inclinar o tronco para trás"],
    regressao: "Elástico mais leve.",
    progressao: "Pausa de 2 s na posição final.",
    dose: "3 × 12–15"
  },
  {
    id: "flexoes",
    nome: "Flexões",
    nomeEn: "push up",
    categoria: "forca",
    material: ["peso-corporal"],
    disciplinas: ["natacao"],
    musculos: "Peitoral, tríceps, serrátil anterior, core",
    execucao: [
      "Mãos ligeiramente mais afastadas que os ombros, corpo em prancha.",
      "Desce até o peito quase tocar no chão, cotovelos a ~45° do corpo.",
      "Empurra o chão e, no topo, afasta as omoplatas (flexão + serrátil)."
    ],
    erros: ["Anca a cair", "Cotovelos abertos a 90°", "Amplitude curta"],
    regressao: "Mãos num banco ou joelhos no chão.",
    progressao: "Pés elevados ou colete com peso.",
    dose: "3 × 8–15"
  },

  // ---------- Core ----------
  {
    id: "prancha-frontal",
    nome: "Prancha frontal",
    nomeEn: "front plank",
    categoria: "core",
    material: ["peso-corporal"],
    disciplinas: ["natacao", "ciclismo", "corrida"],
    musculos: "Reto abdominal, transverso, glúteos",
    execucao: [
      "Antebraços no chão, cotovelos debaixo dos ombros.",
      "Corpo em linha da cabeça aos calcanhares; contrai glúteos e abdominais.",
      "Respira normalmente durante todo o tempo."
    ],
    erros: ["Anca alta ou a cair", "Prender a respiração"],
    regressao: "Joelhos no chão.",
    progressao: "Levantar um braço ou uma perna de forma alternada.",
    dose: "3 × 30–45 s"
  },
  {
    id: "prancha-lateral",
    nome: "Prancha lateral",
    nomeEn: "side plank",
    categoria: "core",
    material: ["peso-corporal"],
    disciplinas: ["natacao", "ciclismo", "corrida"],
    musculos: "Oblíquos, quadrado lombar, glúteo médio",
    execucao: [
      "Deitado de lado, cotovelo debaixo do ombro, pés sobrepostos.",
      "Levanta a anca até o corpo ficar em linha reta.",
      "Mantém sem deixar a anca rodar para trás."
    ],
    erros: ["Anca a cair", "Ombro encolhido"],
    regressao: "Joelhos dobrados no chão.",
    progressao: "Levantar a perna de cima.",
    dose: "3 × 20–40 s por lado"
  },
  {
    id: "dead-bug",
    nome: "Dead bug",
    nomeEn: "dead bug exercise",
    categoria: "core",
    material: ["peso-corporal"],
    disciplinas: ["natacao", "ciclismo", "corrida"],
    musculos: "Transverso, reto abdominal (anti-extensão)",
    execucao: [
      "Deitado de costas, braços para o teto, ancas e joelhos a 90°.",
      "Encosta a lombar ao chão e mantém-na lá.",
      "Estende o braço e a perna opostos devagar, sem a lombar levantar. Volta e troca."
    ],
    erros: ["Lombar a descolar do chão", "Movimento rápido"],
    regressao: "Mexer só as pernas.",
    progressao: "Segurar um elástico ou haltere leve nas mãos.",
    dose: "3 × 8 por lado"
  },
  {
    id: "bird-dog",
    nome: "Bird dog",
    nomeEn: "bird dog exercise",
    categoria: "core",
    material: ["peso-corporal"],
    disciplinas: ["natacao", "corrida"],
    musculos: "Multífidos, glúteos, estabilizadores do tronco",
    execucao: [
      "Em quatro apoios, mãos debaixo dos ombros, joelhos debaixo da anca.",
      "Estende o braço e a perna opostos até ficarem em linha com o tronco.",
      "Pausa 2 s sem a anca rodar e volta devagar."
    ],
    erros: ["Rodar a anca", "Arquear a lombar", "Levantar a perna acima da anca"],
    regressao: "Só a perna ou só o braço.",
    progressao: "Tocar cotovelo no joelho debaixo do corpo entre repetições.",
    dose: "3 × 8 por lado"
  },
  {
    id: "pallof",
    nome: "Pallof press",
    nomeEn: "pallof press band",
    categoria: "core",
    material: ["elastico", "ginasio"],
    disciplinas: ["natacao", "ciclismo", "corrida"],
    musculos: "Oblíquos, transverso (anti-rotação)",
    execucao: [
      "De lado para o ponto onde o elástico está preso, à altura do peito.",
      "Mãos no peito; estende os braços à frente sem deixar o tronco rodar.",
      "Pausa 2 s e volta. Faz todas as repetições e troca de lado."
    ],
    erros: ["Deixar o tronco rodar", "Pés juntos (base estreita)"],
    regressao: "Elástico mais leve, de joelhos.",
    progressao: "Em posição de afundo ou com mais tensão.",
    dose: "3 × 10 por lado"
  },

  // ---------- Mobilidade ----------
  {
    id: "rotacao-toracica",
    nome: "Rotação torácica (open book)",
    nomeEn: "open book thoracic rotation",
    categoria: "mobilidade",
    material: ["peso-corporal"],
    disciplinas: ["natacao", "ciclismo"],
    musculos: "Coluna torácica, peitoral",
    execucao: [
      "Deitado de lado, ancas e joelhos a 90°, braços esticados à frente.",
      "Abre o braço de cima como um livro, seguindo a mão com o olhar.",
      "Mantém os joelhos juntos no chão. Respira fundo na posição final."
    ],
    erros: ["Joelhos a levantar", "Forçar o ombro em vez de rodar o tronco"],
    regressao: "Amplitude menor.",
    progressao: "Em quatro apoios, mão atrás da cabeça.",
    dose: "2 × 8 por lado"
  },
  {
    id: "flexor-anca",
    nome: "Alongamento do flexor da anca",
    nomeEn: "kneeling hip flexor stretch",
    categoria: "mobilidade",
    material: ["peso-corporal"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Psoas, reto femoral",
    execucao: [
      "Ajoelhado em posição de afundo, joelho de trás numa almofada.",
      "Contrai o glúteo do lado de trás e leva a anca ligeiramente à frente.",
      "Levanta o braço do lado de trás para intensificar."
    ],
    erros: ["Arquear a lombar em vez de mexer a anca", "Avançar demasiado o joelho da frente"],
    regressao: "Sem o braço levantado.",
    progressao: "Pé de trás apoiado num banco (couch stretch).",
    dose: "2 × 45 s por lado"
  },
  {
    id: "tornozelo-parede",
    nome: "Mobilidade do tornozelo à parede",
    nomeEn: "knee to wall ankle mobility",
    categoria: "mobilidade",
    material: ["peso-corporal"],
    disciplinas: ["corrida"],
    musculos: "Tornozelo (dorsiflexão), gémeos",
    execucao: [
      "De frente para a parede, pé a alguns centímetros dela.",
      "Leva o joelho à parede sem levantar o calcanhar.",
      "Afasta o pé aos poucos até ser difícil tocar. Regista a distância."
    ],
    erros: ["Calcanhar a levantar", "Joelho a cair para dentro"],
    regressao: "Amplitude menor.",
    progressao: "Com carga (haltere sobre o joelho).",
    dose: "2 × 10 por lado"
  },
  {
    id: "anca-90-90",
    nome: "Anca 90/90",
    nomeEn: "90 90 hip mobility",
    categoria: "mobilidade",
    material: ["peso-corporal"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Rotadores da anca, glúteos",
    execucao: [
      "Sentado, perna da frente e de trás ambas dobradas a 90°.",
      "Tronco direito, inclina-te sobre a perna da frente.",
      "Roda os joelhos para o outro lado e repete."
    ],
    erros: ["Arredondar as costas", "Usar as mãos para compensar"],
    regressao: "Mãos apoiadas atrás.",
    progressao: "Sem mãos, transições controladas.",
    dose: "2 × 6 por lado"
  },

  // ---------- Ativação / pliometria ----------
  {
    id: "monster-walk",
    nome: "Monster walk com elástico",
    nomeEn: "monster walk band",
    categoria: "ativacao",
    material: ["elastico"],
    disciplinas: ["corrida", "ciclismo"],
    musculos: "Glúteo médio",
    execucao: [
      "Mini-band acima dos joelhos ou nos tornozelos, meio agachado.",
      "Dá passos laterais/diagonais curtos, sem deixar os pés juntarem.",
      "Joelhos para fora, tronco estável."
    ],
    erros: ["Joelhos a cair para dentro", "Tronco a balançar"],
    regressao: "Elástico mais leve, acima dos joelhos.",
    progressao: "Elástico nos pés ou mais forte.",
    dose: "2 × 10 passos para cada lado"
  },
  {
    id: "ponte-unilateral",
    nome: "Ponte glútea unilateral",
    nomeEn: "single leg glute bridge",
    categoria: "ativacao",
    material: ["peso-corporal"],
    disciplinas: ["ciclismo", "corrida"],
    musculos: "Glúteo máximo, isquiotibiais",
    execucao: [
      "Deitado de costas, um pé no chão e a outra perna esticada no ar.",
      "Sobe a anca até alinhar com o tronco, sem rodar.",
      "Pausa 1 s e desce."
    ],
    erros: ["Anca a rodar", "Empurrar com a lombar"],
    regressao: "Duas pernas.",
    progressao: "Pé num banco.",
    dose: "2–3 × 10 por perna"
  },
  {
    id: "pogo",
    nome: "Pogo jumps",
    nomeEn: "pogo jumps",
    categoria: "pliometria",
    material: ["peso-corporal"],
    disciplinas: ["corrida"],
    musculos: "Gémeos, tendão de Aquiles (rigidez/reatividade)",
    execucao: [
      "Saltos pequenos e rápidos no mesmo sítio, joelhos quase estendidos.",
      "Aterra na parte da frente do pé com o mínimo de tempo no chão.",
      "Mantém o corpo alto e os braços relaxados."
    ],
    erros: ["Dobrar muito os joelhos", "Aterrar com os calcanhares", "Saltos lentos"],
    regressao: "Saltar à corda devagar.",
    progressao: "Uma perna ou para a frente/trás.",
    dose: "3 × 20 contactos"
  },
  {
    id: "aquiles-excentrico",
    nome: "Excêntrico do Aquiles no degrau",
    nomeEn: "eccentric heel drop achilles",
    categoria: "prevencao",
    material: ["peso-corporal"],
    disciplinas: ["corrida"],
    musculos: "Tendão de Aquiles, gémeos, sóleo",
    execucao: [
      "Na ponta de um degrau, sobe com as duas pernas.",
      "Tira um pé e desce só com o outro, devagar (3–4 s), até abaixo do degrau.",
      "Faz metade das repetições com joelho estendido e metade com joelho fletido."
    ],
    erros: ["Descer depressa", "Fazer com dor acima de 5/10"],
    regressao: "Descida com as duas pernas.",
    progressao: "Mochila com peso.",
    dose: "3 × 15 por perna"
  }
];

const SESSOES = [
  {
    id: "forca-base",
    nome: "Força base",
    fase: "Preparatória geral",
    local: "Ginásio",
    duracao: 45,
    frequencia: "2× por semana",
    rpe: "6–7",
    objetivo: "Construir força geral nas pernas, cadeia posterior e tronco. Cargas moderadas, técnica perfeita.",
    nota: "Deixa 2–3 repetições \"na reserva\" em cada série. Evita fazer no dia antes de um treino de qualidade de corrida.",
    blocos: [
      { titulo: "Ativação", itens: [
        { ex: "monster-walk", dose: "2 × 10/lado", descanso: "—" },
        { ex: "ponte-unilateral", dose: "2 × 10/perna", descanso: "—" }
      ]},
      { titulo: "Principal", itens: [
        { ex: "agachamento-goblet", dose: "4 × 8", descanso: "90 s" },
        { ex: "peso-morto-romeno", dose: "4 × 8", descanso: "90 s" },
        { ex: "split-squat-bulgaro", dose: "3 × 8/perna", descanso: "60 s" },
        { ex: "remada-haltere", dose: "3 × 10/braço", descanso: "60 s" },
        { ex: "gemeos-em-pe", dose: "3 × 12/perna", descanso: "45 s" }
      ]},
      { titulo: "Core", itens: [
        { ex: "pallof", dose: "3 × 10/lado", descanso: "30 s" },
        { ex: "prancha-lateral", dose: "2 × 30 s/lado", descanso: "30 s" }
      ]}
    ]
  },
  {
    id: "forca-casa",
    nome: "Força em casa",
    fase: "Qualquer fase",
    local: "Casa — elástico e peso corporal",
    duracao: 30,
    frequencia: "1–2× por semana",
    rpe: "6",
    objetivo: "Alternativa sem ginásio, para semanas de viagem ou com pouco tempo.",
    nota: "Faz em circuito: 3 voltas, 60–90 s de descanso no fim de cada volta.",
    blocos: [
      { titulo: "Circuito × 3", itens: [
        { ex: "split-squat-bulgaro", dose: "10/perna", descanso: "—" },
        { ex: "ponte-unilateral", dose: "12/perna", descanso: "—" },
        { ex: "flexoes", dose: "10–15", descanso: "—" },
        { ex: "pulldown-bracos-estendidos", dose: "15", descanso: "—" },
        { ex: "gemeos-em-pe", dose: "15/perna", descanso: "—" },
        { ex: "dead-bug", dose: "8/lado", descanso: "60–90 s" }
      ]}
    ]
  },
  {
    id: "core-triatlo",
    nome: "Core do triatleta",
    fase: "Todo o ano",
    local: "Casa ou piscina (no seco)",
    duracao: 15,
    frequencia: "2–3× por semana",
    rpe: "5",
    objetivo: "Tronco estável para manter a posição na bicicleta e a postura na corrida com fadiga.",
    nota: "Pode ser feito logo a seguir a um treino aeróbio fácil.",
    blocos: [
      { titulo: "Sequência", itens: [
        { ex: "dead-bug", dose: "3 × 8/lado", descanso: "20 s" },
        { ex: "bird-dog", dose: "3 × 8/lado", descanso: "20 s" },
        { ex: "prancha-frontal", dose: "3 × 40 s", descanso: "20 s" },
        { ex: "prancha-lateral", dose: "3 × 30 s/lado", descanso: "20 s" },
        { ex: "pallof", dose: "2 × 10/lado", descanso: "20 s" }
      ]}
    ]
  },
  {
    id: "ombro-nadador",
    nome: "Ombro do nadador",
    fase: "Todo o ano",
    local: "Antes da natação",
    duracao: 12,
    frequencia: "Antes de cada treino de natação",
    rpe: "3–4",
    objetivo: "Ativar a coifa dos rotadores e a omoplata para proteger o ombro no volume de natação.",
    nota: "Elástico leve: o objetivo é ativar, não cansar.",
    blocos: [
      { titulo: "Pré-piscina", itens: [
        { ex: "rotacao-externa-elastico", dose: "2 × 15/braço", descanso: "—" },
        { ex: "face-pull", dose: "2 × 15", descanso: "—" },
        { ex: "ytw", dose: "1 × 8 cada letra", descanso: "—" },
        { ex: "pulldown-bracos-estendidos", dose: "2 × 12", descanso: "—" },
        { ex: "rotacao-toracica", dose: "1 × 8/lado", descanso: "—" }
      ]}
    ]
  },
  {
    id: "prevencao-corrida",
    nome: "Pernas à prova de corrida",
    fase: "Todo o ano",
    local: "Casa ou ginásio",
    duracao: 20,
    frequencia: "2× por semana",
    rpe: "5–6",
    objetivo: "Fortalecer gémeos, Aquiles, isquiotibiais e adutores, as zonas que mais se lesionam com o volume de corrida.",
    nota: "Dor no tendão até 3/10 durante o exercício é aceitável se no dia seguinte não piorar.",
    blocos: [
      { titulo: "Sequência", itens: [
        { ex: "gemeos-em-pe", dose: "3 × 15/perna", descanso: "45 s" },
        { ex: "gemeos-sentado", dose: "3 × 12", descanso: "45 s" },
        { ex: "nordic", dose: "2 × 5", descanso: "90 s" },
        { ex: "copenhagen", dose: "2 × 20 s/lado", descanso: "45 s" },
        { ex: "pogo", dose: "3 × 20", descanso: "60 s" }
      ]}
    ]
  },
  {
    id: "mobilidade-pos",
    nome: "Mobilidade pós-treino",
    fase: "Todo o ano",
    local: "Qualquer sítio",
    duracao: 12,
    frequencia: "Depois de treinos longos",
    rpe: "2",
    objetivo: "Recuperar amplitude na anca, tornozelo e coluna depois de horas na bicicleta ou a correr.",
    nota: "Respira devagar pelo nariz. Nunca forces até à dor.",
    blocos: [
      { titulo: "Sequência", itens: [
        { ex: "flexor-anca", dose: "2 × 45 s/lado", descanso: "—" },
        { ex: "anca-90-90", dose: "2 × 6/lado", descanso: "—" },
        { ex: "rotacao-toracica", dose: "2 × 8/lado", descanso: "—" },
        { ex: "tornozelo-parede", dose: "2 × 10/lado", descanso: "—" }
      ]}
    ]
  },
  {
    id: "manutencao-competicao",
    nome: "Manutenção competitiva",
    fase: "Competitiva",
    local: "Ginásio",
    duracao: 25,
    frequencia: "1× por semana",
    rpe: "6",
    objetivo: "Manter a força ganha sem acumular fadiga. Pouco volume, carga relativamente alta.",
    nota: "Não fazer nos 4–5 dias antes de uma prova A.",
    blocos: [
      { titulo: "Principal", itens: [
        { ex: "agachamento-goblet", dose: "3 × 5", descanso: "2 min" },
        { ex: "hip-thrust", dose: "3 × 6", descanso: "90 s" },
        { ex: "step-up", dose: "2 × 6/perna", descanso: "60 s" },
        { ex: "remada-haltere", dose: "2 × 8/braço", descanso: "60 s" },
        { ex: "pogo", dose: "2 × 20", descanso: "60 s" }
      ]}
    ]
  }
];
