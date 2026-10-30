// Biblioteca alargada — exercícios e sessões-modelo adicionais.
// Formato compacto: cada linha chama ex(...) com os campos por esta ordem:
//   id, nome, nome em inglês (para pesquisar vídeos), categoria, material, disciplinas,
//   músculos, passos de execução, erros comuns, versão mais fácil, versão mais difícil, dose habitual
// Disciplinas: N = natação, C = ciclismo, R = corrida (ex.: "CR" = ciclismo e corrida).

(function () {
  const D = { N: "natacao", C: "ciclismo", R: "corrida" };
  const ex = (id, nome, nomeEn, categoria, material, disc, musculos, execucao, erros, regressao, progressao, dose) =>
    EXERCICIOS.push({
      id, nome, nomeEn, categoria, material, musculos, execucao, erros, regressao, progressao, dose,
      disciplinas: disc.split("").map((c) => D[c]),
      video: ""
    });

  // ================= FORÇA — MEMBROS INFERIORES =================
  ex("agachamento-barra", "Agachamento com barra", "barbell back squat", "forca", ["ginasio"], "CR", "Quadríceps, glúteos, adutores, core",
    ["Barra apoiada no trapézio, mãos firmes, cotovelos para baixo.", "Inspira, contrai o abdómen e desce com o peito aberto.", "Desce até as coxas ficarem paralelas ou abaixo, joelhos na linha dos pés.", "Sobe empurrando o chão, mantendo a barra sobre o meio do pé."],
    ["Joelhos para dentro", "Tronco a cair à frente na subida", "Calcanhares a levantar"], "Agachamento goblet.", "Mais carga, 3–5 repetições.", "4 × 4–6");
  ex("agachamento-frontal", "Agachamento frontal", "front squat", "forca", ["ginasio"], "CR", "Quadríceps, glúteos, core (anti-flexão)",
    ["Barra apoiada à frente dos ombros, cotovelos altos.", "Desce na vertical mantendo o tronco direito.", "Sobe sem deixar os cotovelos caírem."],
    ["Cotovelos a descer", "Arredondar as costas"], "Agachamento goblet.", "Pausa de 2 s no fundo.", "4 × 4–6");
  ex("peso-morto", "Peso morto convencional", "conventional deadlift", "forca", ["ginasio"], "CR", "Glúteos, isquiotibiais, lombares, dorsal",
    ["Barra sobre o meio do pé, pés à largura da anca.", "Agarra a barra, costas neutras, ombros ligeiramente à frente da barra.", "Empurra o chão e estende anca e joelhos ao mesmo tempo, barra encostada às pernas.", "Desce controlando, anca atrás primeiro."],
    ["Arredondar a lombar", "Barra longe do corpo", "Hiperextensão no topo"], "Peso morto com trap bar ou kettlebell.", "Mais carga, séries de 3–5.", "3–4 × 3–6");
  ex("peso-morto-trap-bar", "Peso morto com trap bar", "trap bar deadlift", "forca", ["ginasio"], "CR", "Quadríceps, glúteos, isquiotibiais",
    ["Dentro da barra hexagonal, pegas ao lado do corpo.", "Anca para trás, costas neutras, peito aberto.", "Sobe até ficar direito e desce controlando."],
    ["Arredondar as costas", "Subir primeiro a anca"], "Kettlebell entre os pés.", "Mais carga ou saída de um bloco baixo.", "4 × 5");
  ex("peso-morto-unilateral", "Peso morto romeno a uma perna", "single leg romanian deadlift", "forca", ["halteres", "peso-corporal"], "CR", "Isquiotibiais, glúteos, estabilizadores da anca e do pé",
    ["De pé numa perna, haltere na mão contrária.", "Inclina o tronco à frente e leva a perna livre atrás, em linha com o tronco.", "Anca virada para o chão; volta contraindo o glúteo."],
    ["Anca a rodar para fora", "Joelho de apoio bloqueado", "Perder o equilíbrio por ir rápido"], "Pé de trás a tocar no chão (kickstand).", "Haltere mais pesado ou pausa em baixo.", "3 × 8 por perna");
  ex("afundo-frente", "Afundo à frente", "forward lunge", "forca", ["peso-corporal", "halteres"], "CR", "Quadríceps, glúteos",
    ["Dá um passo largo à frente e desce até o joelho de trás quase tocar no chão.", "Tronco direito, joelho da frente sobre o pé.", "Empurra com a perna da frente para voltar."],
    ["Passo curto (joelho muito à frente)", "Joelho a cair para dentro"], "Afundo estático (split squat).", "Halteres ou afundo a andar.", "3 × 8 por perna");
  ex("afundo-atras", "Afundo atrás", "reverse lunge", "forca", ["peso-corporal", "halteres"], "CR", "Glúteos, quadríceps",
    ["Dá um passo atrás e desce até o joelho quase tocar no chão.", "Peso sobre a perna da frente.", "Volta empurrando o chão com a perna da frente."],
    ["Tronco a cair à frente", "Empurrar com a perna de trás"], "Amplitude menor.", "Halteres ou pé da frente num degrau (déficit).", "3 × 8 por perna");
  ex("afundo-lateral", "Afundo lateral", "lateral lunge", "forca", ["peso-corporal", "halteres"], "CR", "Adutores, glúteos, quadríceps",
    ["Dá um passo largo para o lado.", "Senta-te na perna que avançou, a outra fica esticada.", "Volta empurrando o chão."],
    ["Calcanhar a levantar", "Joelho à frente da ponta do pé"], "Amplitude menor, mãos num apoio.", "Haltere goblet.", "3 × 8 por lado");
  ex("afundo-andar", "Afundo a andar", "walking lunge", "forca", ["peso-corporal", "halteres"], "CR", "Quadríceps, glúteos, equilíbrio",
    ["Afundo à frente e, em vez de voltar, avança com a perna de trás para o afundo seguinte.", "Mantém o tronco alto e o ritmo controlado."],
    ["Passos estreitos (como numa corda)", "Bater com o joelho no chão"], "Afundo estático.", "Halteres pesados.", "3 × 10 por perna");
  ex("step-up-lateral", "Step-up lateral", "lateral step up", "forca", ["peso-corporal", "halteres"], "CR", "Glúteo médio, quadríceps",
    ["De lado para um banco, pé de cima apoiado.", "Sobe só com essa perna, sem impulso da outra.", "Desce devagar."],
    ["Joelho a cair para dentro", "Impulso com a perna de baixo"], "Degrau mais baixo.", "Halteres ou banco mais alto.", "3 × 8 por perna");
  ex("step-down", "Step-down excêntrico", "eccentric step down", "prevencao", ["peso-corporal"], "R", "Quadríceps, tendão rotuliano, controlo do joelho",
    ["Em cima de um degrau numa perna.", "Desce a outra perna devagar (3 s) até o calcanhar tocar no chão à frente.", "Joelho alinhado com o 2.º dedo do pé; volta a subir."],
    ["Joelho para dentro", "Anca a cair para o lado"], "Degrau baixo.", "Degrau mais alto ou haltere.", "3 × 10 por perna");
  ex("agachamento-espanhol", "Agachamento espanhol", "spanish squat", "prevencao", ["elastico"], "CR", "Quadríceps, tendão rotuliano",
    ["Elástico forte preso a um ponto fixo e atrás dos joelhos.", "Inclina-te para trás e senta-te mantendo as canelas verticais.", "Fica em isometria ou faz repetições lentas."],
    ["Joelhos a avançar", "Elástico demasiado fraco"], "Menor amplitude.", "Isometria mais longa ou com haltere.", "5 × 45 s isometria");
  ex("leg-press", "Leg press", "leg press", "forca", ["ginasio"], "CR", "Quadríceps, glúteos",
    ["Pés à largura da anca a meio da plataforma.", "Desce até cerca de 90° no joelho sem a lombar descolar.", "Empurra sem bloquear os joelhos."],
    ["Lombar a descolar do banco", "Joelhos a cair para dentro"], "Carga leve.", "Unilateral.", "3 × 8–12");
  ex("extensora", "Cadeira extensora", "leg extension", "forca", ["ginasio"], "C", "Quadríceps",
    ["Sentado, eixo da máquina alinhado com o joelho.", "Estende as pernas e pausa 1 s.", "Desce em 3 s."],
    ["Balanço", "Carga excessiva com dor no joelho"], "Unilateral leve.", "Isometria no topo.", "3 × 10–12");
  ex("curl-fitball", "Curl de isquiotibiais na fitball", "stability ball hamstring curl", "forca", ["fitball"], "CR", "Isquiotibiais, glúteos",
    ["Deitado de costas, calcanhares em cima da bola.", "Sobe a anca e puxa a bola para ti dobrando os joelhos.", "Estica devagar sem baixar a anca."],
    ["Anca a cair", "Ir depressa"], "Só a ponte com a bola.", "Uma perna.", "3 × 8–12");
  ex("good-morning", "Good morning", "good morning exercise", "forca", ["ginasio", "elastico"], "CR", "Isquiotibiais, glúteos, lombares",
    ["Barra leve nas costas (ou elástico preso debaixo dos pés e por trás dos ombros, no trapézio — nunca no pescoço).", "Joelhos ligeiramente fletidos, leva a anca atrás.", "Desce o tronco com as costas neutras e volta."],
    ["Arredondar as costas", "Carga a mais"], "Só com um bastão.", "Mais carga.", "3 × 8–10");
  ex("hip-thrust-unilateral", "Hip thrust a uma perna", "single leg hip thrust", "forca", ["peso-corporal", "halteres"], "CR", "Glúteo máximo",
    ["Costas num banco, um pé no chão, a outra perna dobrada no ar.", "Sobe a anca até alinhar com o tronco, sem rodar.", "Pausa 1 s em cima."],
    ["Anca a rodar", "Arquear a lombar"], "Hip thrust a duas pernas.", "Haltere na anca.", "3 × 10 por perna");
  ex("ponte-glutea", "Ponte glútea", "glute bridge", "ativacao", ["peso-corporal"], "CR", "Glúteos",
    ["Deitado de costas, pés no chão à largura da anca.", "Sobe a anca contraindo os glúteos.", "Pausa 2 s e desce."],
    ["Empurrar com a lombar", "Pés longe demais"], "Amplitude menor.", "Ponte unilateral.", "2 × 15");
  ex("agachamento-unipodal-caixa", "Agachamento a uma perna para caixa", "single leg box squat", "forca", ["peso-corporal"], "CR", "Quadríceps, glúteos, controlo do joelho",
    ["Numa perna, de costas para uma caixa/cadeira.", "Desce devagar até tocar com o rabo na caixa, braços à frente.", "Sobe sem impulso."],
    ["Joelho para dentro", "Cair na caixa"], "Caixa mais alta.", "Caixa mais baixa até ao pistol.", "3 × 6 por perna");
  ex("agachamento-cossaco", "Agachamento cossaco", "cossack squat", "mobilidade", ["peso-corporal"], "CR", "Adutores, anca, tornozelo",
    ["Pés bem afastados.", "Desce sobre uma perna, a outra estica com a ponta do pé para cima.", "Passa para o outro lado sem subir totalmente."],
    ["Calcanhar a levantar", "Costas arredondadas"], "Mãos apoiadas num banco.", "Com kettlebell à frente.", "2 × 6 por lado");
  ex("kettlebell-swing", "Kettlebell swing", "kettlebell swing", "forca", ["kettlebell"], "CR", "Glúteos, isquiotibiais (potência da anca)",
    ["Kettlebell à frente, dobradiça da anca.", "Leva-a entre as pernas e projeta a anca à frente com força.", "A kettlebell sobe até ao peito; acompanha-a na descida e só dobras a anca quando os antebraços tocam nas coxas."],
    ["Agachar em vez de dobrar a anca", "Levantar com os braços", "Arquear no topo"], "Peso morto com kettlebell.", "Kettlebell mais pesada ou a uma mão.", "4 × 15");
  ex("wall-sit", "Cadeira na parede", "wall sit", "forca", ["peso-corporal"], "C", "Quadríceps (isometria)",
    ["Costas na parede, desce até joelhos a 90°.", "Mantém a posição a respirar normalmente."],
    ["Joelhos à frente dos pés", "Mãos nas coxas"], "Ângulo menos fundo.", "Uma perna ou haltere nas coxas.", "3 × 45–60 s");
  ex("gemeos-joelho-fletido", "Elevação de gémeos com joelho fletido", "bent knee calf raise", "forca", ["peso-corporal", "halteres"], "R", "Sóleo",
    ["Numa perna, joelho dobrado cerca de 30°, na ponta de um degrau.", "Sobe e desce em amplitude total mantendo o joelho dobrado."],
    ["Esticar o joelho na subida", "Amplitude curta"], "Duas pernas.", "Haltere na mão.", "3 × 15 por perna");
  ex("tibial-raise", "Elevação do tibial anterior", "tibialis raise", "prevencao", ["peso-corporal"], "R", "Tibial anterior (canela)",
    ["Costas na parede, calcanhares um passo à frente.", "Levanta as pontas dos pés o mais alto possível.", "Desce devagar."],
    ["Dobrar os joelhos", "Ir depressa"], "Calcanhares mais perto da parede.", "Calcanhares mais longe ou uma perna.", "3 × 15–20");
  ex("abducao-anca-deitado", "Abdução da anca deitado de lado", "side lying hip abduction", "prevencao", ["peso-corporal", "elastico"], "CR", "Glúteo médio",
    ["Deitado de lado, perna de baixo dobrada.", "Levanta a perna de cima esticada, ligeiramente para trás, com o pé paralelo ao chão.", "Desce devagar."],
    ["Rodar a ponta do pé para cima", "Rodar a anca para trás"], "Amplitude menor.", "Mini-band nos tornozelos.", "3 × 12–15 por lado");
  ex("clamshell", "Concha (clamshell)", "clamshell exercise", "ativacao", ["peso-corporal", "elastico"], "CR", "Glúteo médio, rotadores externos da anca",
    ["Deitado de lado, ancas e joelhos dobrados, pés juntos.", "Abre o joelho de cima sem rodar a anca.", "Fecha devagar."],
    ["Anca a rodar para trás", "Ir depressa"], "Sem elástico.", "Mini-band acima dos joelhos.", "2 × 15 por lado");
  ex("hip-airplane", "Avião da anca", "hip airplane", "prevencao", ["peso-corporal"], "R", "Glúteos, rotadores da anca, equilíbrio",
    ["Numa perna, tronco inclinado à frente como no peso morto unilateral.", "Roda a pélvis para abrir para o lado da perna livre e depois fecha.", "Movimento lento e controlado."],
    ["Perder o alinhamento do joelho", "Rodar só o tronco"], "Mão apoiada numa parede.", "Mais amplitude ou de olhos fechados.", "2 × 6 por perna");
  ex("aducao-deitado", "Adução da anca deitado de lado", "side lying hip adduction", "prevencao", ["peso-corporal"], "CR", "Adutores",
    ["Deitado de lado, perna de cima dobrada à frente.", "Levanta a perna de baixo esticada.", "Desce devagar."],
    ["Rodar o tronco", "Balanço"], "Amplitude menor.", "Caneleira ou Copenhaga.", "3 × 12 por lado");
  ex("nordic-invertido", "Nordic invertido", "reverse nordic", "forca", ["peso-corporal"], "CR", "Quadríceps (excêntrico), reto femoral",
    ["Ajoelhado, tronco e coxas em linha.", "Inclina-te para trás devagar mantendo a anca estendida.", "Volta à posição inicial."],
    ["Dobrar a anca", "Arquear a lombar"], "Amplitude curta.", "Mais amplitude ou segurar um peso.", "3 × 6–8");

  // ================= PÉ E TORNOZELO =================
  ex("short-foot", "Pé curto (short foot)", "short foot exercise", "prevencao", ["peso-corporal"], "R", "Músculos intrínsecos do pé, arco plantar",
    ["Sentado ou de pé, pé apoiado no chão.", "Encurta o pé puxando a base do dedo grande na direção do calcanhar, sem dobrar os dedos.", "Mantém 5 s e relaxa."],
    ["Dobrar os dedos", "Levantar o calcanhar"], "Sentado.", "De pé numa perna.", "3 × 10 × 5 s");
  ex("toe-yoga", "Yoga dos dedos", "toe yoga", "prevencao", ["peso-corporal"], "R", "Intrínsecos do pé",
    ["Pés no chão.", "Levanta só o dedo grande mantendo os outros no chão.", "Depois o contrário: os quatro dedos sobem e o grande fica."],
    ["Mexer o tornozelo", "Rodar o pé"], "Ajudar com a mão.", "De pé.", "2 × 10");
  ex("equilibrio-unipodal", "Equilíbrio numa perna", "single leg balance", "prevencao", ["peso-corporal"], "R", "Tornozelo, propriocepção",
    ["Numa perna, joelho ligeiramente dobrado.", "Mantém o equilíbrio sem tocar com o outro pé.", "Olhos num ponto fixo."],
    ["Joelho bloqueado", "Anca a cair"], "Mão na parede.", "Olhos fechados, superfície instável ou a mexer os braços.", "3 × 30 s por perna");
  ex("equilibrio-alcance", "Alcance em estrela (Y-balance)", "y balance reach", "prevencao", ["peso-corporal"], "R", "Tornozelo, joelho, anca (controlo)",
    ["Numa perna, leva o pé livre o mais longe possível à frente, ao lado e atrás.", "Toca levemente no chão e volta ao centro.", "Mantém o joelho de apoio alinhado."],
    ["Apoiar o peso no pé que alcança", "Joelho para dentro"], "Distâncias curtas.", "Mais distância.", "2 × 5 de cada direção");
  ex("caminhar-calcanhares", "Caminhar em calcanhares e pontas", "heel walk toe walk", "ativacao", ["peso-corporal"], "R", "Tibial anterior, gémeos",
    ["Caminha 15 m só nos calcanhares, pontas dos pés para cima.", "Volta só nas pontas dos pés, bem alto."],
    ["Dobrar a anca", "Passos longos"], "Distância menor.", "Mais distância.", "2 × 15 m cada");
  ex("eversao-elastico", "Eversão do tornozelo com elástico", "ankle eversion band", "prevencao", ["elastico"], "R", "Peroniais",
    ["Sentado, elástico à volta do pé e preso do lado de dentro.", "Roda o pé para fora contra o elástico.", "Volta devagar."],
    ["Rodar a perna em vez do pé"], "Elástico leve.", "Elástico forte.", "2 × 15 por pé");
  ex("inversao-elastico", "Inversão do tornozelo com elástico", "ankle inversion band", "prevencao", ["elastico"], "R", "Tibial posterior",
    ["Sentado, elástico à volta do pé e preso do lado de fora.", "Roda o pé para dentro contra o elástico.", "Volta devagar."],
    ["Rodar a perna em vez do pé"], "Elástico leve.", "Elástico forte.", "2 × 15 por pé");

  // ================= FORÇA — MEMBROS SUPERIORES / NATAÇÃO =================
  ex("elevacoes", "Elevações na barra", "pull up", "forca", ["ginasio", "peso-corporal"], "N", "Grande dorsal, bíceps, core",
    ["Pendurado, mãos um pouco mais afastadas que os ombros.", "Puxa os ombros para baixo e sobe até o queixo passar a barra.", "Desce controlando até os braços esticarem."],
    ["Balanço", "Meia amplitude", "Encolher os ombros"], "Elevações com elástico ou negativas.", "Com peso.", "4 × 4–8");
  ex("elevacoes-assistidas", "Elevações assistidas com elástico", "band assisted pull up", "forca", ["elastico", "ginasio"], "N", "Grande dorsal, bíceps",
    ["Elástico preso na barra e debaixo dos joelhos ou pés.", "Faz a elevação completa com controlo."],
    ["Deixar o elástico fazer o trabalho em baixo"], "Elástico mais forte.", "Elástico mais fraco.", "3 × 6–10");
  ex("remada-invertida", "Remada invertida", "inverted row", "forca", ["trx", "ginasio", "peso-corporal"], "N", "Dorsais, romboides, deltoide posterior",
    ["Debaixo de uma barra baixa ou com TRX, corpo em prancha.", "Puxa o peito até à barra juntando as omoplatas.", "Desce controlando."],
    ["Anca a cair", "Puxar com o pescoço"], "Corpo mais vertical.", "Pés elevados.", "3 × 8–12");
  ex("puxada-frente", "Puxada à frente", "lat pulldown", "forca", ["ginasio"], "N", "Grande dorsal",
    ["Sentado, pega mais larga que os ombros.", "Puxa a barra até ao peito, cotovelos para baixo.", "Sobe devagar até esticar."],
    ["Inclinar muito para trás", "Puxar atrás da cabeça"], "Menos carga.", "Unilateral ou pega neutra pesada.", "3 × 8–12");
  ex("remada-cabo", "Remada sentado no cabo", "seated cable row", "forca", ["ginasio"], "N", "Dorsais, romboides",
    ["Sentado, tronco direito.", "Puxa até ao abdómen juntando as omoplatas.", "Estica os braços deixando as omoplatas abrir."],
    ["Balançar o tronco", "Ombros encolhidos"], "Carga leve.", "Unilateral.", "3 × 10–12");
  ex("remada-elastico", "Remada com elástico", "resistance band row", "forca", ["elastico"], "N", "Dorsais, romboides, deltoide posterior",
    ["Elástico preso à altura do peito.", "Puxa os cotovelos para trás junto ao corpo.", "Volta devagar."],
    ["Encolher os ombros", "Inclinar o tronco"], "Elástico leve.", "Elástico forte ou unilateral.", "3 × 15");
  ex("pullover-haltere", "Pullover com haltere", "dumbbell pullover", "forca", ["halteres"], "N", "Grande dorsal, peitoral",
    ["Deitado num banco, haltere acima do peito com os braços quase esticados.", "Leva o haltere para trás da cabeça até sentires alongar.", "Volta acima do peito."],
    ["Arquear a lombar", "Dobrar muito os cotovelos"], "Haltere leve.", "Mais carga.", "3 × 10–12");
  ex("press-ombro", "Press de ombros com halteres", "dumbbell shoulder press", "forca", ["halteres"], "N", "Deltoides, tríceps",
    ["Sentado ou de pé, halteres à altura dos ombros.", "Empurra para cima sem arquear a lombar.", "Desce até à altura das orelhas."],
    ["Arquear as costas", "Cotovelos muito abertos"], "Halteres leves.", "De pé, unilateral.", "3 × 8–10");
  ex("supino-haltere", "Supino com halteres", "dumbbell bench press", "forca", ["halteres", "ginasio"], "N", "Peitoral, tríceps, deltoide anterior",
    ["Deitado num banco, omoplatas juntas.", "Desce os halteres ao lado do peito, cotovelos a ~45°.", "Empurra para cima."],
    ["Cotovelos a 90°", "Levantar o rabo do banco"], "Flexões.", "Mais carga.", "3 × 8–10");
  ex("flexao-serratil", "Flexão com protração (push-up plus)", "push up plus", "prevencao", ["peso-corporal"], "N", "Serrátil anterior",
    ["Em prancha alta, braços esticados.", "Deixa o peito descer entre as omoplatas e depois empurra o chão afastando-as ao máximo.", "Sem dobrar os cotovelos."],
    ["Dobrar os cotovelos", "Anca a cair"], "Joelhos no chão ou na parede.", "No fim de cada flexão completa.", "3 × 12");
  ex("wall-slide", "Deslize na parede com rolo", "serratus wall slide foam roller", "prevencao", ["rolo", "peso-corporal"], "N", "Serrátil, trapézio inferior",
    ["Antebraços na parede com um rolo por baixo.", "Desliza para cima afastando as omoplatas.", "Desce devagar."],
    ["Arquear a lombar", "Encolher os ombros"], "Sem rolo.", "Elástico à volta dos pulsos.", "2 × 10");
  ex("rotacao-externa-90", "Rotação externa a 90°", "90 90 external rotation band", "prevencao", ["elastico"], "N", "Coifa dos rotadores (posição de braçada)",
    ["Braço ao nível do ombro, cotovelo a 90°, elástico à frente.", "Roda o antebraço para cima até ficar vertical.", "Volta devagar."],
    ["Deixar o cotovelo descer", "Arquear as costas"], "Rotação externa com o braço junto ao corpo.", "Elástico mais forte ou pausa em cima.", "3 × 12 por braço");
  ex("rotacao-interna", "Rotação interna com elástico", "band internal rotation", "prevencao", ["elastico"], "N", "Subescapular",
    ["Elástico preso do lado do braço, cotovelo junto ao corpo a 90°.", "Roda o antebraço para dentro até à barriga.", "Volta devagar."],
    ["Afastar o cotovelo", "Rodar o tronco"], "Elástico leve.", "Elástico forte.", "2 × 15 por braço");
  ex("scaption", "Elevação em Y (scaption)", "scaption raise", "prevencao", ["halteres", "peso-corporal"], "N", "Supraespinhoso, deltoide",
    ["De pé, polegares para cima.", "Sobe os braços na diagonal à frente até à altura dos ombros.", "Desce em 3 s."],
    ["Encolher os ombros", "Peso demasiado alto"], "Sem peso.", "Halteres de 2–4 kg.", "3 × 12");
  ex("band-pull-apart", "Abertura com elástico", "band pull apart", "ativacao", ["elastico"], "N", "Deltoide posterior, romboides",
    ["Elástico à frente à altura dos ombros, braços esticados.", "Abre os braços até o elástico tocar no peito.", "Volta devagar."],
    ["Arquear a lombar", "Dobrar os cotovelos"], "Elástico leve.", "Pausa de 2 s.", "2 × 15–20");
  ex("bracada-elastico-crol", "Braçada de crol com elástico", "swim cord freestyle pull", "forca", ["elastico"], "N", "Grande dorsal, tríceps (específico de natação)",
    ["Elásticos presos à frente à altura da anca, tronco inclinado como a nadar.", "Cotovelo alto na entrada (agarre) e puxa até à coxa.", "Alterna os braços com ritmo de prova."],
    ["Cotovelo a cair", "Puxar com o braço esticado", "Encolher os ombros"], "Só fase de agarre, devagar.", "Mais tempo ou ritmo mais alto.", "4 × 30–60 s");
  ex("bracada-elastico-dupla", "Braçada dupla com elástico", "swim cord double arm pull", "forca", ["elastico"], "N", "Grande dorsal, tríceps",
    ["Mesma posição da braçada de crol.", "Puxa os dois braços ao mesmo tempo até às coxas.", "Volta controlado até à frente."],
    ["Perder o cotovelo alto", "Balançar o tronco"], "Elástico leve.", "Explosivo na puxada.", "3 × 15–20");
  ex("triceps-elastico", "Extensão de tríceps com elástico", "band triceps extension", "forca", ["elastico"], "N", "Tríceps (fase final da braçada)",
    ["Elástico preso em cima, cotovelos junto ao corpo.", "Estica os braços até baixo.", "Sobe devagar."],
    ["Mexer os cotovelos", "Inclinar o tronco"], "Elástico leve.", "Extensão unilateral acima da cabeça.", "3 × 15");
  ex("cobra", "Cobra deitado", "prone cobra exercise", "prevencao", ["peso-corporal"], "N", "Extensores torácicos, trapézio inferior",
    ["Deitado de barriga para baixo, braços ao lado do corpo.", "Levanta peito e braços, roda os polegares para fora e junta as omoplatas.", "Mantém 5 s."],
    ["Levantar a cabeça demasiado", "Contrair a lombar em vez das costas de cima"], "Menos tempo.", "Pequeno peso nas mãos.", "3 × 8 × 5 s");
  ex("rotacao-externa-lado", "Rotação externa deitado de lado", "side lying external rotation", "prevencao", ["halteres"], "N", "Infraespinhoso, redondo menor",
    ["Deitado de lado, cotovelo de cima a 90° junto ao corpo com uma toalha.", "Roda o antebraço para cima com um haltere leve.", "Desce em 3 s."],
    ["Afastar o cotovelo", "Rodar o tronco"], "Sem peso.", "1–3 kg.", "3 × 12–15");
  ex("remada-renegada", "Remada em prancha (renegade row)", "renegade row", "core", ["halteres"], "N", "Core (anti-rotação), dorsais",
    ["Prancha alta com as mãos em halteres, pés afastados.", "Puxa um haltere à anca sem rodar a anca.", "Pousa e troca."],
    ["Anca a rodar", "Pés juntos"], "Joelhos no chão.", "Halteres mais pesados.", "3 × 6 por braço");

  // ================= CORE =================
  ex("prancha-toques", "Prancha com toques nos ombros", "plank shoulder taps", "core", ["peso-corporal"], "NCR", "Core (anti-rotação), ombros",
    ["Prancha alta, pés afastados.", "Toca com uma mão no ombro oposto sem a anca mexer.", "Alterna devagar."],
    ["Anca a balançar", "Ir depressa"], "Pés mais afastados ou joelhos no chão.", "Pés juntos.", "3 × 10 por lado");
  ex("hollow", "Hollow hold", "hollow body hold", "core", ["peso-corporal"], "N", "Reto abdominal, transverso",
    ["Deitado de costas, lombar colada ao chão.", "Levanta pernas esticadas e ombros, braços acima da cabeça.", "Mantém a forma de banana."],
    ["Lombar a descolar"], "Joelhos dobrados, braços à frente.", "Hollow rocks.", "3 × 20–30 s");
  ex("rollout", "Rollout (roda ou fitball)", "ab wheel rollout", "core", ["fitball", "ginasio"], "NR", "Core (anti-extensão), dorsais",
    ["De joelhos, mãos na roda ou antebraços na bola.", "Rola para a frente mantendo a lombar neutra.", "Volta puxando com o abdómen."],
    ["Lombar a afundar", "Ir longe demais"], "Amplitude curta com fitball.", "De pé (roda).", "3 × 8");
  ex("stir-the-pot", "Mexer a panela (stir the pot)", "stir the pot exercise", "core", ["fitball"], "NCR", "Core (anti-extensão e anti-rotação)",
    ["Prancha com antebraços em cima da fitball.", "Faz pequenos círculos com os antebraços.", "Mantém a anca imóvel."],
    ["Anca alta", "Círculos grandes demais"], "Joelhos no chão.", "Círculos maiores.", "3 × 6 por sentido");
  ex("farmer-carry", "Transporte do agricultor", "farmers carry", "core", ["halteres", "kettlebell"], "NCR", "Core, pega, trapézio",
    ["Um haltere pesado em cada mão.", "Caminha com o tronco alto e passos curtos.", "Ombros para baixo."],
    ["Inclinar o tronco", "Ombros encolhidos"], "Menos peso.", "Mais peso ou distância.", "3 × 30 m");
  ex("suitcase-carry", "Transporte com um peso (mala)", "suitcase carry", "core", ["halteres", "kettlebell"], "NCR", "Oblíquos, quadrado lombar",
    ["Um peso numa só mão.", "Caminha sem deixar o tronco inclinar.", "Troca de mão a meio."],
    ["Inclinar para o lado do peso"], "Menos peso.", "Mais peso.", "3 × 20 m por lado");
  ex("chop-elastico", "Lenhador com elástico (chop)", "cable chop", "core", ["elastico", "ginasio"], "NCR", "Oblíquos, core rotacional",
    ["Elástico preso em cima de um lado.", "Puxa na diagonal até à anca oposta, braços quase esticados, rodando o tronco.", "Volta devagar."],
    ["Puxar só com os braços", "Rodar os joelhos"], "De joelhos.", "Mais resistência.", "3 × 10 por lado");
  ex("lift-elastico", "Lift com elástico", "cable lift", "core", ["elastico", "ginasio"], "NCR", "Oblíquos, glúteos",
    ["Elástico preso em baixo de um lado.", "Puxa na diagonal para cima até acima do ombro oposto.", "Volta devagar."],
    ["Arquear a lombar"], "De joelhos.", "Mais resistência.", "3 × 10 por lado");
  ex("elevacao-joelhos-suspenso", "Elevação de joelhos suspenso", "hanging knee raise", "core", ["ginasio"], "N", "Abdominais, flexores da anca",
    ["Pendurado numa barra.", "Sobe os joelhos ao peito enrolando a pélvis.", "Desce sem balanço."],
    ["Balançar", "Só subir as pernas sem enrolar"], "No banco (apoio nos antebraços).", "Pernas esticadas.", "3 × 8–12");
  ex("ponte-marcha", "Ponte com marcha", "marching glute bridge", "core", ["peso-corporal"], "CR", "Glúteos, core (anti-rotação)",
    ["Em ponte glútea.", "Levanta um pé de cada vez sem a anca descer ou rodar."],
    ["Anca a cair", "Ir depressa"], "Ponte simples.", "Pés mais longe.", "3 × 10 por lado");
  ex("urso", "Prancha do urso", "bear plank hold", "core", ["peso-corporal"], "NCR", "Core, ombros, quadríceps",
    ["Quatro apoios, joelhos 2–3 cm acima do chão.", "Costas planas, respira normalmente."],
    ["Anca alta", "Prender a respiração"], "Menos tempo.", "Gatinhar em urso.", "3 × 30 s");
  ex("crunch-invertido", "Crunch invertido", "reverse crunch", "core", ["peso-corporal"], "N", "Reto abdominal (parte inferior)",
    ["Deitado, joelhos a 90°.", "Enrola a pélvis levando os joelhos ao peito.", "Desce devagar."],
    ["Usar balanço"], "Amplitude menor.", "Num banco inclinado.", "3 × 12");
  ex("prancha-lateral-perna", "Prancha lateral com elevação da perna", "side plank leg raise", "core", ["peso-corporal"], "CR", "Oblíquos, glúteo médio",
    ["Em prancha lateral.", "Levanta a perna de cima esticada e desce.", "Anca sempre alta."],
    ["Anca a cair", "Rodar o tronco"], "Prancha lateral simples.", "Mini-band nos joelhos.", "3 × 10 por lado");
  ex("mountain-climber-lento", "Mountain climber lento", "slow mountain climber", "core", ["peso-corporal"], "R", "Core, flexores da anca",
    ["Prancha alta.", "Leva um joelho ao peito devagar sem a anca subir.", "Troca."],
    ["Anca alta", "Ir rápido e perder a forma"], "Mãos num banco.", "Pés numa toalha a deslizar.", "3 × 10 por lado");
  ex("superman-alternado", "Superman alternado", "alternating superman", "core", ["peso-corporal"], "NR", "Lombares, glúteos, costas",
    ["Deitado de barriga para baixo, braços à frente.", "Levanta braço e perna opostos.", "Pausa 2 s e troca."],
    ["Levantar demasiado", "Hiperestender o pescoço"], "Só pernas ou só braços.", "Os quatro ao mesmo tempo.", "2 × 10 por lado");
  ex("pallof-isometrico", "Pallof isométrico em afundo", "half kneeling pallof hold", "core", ["elastico"], "NCR", "Oblíquos, glúteos",
    ["Meio ajoelhado, elástico de lado.", "Braços esticados à frente e mantém sem rodar."],
    ["Rodar o tronco", "Arquear a lombar"], "De pé, base larga.", "Mais tensão.", "3 × 20 s por lado");

  // ================= MOBILIDADE / LIBERTAÇÃO =================
  ex("rolo-gemeos", "Rolo nos gémeos", "foam roll calves", "mobilidade", ["rolo"], "R", "Gémeos, sóleo",
    ["Sentado, rolo debaixo dos gémeos.", "Rola devagar do tornozelo ao joelho.", "Para 20 s nos pontos mais tensos."],
    ["Rolar rápido", "Rolar sobre o tendão de Aquiles com dor"], "Sem cruzar pernas.", "Uma perna sobre a outra.", "60 s por perna");
  ex("rolo-quadriceps", "Rolo nos quadríceps", "foam roll quads", "mobilidade", ["rolo"], "CR", "Quadríceps",
    ["De barriga para baixo, rolo debaixo das coxas.", "Rola da anca ao joelho, roda ligeiramente para dentro e fora."],
    ["Rolar sobre o joelho"], "Duas pernas.", "Uma perna.", "60 s por perna");
  ex("rolo-lateral-coxa", "Rolo na lateral da coxa", "foam roll lateral thigh", "mobilidade", ["rolo"], "CR", "Vasto lateral, tensor da fáscia lata",
    ["Deitado de lado com o rolo debaixo da coxa.", "Apoia a perna de cima à frente para controlar a pressão.", "Rola devagar entre a anca e o joelho."],
    ["Pressão excessiva", "Rolar sobre a anca óssea"], "Mais peso na perna de apoio.", "Menos apoio.", "60 s por lado");
  ex("rolo-gluteo", "Rolo nos glúteos", "foam roll glutes", "mobilidade", ["rolo"], "CR", "Glúteos, piriforme",
    ["Sentado no rolo, tornozelo cruzado sobre o joelho oposto.", "Inclina para o lado da perna cruzada e rola devagar."],
    ["Rolar sobre a lombar"], "Sem cruzar.", "Bola de ténis.", "60 s por lado");
  ex("rolo-toracico", "Extensão torácica no rolo", "thoracic extension foam roller", "mobilidade", ["rolo"], "NC", "Coluna torácica",
    ["Rolo atravessado nas costas, ao nível das omoplatas, mãos atrás da cabeça.", "Estende as costas sobre o rolo e volta.", "Muda o rolo de posição 2–3 vezes."],
    ["Estender a lombar", "Puxar o pescoço"], "Amplitude menor.", "Braços acima da cabeça.", "2 × 8");
  ex("gato-camelo", "Gato-camelo", "cat cow", "mobilidade", ["peso-corporal"], "NCR", "Coluna",
    ["Quatro apoios.", "Arredonda as costas ao expirar, depois afunda-as ao inspirar.", "Movimento lento, vértebra a vértebra."],
    ["Mexer só o pescoço"], "Amplitude menor.", "Mais lento com pausas.", "2 × 8");
  ex("worlds-greatest", "O melhor alongamento do mundo", "worlds greatest stretch", "mobilidade", ["peso-corporal"], "NCR", "Anca, isquiotibiais, torácica",
    ["Afundo profundo, mão do lado da perna de trás no chão.", "Leva o cotovelo da frente ao pé, depois roda o braço para o teto.", "Estica a perna da frente para alongar os isquiotibiais."],
    ["Joelho de trás a dobrar", "Rodar só o braço"], "Joelho de trás no chão.", "Mais lento com pausas.", "2 × 5 por lado");
  ex("isquios-ativo", "Elevação ativa da perna esticada", "active straight leg raise", "mobilidade", ["peso-corporal", "elastico"], "CR", "Isquiotibiais",
    ["Deitado de costas, uma perna esticada no chão.", "Levanta a outra perna esticada o mais alto possível sem dobrar.", "Desce devagar."],
    ["Dobrar o joelho", "Levantar a perna de baixo"], "Com elástico a ajudar.", "Pausa em cima.", "2 × 10 por perna");
  ex("alongamento-gemeos", "Alongamento dos gémeos na parede", "wall calf stretch", "mobilidade", ["peso-corporal"], "R", "Gémeos",
    ["Mãos na parede, perna de trás esticada e calcanhar no chão.", "Leva a anca à frente até sentir alongar.", "Mantém."],
    ["Calcanhar a levantar", "Pé rodado para fora"], "Menos amplitude.", "Ponta do pé numa parede.", "2 × 30 s por perna");
  ex("alongamento-soleo", "Alongamento do sóleo", "soleus stretch", "mobilidade", ["peso-corporal"], "R", "Sóleo, tendão de Aquiles",
    ["Igual ao alongamento dos gémeos, mas dobra o joelho de trás.", "Mantém o calcanhar no chão."],
    ["Calcanhar a levantar"], "Menos amplitude.", "Mais amplitude.", "2 × 30 s por perna");
  ex("alongamento-peitoral", "Alongamento do peitoral na porta", "doorway pec stretch", "mobilidade", ["peso-corporal"], "NC", "Peitoral, ombro anterior",
    ["Antebraço no batente da porta, cotovelo à altura do ombro.", "Avança o corpo até sentir alongar à frente do ombro."],
    ["Arquear a lombar", "Forçar com dor no ombro"], "Cotovelo mais baixo.", "Variar a altura do braço.", "2 × 30 s por lado");
  ex("alongamento-dorsal", "Alongamento do grande dorsal", "lat stretch bench", "mobilidade", ["peso-corporal"], "N", "Grande dorsal, tríceps",
    ["Ajoelhado, cotovelos num banco, mãos juntas atrás da cabeça.", "Leva o peito em direção ao chão."],
    ["Arquear a lombar"], "Menos amplitude.", "Com um bastão nas mãos.", "2 × 30 s");
  ex("bastao-ombros", "Rotação de ombros com bastão", "shoulder dislocates stick", "mobilidade", ["peso-corporal"], "N", "Ombros, peitoral",
    ["Bastão com pega larga à frente das coxas.", "Leva-o por cima da cabeça até atrás das costas com os braços esticados.", "Volta. Estreita a pega aos poucos."],
    ["Dobrar os cotovelos", "Arquear a lombar"], "Pega mais larga.", "Pega mais estreita.", "2 × 10");
  ex("crianca-lateral", "Postura da criança lateral", "side child pose lat stretch", "mobilidade", ["peso-corporal"], "N", "Grande dorsal, quadrado lombar",
    ["Sentado nos calcanhares, braços esticados à frente.", "Leva as duas mãos para um lado e respira fundo.", "Troca de lado."],
    ["Levantar o rabo"], "Almofada debaixo do rabo.", "Mais tempo.", "2 × 30 s por lado");
  ex("figura-4", "Alongamento do piriforme (figura 4)", "figure 4 stretch", "mobilidade", ["peso-corporal"], "CR", "Piriforme, glúteos",
    ["Deitado, tornozelo cruzado sobre o joelho oposto.", "Puxa a perna de baixo para o peito."],
    ["Levantar a cabeça", "Forçar o joelho"], "Pé de baixo no chão.", "Sentado numa cadeira, inclinar à frente.", "2 × 30 s por lado");
  ex("sapo", "Sapo (adutores)", "frog stretch rock back", "mobilidade", ["peso-corporal"], "CR", "Adutores",
    ["Quatro apoios, joelhos bem afastados, pés para fora.", "Leva a anca para trás devagar e volta."],
    ["Arredondar a lombar"], "Joelhos menos afastados.", "Mais amplitude.", "2 × 10");
  ex("agachamento-profundo", "Agachamento profundo sustentado", "deep squat hold", "mobilidade", ["peso-corporal"], "CR", "Anca, tornozelo, adutores",
    ["Desce até ao fundo do agachamento com os calcanhares no chão.", "Cotovelos por dentro dos joelhos a empurrar para fora.", "Respira fundo."],
    ["Calcanhares a levantar"], "Segurar num poste ou calço nos calcanhares.", "Rodar o tronco com um braço ao teto.", "3 × 30 s");
  ex("fio-agulha", "Fio na agulha", "thread the needle", "mobilidade", ["peso-corporal"], "NC", "Coluna torácica, ombro posterior",
    ["Quatro apoios.", "Passa um braço por baixo do outro até o ombro tocar no chão.", "Depois abre-o para o teto."],
    ["Mexer a anca"], "Amplitude menor.", "Pausa em cada posição.", "2 × 8 por lado");
  ex("cars-anca", "Círculos controlados da anca (CARs)", "hip controlled articular rotations", "mobilidade", ["peso-corporal"], "CR", "Articulação da anca",
    ["Em quatro apoios ou de pé apoiado.", "Faz o maior círculo possível com o joelho, devagar, sem mexer o tronco.", "Inverte o sentido."],
    ["Rodar o tronco", "Ir depressa"], "Círculos menores.", "De pé sem apoio.", "2 × 5 por sentido");
  ex("alongamento-quadriceps", "Alongamento do quadríceps de pé", "standing quad stretch", "mobilidade", ["peso-corporal"], "CR", "Quadríceps, flexores da anca",
    ["Numa perna, agarra o pé da outra atrás.", "Joelhos juntos, anca ligeiramente à frente."],
    ["Arquear a lombar", "Joelho a afastar-se"], "Apoio numa parede.", "Couch stretch.", "2 × 30 s por perna");

  // ================= ATIVAÇÃO / AQUECIMENTO DINÂMICO =================
  ex("balanco-pernas-frente", "Balanço de pernas à frente e atrás", "leg swings front back", "ativacao", ["peso-corporal"], "R", "Isquiotibiais, flexores da anca",
    ["Apoiado numa parede, balança uma perna à frente e atrás.", "Aumenta a amplitude aos poucos, tronco direito."],
    ["Arredondar as costas", "Forçar logo de início"], "Amplitude menor.", "Mais amplitude.", "1 × 12 por perna");
  ex("balanco-pernas-lado", "Balanço de pernas lateral", "leg swings side to side", "ativacao", ["peso-corporal"], "R", "Adutores, abdutores",
    ["De frente para a parede, balança uma perna para os lados, pela frente do corpo."],
    ["Rodar o tronco"], "Amplitude menor.", "Mais amplitude.", "1 × 12 por perna");
  ex("skipping-a", "Skipping A", "a skip drill", "ativacao", ["peso-corporal"], "R", "Flexores da anca, técnica de corrida",
    ["Marcha saltitante subindo o joelho à altura da anca.", "Pé de apoio aterra debaixo do corpo, na parte da frente.", "Braços coordenados."],
    ["Inclinar para trás", "Aterrar à frente do corpo"], "Marcha A (sem saltar).", "Mais rápido.", "2 × 20 m");
  ex("skipping-b", "Skipping B", "b skip drill", "ativacao", ["peso-corporal"], "R", "Isquiotibiais, técnica de corrida",
    ["Como o skipping A, mas a perna estica à frente e puxa o pé para baixo e para trás.", "Contacto ativo debaixo do corpo."],
    ["Pontapé à frente sem puxar"], "Marcha B.", "Mais rápido.", "2 × 20 m");
  ex("calcanhares-gluteos", "Calcanhares aos glúteos", "butt kicks drill", "ativacao", ["peso-corporal"], "R", "Isquiotibiais, técnica de corrida",
    ["Corrida curta trazendo o calcanhar ao glúteo.", "Joelhos apontados para baixo, cadência alta."],
    ["Inclinar o tronco"], "Mais lento.", "Mais rápido.", "2 × 20 m");
  ex("carioca", "Carioca", "carioca drill", "ativacao", ["peso-corporal"], "R", "Rotação da anca, coordenação",
    ["Desloca-te de lado cruzando a perna de trás à frente e atrás alternadamente.", "Roda a anca, ombros virados à frente."],
    ["Rodar os ombros com a anca"], "Mais lento.", "Mais rápido.", "2 × 20 m por lado");
  ex("inchworm", "Lagarta (inchworm)", "inchworm exercise", "ativacao", ["peso-corporal"], "NCR", "Isquiotibiais, ombros, core",
    ["De pé, dobra-te e põe as mãos no chão.", "Caminha com as mãos até à prancha.", "Caminha com os pés até às mãos."],
    ["Dobrar muito os joelhos", "Anca a cair na prancha"], "Joelhos dobrados.", "Flexão na prancha.", "2 × 5");
  ex("circulos-bracos", "Círculos e balanços de braços", "arm circles swings", "ativacao", ["peso-corporal"], "N", "Ombros",
    ["Círculos de braços grandes para a frente e para trás.", "Depois abraços (cruzar e abrir os braços à frente do peito)."],
    ["Encolher os ombros"], "Círculos pequenos.", "Mais rápido.", "1 × 10 de cada");
  ex("marcha-joelhos", "Marcha com joelhos altos", "high knee march", "ativacao", ["peso-corporal"], "R", "Flexores da anca, equilíbrio",
    ["Marcha devagar subindo o joelho acima da anca.", "Pausa 1 s em cada passo na ponta do pé de apoio."],
    ["Inclinar para trás"], "Sem ponta do pé.", "Skipping A.", "2 × 20 m");

  // ================= PLIOMETRIA / POTÊNCIA =================
  ex("saltar-corda", "Saltar à corda", "jump rope", "pliometria", ["peso-corporal"], "R", "Gémeos, tendão de Aquiles, coordenação",
    ["Saltos baixos na parte da frente do pé.", "Pulsos a rodar a corda, cotovelos junto ao corpo."],
    ["Saltar alto demais", "Aterrar nos calcanhares"], "Saltar sem corda.", "Alternar pés ou duplos.", "3–5 × 30 s–1 min");
  ex("salto-caixa", "Salto para a caixa", "box jump", "pliometria", ["peso-corporal"], "CR", "Glúteos, quadríceps (potência)",
    ["Em frente a uma caixa, balança os braços e salta.", "Aterra suave com os dois pés, joelhos alinhados.", "Desce a andar, não a saltar."],
    ["Aterrar com joelhos para dentro", "Caixa alta demais"], "Caixa baixa.", "Caixa mais alta ou a uma perna.", "4 × 5");
  ex("salto-agachamento", "Salto de agachamento", "squat jump", "pliometria", ["peso-corporal"], "CR", "Quadríceps, glúteos (potência)",
    ["Desce a meio agachamento e salta o mais alto possível.", "Aterra suave e reinicia."],
    ["Aterrar com as pernas esticadas", "Joelhos para dentro"], "Saltos pequenos.", "Com haltere leve.", "3 × 6");
  ex("salto-afundo", "Salto em afundo alternado", "split jump", "pliometria", ["peso-corporal"], "R", "Quadríceps, glúteos",
    ["Em afundo, salta e troca as pernas no ar.", "Aterra em afundo controlado."],
    ["Joelho da frente a cair para dentro", "Perder o equilíbrio"], "Afundo a andar.", "Mais rápido.", "3 × 6 por perna");
  ex("multisaltos", "Multisaltos (bounding)", "bounding drill", "pliometria", ["peso-corporal"], "R", "Glúteos, gémeos (potência de corrida)",
    ["Corrida com passadas exageradas, longas e altas.", "Empurra o chão para trás e para cima, braços fortes."],
    ["Aterrar com o calcanhar à frente do corpo"], "Skipping longo.", "Mais distância.", "4 × 20–30 m");
  ex("saltos-patinador", "Saltos de patinador", "skater jumps", "pliometria", ["peso-corporal"], "CR", "Glúteo médio, estabilidade lateral",
    ["Salta para o lado aterrando numa perna.", "Mantém o equilíbrio 1 s e salta para o outro lado."],
    ["Joelho para dentro na aterragem"], "Passos laterais sem salto.", "Mais distância.", "3 × 8 por lado");
  ex("saltos-unipodais", "Saltos a uma perna", "single leg hops", "pliometria", ["peso-corporal"], "R", "Gémeos, tendão de Aquiles, estabilidade",
    ["Numa perna, pequenos saltos no sítio ou para a frente.", "Contacto curto na parte da frente do pé.", "Joelho alinhado."],
    ["Joelho para dentro", "Contacto longo"], "Pogo a duas pernas.", "Para a frente e para os lados.", "3 × 10 por perna");
  ex("drop-jump", "Drop jump", "drop jump", "pliometria", ["peso-corporal"], "R", "Rigidez/reatividade das pernas",
    ["Em cima de uma caixa baixa (20–30 cm), dá um passo para fora.", "Ao tocar no chão, salta logo o mais alto possível com contacto curto."],
    ["Aterrar e afundar", "Caixa alta demais"], "Pogo jumps.", "Caixa um pouco mais alta.", "3 × 5");
  ex("saltos-barreiras", "Saltos sobre barreiras", "hurdle hops", "pliometria", ["peso-corporal"], "R", "Reatividade, coordenação",
    ["Barreiras baixas em linha.", "Salta sobre elas a pés juntos com contacto curto."],
    ["Pausas entre saltos", "Joelhos para dentro"], "Linhas no chão.", "Barreiras mais altas.", "4 × 5 barreiras");
  ex("salto-comprimento", "Salto em comprimento a pés juntos", "standing broad jump", "pliometria", ["peso-corporal"], "CR", "Glúteos, isquiotibiais (potência)",
    ["Balança os braços e salta o mais longe possível.", "Aterra suave e fica parado 2 s."],
    ["Aterrar com as pernas esticadas"], "Saltos curtos.", "Saltos encadeados.", "4 × 3");
  ex("lancamento-medicinal-cima", "Lançamento de bola medicinal acima da cabeça", "medicine ball overhead throw", "pliometria", ["bola-medicinal"], "N", "Dorsais, core (potência de braçada)",
    ["De frente para uma parede, bola acima da cabeça.", "Lança com força contra a parede como na braçada.", "Apanha e repete."],
    ["Arquear a lombar"], "Bola leve.", "Mais peso ou ajoelhado.", "3 × 10");
  ex("slam-medicinal", "Slam com bola medicinal", "medicine ball slam", "pliometria", ["bola-medicinal"], "N", "Dorsais, core",
    ["Bola acima da cabeça em extensão.", "Atira-a ao chão com força usando o tronco e os braços.", "Apanha e repete."],
    ["Arredondar as costas ao apanhar"], "Bola leve.", "Mais rápido.", "3 × 10");
  ex("lancamento-rotacional", "Lançamento rotacional à parede", "medicine ball rotational throw", "pliometria", ["bola-medicinal"], "NCR", "Oblíquos, anca (potência rotacional)",
    ["De lado para a parede, bola à anca.", "Roda a anca e o tronco e lança a bola contra a parede.", "Apanha e repete."],
    ["Lançar só com os braços"], "Bola leve.", "Mais peso ou passo antes.", "3 × 8 por lado");

  // ================= SESSÕES-MODELO ADICIONAIS =================
  SESSOES.push(
    {
      id: "forca-maxima", nome: "Força máxima", fase: "Preparatória específica", local: "Ginásio", duracao: 50,
      frequencia: "2× por semana", rpe: "7–8",
      objetivo: "Aumentar a força máxima com cargas altas e poucas repetições, para melhorar a economia de corrida e de pedalada.",
      nota: "Aquece bem com 2 séries de aproximação em cada exercício principal. Paragem 2–3 min entre séries pesadas.",
      blocos: [
        { titulo: "Ativação", itens: [{ ex: "ponte-glutea", dose: "2 × 15", descanso: "—" }, { ex: "worlds-greatest", dose: "1 × 5/lado", descanso: "—" }] },
        { titulo: "Principal", itens: [
          { ex: "agachamento-barra", dose: "4 × 5", descanso: "2–3 min" },
          { ex: "peso-morto-trap-bar", dose: "4 × 5", descanso: "2–3 min" },
          { ex: "split-squat-bulgaro", dose: "3 × 6/perna", descanso: "90 s" },
          { ex: "elevacoes", dose: "3 × 5–6", descanso: "2 min" },
          { ex: "gemeos-sentado", dose: "3 × 10", descanso: "60 s" }
        ] },
        { titulo: "Core", itens: [{ ex: "suitcase-carry", dose: "3 × 20 m/lado", descanso: "45 s" }] }
      ]
    },
    {
      id: "pliometria-corrida", nome: "Pliometria para a corrida", fase: "Preparatória específica", local: "Pista ou relva", duracao: 25,
      frequencia: "1–2× por semana", rpe: "6–7",
      objetivo: "Melhorar a reatividade e a rigidez do tendão para uma passada mais económica.",
      nota: "Qualidade acima de tudo: contactos curtos e explosivos. Para quando a técnica piorar. Faz antes de um treino de corrida fácil.",
      blocos: [
        { titulo: "Aquecimento", itens: [
          { ex: "skipping-a", dose: "2 × 20 m", descanso: "—" },
          { ex: "skipping-b", dose: "2 × 20 m", descanso: "—" },
          { ex: "carioca", dose: "1 × 20 m/lado", descanso: "—" }
        ] },
        { titulo: "Pliometria", itens: [
          { ex: "pogo", dose: "3 × 20", descanso: "60 s" },
          { ex: "saltos-unipodais", dose: "3 × 10/perna", descanso: "60 s" },
          { ex: "saltos-barreiras", dose: "4 × 5", descanso: "90 s" },
          { ex: "multisaltos", dose: "4 × 25 m", descanso: "90 s" }
        ] }
      ]
    },
    {
      id: "natacao-seco", nome: "Natação no seco", fase: "Todo o ano", local: "Casa ou ginásio (elásticos)", duracao: 30,
      frequencia: "2× por semana", rpe: "6",
      objetivo: "Força específica da braçada e estabilidade do ombro sem precisar de piscina.",
      nota: "Mantém o cotovelo alto em todas as puxadas, como na água.",
      blocos: [
        { titulo: "Ativação", itens: [
          { ex: "circulos-bracos", dose: "1 × 10", descanso: "—" },
          { ex: "band-pull-apart", dose: "2 × 15", descanso: "—" },
          { ex: "rotacao-externa-90", dose: "2 × 12/braço", descanso: "—" }
        ] },
        { titulo: "Principal", itens: [
          { ex: "bracada-elastico-crol", dose: "4 × 45 s", descanso: "45 s" },
          { ex: "bracada-elastico-dupla", dose: "3 × 15", descanso: "45 s" },
          { ex: "remada-invertida", dose: "3 × 10", descanso: "60 s" },
          { ex: "triceps-elastico", dose: "3 × 15", descanso: "30 s" },
          { ex: "lancamento-medicinal-cima", dose: "3 × 8", descanso: "60 s" }
        ] },
        { titulo: "Core", itens: [{ ex: "hollow", dose: "3 × 25 s", descanso: "30 s" }, { ex: "superman-alternado", dose: "2 × 10/lado", descanso: "30 s" }] }
      ]
    },
    {
      id: "ativacao-pre-corrida", nome: "Ativação pré-corrida", fase: "Todo o ano", local: "Antes de correr", duracao: 10,
      frequencia: "Antes de séries e provas", rpe: "3",
      objetivo: "Preparar anca, tornozelos e glúteos para correr com qualidade.",
      nota: "Faz logo antes do aquecimento a correr.",
      blocos: [
        { titulo: "Sequência", itens: [
          { ex: "balanco-pernas-frente", dose: "12/perna", descanso: "—" },
          { ex: "balanco-pernas-lado", dose: "12/perna", descanso: "—" },
          { ex: "monster-walk", dose: "10 passos/lado", descanso: "—" },
          { ex: "ponte-unilateral", dose: "8/perna", descanso: "—" },
          { ex: "skipping-a", dose: "2 × 20 m", descanso: "—" },
          { ex: "pogo", dose: "1 × 20", descanso: "—" }
        ] }
      ]
    },
    {
      id: "ativacao-pre-ciclismo", nome: "Ativação pré-ciclismo", fase: "Todo o ano", local: "Antes de pedalar", duracao: 8,
      frequencia: "Antes de treinos de qualidade", rpe: "3",
      objetivo: "Ativar glúteos e soltar a anca e as costas antes de muito tempo na posição de bicicleta.",
      nota: "Ótimo também antes do rolo.",
      blocos: [
        { titulo: "Sequência", itens: [
          { ex: "gato-camelo", dose: "8", descanso: "—" },
          { ex: "worlds-greatest", dose: "3/lado", descanso: "—" },
          { ex: "ponte-glutea", dose: "15", descanso: "—" },
          { ex: "clamshell", dose: "12/lado", descanso: "—" },
          { ex: "agachamento-profundo", dose: "30 s", descanso: "—" }
        ] }
      ]
    },
    {
      id: "pe-tornozelo", nome: "Pés e tornozelos fortes", fase: "Todo o ano", local: "Casa", duracao: 15,
      frequencia: "2–3× por semana", rpe: "4",
      objetivo: "Fortalecer o pé e o tornozelo para prevenir entorses, fascite plantar e dores na canela.",
      nota: "Pode fazer-se descalço, por exemplo enquanto vês televisão.",
      blocos: [
        { titulo: "Sequência", itens: [
          { ex: "short-foot", dose: "3 × 10 × 5 s", descanso: "—" },
          { ex: "toe-yoga", dose: "2 × 10", descanso: "—" },
          { ex: "equilibrio-unipodal", dose: "3 × 30 s/perna", descanso: "—" },
          { ex: "tibial-raise", dose: "3 × 15", descanso: "30 s" },
          { ex: "gemeos-joelho-fletido", dose: "3 × 15/perna", descanso: "30 s" },
          { ex: "eversao-elastico", dose: "2 × 15/pé", descanso: "—" }
        ] }
      ]
    },
    {
      id: "circuito-hotel", nome: "Circuito de hotel", fase: "Qualquer fase", local: "Quarto de hotel — sem material", duracao: 20,
      frequencia: "Em viagem", rpe: "6",
      objetivo: "Manter a força em viagem só com o peso do corpo.",
      nota: "4 voltas. 20–30 s entre exercícios, 90 s entre voltas.",
      blocos: [
        { titulo: "Circuito × 4", itens: [
          { ex: "afundo-atras", dose: "10/perna", descanso: "—" },
          { ex: "flexoes", dose: "10–15", descanso: "—" },
          { ex: "agachamento-unipodal-caixa", dose: "6/perna", descanso: "—" },
          { ex: "superman-alternado", dose: "10/lado", descanso: "—" },
          { ex: "gemeos-em-pe", dose: "15/perna", descanso: "—" },
          { ex: "prancha-toques", dose: "10/lado", descanso: "90 s" }
        ] }
      ]
    },
    {
      id: "core-avancado", nome: "Core avançado", fase: "Preparatória", local: "Ginásio", duracao: 20,
      frequencia: "1–2× por semana", rpe: "6–7",
      objetivo: "Core forte em anti-extensão, anti-rotação e transporte de carga.",
      nota: "Qualidade acima de quantidade. Para quando a lombar começar a compensar.",
      blocos: [
        { titulo: "Sequência", itens: [
          { ex: "rollout", dose: "3 × 8", descanso: "45 s" },
          { ex: "chop-elastico", dose: "3 × 10/lado", descanso: "30 s" },
          { ex: "remada-renegada", dose: "3 × 6/braço", descanso: "45 s" },
          { ex: "elevacao-joelhos-suspenso", dose: "3 × 10", descanso: "45 s" },
          { ex: "farmer-carry", dose: "3 × 30 m", descanso: "60 s" }
        ] }
      ]
    },
    {
      id: "mobilidade-rolo", nome: "Rolo e mobilidade (recuperação)", fase: "Todo o ano", local: "Casa", duracao: 15,
      frequencia: "Dias de descanso ou depois de treinos longos", rpe: "2",
      objetivo: "Soltar os músculos mais carregados no triatlo e recuperar amplitude.",
      nota: "Pressão moderada; nunca até à dor aguda.",
      blocos: [
        { titulo: "Rolo", itens: [
          { ex: "rolo-gemeos", dose: "60 s/perna", descanso: "—" },
          { ex: "rolo-quadriceps", dose: "60 s/perna", descanso: "—" },
          { ex: "rolo-gluteo", dose: "60 s/lado", descanso: "—" },
          { ex: "rolo-toracico", dose: "2 × 8", descanso: "—" }
        ] },
        { titulo: "Mobilidade", itens: [
          { ex: "figura-4", dose: "30 s/lado", descanso: "—" },
          { ex: "alongamento-peitoral", dose: "30 s/lado", descanso: "—" },
          { ex: "crianca-lateral", dose: "30 s/lado", descanso: "—" }
        ] }
      ]
    },
    {
      id: "joelho-forte", nome: "Joelhos fortes", fase: "Todo o ano", local: "Casa ou ginásio", duracao: 20,
      frequencia: "2× por semana", rpe: "5–6",
      objetivo: "Prevenir dores no joelho (tendão rotuliano e síndrome da banda iliotibial) com força do quadríceps e controlo da anca.",
      nota: "Dor até 3/10 durante os isométricos é aceitável se não piorar no dia seguinte.",
      blocos: [
        { titulo: "Sequência", itens: [
          { ex: "agachamento-espanhol", dose: "5 × 45 s", descanso: "60 s" },
          { ex: "step-down", dose: "3 × 10/perna", descanso: "45 s" },
          { ex: "abducao-anca-deitado", dose: "3 × 15/lado", descanso: "30 s" },
          { ex: "hip-airplane", dose: "2 × 6/perna", descanso: "30 s" },
          { ex: "nordic-invertido", dose: "2 × 6", descanso: "60 s" }
        ] }
      ]
    }
  );
})();
