(function () {
  "use strict";

  // ======================================================================
  // Configuração e constantes
  // ======================================================================
  const sb = window.supabase.createClient(window.CONFIG.supabaseUrl, window.CONFIG.supabaseAnonKey);

  const CATEGORIAS = { forca: "Força", core: "Core", mobilidade: "Mobilidade", prevencao: "Prevenção", ativacao: "Ativação", pliometria: "Pliometria", tecnica: "Técnica de corrida" };
  const DISCIPLINAS = { natacao: "Natação", ciclismo: "Ciclismo", corrida: "Corrida" };
  const MATERIAIS = {
    "peso-corporal": "Peso corporal", elastico: "Elástico", halteres: "Halteres", kettlebell: "Kettlebell", ginasio: "Ginásio",
    fitball: "Fitball", rolo: "Rolo", trx: "TRX", "bola-medicinal": "Bola medicinal", "escada-agilidade": "Escada de agilidade"
  };
  const ESTADOS = { planeado: "Planeado", feito: "Feito", nao_feito: "Não feito" };
  const ESCALA_RPE = [
    [0, "Repouso", "Nenhum esforço."],
    [1, "Muito, muito fácil", "Mal se nota."],
    [2, "Fácil", "Conversas sem esforço."],
    [3, "Moderado", "Respiração um pouco mais rápida."],
    [4, "Algo difícil", "Ainda dá para falar frases."],
    [5, "Difícil", "Frases curtas. Começa a custar."],
    [6, "Difícil +", "Exigente, mas controlado."],
    [7, "Muito difícil", "Só algumas palavras."],
    [8, "Muito difícil +", "Perto do limite; poucas repetições na reserva."],
    [9, "Quase máximo", "Aguentava muito pouco mais."],
    [10, "Máximo", "Não dava para fazer mais nada."]
  ];

  // ======================================================================
  // Estado
  // ======================================================================
  const est = {
    utilizador: null,
    perfil: null,
    exercicios: [],
    exPorId: {},
    sessoes: [],
    atletas: [],          // só treinador
    recuperacao: false,   // a definir nova palavra-passe
    filtros: { texto: "", categoria: null, disciplina: null, material: null },
    rascunho: null,       // formulário de treino em edição
    rascunhoRota: "",     // rota a que o rascunho pertence
    modeloPendente: null, // sessão-modelo a aplicar ao abrir "novo treino"
    duplicarDe: null,     // treino a copiar ao abrir "novo treino"
    treinoAtual: null,    // último treino aberto (para duplicar)
    sessoesNaBD: new Set(),
    nivel: "basico",      // nível escolhido no planeamento
    plano: null           // formulário "atribuir fase"
  };
  try { est.nivel = localStorage.getItem("nivelPlaneamento") || "basico"; } catch (_) { /* sem armazenamento */ }

  // ======================================================================
  // Utilitários
  // ======================================================================
  const $ = (id) => document.getElementById(id);
  const app = () => $("app");
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function isoLocal(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${dia}`;
  }
  const hoje = () => isoLocal(new Date());
  function somarDias(iso, n) {
    const [a, m, d] = iso.split("-").map(Number);
    return isoLocal(new Date(a, m - 1, d + n));
  }
  // Segunda-feira da semana de uma data (AAAA-MM-DD).
  function segundaDe(iso) {
    const [a, m, d] = iso.split("-").map(Number);
    return somarDias(iso, -((new Date(a, m - 1, d).getDay() + 6) % 7));
  }
  const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  function dataBonita(iso, longa) {
    const [a, m, d] = iso.split("-").map(Number);
    const dt = new Date(a, m - 1, d);
    const opts = longa
      ? { weekday: "long", day: "numeric", month: "long" }
      : { weekday: "short", day: "numeric", month: "short" };
    let txt = dt.toLocaleDateString("pt-PT", opts);
    if (iso === hoje()) txt = "Hoje · " + txt;
    else if (iso === somarDias(hoje(), 1)) txt = "Amanhã · " + txt;
    return txt;
  }

  function corRpe(n) {
    if (n <= 3) return "var(--rpe-1)";
    if (n <= 6) return "var(--rpe-2)";
    if (n <= 8) return "var(--rpe-3)";
    return "var(--rpe-4)";
  }
  // Texto escuro ou claro por cima da cor da escala (contraste).
  const tintaRpe = (n) => (n >= 9 ? "#fff" : "#0B1410");

  // Ícones (traço) para o menu e botões.
  const ICONES = {
    treinos: '<path d="M4 7h16M4 7v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7M4 7l1-3h14l1 3M9 12h6M9 16h4"/>',
    atletas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M15.5 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/>',
    candidaturas: '<path d="M3 13l2.5-8h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>',
    biblioteca: '<path d="M4 4.5h5a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4zM20 4.5h-5a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H20z"/>',
    feedback: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    coment: '<path d="M5 5h14v10H10l-5 4z"/>',
    escala: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/><path d="M4 18h2M18 18h2M12 10V8"/>'
  };
  const icone = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONES[n] || ""}</svg>`;
  const LOGO = '<svg class="logo-marca" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18"/><path d="M7 25c5-4 9 4 13 0s8 4 13 0"/></svg>';
  const carga = (t) => (t.estado === "feito" && t.rpe != null && t.duracao_real ? t.rpe * t.duracao_real : 0);

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.hidden = true), 2600);
  }

  function erro(e) {
    console.error(e);
    const msg = (e && (e.message || e.error_description)) || "Algo correu mal.";
    toast(traduzirErro(msg));
  }

  function traduzirErro(msg) {
    const m = msg.toLowerCase();
    if (m.includes("invalid login")) return "Email ou palavra-passe errados.";
    if (m.includes("email not confirmed")) return "Ainda não confirmaste o email. Vê a tua caixa de correio.";
    if (m.includes("already registered")) return "Já existe uma conta com este email. Usa \"Entrar\".";
    if (m.includes("different from the old")) return "A nova palavra-passe tem de ser diferente da anterior.";
    if (m.includes("password should be")) return "A palavra-passe tem de ter pelo menos 6 caracteres.";
    if (m.includes("rate limit")) return "Demasiadas tentativas. Espera uns minutos e tenta outra vez.";
    if (m.includes("failed to fetch")) return "Sem ligação. Verifica a internet.";
    return msg;
  }

  // Mostra um erro a ocupar a página, com botão para tentar outra vez (ex.: sem rede ao arrancar).
  function ecraErro(e, acao) {
    console.error(e);
    const msg = traduzirErro((e && (e.message || e.error_description)) || "Algo correu mal.");
    app().innerHTML = `
      <section class="auth">
        <h1>Não foi possível carregar</h1>
        <p>${esc(msg)}</p>
        <button type="button" class="btn primario" data-tentar="${acao}">Tentar outra vez</button>
      </section>`;
  }

  // "4 × 10/perna" → "3 × 10/perna" (semana de descarga: uma série a menos, mínimo 1).
  function menosUmaSerie(dose) {
    return String(dose || "").replace(/^(\d+)(\s*[×x])/, (m, n, resto) => `${Math.max(1, Number(n) - 1)}${resto}`);
  }

  // Inteiro entre min e max (para o campo de semanas).
  const limitar = (v, min, max) => Math.min(max, Math.max(min, Math.round(Number(v)) || min));

  function tagsDisciplinas(lista) {
    return (lista || []).map((d) => `<span class="tag d-${d}">${DISCIPLINAS[d] || d}</span>`).join("");
  }
  const pillEstado = (e, data) =>
    e === "planeado" && data && data < hoje()
      ? `<span class="pill e-pendente">Por registar</span>`
      : `<span class="pill e-${e}">${ESTADOS[e] || e}</span>`;

  // ======================================================================
  // Dados
  // ======================================================================
  async function carregarPerfil() {
    const { data, error } = await sb.from("perfis").select("*").eq("id", est.utilizador.id).maybeSingle();
    if (error) throw error;
    est.perfil = data;
  }

  async function carregarBiblioteca() {
    const [ex, se] = await Promise.all([
      sb.from("exercicios").select("*").order("nome"),
      sb.from("sessoes").select("*").order("nome")
    ]);
    if (ex.error) throw ex.error;
    if (se.error) throw se.error;

    // A biblioteca base vem dos ficheiros do site (../treino-fisico/dados.js e exercicios-extra.js).
    // O que estiver na base de dados com o mesmo id substitui-a (ex.: um vídeo teu).
    const base = (window.EXERCICIOS_BASE || []).map((e) => ({
      id: e.id, nome: e.nome, nome_en: e.nomeEn || "", categoria: e.categoria, material: e.material,
      disciplinas: e.disciplinas, musculos: e.musculos, execucao: e.execucao, erros: e.erros,
      regressao: e.regressao, progressao: e.progressao, dose: e.dose, video: e.video || ""
    }));
    const porId = new Map(base.map((e) => [e.id, e]));
    ex.data.forEach((e) => porId.set(e.id, e));
    est.exercicios = [...porId.values()].sort((x, y) => x.nome.localeCompare(y.nome, "pt"));
    est.exPorId = Object.fromEntries(est.exercicios.map((e) => [e.id, e]));

    const sesPorId = new Map((window.SESSOES_BASE || []).map((s) => [s.id, s]));
    se.data.forEach((s) => sesPorId.set(s.id, s));
    est.sessoesNaBD = new Set(se.data.map((s) => s.id));
    // Sessões completas primeiro (pela ordem definida), depois as restantes por nome.
    const todas = [...sesPorId.values()];
    est.sessoes = [
      ...todas.filter((s) => s.completa),
      ...todas.filter((s) => s.casa).sort((x, y) => x.ordem - y.ordem),
      ...todas.filter((s) => !s.completa && !s.casa).sort((x, y) => x.nome.localeCompare(y.nome, "pt"))
    ];
  }

  async function carregarAtletas() {
    const { data, error } = await sb.from("perfis").select("*").neq("id", est.utilizador.id).order("nome");
    if (error) throw error;
    est.atletas = data;
  }

  const eTreinador = () => est.perfil && est.perfil.papel === "treinador";

  // ======================================================================
  // Autenticação
  // ======================================================================
  function vistaEntrar(modo) {
    modo = modo || "entrar";
    $("menu").hidden = true;
    $("conta").hidden = true;
    const titulos = { entrar: "Entrar", registar: "Criar conta", recuperar: "Recuperar palavra-passe", nova: "Nova palavra-passe" };
    const campos = {
      entrar: `
        <label class="campo"><span>Email</span><input id="aEmail" type="email" autocomplete="email" required /></label>
        <label class="campo"><span>Palavra-passe</span><input id="aPass" type="password" autocomplete="current-password" required /></label>`,
      registar: `
        <label class="campo"><span>Nome</span><input id="aNome" type="text" autocomplete="name" required /></label>
        <label class="campo"><span>Email</span><input id="aEmail" type="email" autocomplete="email" required /></label>
        <label class="campo"><span>Palavra-passe</span><input id="aPass" type="password" autocomplete="new-password" minlength="6" required /></label>`,
      recuperar: `
        <label class="campo"><span>Email</span><input id="aEmail" type="email" autocomplete="email" required /></label>`,
      nova: `
        <label class="campo"><span>Nova palavra-passe</span><input id="aPass" type="password" autocomplete="new-password" minlength="6" required /></label>`
    };
    const botoes = { entrar: "Entrar", registar: "Criar conta", recuperar: "Enviar email", nova: "Guardar" };
    const links = {
      entrar: `<button type="button" class="link" data-modo="registar">Ainda não tenho conta</button>
               <button type="button" class="link" data-modo="recuperar">Esqueci-me da palavra-passe</button>`,
      registar: `<button type="button" class="link" data-modo="entrar">Já tenho conta</button>`,
      recuperar: `<button type="button" class="link" data-modo="entrar">Voltar a entrar</button>`,
      nova: ""
    };
    const ajuda = {
      entrar: "Entra com a conta que criaste. Se és atleta novo, cria conta e o treinador aprova-te.",
      registar: "Depois de criares conta, o treinador tem de te aprovar para veres os teus treinos.",
      recuperar: "Enviamos-te um email com um link para definires uma nova palavra-passe.",
      nova: "Escolhe uma nova palavra-passe com pelo menos 6 caracteres."
    };

    app().innerHTML = `
      <section class="entrar">
        <div class="entrar-hero">
          ${LOGO}
          <p class="sobre">Área de atleta</p>
          <p class="entrar-frase">O teu treino de força, técnica e mobilidade — num só sítio.</p>
        </div>
        <div class="auth">
          <h1>${titulos[modo]}</h1>
          <p class="muted">${ajuda[modo]}</p>
          <form id="fAuth" class="form" data-modo="${modo}" novalidate>
            ${campos[modo]}
            <button class="btn primario grande" type="submit">${botoes[modo]}</button>
          </form>
          ${links[modo] ? `<div class="auth-links">${links[modo]}</div>` : ""}
        </div>
      </section>`;
    const primeiro = app().querySelector("input");
    if (primeiro) primeiro.focus();
  }

  async function submeterAuth(form) {
    const modo = form.dataset.modo;
    const email = $("aEmail") ? $("aEmail").value.trim() : "";
    const pass = $("aPass") ? $("aPass").value : "";
    const btn = form.querySelector("button[type=submit]");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    btn.disabled = true;
    try {
      if (modo === "entrar") {
        const { error } = await sb.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else if (modo === "registar") {
        const nome = $("aNome").value.trim();
        if (!nome) { toast("Escreve o teu nome."); return; }
        const { data, error } = await sb.auth.signUp({
          email,
          password: pass,
          options: { data: { nome }, emailRedirectTo: location.origin + location.pathname }
        });
        if (error) throw error;
        if (!data.session) {
          app().innerHTML = `
            <section class="auth">
              <h1>Confirma o teu email</h1>
              <p>Enviámos um email para <strong>${esc(email)}</strong>. Abre o link para ativares a conta e depois entra aqui.</p>
              <button type="button" class="btn" data-modo="entrar">Voltar a entrar</button>
            </section>`;
        }
      } else if (modo === "recuperar") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        toast("Email enviado. Vê a tua caixa de correio.");
        vistaEntrar("entrar");
      } else if (modo === "nova") {
        const { error } = await sb.auth.updateUser({ password: pass });
        if (error) throw error;
        est.recuperacao = false;
        toast("Palavra-passe alterada.");
        await iniciarSessao();
      }
    } catch (e) {
      erro(e);
    } finally {
      btn.disabled = false;
    }
  }

  async function iniciarSessao(verificar) {
    try {
      await carregarPerfil();
    } catch (e) {
      ecraErro(e, "sessao");
      return;
    }
    $("conta").hidden = false;
    $("contaNome").textContent = (est.perfil && est.perfil.nome) || est.utilizador.email;

    if (!est.perfil || (!est.perfil.aprovado && !eTreinador())) {
      $("menu").hidden = true;
      if (verificar) toast("A tua conta ainda está à espera de aprovação.");
      app().innerHTML = `
        <section class="auth">
          <h1>À espera de aprovação</h1>
          <p>A tua conta (<strong>${esc(est.utilizador.email)}</strong>) foi criada. Assim que o treinador te aprovar, vais ver aqui os teus treinos.</p>
          <button type="button" class="btn" id="btnRecarregar">Verificar outra vez</button>
        </section>`;
      return;
    }

    try {
      await carregarBiblioteca();
      if (eTreinador()) await carregarAtletas();
    } catch (e) {
      ecraErro(e, "sessao");
      return;
    }
    if (!eTreinador()) await contarFeedbackPorLer();
    desenharMenu();
    rota();
  }

  // ======================================================================
  // Menu e rotas
  // ======================================================================
  function desenharMenu() {
    const itens = eTreinador()
      ? [["atletas", "Atletas"], ["candidaturas", "Candidaturas"], ["biblioteca", "Biblioteca"], ["escala", "Escala RPE"]]
      : [["treinos", "Treinos"], ...(est.fbAtivo ? [["feedback", "Feedback"]] : []), ["escala", "Escala RPE"]];
    $("menu").innerHTML = itens.map(([h, t]) => `<a class="tab" href="#${h}" data-tab="${h}">${icone(h)}<span>${t}</span>${h === "feedback" ? `<b class="badge" id="badgeFeedback" ${est.fbPorLer ? "" : "hidden"}>${est.fbPorLer}<span class="sr"> por ler</span></b>` : ""}</a>`).join("");
    $("menu").hidden = false;
  }

  // Atleta: quantos feedbacks semanais estão por ler (e se a funcionalidade está ativa).
  async function contarFeedbackPorLer() {
    const { data, error } = await sb.from("feedbacks").select("id, lido_em");
    est.fbAtivo = !error;
    est.fbPorLer = error ? 0 : data.filter((f) => !f.lido_em).length;
    if (error && !faltaTabela(error)) console.warn(error);
  }
  function atualizarBadgeFeedback() {
    const b = $("badgeFeedback");
    if (!b) return;
    b.hidden = !est.fbPorLer;
    b.innerHTML = `${est.fbPorLer}<span class="sr"> por ler</span>`;
  }

  function marcarTab(tab) {
    document.querySelectorAll("#menu .tab").forEach((t) => {
      t.classList.toggle("ativo", t.dataset.tab === tab);
      if (t.dataset.tab === tab) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
  }

  let ultimaRota = "";
  async function rota() {
    if (!est.utilizador || est.recuperacao || !est.perfil) return;
    if (!est.perfil.aprovado && !eTreinador()) return;
    const inicial = eTreinador() ? "atletas" : "treinos";
    let h;
    try { h = decodeURIComponent(location.hash.slice(1)) || inicial; } catch (_) { h = inicial; }
    if (est.rascunhoRota !== h) est.rascunho = null;
    est.rascunhoRota = h;

    // O atleta só vê os seus treinos: sem biblioteca, planeamento nem sessões-modelo.
    if (!eTreinador() && (h === "biblioteca" || h.startsWith("m-") || h.startsWith("plano-"))) {
      location.replace("#treinos");
      return;
    }

    try {
      if (h === "biblioteca") { marcarTab("biblioteca"); vistaBiblioteca(); }
      else if (h === "escala") { marcarTab("escala"); vistaEscala(); }
      else if (!eTreinador() && h === "feedback" && est.fbAtivo) { marcarTab("feedback"); await vistaFeedbackAtleta(); }
      else if (h.startsWith("ex-") && !eTreinador()) {
        marcarTab("treinos");
        if (await exercicioNosMeusTreinos(h.slice(3))) vistaExercicio(h.slice(3));
        else app().innerHTML = `<section class="vista"><a class="voltar" href="#treinos">← Os meus treinos</a><p class="vazio-caixa">Exercício não disponível. Só podes ver os exercícios que fazem parte dos teus treinos.</p></section>`;
      }
      else if (h.startsWith("ex-")) { marcarTab("biblioteca"); vistaExercicio(h.slice(3)); }
      else if (h.startsWith("m-")) { marcarTab("biblioteca"); vistaModelo(h.slice(2)); }
      else if (h.startsWith("t-")) { marcarTab(eTreinador() ? "atletas" : "treinos"); await vistaTreino(h.slice(2)); }
      else if (eTreinador() && h === "candidaturas") { marcarTab("candidaturas"); await vistaCandidaturas(); }
      else if (eTreinador() && h.startsWith("a-")) { marcarTab("atletas"); await vistaAtleta(h.slice(2)); }
      else if (eTreinador() && (h === "novo" || h.startsWith("novo-"))) { marcarTab("atletas"); vistaFormTreino({ atletaId: h.slice(5) || null }); }
      else if (eTreinador() && h.startsWith("plano-")) { marcarTab("biblioteca"); vistaPlano(h.slice(6)); }
      else if (eTreinador() && h.startsWith("editar-")) { marcarTab("atletas"); await vistaFormTreino({ treinoId: h.slice(7) }); }
      else if (eTreinador()) { marcarTab("atletas"); await vistaAtletas(); }
      else { marcarTab("treinos"); await vistaMeusTreinos(); }
    } catch (e) {
      ecraErro(e, "rota");
    }
    if (h !== ultimaRota) window.scrollTo(0, 0);
    ultimaRota = h;
    // "Registar" no cartão de hoje: abre o treino já no formulário de registo.
    if (est.irParaRegisto && $("fRegisto")) $("fRegisto").scrollIntoView({ block: "start" });
    est.irParaRegisto = false;
  }

  // O atleta só abre exercícios que estão nos seus treinos (a RLS já limita os treinos a si).
  async function exercicioNosMeusTreinos(id) {
    const { data, error } = await sb.from("treinos").select("blocos");
    if (error) throw error;
    return data.some((t) => (t.blocos || []).some((b) => (b.itens || []).some((i) => i.ex === id)));
  }

  // Tabelas do 05-feedback-comentarios.sql ainda não criadas?
  const faltaTabela = (e) => /feedbacks|comentarios|schema cache|does not exist|relation/i.test((e && e.message) || "");
  const AVISO_ATIVAR = `<div class="vazio-caixa aviso-ativar"><p><strong>Falta ativar:</strong> corre <code>plataforma/sql/05-feedback-comentarios.sql</code> no Supabase (SQL Editor → Run) e atualiza a página.</p></div>`;

  function tempoRelativo(iso) {
    const dt = new Date(iso);
    const seg = Math.round((Date.now() - dt.getTime()) / 1000);
    if (seg < 60) return "agora mesmo";
    if (seg < 3600) return `há ${Math.floor(seg / 60)} min`;
    if (seg < 86400) return `há ${Math.floor(seg / 3600)} h`;
    const dias = Math.floor(seg / 86400);
    if (dias === 1) return "ontem";
    if (dias < 7) return `há ${dias} dias`;
    return dt.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
  }
  const dm = (iso) => `${iso.slice(8)}/${iso.slice(5, 7)}`;
  const rotuloSemana = (seg) => `Semana de ${dm(seg)} a ${dm(somarDias(seg, 6))}`;

  // Treinador: comentários dos últimos 7 dias, por treino (para mostrar um contador nas linhas).
  async function carregarComentRecentes() {
    est.comentRecentes = {};
    est.comentPorAutor = {};
    const desde = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data, error } = await sb.from("comentarios").select("treino_id, autor_id, criado_em").gte("criado_em", desde);
    if (error) { if (!faltaTabela(error)) console.warn(error); return; }
    data.filter((c) => c.autor_id !== est.utilizador.id).forEach((c) => {
      est.comentRecentes[c.treino_id] = (est.comentRecentes[c.treino_id] || 0) + 1;
      est.comentPorAutor[c.autor_id] = (est.comentPorAutor[c.autor_id] || 0) + 1;
    });
  }
  const badgeComent = (n, txt) => (n ? `<span class="badge-coment" title="${n} comentário${n === 1 ? "" : "s"} nos últimos 7 dias">${icone("coment")}${n}<span class="sr"> ${txt || "comentários recentes"}</span></span>` : "");

  // ======================================================================
  // Comentários num treino (atleta e treinador)
  // ======================================================================
  async function desenharComentarios(treinoId) {
    const zona = $("comentariosZona");
    if (!zona) return;
    const { data, error } = await sb.from("comentarios").select("*").eq("treino_id", treinoId).order("criado_em");
    if (error) {
      if (!faltaTabela(error)) console.warn(error);
      zona.innerHTML = eTreinador() ? `<h2 class="titulo-secao">Comentários</h2>${AVISO_ATIVAR}` : "";
      return;
    }
    const autor = (c) => {
      if (c.autor_id === est.utilizador.id) return "Tu";
      if (!eTreinador()) return "Treinador";
      const a = est.atletas.find((x) => x.id === c.autor_id);
      return a ? (a.nome || a.email) : "Atleta";
    };
    zona.innerHTML = `
      <section class="comentarios" aria-labelledby="tituloComent">
        <h2 class="titulo-secao" id="tituloComent">Comentários${data.length ? ` · ${data.length}` : ""}</h2>
        ${data.length ? `<ol class="lista-coment">${data.map((c) => `
          <li class="coment${c.autor_id === est.utilizador.id ? " meu" : ""}">
            <div class="coment-cab"><strong>${esc(autor(c))}</strong><time datetime="${esc(c.criado_em)}">${esc(tempoRelativo(c.criado_em))}</time></div>
            <p>${esc(c.texto)}</p>
            ${c.autor_id === est.utilizador.id ? `<button type="button" class="link apagar-coment" data-apagar-coment="${esc(c.id)}">Apagar</button>` : ""}
          </li>`).join("")}</ol>`
          : `<p class="muted coment-vazio">${eTreinador() ? "Ainda sem comentários. Escreve uma nota ao atleta sobre este treino." : "Ainda sem comentários. Tens uma dúvida sobre este treino? Pergunta aqui ao treinador."}</p>`}
        <form id="fComentario" class="form-coment" data-treino="${esc(treinoId)}" novalidate>
          <label class="sr" for="cTexto">Escrever comentário</label>
          <textarea id="cTexto" rows="2" maxlength="2000" placeholder="Escreve um comentário…"></textarea>
          <button class="btn primario" type="submit">Enviar</button>
        </form>
      </section>`;
  }

  async function enviarComentario(form) {
    const texto = $("cTexto").value.trim();
    if (!texto) return toast("Escreve o comentário.");
    if (texto.length > 2000) return toast("O comentário é demasiado longo (máx. 2000 caracteres).");
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    const { error } = await sb.from("comentarios").insert({ treino_id: form.dataset.treino, autor_id: est.utilizador.id, texto });
    btn.disabled = false;
    if (error) return erro(error);
    toast("Comentário enviado.");
    await desenharComentarios(form.dataset.treino);
  }

  async function apagarComentario(btn) {
    if (btn.dataset.confirmar !== "1") {
      btn.dataset.confirmar = "1";
      btn.textContent = "Carrega outra vez para apagar";
      setTimeout(() => { if (btn.isConnected) { btn.dataset.confirmar = ""; btn.textContent = "Apagar"; } }, 4000);
      return;
    }
    const treino = $("fComentario").dataset.treino;
    const { error } = await sb.from("comentarios").delete().eq("id", btn.dataset.apagarComent);
    if (error) return erro(error);
    toast("Comentário apagado.");
    await desenharComentarios(treino);
  }

  // ======================================================================
  // Feedback semanal
  // ======================================================================
  async function vistaFeedbackAtleta() {
    const { data, error } = await sb.from("feedbacks").select("*").order("semana", { ascending: false });
    if (error) throw error;
    est.fbPorLer = data.filter((f) => !f.lido_em).length;
    atualizarBadgeFeedback();
    app().innerHTML = `
      <section class="vista">
        <h1>Feedback</h1>
        <p class="muted">O resumo semanal do teu treinador. ${est.fbPorLer ? `<strong>${est.fbPorLer} por ler.</strong>` : ""}</p>
        ${data.length ? `<div class="lista-fb">${data.map((f, i) => `
          <details class="fb${f.lido_em ? "" : " por-ler"}" data-fb="${esc(f.id)}">
            <summary>
              <span class="fb-cab">
                <span class="sobre">${esc(rotuloSemana(f.semana))}</span>
                ${f.lido_em ? "" : `<span class="chip-estado c-novo">Novo</span>`}
                ${f.resposta ? `<span class="chip-estado c-ok">Respondido</span>` : ""}
              </span>
              <span class="fb-preview">${esc(String(f.texto).split("\n").find((l) => l.trim() && !/^Resumo da semana/.test(l)) || f.texto)}</span>
            </summary>
            <div class="fb-corpo">
              <p class="fb-texto">${esc(f.texto)}</p>
              <form class="form-resposta" data-responder="${esc(f.id)}" novalidate>
                <label class="campo"><span>${f.resposta ? "A tua resposta" : "Responder ao treinador"}</span>
                  <textarea id="fbResp-${esc(f.id)}" rows="3" maxlength="2000" placeholder="Como te sentiste, dúvidas, o que queres ajustar…">${esc(f.resposta || "")}</textarea>
                </label>
                <div class="acoes-linha">
                  <button class="btn primario" type="submit">${f.resposta ? "Atualizar resposta" : "Enviar resposta"}</button>
                  ${f.resposta_em ? `<span class="muted pequeno-txt">Respondeste ${esc(tempoRelativo(f.resposta_em))}</span>` : ""}
                </div>
              </form>
            </div>
          </details>`).join("")}</div>`
        : `<div class="vazio-caixa"><p><strong>Ainda sem feedback.</strong></p><p>No fim de cada semana o treinador deixa-te aqui um resumo.</p></div>`}
      </section>`;
  }

  async function marcarFeedbackLido(det) {
    if (!det.classList.contains("por-ler")) return;
    det.classList.remove("por-ler");
    const novo = det.querySelector(".c-novo");
    if (novo) novo.remove();
    const { error } = await sb.rpc("marcar_feedback_lido", { p_id: det.dataset.fb });
    if (error) return erro(error);
    est.fbPorLer = Math.max(0, (est.fbPorLer || 0) - 1);
    atualizarBadgeFeedback();
  }

  async function responderFeedback(form) {
    const id = form.dataset.responder;
    const txt = $("fbResp-" + id).value.trim();
    if (!txt) return toast("Escreve a resposta.");
    if (txt.length > 2000) return toast("A resposta é demasiado longa (máx. 2000 caracteres).");
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    const { error } = await sb.rpc("responder_feedback", { p_id: id, p_resposta: txt });
    btn.disabled = false;
    if (error) return erro(error);
    toast("Resposta enviada ao treinador.");
    await vistaFeedbackAtleta();
    const det = document.querySelector(`.fb[data-fb="${CSS.escape(id)}"]`);
    if (det) det.open = true;
  }

  // Treinador: lista de feedbacks de um atleta (na página do atleta).
  async function desenharFeedbacksAtleta(atletaId) {
    const zona = $("fbZona");
    if (!zona) return;
    const { data, error } = await sb.from("feedbacks").select("*").eq("atleta_id", atletaId).order("semana", { ascending: false });
    est.feedbacksAtleta = error ? null : data;
    if (error) {
      if (!faltaTabela(error)) console.warn(error);
      zona.innerHTML = `<h2 class="titulo-secao">Feedback enviado</h2>${AVISO_ATIVAR}`;
      return;
    }
    zona.innerHTML = `
      <h2 class="titulo-secao">Feedback enviado${data.length ? ` · ${data.length}` : ""}</h2>
      ${data.length ? `<div class="lista-fb">${data.map((f) => `
        <details class="fb">
          <summary>
            <span class="fb-cab">
              <span class="sobre">${esc(rotuloSemana(f.semana))}</span>
              ${f.lido_em ? `<span class="chip-estado c-ok">Lido</span>` : `<span class="chip-estado c-aviso">Por ler</span>`}
              ${f.resposta ? `<span class="chip-estado c-novo">Com resposta</span>` : ""}
            </span>
            <span class="fb-preview">Atualizado ${esc(tempoRelativo(f.atualizado_em || f.criado_em))}${f.resposta ? ` · “${esc(f.resposta.slice(0, 80))}${f.resposta.length > 80 ? "…" : ""}”` : ""}</span>
          </summary>
          <div class="fb-corpo">
            <p class="fb-texto">${esc(f.texto)}</p>
            ${f.resposta ? `<div class="fb-resposta"><span class="sobre">Resposta do atleta · ${esc(tempoRelativo(f.resposta_em))}</span><p>${esc(f.resposta)}</p></div>` : `<p class="muted pequeno-txt">Ainda sem resposta.</p>`}
            ${document.querySelector(`#rsSemana option[value="${f.semana}"]`) ? `<button type="button" class="btn pequeno" data-editar-feedback="${esc(f.id)}">Editar no resumo</button>` : ""}
          </div>
        </details>`).join("")}</div>`
      : `<p class="vazio-caixa">Ainda não enviaste feedback a este atleta. Gera o rascunho acima, revê e carrega em “Guardar como feedback”.</p>`}`;
    avisoFeedbackExistente();
  }

  function avisoFeedbackExistente() {
    const el = $("rsExiste");
    if (!el || !$("rsSemana")) return;
    const f = (est.feedbacksAtleta || []).find((x) => x.semana === $("rsSemana").value);
    el.hidden = !f;
    if (f) el.textContent = `Já existe feedback para esta semana (${f.lido_em ? "lido" : "por ler"}). Guardar substitui o texto.`;
  }

  async function guardarFeedback(btn, atletaId) {
    const texto = $("rsTexto").value.trim();
    const semana = $("rsSemana").value;
    if (!texto) return toast("O texto do feedback está vazio.");
    if (texto.length > 5000) return toast("O feedback é demasiado longo (máx. 5000 caracteres).");
    btn.disabled = true;
    const { error } = await sb.from("feedbacks")
      .upsert({ atleta_id: atletaId, semana, texto, atualizado_em: new Date().toISOString() }, { onConflict: "atleta_id,semana" });
    btn.disabled = false;
    if (error) return faltaTabela(error) ? toast("Falta ativar: corre plataforma/sql/05-feedback-comentarios.sql no Supabase.") : erro(error);
    toast("Feedback guardado. O atleta já o vê no separador Feedback.");
    await desenharFeedbacksAtleta(atletaId);
  }

  // ======================================================================
  // Blocos de uma sessão (usado no treino e nos modelos)
  // ======================================================================
  function htmlBlocos(blocos) {
    let n = 0;
    return (blocos || []).map((b, bi) => {
      // "1 · Mobilidade (8 min)" → número, nome e minutos
      const m = String(b.titulo || "").match(/^\s*(\d+)\s*·\s*(.*?)\s*(?:\((\d+)\s*min\))?\s*$/);
      const num = m ? m[1] : String(bi + 1);
      const nomeBloco = m ? m[2] : String(b.titulo || "").replace(/\s*\((\d+)\s*min\)\s*$/, "");
      const minM = m ? m[3] : (String(b.titulo || "").match(/\((\d+)\s*min\)/) || [])[1];
      const nItens = (b.itens || []).length;
      return `
      <section class="bloco">
        <header class="bloco-cab">
          <span class="bloco-n" aria-hidden="true">${esc(num)}</span>
          <h3>${esc(nomeBloco)}</h3>
          <span class="bloco-min">${minM ? `${esc(minM)} min` : `${nItens} ex.`}</span>
        </header>
        <ol class="passos">
          ${(b.itens || []).map((i) => {
            n += 1;
            const e = est.exPorId[i.ex];
            const nome = e ? `<a class="nome" href="#ex-${esc(e.id)}">${esc(e.nome)}</a>` : `<span class="nome">${esc(i.ex)}</span>`;
            const desc = e ? `<span class="desc">${esc(e.musculos)}</span>` : "";
            const nota = i.nota ? `<span class="desc nota-item">${esc(i.nota)}</span>` : "";
            const descanso = i.descanso && i.descanso !== "—" ? `<small class="descanso">desc. ${esc(i.descanso)}</small>` : "";
            const [dose, extra] = partirDose(i.dose);
            return `<li class="passo${e ? " com-link" : ""}"><span class="n">${n}</span><div class="passo-txt">${nome}${desc}${nota}</div><div class="dose"><span class="dose-v">${esc(dose)}</span>${extra ? `<small>${esc(extra)}</small>` : ""}${descanso}</div></li>`;
          }).join("")}
        </ol>
      </section>`;
    }).join("");
  }

  // "4 × 10/perna (pausa em baixo)" → ["4 × 10/perna", "pausa em baixo"]
  function partirDose(dose) {
    const m = String(dose || "").match(/^(.*?)\s*\((.+)\)\s*$/);
    return m ? [m[1], m[2]] : [String(dose || ""), ""];
  }

  // Estado "visual" de um treino (inclui "por registar" para os planeados que já passaram).
  const estadoVisual = (t) => (t.estado === "planeado" && t.data < hoje() ? "pendente" : t.estado);

  function linhaTreino(t, mostrarAtleta) {
    const atleta = mostrarAtleta ? est.atletas.find((a) => a.id === t.atleta_id) : null;
    const rpe = t.estado === "feito" && t.rpe != null
      ? `<span class="rpe-mini"><i style="background:${corRpe(t.rpe)}"></i>RPE ${t.rpe}</span>`
      : "";
    const cg = carga(t) ? `<span class="carga-mini">${carga(t)} UA</span>` : "";
    return `
      <a class="linha-treino" href="#t-${t.id}">
        <i class="lt-ponto p-${estadoVisual(t)}" aria-hidden="true"></i>
        <div class="lt-corpo">
          <strong>${esc(t.titulo)}</strong>
          <span class="data">${esc(dataBonita(t.data))}${atleta ? ` · ${esc(atleta.nome || atleta.email)}` : ""}</span>
        </div>
        <div class="lado">${eTreinador() && est.comentRecentes ? badgeComent(est.comentRecentes[t.id]) : ""}${pillEstado(t.estado, t.data)}${rpe}${cg}</div>
      </a>`;
  }

  // Faixa da semana (segunda a domingo) com o estado de cada dia.
  function faixaSemana(treinos) {
    const h = hoje();
    const seg = segundaDe(h);
    const nomes = { feito: "feito", nao_feito: "não feito", pendente: "por registar", planeado: "planeado" };
    return `
      <ol class="semana" aria-label="Esta semana">
        ${DIAS_SEMANA.map((nome, i) => {
          const d = somarDias(seg, i);
          const ts = treinos.filter((t) => t.data === d);
          const estados = ts.map(estadoVisual);
          const principal = ["pendente", "nao_feito", "planeado", "feito"].find((e) => estados.includes(e)) || "vazio";
          const rotulo = `${nome} ${Number(d.slice(8))}: ${ts.length ? ts.map((t) => nomes[estadoVisual(t)]).join(", ") : "sem treino"}`;
          const conteudo = `<span class="sd-nome">${nome}</span><span class="sd-num">${Number(d.slice(8))}</span><i class="sd-ponto p-${principal}"></i>`;
          const cls = `sd${d === h ? " sd-hoje" : ""}`;
          return `<li>${ts.length
            ? `<a class="${cls}" href="#t-${ts[0].id}" aria-label="${esc(rotulo)}">${conteudo}</a>`
            : `<span class="${cls}" aria-label="${esc(rotulo)}">${conteudo}</span>`}</li>`;
        }).join("")}
      </ol>`;
  }

  // ======================================================================
  // Atleta: os meus treinos
  // ======================================================================
  async function vistaMeusTreinos() {
    const desde = somarDias(hoje(), -28);
    const { data, error } = await sb.from("treinos").select("*").gte("data", desde).order("data");
    if (error) throw error;
    const h = hoje();
    const deHoje = data.filter((t) => t.data === h);
    const proximos = data.filter((t) => t.data > h);
    const anteriores = data.filter((t) => t.data < h).reverse();
    const porRegistar = anteriores.filter((t) => t.estado === "planeado");
    const semana = data.filter((t) => t.data > somarDias(h, -7) && t.data <= h);
    const feitos = semana.filter((t) => t.estado === "feito").length;
    const cargaSemana = semana.reduce((s, t) => s + carga(t), 0);
    const dataHoje = new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });

    const cartaoHoje = (t) => {
      const feito = t.estado !== "planeado";
      return `
        <article class="cartao-hoje${feito ? " registado" : ""}">
          <p class="sobre">Hoje · ${esc(dataHoje)}</p>
          <h2>${esc(t.titulo)}</h2>
          <dl class="hoje-num">
            <div class="grande"><dt>Duração</dt><dd><b>${t.duracao_prevista || "–"}</b> min</dd></div>
            <div><dt>RPE alvo</dt><dd><b>${t.rpe_alvo ? esc(t.rpe_alvo) : "–"}</b></dd></div>
            <div><dt>Estado</dt><dd>${t.estado === "feito" && t.rpe != null ? `<span class="pill e-feito">Feito · RPE ${t.rpe}</span>` : pillEstado(t.estado)}</dd></div>
          </dl>
          ${t.notas_treinador ? `<p class="obj">${esc(t.notas_treinador)}</p>` : ""}
          <div class="hoje-acoes">
            <a class="btn primario grande" href="#t-${t.id}">Ver treino</a>
            <a class="btn grande secundario" href="#t-${t.id}" data-registar="1">${feito ? "Corrigir registo" : "Registar"}</a>
          </div>
        </article>`;
    };

    app().innerHTML = `
      <section class="vista">
        <div class="ola">
          <h1>Olá, ${esc((est.perfil.nome || "").split(" ")[0] || "atleta")}</h1>
          <p class="muted">Últimos 7 dias: <strong>${feitos}</strong> de ${semana.length} treinos feitos · carga <strong>${cargaSemana}</strong> UA</p>
        </div>

        ${faixaSemana(data)}
        <p class="semana-legenda" aria-hidden="true"><span><i class="sd-ponto p-feito"></i>Feito</span><span><i class="sd-ponto p-planeado"></i>Planeado</span><span><i class="sd-ponto p-pendente"></i>Por registar</span><span><i class="sd-ponto p-nao_feito"></i>Não feito</span></p>

        <h2 class="titulo-secao sr">Hoje</h2>
        ${deHoje.length
          ? `<div class="cartoes-hoje">${deHoje.map(cartaoHoje).join("")}</div>`
          : `<div class="cartao-hoje descanso">
              <p class="sobre">Hoje · ${esc(dataHoje)}</p>
              <h2>Dia sem treino físico</h2>
              <p class="obj">${proximos.length ? `Próximo: <strong>${esc(proximos[0].titulo)}</strong> · ${esc(dataBonita(proximos[0].data))}` : "Hoje não tens treino físico marcado."}</p>
              ${proximos.length ? `<div class="hoje-acoes"><a class="btn grande secundario" href="#t-${proximos[0].id}">Ver próximo treino</a></div>` : ""}
            </div>`}

        ${porRegistar.length ? `
          <div class="caixa-aviso">
            <p><strong>${porRegistar.length} treino${porRegistar.length === 1 ? "" : "s"} por registar.</strong> Regista o esforço para o treinador poder ajustar.</p>
            <div class="lista-treinos">${porRegistar.map((t) => linhaTreino(t)).join("")}</div>
          </div>` : ""}

        <h2 class="titulo-secao">Próximos</h2>
        ${proximos.length ? `<div class="lista-treinos">${proximos.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Sem treinos marcados.</p>`}

        <h2 class="titulo-secao">Últimas 4 semanas</h2>
        ${anteriores.length ? `<div class="lista-treinos compacta">${anteriores.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Ainda sem histórico.</p>`}
      </section>`;
  }

  // ======================================================================
  // Detalhe de um treino (atleta regista; treinador vê e edita)
  // ======================================================================
  async function vistaTreino(id) {
    const { data: t, error } = await sb.from("treinos").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    const voltar = eTreinador()
      ? (t ? `#a-${t.atleta_id}` : "#atletas")
      : "#treinos";
    if (!t) {
      app().innerHTML = `<a class="voltar" href="${voltar}">← Voltar</a><p class="vazio">Treino não encontrado.</p>`;
      return;
    }
    const atleta = eTreinador() ? est.atletas.find((a) => a.id === t.atleta_id) : null;
    est.treinoAtual = t;

    const factos = `
      <dl class="factos">
        <div><dt>Data</dt><dd>${esc(dataBonita(t.data, true))}</dd></div>
        <div><dt>Duração</dt><dd><b class="num">${t.duracao_prevista || "—"}</b>${t.duracao_prevista ? " min" : ""}</dd></div>
        <div><dt>RPE alvo</dt><dd><b class="num">${t.rpe_alvo ? esc(t.rpe_alvo) : "—"}</b>${t.rpe_alvo ? " / 10" : ""}</dd></div>
        <div><dt>Estado</dt><dd>${pillEstado(t.estado, t.data)}</dd></div>
      </dl>`;

    const resultado = t.estado === "planeado" ? "" : `
      <div class="resultado">
        <h3>Registo do atleta</h3>
        ${t.estado === "feito" ? `
          <div class="numeros">
            <div><span>RPE</span><b class="com-cor" style="--c:${corRpe(t.rpe ?? 0)}">${t.rpe ?? "—"}</b></div>
            <div><span>Minutos</span><b>${t.duracao_real ?? "—"}</b></div>
            <div><span>Carga (RPE × min)</span><b>${carga(t) || "—"}</b></div>
          </div>` : `<p>O atleta indicou que não fez este treino.</p>`}
        ${t.comentario_atleta ? `<p class="comentario">“${esc(t.comentario_atleta)}”</p>` : ""}
      </div>`;

    const acoesTreinador = eTreinador() ? `
      <div class="acoes">
        <a class="btn primario" href="#editar-${t.id}">Editar treino</a>
        <button class="btn" type="button" data-duplicar="1">Duplicar (outro dia ou atleta)</button>
        <a class="btn" href="#novo-${t.atleta_id}">Novo treino em branco</a>
      </div>` : "";

    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="${voltar}">← ${eTreinador() ? esc(atleta ? (atleta.nome || atleta.email) : "Atleta") : "Os meus treinos"}</a>
        <div class="det-cab">
          <p class="sobre">${t.data === hoje() ? "Treino de hoje" : "Treino"}${(t.blocos || []).length ? ` · ${(t.blocos || []).length} blocos` : ""}</p>
          <h2>${esc(t.titulo)}</h2>
          ${factos}
          ${acoesTreinador}
        </div>
        ${t.notas_treinador ? `<p class="nota">${esc(t.notas_treinador)}</p>` : ""}
        ${eTreinador() ? resultado : ""}
        ${htmlBlocos(t.blocos)}
        ${eTreinador() ? "" : t.data > somarDias(hoje(), 1)
          ? `<p class="vazio-caixa">Podes registar este treino a partir do dia ${esc(dataBonita(t.data))}.</p>`
          : formRegisto(t)}
        <div id="comentariosZona"></div>
      </section>`;
    await desenharComentarios(t.id);
  }

  function formRegisto(t) {
    const estado = t.estado === "planeado" ? "feito" : t.estado;
    const rpe = t.rpe ?? null;
    const dur = t.duracao_real ?? t.duracao_prevista ?? "";
    return `
      <form class="registo" id="fRegisto" data-id="${t.id}" novalidate>
        <h3>Como correu?</h3>
        <p class="muted">Regista 15–30 min depois de acabares. ${t.estado !== "planeado" ? "Já registaste este treino; podes corrigir." : ""}</p>
        <div class="seg" role="group" aria-label="Fizeste o treino?">
          <button type="button" class="seg-op" data-estado="feito" aria-pressed="${estado === "feito"}">Fiz o treino</button>
          <button type="button" class="seg-op" data-estado="nao_feito" aria-pressed="${estado === "nao_feito"}">Não consegui fazer</button>
        </div>
        <input type="hidden" id="rEstado" value="${estado}" />
        <div id="rCamposFeito" class="registo-campos" ${estado === "feito" ? "" : "hidden"}>
          <fieldset class="rpe-escolha">
            <legend>Esforço da sessão inteira (RPE 0–10)</legend>
            <div class="rpe-visor" id="rpeVisor" style="--c:${rpe != null ? corRpe(rpe) : "var(--line)"}">
              <b id="rpeNum" aria-hidden="true">${rpe ?? "–"}</b>
              <div>
                <strong id="rpeNome">${rpe != null ? esc(ESCALA_RPE[rpe][1]) : "Escolhe o esforço"}</strong>
                <span class="rpe-legenda" id="rpeLegenda">${rpe != null ? esc(ESCALA_RPE[rpe][2]) : "Toca num número de 0 a 10."}</span>
              </div>
            </div>
            <div class="rpe-botoes">
              ${ESCALA_RPE.map(([n, nome]) => `
                <button type="button" class="rpe-op" data-rpe="${n}" aria-pressed="${rpe === n}" style="--c:${corRpe(n)};--ct:${tintaRpe(n)}" aria-label="${n} — ${nome}">${n}</button>`).join("")}
            </div>
            <div class="rpe-extremos" aria-hidden="true"><span>Repouso</span><span>Máximo</span></div>
            <input type="hidden" id="rRpe" value="${rpe ?? ""}" />
          </fieldset>
          <div class="campo">
            <label for="rDur">Minutos que treinaste</label>
            <div class="stepper">
              <button type="button" class="btn passo-min" data-min="-5" aria-label="Menos 5 minutos">−5</button>
              <input id="rDur" type="number" inputmode="numeric" min="1" max="600" value="${esc(dur)}" />
              <button type="button" class="btn passo-min" data-min="5" aria-label="Mais 5 minutos">+5</button>
            </div>
          </div>
          <p class="carga-viva" id="rCarga" aria-live="polite">${textoCargaViva(rpe, dur)}</p>
        </div>
        <label class="campo"><span>Comentário para o treinador (opcional)</span><textarea id="rComentario" rows="3" placeholder="Dores, cargas usadas, como te sentiste…">${esc(t.comentario_atleta)}</textarea></label>
        <button class="btn primario grande" type="submit">Guardar registo</button>
      </form>`;
  }

  function textoCargaViva(rpe, dur) {
    const d = Number(dur);
    const ok = rpe != null && rpe !== "" && d > 0;
    return `<span>Carga = RPE × min</span><b>${ok ? `${rpe} × ${d} = <em>${Number(rpe) * d}</em> UA` : "—"}</b>`;
  }
  function atualizarCargaViva() {
    if (!$("rCarga")) return;
    const r = $("rRpe").value;
    $("rCarga").innerHTML = textoCargaViva(r === "" ? null : Number(r), $("rDur").value);
  }

  async function submeterRegisto(form) {
    const estado = $("rEstado").value;
    const rpe = $("rRpe").value === "" ? null : Number($("rRpe").value);
    const dur = $("rDur").value === "" ? null : Number($("rDur").value);
    if (estado === "feito" && (rpe == null || !dur)) {
      toast("Indica o RPE e os minutos.");
      return;
    }
    if (estado === "feito" && (!Number.isInteger(dur) || dur < 1 || dur > 600)) {
      toast("Os minutos têm de ser um número inteiro entre 1 e 600.");
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    const { error } = await sb.rpc("registar_treino", {
      p_id: form.dataset.id,
      p_estado: estado,
      p_rpe: rpe,
      p_duracao: dur,
      p_comentario: $("rComentario").value.trim()
    });
    btn.disabled = false;
    if (error) return erro(error);
    toast("Registo guardado. Bom trabalho!");
    location.hash = "#treinos";
  }

  // ======================================================================
  // Treinador: lista de atletas
  // ======================================================================
  async function vistaAtletas() {
    await carregarAtletas();
    await carregarComentRecentes();
    const h = hoje();
    const { data: treinos, error } = await sb.from("treinos")
      .select("id, atleta_id, data, titulo, estado, rpe, duracao_real")
      .gte("data", somarDias(h, -6)).lte("data", somarDias(h, 14));
    if (error) throw error;

    const pendentes = est.atletas.filter((a) => !a.aprovado && a.papel !== "treinador");
    const ativos = est.atletas.filter((a) => a.aprovado || a.papel === "treinador");

    const resumo = (a) => {
      const ts = treinos.filter((t) => t.atleta_id === a.id);
      const semana = ts.filter((t) => t.data <= h);
      const feitos = semana.filter((t) => t.estado === "feito");
      const proximos = ts.filter((t) => t.data > h).length;
      const cg = semana.reduce((s, t) => s + carga(t), 0);
      const porRegistar = semana.filter((t) => t.estado === "planeado" && t.data < h).length;
      const naoFeitos = semana.filter((t) => t.estado === "nao_feito").length;
      return { semana: semana.length, feitos: feitos.length, proximos, cg, porRegistar, naoFeitos };
    };
    const iniciais = (a) => String(a.nome || a.email || "?").trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
    const chipAtleta = (r) =>
      r.porRegistar ? `<span class="chip-estado c-aviso">${r.porRegistar} por registar</span>`
      : r.naoFeitos ? `<span class="chip-estado c-alerta">${r.naoFeitos} não feito${r.naoFeitos === 1 ? "" : "s"}</span>`
      : !r.semana && !r.proximos ? `<span class="chip-estado c-neutro">Sem treinos</span>`
      : `<span class="chip-estado c-ok">Em dia</span>`;

    app().innerHTML = `
      <section class="vista">
        <div class="cab-linha">
          <h1>Atletas</h1>
          <a class="btn primario" href="#novo">+ Atribuir treino</a>
        </div>

        ${pendentes.length ? `
          <div class="caixa-alerta">
            <h2 class="titulo-secao">À espera de aprovação</h2>
            ${pendentes.map((a) => `
              <div class="linha-pendente">
                <span class="avatar" aria-hidden="true">${esc(iniciais(a))}</span>
                <div><strong>${esc(a.nome || "(sem nome)")}</strong><span class="muted">${esc(a.email)}</span></div>
                <div class="acoes-linha">
                  <button class="btn primario pequeno" type="button" data-aprovar="${a.id}">Aprovar</button>
                  <button class="btn pequeno" type="button" data-recusar="${a.id}">Recusar</button>
                </div>
              </div>`).join("")}
          </div>` : ""}

        ${(() => {
          const deHoje = treinos.filter((t) => t.data === h);
          if (!deHoje.length) return "";
          const feitos = deHoje.filter((t) => t.estado !== "planeado").length;
          return `
            <div class="painel-hoje">
              <div class="painel-num"><b>${feitos}<small>/${deHoje.length}</small></b><span>treinos de hoje registados</span></div>
              <div class="lista-treinos">${deHoje.map((t) => linhaTreino(t, true)).join("")}</div>
            </div>`;
        })()}

        ${ativos.length ? `
          <h2 class="titulo-secao">Os teus atletas</h2>
          <p class="muted legenda-tabela">Últimos 7 dias · carga = soma de RPE × minutos (UA)</p>
          <div class="lista-atletas">
            ${ativos.map((a) => {
              const r = resumo(a);
              return `
                <a class="linha-atleta" href="#a-${a.id}">
                  <span class="avatar" aria-hidden="true">${esc(iniciais(a))}</span>
                  <div class="la-corpo">
                    <strong>${esc(a.nome || a.email)}</strong>
                    <span class="muted">${r.proximos} treino${r.proximos === 1 ? "" : "s"} nos próximos 14 dias</span>
                  </div>
                  <div class="numeros-mini">
                    <span><b>${r.feitos}/${r.semana}</b> feitos</span>
                    <span><b>${r.cg}</b> UA</span>
                  </div>
                  <span class="la-chips">${badgeComent(est.comentPorAutor[a.id], "comentários do atleta nos últimos 7 dias")}${chipAtleta(r)}</span>
                  <span class="seta" aria-hidden="true">›</span>
                </a>`;
            }).join("")}
          </div>` : `
          <div class="vazio-caixa">
            <p><strong>Ainda não tens atletas.</strong></p>
            <p>Envia-lhes o link deste site. Eles carregam em "Ainda não tenho conta", registam-se, e aparecem aqui para aprovares.</p>
          </div>`}
      </section>`;
  }

  async function aprovar(id, sim) {
    if (sim) {
      const { error } = await sb.from("perfis").update({ aprovado: true }).eq("id", id);
      if (error) return erro(error);
      toast("Atleta aprovado.");
    } else {
      const { error } = await sb.from("perfis").delete().eq("id", id);
      if (error) return erro(error);
      toast("Pedido recusado.");
    }
    rota();
  }

  // ======================================================================
  // Treinador: página de um atleta
  // ======================================================================
  async function vistaAtleta(id) {
    const a = est.atletas.find((x) => x.id === id);
    if (!a) {
      app().innerHTML = `<a class="voltar" href="#atletas">← Atletas</a><p class="vazio">Atleta não encontrado.</p>`;
      return;
    }
    const h = hoje();
    const { data, error } = await sb.from("treinos").select("*").eq("atleta_id", id)
      .gte("data", somarDias(h, -56)).order("data");
    if (error) throw error;

    // Carga por semana (segunda a domingo), últimas 8 semanas.
    const segunda = segundaDe;
    const semanas = [];
    for (let i = 7; i >= 0; i--) semanas.push(somarDias(segunda(h), -7 * i));
    const cargaSem = semanas.map((s) => data.filter((t) => segunda(t.data) === s).reduce((acc, t) => acc + carga(t), 0));
    const max = Math.max(1, ...cargaSem);

    est.treinosAtleta = { id, data };
    await carregarComentRecentes();
    const comentAtleta = est.comentPorAutor[id] || 0;
    const proximos = data.filter((t) => t.data >= h);
    const anteriores = data.filter((t) => t.data < h).reverse();

    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="#atletas">← Atletas</a>
        <div class="cab-linha">
          <div>
            <h1>${esc(a.nome || a.email)}</h1>
            <p class="muted">${esc(a.email)}${comentAtleta ? ` · ${badgeComent(comentAtleta, "comentários do atleta nos últimos 7 dias")} <span class="pequeno-txt">comentário${comentAtleta === 1 ? "" : "s"} esta semana</span>` : ""}</p>
          </div>
          <div class="acoes-linha">
            ${a.aprovado || a.papel === "treinador"
              ? `<a class="btn primario" href="#novo-${a.id}">+ Atribuir treino</a>`
              : `<span class="pill e-pendente">À espera de aprovação</span>`}
            <button class="btn" type="button" data-copiar-semana="${a.id}">Copiar esta semana para a próxima</button>
          </div>
        </div>

        <div class="grafico cartao">
          <div class="grafico-cab">
            <h2 class="titulo-secao">Carga semanal (RPE × min)</h2>
            <p class="grafico-num"><b>${cargaSem[7]}</b> UA <span class="muted">esta semana</span></p>
          </div>
          <div class="barras" role="img" aria-label="Carga semanal das últimas 8 semanas">
            ${cargaSem.map((v, i) => `
              <div class="barra-col">
                <span class="barra-val">${v || ""}</span>
                <div class="barra" style="height:${Math.round((v / max) * 82)}%" ${i === 7 ? 'data-atual="1"' : ""}></div>
                <span class="barra-lab">${semanas[i].slice(8)}/${semanas[i].slice(5, 7)}</span>
              </div>`).join("")}
          </div>
          <p class="muted pequeno-txt">Cada barra é uma semana, a começar à segunda-feira. A última é a semana atual.</p>
        </div>

        <div class="resumo-semana cartao">
          <h2 class="titulo-secao">Resumo da semana</h2>
          <div class="acoes-linha">
            <select id="rsSemana" aria-label="Semana">
              ${[0, 1, 2, 3].map((k) => {
                const seg = somarDias(segundaDe(h), -7 * k);
                return `<option value="${seg}">${k === 0 ? "Esta semana" : k === 1 ? "Semana passada" : "Semana de " + dataBonita(seg)} (${seg.slice(8)}/${seg.slice(5, 7)})</option>`;
              }).join("")}
            </select>
            <button type="button" class="btn primario pequeno" data-resumo="${a.id}">Gerar rascunho</button>
          </div>
          <p class="aviso pequeno-txt" id="rsExiste" hidden></p>
          <div id="rsSaida" hidden>
            <textarea id="rsTexto" rows="9" maxlength="5000" aria-label="Resumo da semana"></textarea>
            <div class="acoes-linha">
              <button type="button" class="btn primario pequeno" data-guardar-feedback="${a.id}">Guardar como feedback</button>
              <button type="button" class="btn pequeno" data-copiar-resumo="1">Copiar texto</button>
              <span class="muted pequeno-txt">Revê e junta o que vês no TrainingPeaks (natação, bicicleta, corrida) antes de enviar.</span>
            </div>
          </div>
        </div>

        <div id="fbZona"></div>

        <h2 class="titulo-secao">Próximos</h2>
        ${proximos.length ? `<div class="lista-treinos">${proximos.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Sem treinos marcados.</p>`}

        <h2 class="titulo-secao">Anteriores (8 semanas)</h2>
        ${anteriores.length ? `<div class="lista-treinos">${anteriores.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Sem histórico.</p>`}
      </section>`;
    await desenharFeedbacksAtleta(id);
  }

  // ======================================================================
  // Treinador: formulário para atribuir / editar treino
  // ======================================================================
  async function vistaFormTreino({ atletaId, treinoId }) {
    const ativos = est.atletas.filter((a) => a.aprovado);
    if (!est.rascunho) {
      if (treinoId) {
        const { data: t, error } = await sb.from("treinos").select("*").eq("id", treinoId).maybeSingle();
        if (error) throw error;
        if (!t) {
          app().innerHTML = `<a class="voltar" href="#atletas">← Atletas</a><p class="vazio">Treino não encontrado.</p>`;
          return;
        }
        est.rascunho = {
          id: t.id, atletas: [t.atleta_id], data: t.data, sessao_id: t.sessao_id || "",
          titulo: t.titulo, duracao_prevista: t.duracao_prevista || "", rpe_alvo: t.rpe_alvo,
          notas_treinador: t.notas_treinador, blocos: structuredClone(t.blocos || [])
        };
      } else {
        est.rascunho = {
          id: null, atletas: atletaId ? [atletaId] : [], data: somarDias(hoje(), 1), sessao_id: "",
          titulo: "", duracao_prevista: "", rpe_alvo: "", notas_treinador: "",
          blocos: ["1 · Mobilidade", "2 · Técnica de corrida", "3 · Pliometria", "4 · Força inferior — agachamento e peso morto", "5 · Força superior e core"]
            .map((titulo) => ({ titulo, itens: [] })),
          dias: [], semanas: 1
        };
        const d = est.duplicarDe;
        if (d) {
          Object.assign(est.rascunho, {
            atletas: [d.atleta_id], data: somarDias(d.data, 7), sessao_id: d.sessao_id || "",
            titulo: d.titulo, duracao_prevista: d.duracao_prevista || "", rpe_alvo: d.rpe_alvo,
            notas_treinador: d.notas_treinador, blocos: structuredClone(d.blocos || [])
          });
          est.duplicarDe = null;
        }
        if (est.modeloPendente) {
          aplicarModelo(est.modeloPendente);
          est.modeloPendente = null;
        }
      }
    }
    const r = est.rascunho;
    const voltar = r.id ? `#t-${r.id}` : (r.atletas.length === 1 ? `#a-${r.atletas[0]}` : "#atletas");
    const opcoesEx = (sel) =>
      `<option value="">Escolhe…</option>` +
      Object.entries(CATEGORIAS).map(([c, nome]) => `
        <optgroup label="${nome}">
          ${est.exercicios.filter((e) => e.categoria === c)
            .map((e) => `<option value="${esc(e.id)}" ${e.id === sel ? "selected" : ""}>${esc(e.nome)}</option>`).join("")}
        </optgroup>`).join("");

    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="${voltar}">← Cancelar</a>
        <h1>${r.id ? "Editar treino" : "Atribuir treino"}</h1>
        <form id="fTreino" class="form form-treino" novalidate>

          <fieldset class="grupo">
            <legend>Para quem</legend>
            ${r.id
              ? `<p><strong>${esc((ativos.find((a) => a.id === r.atletas[0]) || {}).nome || "Atleta")}</strong></p>`
              : ativos.length
                ? `<div class="checks">${ativos.map((a) => `
                    <label class="check"><input type="checkbox" name="atleta" value="${a.id}" ${r.atletas.includes(a.id) ? "checked" : ""} /> ${esc(a.nome || a.email)}</label>`).join("")}</div>
                   <div class="acoes-linha" style="margin-top:.5rem">
                     <button type="button" class="btn pequeno" data-acao="todos-atletas">Selecionar todos</button>
                     <button type="button" class="btn pequeno" data-acao="nenhum-atleta">Limpar</button>
                   </div>
                   <p class="muted pequeno-txt">Cada atleta recebe uma cópia que podes ajustar depois.</p>`
                : `<p class="muted">Ainda não tens atletas aprovados.</p>`}
          </fieldset>

          <fieldset class="grupo">
          <legend>Quando e o quê</legend>
          <div class="linha-campos">
            <label class="campo"><span>Data</span><input id="tData" type="date" value="${esc(r.data)}" required /></label>
            <label class="campo"><span>Partir de uma sessão-modelo</span>
              <select id="tModelo">
                <option value="">— Em branco —</option>
                ${[...(window.PLANEAMENTO ? window.PLANEAMENTO.niveis.map((n) => [`Planeamento · ${n.nome}`, (s) => s.nivel === n.id]) : []),
                   ["Em casa", (s) => s.casa],
                   ["Sessões curtas e blocos", (s) => !s.nivel && !s.casa]].map(([grupo, filtro]) => `
                  <optgroup label="${grupo}">
                    ${est.sessoes.filter(filtro)
                      .map((s) => `<option value="${esc(s.id)}" ${s.id === r.sessao_id ? "selected" : ""}>${esc(s.nivel ? `${s.fase} · Dia ${s.dia} (${s.foco})` : s.nome)} · ${s.duracao} min</option>`).join("")}
                  </optgroup>`).join("")}
              </select>
            </label>
          </div>
          </fieldset>

          ${r.id ? "" : `
          <fieldset class="grupo">
            <legend>Repetir (opcional)</legend>
            <div class="dias">
              ${DIAS_SEMANA.map((n, i) => `
                <label class="dia"><input type="checkbox" name="dia" value="${i}" ${r.dias.includes(i) ? "checked" : ""} /><span>${n}</span></label>`).join("")}
            </div>
            <label class="campo curto"><span>Durante quantas semanas</span>
              <input id="tSemanas" type="number" inputmode="numeric" min="1" max="16" value="${esc(r.semanas)}" />
            </label>
            <p class="muted pequeno-txt" id="resumoRepetir">${textoRepetir(r)}</p>
          </fieldset>`}

          <fieldset class="grupo">
          <legend>Detalhes</legend>
          <label class="campo"><span>Título</span><input id="tTitulo" type="text" value="${esc(r.titulo)}" placeholder="Ex.: Força base — semana 3" required /></label>
          <div class="linha-campos">
            <label class="campo"><span>Duração prevista (min)</span><input id="tDur" type="number" inputmode="numeric" min="0" max="600" value="${esc(r.duracao_prevista)}" /></label>
            <label class="campo"><span>RPE alvo</span><input id="tRpe" type="text" value="${esc(r.rpe_alvo)}" placeholder="Ex.: 6–7" /></label>
          </div>
          <label class="campo"><span>Notas para o atleta</span><textarea id="tNotas" rows="3" placeholder="Cargas, foco técnico, o que fazer se estiver cansado…">${esc(r.notas_treinador)}</textarea></label>
          </fieldset>

          <h2 class="titulo-secao">Exercícios</h2>
          <div id="blocosEdit">
            ${r.blocos.map((b, bi) => `
              <div class="bloco-edit" data-bi="${bi}">
                <div class="bloco-edit-cab">
                  <input class="b-titulo" type="text" value="${esc(b.titulo)}" aria-label="Nome do bloco" />
                  <button type="button" class="btn pequeno" data-acao="rem-bloco" data-bi="${bi}" title="Remover bloco">Remover bloco</button>
                </div>
                ${b.itens.map((it, ii) => `
                  <div class="item-edit" data-ii="${ii}">
                    <select class="i-ex" aria-label="Exercício" data-ex="${esc(it.ex)}">${opcoesEx(it.ex)}</select>
                    <input class="i-dose" type="text" value="${esc(it.dose)}" placeholder="3 × 8" aria-label="Séries × repetições" />
                    <input class="i-desc" type="text" value="${esc(it.descanso || "")}" placeholder="Descanso" aria-label="Descanso" />
                    <input class="i-nota" type="text" value="${esc(it.nota || "")}" placeholder="Nota (ex.: 12 kg)" aria-label="Nota" />
                    <button type="button" class="btn pequeno icone" data-acao="rem-item" data-bi="${bi}" data-ii="${ii}" aria-label="Remover exercício">✕</button>
                  </div>`).join("")}
                <button type="button" class="btn pequeno" data-acao="add-item" data-bi="${bi}">+ Exercício</button>
              </div>`).join("")}
          </div>
          <button type="button" class="btn" data-acao="add-bloco">+ Bloco</button>

          <div class="acoes-form">
            <button class="btn primario grande" type="submit">${r.id ? "Guardar alterações" : "Atribuir treino"}</button>
            ${r.id ? `<button class="btn perigo" type="button" data-acao="apagar" id="btnApagar">Apagar treino</button>` : ""}
          </div>
        </form>
      </section>`;
  }

  // Datas em que o treino vai ser criado (a partir da data escolhida).
  // N semanas × dias escolhidos, a contar a partir da data de início (se o início for a meio
  // da semana, os dias que já passaram são compensados na semana a seguir).
  function datasRepetir(r) {
    if (!r.data) return [];
    if (r.id || !r.dias.length) return [r.data];
    const semanas = limitar(r.semanas, 1, 16);
    const inicio = segundaDe(r.data);
    const datas = [];
    for (let w = 0; w <= semanas; w++) {
      [...r.dias].sort((a, b) => a - b).forEach((i) => {
        const dt = somarDias(inicio, w * 7 + i);
        if (dt >= r.data) datas.push(dt);
      });
    }
    return datas.slice(0, semanas * r.dias.length);
  }

  function textoRepetir(r) {
    const datas = datasRepetir(r);
    const n = Math.max(1, r.atletas.length);
    if (!r.data) return "Escolhe a data de início.";
    if (!r.dias.length) return "Sem repetição: só na data escolhida.";
    if (!datas.length) return "Nenhum dia a partir da data escolhida.";
    return `${datas.length} treino${datas.length === 1 ? "" : "s"} por atleta (de ${dataBonita(datas[0])} a ${dataBonita(datas[datas.length - 1])})` +
      (n > 1 ? ` · ${datas.length * n} no total.` : ".");
  }

  // Lê o formulário para o rascunho (antes de redesenhar ou guardar).
  function lerFormTreino() {
    const r = est.rascunho;
    if (!r || !$("fTreino")) return;
    if (!r.id) r.atletas = [...document.querySelectorAll('input[name="atleta"]:checked')].map((i) => i.value);
    r.data = $("tData").value;
    if (!r.id) {
      r.dias = [...document.querySelectorAll('input[name="dia"]:checked')].map((i) => Number(i.value));
      r.semanas = limitar($("tSemanas").value, 1, 16);
      $("tSemanas").value = r.semanas;
    }
    r.sessao_id = $("tModelo").value;
    r.titulo = $("tTitulo").value;
    r.duracao_prevista = $("tDur").value;
    r.rpe_alvo = $("tRpe").value;
    r.notas_treinador = $("tNotas").value;
    r.blocos = [...document.querySelectorAll(".bloco-edit")].map((be) => ({
      titulo: be.querySelector(".b-titulo").value,
      itens: [...be.querySelectorAll(".item-edit")].map((ie) => {
        const it = {
          ex: ie.querySelector(".i-ex").value,
          dose: ie.querySelector(".i-dose").value,
          descanso: ie.querySelector(".i-desc").value
        };
        const nota = ie.querySelector(".i-nota").value.trim();
        if (nota) it.nota = nota;
        return it;
      })
    }));
  }

  function aplicarModelo(id) {
    const s = est.sessoes.find((x) => x.id === id);
    const r = est.rascunho;
    if (!s) return;
    r.titulo = s.nome;
    r.duracao_prevista = s.duracao;
    r.rpe_alvo = s.rpe;
    const anterior = est.sessoes.find((x) => x.id === r.sessao_id);
    if (!r.notas_treinador || (anterior && r.notas_treinador === anterior.nota)) r.notas_treinador = s.nota || "";
    r.sessao_id = s.id;
    r.blocos = structuredClone(s.blocos);
  }

  async function guardarTreino() {
    lerFormTreino();
    const r = est.rascunho;
    if (!r.id && !r.atletas.length) return toast("Escolhe pelo menos um atleta.");
    if (!r.data) return toast("Escolhe a data.");
    if (!r.titulo.trim()) return toast("Dá um título ao treino.");
    const blocos = r.blocos
      .map((b) => ({ ...b, itens: b.itens.filter((i) => i.ex) }))
      .filter((b) => b.itens.length);
    if (!blocos.length) return toast("Junta pelo menos um exercício.");

    const datas = datasRepetir(r);
    if (!datas.length) return toast("Nenhum dia da repetição cai a partir da data escolhida.");
    if (datas.length * Math.max(1, r.atletas.length) > 300) return toast("Demasiados treinos de uma vez (máx. 300).");

    const base = {
      data: r.data,
      // Só as sessões guardadas na base de dados podem ser referenciadas (chave estrangeira).
      sessao_id: est.sessoesNaBD && est.sessoesNaBD.has(r.sessao_id) ? r.sessao_id : null,
      titulo: r.titulo.trim(),
      duracao_prevista: Number(r.duracao_prevista) || 0,
      rpe_alvo: r.rpe_alvo.trim(),
      notas_treinador: r.notas_treinador.trim(),
      blocos
    };
    const btn = document.querySelector('#fTreino button[type="submit"]');
    btn.disabled = true;
    let res;
    if (r.id) res = await sb.from("treinos").update(base).eq("id", r.id).select("id");
    else res = await sb.from("treinos")
      .insert(r.atletas.flatMap((a) => datas.map((dt) => ({ ...base, data: dt, atleta_id: a }))))
      .select("id");
    btn.disabled = false;
    if (res.error) return erro(res.error);

    const destino = r.id ? `#t-${r.id}` : (r.atletas.length === 1 ? `#a-${r.atletas[0]}` : "#atletas");
    const total = r.id ? 1 : res.data.length;
    toast(r.id ? "Treino atualizado." : `${total} treino${total === 1 ? "" : "s"} criado${total === 1 ? "" : "s"}.`);
    est.rascunho = null;
    location.hash = destino;
  }

  async function apagarTreino(btn) {
    if (btn.dataset.confirmar !== "1") {
      btn.dataset.confirmar = "1";
      btn.textContent = "Carrega outra vez para apagar";
      setTimeout(() => {
        if (btn.isConnected) { btn.dataset.confirmar = ""; btn.textContent = "Apagar treino"; }
      }, 4000);
      return;
    }
    const r = est.rascunho;
    const { error } = await sb.from("treinos").delete().eq("id", r.id);
    if (error) return erro(error);
    toast("Treino apagado.");
    const atleta = r.atletas[0];
    est.rascunho = null;
    location.hash = `#a-${atleta}`;
  }

  // ======================================================================
  // Planeamento por fases e níveis
  // ======================================================================
  function htmlPlaneamento() {
    const P = window.PLANEAMENTO;
    if (!P) return "";
    const nv = P.niveis.find((n) => n.id === est.nivel) || P.niveis[0];
    const ni = P.niveis.indexOf(nv);
    const porId = Object.fromEntries(est.sessoes.map((s) => [s.id, s]));
    return `
      <div id="planeamento">
        <div class="niveis" role="group" aria-label="Nível">
          ${P.niveis.map((n) => `<button type="button" class="chip-nivel" data-nivel="${n.id}" aria-pressed="${n.id === nv.id}">${n.nome}</button>`).join("")}
        </div>
        <p class="nivel-desc">${esc(nv.descricao)}</p>
        <ol class="fases">
          ${P.fases.map((f) => `
            <li class="fase">
              <div class="fase-cab">
                <h3>${esc(f.nome)}</h3>
                <span class="fase-sem">${esc(f.semanas)} · RPE ${esc(f.rpe[ni])}</span>
              </div>
              <p class="fase-obj">${esc(f.objetivo)}</p>
              ${f.nota ? `<p class="fase-nota">${esc(f.nota)}</p>` : ""}
              <div class="fase-dias">
                ${f.sessoes[nv.id].map((id) => {
                  const s = porId[id];
                  return s ? `<a class="dia-link" href="#m-${id}"><b>Dia ${s.dia}</b><span>${esc(s.foco)}</span><small>${s.duracao} min</small></a>` : "";
                }).join("")}
              </div>
              ${eTreinador() ? `<div class="fase-acoes"><a class="btn primario pequeno" href="#plano-${f.id}--${nv.id}">Atribuir esta fase (${nv.nome})</a></div>` : ""}
            </li>`).join("")}
        </ol>
      </div>`;
  }

  // Segunda-feira seguinte (ou hoje, se for segunda).
  function proximaSegunda() {
    const seg = segundaDe(hoje());
    return seg === hoje() ? seg : somarDias(seg, 7);
  }

  // Alterna Dia 1 / Dia 2 a partir da data de início, até completar N semanas (2 treinos cada).
  function datasPlano(p) {
    if (!p.inicio || Number(p.dia1) === Number(p.dia2)) return [];
    const semanas = limitar(p.semanas, 1, 16);
    const inicio = segundaDe(p.inicio);
    const dias = [Number(p.dia1), Number(p.dia2)].sort((a, b) => a - b);
    const datas = [];
    for (let w = 0; w <= semanas; w++) {
      dias.forEach((d) => {
        const data = somarDias(inicio, w * 7 + d);
        if (data >= p.inicio) datas.push({ data, dia: d === Number(p.dia1) ? 0 : 1 });
      });
    }
    return datas.slice(0, semanas * 2).map((x, k) => ({ ...x, semana: Math.floor(k / 2) + 1 }));
  }

  function textoPlano(p) {
    const datas = datasPlano(p);
    const nAtl = p.atletas.length;
    if (!nAtl) return "Escolhe pelo menos um atleta.";
    if (!p.inicio) return "Escolhe a data de início.";
    if (Number(p.dia1) === Number(p.dia2)) return "O Dia 1 e o Dia 2 têm de ser dias diferentes.";
    return `<strong>${datas.length * nAtl}</strong> treinos: ${datas.length} por atleta, de ${esc(dataBonita(datas[0].data))} a ${esc(dataBonita(datas[datas.length - 1].data))}.`;
  }

  // Atualiza só o resumo e o botão (não redesenha o formulário, para não perder o foco).
  function atualizarResumoPlano() {
    const p = est.plano;
    const ok = datasPlano(p).length && p.atletas.length;
    $("resumoPlano").innerHTML = textoPlano(p);
    document.querySelector('#fPlano button[type="submit"]').disabled = !ok;
  }

  function vistaPlano(chave) {
    const P = window.PLANEAMENTO;
    const [faseId, nivelId] = chave.split("--");
    const f = P && P.fases.find((x) => x.id === faseId);
    const nv = P && P.niveis.find((x) => x.id === nivelId);
    if (!f || !nv) {
      app().innerHTML = `<a class="voltar" href="#biblioteca">← Biblioteca</a><p class="vazio">Fase não encontrada.</p>`;
      return;
    }
    if (!est.plano || est.plano.chave !== chave) {
      est.plano = { chave, atletas: [], inicio: proximaSegunda(), dia1: 1, dia2: 4, semanas: f.semanasNum, descarga: true };
    }
    const p = est.plano;
    const ativos = est.atletas.filter((a) => a.aprovado);
    const datas = datasPlano(p);
    const nAtl = p.atletas.length;
    const sel = (id, v) => `<select id="${id}">${DIAS_SEMANA.map((d, i) => `<option value="${i}" ${Number(v) === i ? "selected" : ""}>${d}</option>`).join("")}</select>`;

    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="#biblioteca">← Biblioteca</a>
        <h1>Atribuir fase</h1>
        <p class="muted">${esc(f.nome)} · ${esc(nv.nome)} · ${esc(f.semanas)}</p>
        <form id="fPlano" class="form" novalidate>
          <fieldset class="grupo">
            <legend>Para quem</legend>
            ${ativos.length
              ? `<div class="checks">${ativos.map((a) => `
                  <label class="check"><input type="checkbox" name="pAtleta" value="${a.id}" ${p.atletas.includes(a.id) ? "checked" : ""} /> ${esc(a.nome || a.email)}</label>`).join("")}</div>
                 <div class="acoes-linha" style="margin-top:.5rem">
                   <button type="button" class="btn pequeno" data-plano-acao="todos">Selecionar todos</button>
                   <button type="button" class="btn pequeno" data-plano-acao="nenhum">Limpar</button>
                 </div>`
              : `<p class="muted">Ainda não tens atletas aprovados.</p>`}
          </fieldset>
          <fieldset class="grupo">
          <legend>Calendário</legend>
          <div class="linha-campos">
            <label class="campo"><span>Começa na semana de</span><input id="pInicio" type="date" value="${esc(p.inicio)}" /></label>
            <label class="campo"><span>Semanas</span><input id="pSemanas" type="number" inputmode="numeric" min="1" max="16" value="${esc(p.semanas)}" /></label>
          </div>
          <div class="linha-campos">
            <label class="campo"><span>Dia 1 (${esc(f.dias[0].foco)})</span>${sel("pDia1", p.dia1)}</label>
            <label class="campo"><span>Dia 2 (${esc(f.dias[1].foco)})</span>${sel("pDia2", p.dia2)}</label>
          </div>
          <label class="check"><input type="checkbox" id="pDescarga" ${p.descarga ? "checked" : ""} /> Semana de descarga a cada 4.ª semana (uma série a menos em cada exercício)</label>
          </fieldset>
          <p class="resumo-plano" id="resumoPlano">${textoPlano(p)}</p>
          <button class="btn primario grande" type="submit" ${datas.length && nAtl ? "" : "disabled"}>Criar treinos</button>
        </form>
      </section>`;
  }

  function lerFormPlano() {
    const p = est.plano;
    if (!p || !$("fPlano")) return;
    p.atletas = [...document.querySelectorAll('input[name="pAtleta"]:checked')].map((i) => i.value);
    p.inicio = $("pInicio").value;
    p.semanas = limitar($("pSemanas").value, 1, 16);
    p.dia1 = Number($("pDia1").value);
    p.dia2 = Number($("pDia2").value);
    p.descarga = $("pDescarga").checked;
  }

  async function guardarPlano() {
    lerFormPlano();
    const p = est.plano;
    if (p.dia1 === p.dia2) return toast("Escolhe dois dias diferentes.");
    if (!p.inicio) return toast("Escolhe a data de início.");
    const [faseId, nivelId] = p.chave.split("--");
    const f = window.PLANEAMENTO.fases.find((x) => x.id === faseId);
    const sessoes = f.sessoes[nivelId].map((id) => est.sessoes.find((s) => s.id === id));
    const datas = datasPlano(p);
    const linhas = [];
    p.atletas.forEach((atleta) => {
      datas.forEach(({ data, dia, semana }) => {
        const s = sessoes[dia];
        const descarga = p.descarga && semana % 4 === 0;
        linhas.push({
          atleta_id: atleta,
          data,
          sessao_id: est.sessoesNaBD.has(s.id) ? s.id : null,
          titulo: `${s.fase} · Dia ${s.dia} — semana ${semana}${descarga ? " (descarga)" : ""}`,
          duracao_prevista: s.duracao,
          rpe_alvo: descarga ? String(Math.max(3, parseFloat(s.rpe) - 2)) : s.rpe,
          notas_treinador: (descarga ? "SEMANA DE DESCARGA: faz uma série a menos em cada exercício e não vás perto da falha. " : "") + (s.nota || ""),
          blocos: descarga
            ? s.blocos.map((b) => ({ ...b, itens: b.itens.map((it) => ({ ...it, dose: menosUmaSerie(it.dose) })) }))
            : s.blocos
        });
      });
    });
    if (!linhas.length) return toast("Nada para criar.");
    if (linhas.length > 500) return toast("Demasiados treinos de uma vez (máx. 500). Escolhe menos atletas ou semanas.");
    const btn = document.querySelector('#fPlano button[type="submit"]');
    btn.disabled = true;
    const { error } = await sb.from("treinos").insert(linhas);
    btn.disabled = false;
    if (error) return erro(error);
    toast(`${linhas.length} treinos criados.`);
    est.plano = null;
    location.hash = p.atletas.length === 1 ? `#a-${p.atletas[0]}` : "#atletas";
  }

  // ======================================================================
  // Resumo da semana (rascunho gerado a partir dos registos do atleta)
  // ======================================================================
  const PALAVRAS_DOR = /\b(dor|dores|dói|doi|doeu|lesão|lesao|tendão|tendao|joelho|gémeo|gemeo|aquiles|canela|anca|lombar|ombro)\b/i;

  function gerarResumo(atleta, treinos, seg) {
    const fim = somarDias(seg, 6);
    const daSemana = (ini) => treinos.filter((t) => t.data >= ini && t.data <= somarDias(ini, 6));
    const sem = daSemana(seg);
    const ant = daSemana(somarDias(seg, -7));
    const prox = daSemana(somarDias(seg, 7));
    const feitos = sem.filter((t) => t.estado === "feito");
    const naoFeitos = sem.filter((t) => t.estado === "nao_feito");
    const porRegistar = sem.filter((t) => t.estado === "planeado" && t.data <= hoje());
    const minutos = feitos.reduce((x, t) => x + (t.duracao_real || 0), 0);
    const cargaSem = sem.reduce((x, t) => x + carga(t), 0);
    const cargaAnt = ant.reduce((x, t) => x + carga(t), 0);
    const rpes = feitos.filter((t) => t.rpe != null).map((t) => t.rpe);
    const rpeMed = rpes.length ? Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10 : null;
    const alvoMax = (t) => { const n = String(t.rpe_alvo || "").match(/(\d+)(?!.*\d)/); return n ? Number(n[1]) : null; };
    const acimaAlvo = feitos.filter((t) => alvoMax(t) != null && t.rpe != null && t.rpe >= alvoMax(t) + 2);
    const comDor = sem.filter((t) => PALAVRAS_DOR.test(t.comentario_atleta || ""));
    const nome = (atleta.nome || "").split(" ")[0] || "";
    const dd = (iso) => `${iso.slice(8)}/${iso.slice(5, 7)}`;

    const variacao = cargaAnt ? Math.round(((cargaSem - cargaAnt) / cargaAnt) * 100) : null;
    const visao = sem.length
      ? `${feitos.length}/${sem.length} sessões de força e técnica feitas · ${minutos} min · carga ${cargaSem} UA` +
        (variacao != null ? ` (${variacao >= 0 ? "+" : ""}${variacao}% face à semana anterior)` : "") +
        (rpeMed != null ? ` · RPE médio ${String(rpeMed).replace(".", ",")}` : "") + "."
      : "Sem sessões de força e técnica planeadas esta semana.";

    let destaque;
    if (sem.length && feitos.length === sem.length) destaque = "Cumpriste todas as sessões da semana. Consistência é o que faz a diferença.";
    else if (feitos.length) {
      const melhor = feitos.slice().sort((a, b) => carga(b) - carga(a))[0];
      destaque = `Boa sessão de ${melhor.titulo} (${dd(melhor.data)}): RPE ${melhor.rpe} em ${melhor.duracao_real} min.`;
    } else destaque = "[Escreve aqui o ponto alto da semana — por exemplo uma sessão-chave no TrainingPeaks.]";

    const atencao = [];
    if (naoFeitos.length) atencao.push(`${naoFeitos.length} sessão(ões) não feita(s)${naoFeitos.some((t) => t.comentario_atleta) ? ` ("${naoFeitos.find((t) => t.comentario_atleta).comentario_atleta}")` : ""}.`);
    if (porRegistar.length) atencao.push(`${porRegistar.length} sessão(ões) por registar — regista o RPE para eu poder ajustar.`);
    if (acimaAlvo.length) atencao.push(`RPE bem acima do previsto em ${acimaAlvo.map((t) => dd(t.data)).join(", ")}: pode ser sinal de cansaço acumulado.`);
    if (variacao != null && variacao > 10) atencao.push(`A carga subiu ${variacao}% — vamos controlar a progressão.`);
    comDor.forEach((t) => atencao.push(`Referiste: "${t.comentario_atleta}" (${dd(t.data)}). Fica em vigilância.`));
    if (!atencao.length) atencao.push("Nada a assinalar. Mantém o sono e a alimentação em dia.");

    const proxTxt = prox.length
      ? prox.map((t) => `${dataBonita(t.data)}: ${t.titulo}`).join("; ") + "."
      : "[Ainda sem sessões atribuídas para a próxima semana.]";

    const pergunta = comDor.length
      ? "Como está essa dor hoje, de 0 a 10?"
      : naoFeitos.length || acimaAlvo.length
        ? "Como está a tua semana fora do treino (trabalho, sono)? Queres que ajuste o volume?"
        : "De 1 a 10, como te sentiste no geral esta semana?";

    return [
      `Resumo da semana · ${dd(seg)} a ${dd(fim)}${nome ? " · " + nome : ""}`,
      "",
      `Visão geral: ${visao}`,
      `Destaque: ${destaque}`,
      `Atenção: ${atencao.join(" ")}`,
      `Próxima semana: ${proxTxt}`,
      `Pergunta: ${pergunta}`
    ].join("\n");
  }

  // ======================================================================
  // Candidaturas (formulário do site da marca)
  // ======================================================================
  const ESTADOS_CAND = { nova: "Nova", contactado: "Contactado", cliente: "Cliente", arquivada: "Arquivada" };

  async function vistaCandidaturas() {
    const { data, error } = await sb.from("candidaturas").select("*").order("criado_em", { ascending: false }).limit(200);
    if (error) {
      const falta = /candidaturas|schema cache|does not exist/i.test(error.message || "");
      if (!falta) throw error;
      app().innerHTML = `
        <section class="vista">
          <h1>Candidaturas</h1>
          <div class="vazio-caixa">
            <p><strong>Falta ativar as candidaturas.</strong></p>
            <p>No Supabase, abre o SQL Editor, cola o ficheiro <code>plataforma/sql/04-candidaturas.sql</code> e carrega em Run. Depois atualiza esta página.</p>
          </div>
        </section>`;
      return;
    }
    const novas = data.filter((c) => c.estado === "nova").length;
    app().innerHTML = `
      <section class="vista">
        <div class="cab-linha">
          <div>
            <h1>Candidaturas</h1>
            <p class="muted">${data.length} no total · ${novas} nova${novas === 1 ? "" : "s"}</p>
          </div>
        </div>
        ${data.length ? `<div class="lista-cand">${data.map((c) => `
          <article class="cand ${c.estado === "nova" ? "cand-nova" : ""}">
            <div class="cand-cab">
              <div>
                <strong>${esc(c.nome)}</strong>
                <span class="muted">${esc(new Date(c.criado_em).toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" }))}</span>
              </div>
              <select data-cand="${c.id}" aria-label="Estado da candidatura">
                ${Object.entries(ESTADOS_CAND).map(([v, l]) => `<option value="${v}" ${c.estado === v ? "selected" : ""}>${l}</option>`).join("")}
              </select>
            </div>
            <dl class="cand-dados">
              <div><dt>Email</dt><dd>${esc(c.email)}</dd></div>
              ${c.telefone ? `<div><dt>Telemóvel</dt><dd>${esc(c.telefone)}</dd></div>` : ""}
              <div><dt>Modalidade</dt><dd>${c.modalidade === "corrida" ? "Corrida" : "Triatlo"}</dd></div>
              <div><dt>Plano</dt><dd>${esc(c.plano)}</dd></div>
              <div><dt>Experiência</dt><dd>${esc(c.nivel)}</dd></div>
              <div><dt>Horas/semana</dt><dd>${esc(c.horas)}</dd></div>
            </dl>
            ${c.objetivo ? `<p><b>Objetivo:</b> ${esc(c.objetivo)}</p>` : ""}
            ${c.mensagem ? `<p class="comentario">${esc(c.mensagem)}</p>` : ""}
          </article>`).join("")}</div>`
        : `<div class="vazio-caixa"><p><strong>Ainda não há candidaturas.</strong></p><p>Quando alguém preencher o formulário no site da CF Training, aparece aqui.</p></div>`}
      </section>`;
  }

  async function copiarSemana(btn, atletaId) {
    if (btn.dataset.confirmar !== "1") {
      btn.dataset.confirmar = "1";
      btn.textContent = "Carrega outra vez para copiar";
      setTimeout(() => {
        if (btn.isConnected) { btn.dataset.confirmar = ""; btn.textContent = "Copiar esta semana para a próxima"; }
      }, 4000);
      return;
    }
    btn.disabled = true;
    const seg = segundaDe(hoje());
    const { data, error } = await sb.from("treinos").select("*").eq("atleta_id", atletaId)
      .gte("data", seg).lte("data", somarDias(seg, 6));
    if (error) { btn.disabled = false; return erro(error); }
    if (!data.length) { btn.disabled = false; return toast("Esta semana não tem treinos para copiar."); }
    // Não duplica o que já existe na próxima semana (mesmo dia e mesmo título).
    const prox = await sb.from("treinos").select("data, titulo").eq("atleta_id", atletaId)
      .gte("data", somarDias(seg, 7)).lte("data", somarDias(seg, 13));
    if (prox.error) { btn.disabled = false; return erro(prox.error); }
    const existentes = new Set(prox.data.map((t) => t.data + "|" + t.titulo));
    const aCopiar = data.filter((t) => !existentes.has(somarDias(t.data, 7) + "|" + t.titulo));
    if (!aCopiar.length) { btn.disabled = false; return toast("A próxima semana já tem estes treinos."); }
    const novos = aCopiar.map((t) => ({
      atleta_id: t.atleta_id, data: somarDias(t.data, 7), sessao_id: t.sessao_id, titulo: t.titulo,
      duracao_prevista: t.duracao_prevista, rpe_alvo: t.rpe_alvo, notas_treinador: t.notas_treinador, blocos: t.blocos
    }));
    const res = await sb.from("treinos").insert(novos).select("id");
    if (res.error) { btn.disabled = false; return erro(res.error); }
    const saltados = data.length - novos.length;
    toast(`${novos.length} treino${novos.length === 1 ? "" : "s"} copiado${novos.length === 1 ? "" : "s"} para a próxima semana` +
      (saltados ? ` (${saltados} já lá estava${saltados === 1 ? "" : "m"}).` : "."));
    rota();
  }

  // ======================================================================
  // Biblioteca
  // ======================================================================
  function normalizar(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function vistaBiblioteca() {
    const f = est.filtros;
    const chips = (mapa, chave) =>
      `<button class="chip" type="button" data-f="${chave}" data-v="" aria-pressed="${f[chave] === null}">Todos</button>` +
      Object.entries(mapa).map(([v, l]) => `<button class="chip" type="button" data-f="${chave}" data-v="${v}" aria-pressed="${f[chave] === v}">${l}</button>`).join("");

    app().innerHTML = `
      <section class="vista">
        <h1>Biblioteca</h1>
        <h2 class="titulo-secao">Planeamento por fases · 2 dias por semana</h2>
        <p class="muted-grupo">Cada sessão (até 1 h): Mobilidade → Técnica de corrida → Pliometria → Força inferior → Força superior e core</p>
        ${htmlPlaneamento()}

        ${[["Em casa · só peso do corpo ou pouco material", (s) => s.casa], ["Sessões curtas e blocos", (s) => !s.nivel && !s.casa]].map(([grupo, filtro]) => `
        <h2 class="titulo-secao">${grupo}</h2>
        <div class="lista-sessoes">
          ${est.sessoes.filter(filtro).map((s) => `
            <a class="cartao-sessao" href="#m-${esc(s.id)}">
              <div class="minutos"><div><b>${s.duracao}</b><br><span>min</span></div></div>
              <div>
                <h2>${esc(s.nome)}</h2>
                <p class="meta">${esc(s.fase)} · ${esc(s.frequencia)} · RPE ${esc(s.rpe)}</p>
                <p class="obj">${esc(s.objetivo)}</p>
              </div>
            </a>`).join("")}
        </div>`).join("")}

        <h2 class="titulo-secao">Exercícios</h2>
        <div class="filtros">
          <label class="pesquisa"><span class="sr">Pesquisar</span>
            <input id="fPesquisa" type="search" placeholder="Pesquisar exercício ou músculo" autocomplete="off" value="${esc(f.texto)}" />
          </label>
          <div class="chips" role="group" aria-label="Categoria">${chips(CATEGORIAS, "categoria")}</div>
          <div class="chips" role="group" aria-label="Disciplina">${chips(DISCIPLINAS, "disciplina")}</div>
          <div class="chips" role="group" aria-label="Material">${chips(MATERIAIS, "material")}</div>
        </div>
        <p class="contagem" id="contagem"></p>
        <div id="listaExercicios" class="lista-ex"></div>
      </section>`;
    desenharListaEx();
  }

  function desenharListaEx() {
    const f = est.filtros;
    const t = normalizar(f.texto.trim());
    const lista = est.exercicios.filter((e) => {
      if (f.categoria && e.categoria !== f.categoria) return false;
      if (f.disciplina && !(e.disciplinas || []).includes(f.disciplina)) return false;
      if (f.material && !(e.material || []).includes(f.material)) return false;
      if (t && !normalizar(`${e.nome} ${e.musculos} ${e.nome_en}`).includes(t)) return false;
      return true;
    });
    $("contagem").textContent = `${lista.length} de ${est.exercicios.length} exercícios`;
    $("listaExercicios").innerHTML = lista.length
      ? lista.map((e) => `
        <a class="linha-ex" href="#ex-${esc(e.id)}">
          <div>
            <h3>${esc(e.nome)}</h3>
            <p class="musc">${esc(e.musculos)}</p>
            <div class="tags"><span class="tag">${CATEGORIAS[e.categoria] || e.categoria}</span>${tagsDisciplinas(e.disciplinas)}</div>
          </div>
          <span class="dose-mini">${esc(e.dose)}</span>
        </a>`).join("")
      : `<p class="vazio">Nenhum exercício com estes filtros.</p>`;
  }

  function vistaModelo(id) {
    const s = est.sessoes.find((x) => x.id === id);
    if (!s) {
      app().innerHTML = `<a class="voltar" href="#biblioteca">← Biblioteca</a><p class="vazio">Sessão não encontrada.</p>`;
      return;
    }
    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="#biblioteca">← Biblioteca</a>
        <div class="det-cab">
          <h2>${esc(s.nome)}</h2>
          <p class="obj">${esc(s.objetivo)}</p>
          <dl class="factos">
            <div><dt>Duração</dt><dd>${s.duracao} min</dd></div>
            <div><dt>Fase</dt><dd>${esc(s.fase)}</dd></div>
            ${s.nivel ? `<div><dt>Nível · dia</dt><dd>${esc((window.PLANEAMENTO.niveis.find((n) => n.id === s.nivel) || {}).nome || s.nivel)} · Dia ${s.dia} (${esc(s.foco)})</dd></div>` : ""}
            <div><dt>Frequência</dt><dd>${esc(s.frequencia)}</dd></div>
            <div><dt>RPE alvo</dt><dd>${esc(s.rpe)} / 10</dd></div>
          </dl>
          ${eTreinador() ? `<div class="acoes"><button class="btn primario" type="button" data-usar-modelo="${esc(s.id)}">Atribuir esta sessão</button></div>` : ""}
        </div>
        ${s.nota ? `<p class="nota">${esc(s.nota)}</p>` : ""}
        ${htmlBlocos(s.blocos)}
      </section>`;
  }

  function vistaExercicio(id) {
    const e = est.exPorId[id];
    if (!e) {
      app().innerHTML = `<a class="voltar" href="#biblioteca">← Biblioteca</a><p class="vazio">Exercício não encontrado.</p>`;
      return;
    }
    const video = e.video
      ? { href: e.video, texto: "Ver vídeo" }
      : { href: `https://www.youtube.com/results?search_query=${encodeURIComponent(e.nome_en + " exercise technique")}`, texto: "Procurar vídeo no YouTube" };

    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="#" data-voltar="1">← Voltar</a>
        <div class="det-cab">
          <div class="tags"><span class="tag">${CATEGORIAS[e.categoria] || e.categoria}</span>${tagsDisciplinas(e.disciplinas)}</div>
          <h2>${esc(e.nome)}</h2>
          <p class="obj">${esc(e.musculos)}</p>
          <dl class="factos">
            <div><dt>Dose habitual</dt><dd class="dose-grande">${esc(e.dose)}</dd></div>
            <div><dt>Material</dt><dd>${(e.material || []).map((m) => MATERIAIS[m] || m).join(", ")}</dd></div>
          </dl>
          <div class="acoes">
            <a class="btn primario" href="${esc(video.href)}" target="_blank" rel="noopener">${video.texto} ↗</a>
          </div>
        </div>
        <div class="secao-ex"><h3>Execução</h3><ol class="execucao">${(e.execucao || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ol></div>
        <div class="secao-ex"><h3>Erros comuns</h3><ul class="erros">${(e.erros || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
        <div class="secao-ex duas">
          <div><h4>Mais fácil</h4><p>${esc(e.regressao)}</p></div>
          <div><h4>Mais difícil</h4><p>${esc(e.progressao)}</p></div>
        </div>
      </section>`;
  }

  function vistaEscala() {
    app().innerHTML = `
      <section class="vista">
        <div class="escala-intro">
          <h2>Escala de esforço (RPE CR-10)</h2>
          <p>Regista o esforço da sessão inteira 15–30 min depois de acabares. Pensa em como foi o treino no geral, não só o último exercício. A carga do treino é RPE × minutos.</p>
        </div>
        <ol class="escala">
          ${ESCALA_RPE.map(([n, nome, desc]) => `<li style="--c:${corRpe(n)}"><b>${n}</b><div><strong>${nome}</strong><span>${desc}</span></div></li>`).join("")}
        </ol>
      </section>`;
  }

  // ======================================================================
  // Eventos
  // ======================================================================
  document.addEventListener("submit", (ev) => {
    const f = ev.target;
    if (f.id === "fAuth") { ev.preventDefault(); submeterAuth(f); }
    else if (f.id === "fRegisto") { ev.preventDefault(); submeterRegisto(f); }
    else if (f.id === "fTreino") { ev.preventDefault(); guardarTreino(); }
    else if (f.id === "fPlano") { ev.preventDefault(); guardarPlano(); }
    else if (f.id === "fComentario") { ev.preventDefault(); enviarComentario(f); }
    else if (f.dataset && f.dataset.responder) { ev.preventDefault(); responderFeedback(f); }
  });

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("button, a");
    if (!el) return;

    if (el.dataset.modo) { vistaEntrar(el.dataset.modo); return; }
    if (el.id === "btnRecarregar") { iniciarSessao(true); return; }
    if (el.dataset.tentar) { el.dataset.tentar === "rota" ? rota() : iniciarSessao(); return; }
    if (el.dataset.voltar) { ev.preventDefault(); history.length > 1 ? history.back() : (location.hash = eTreinador() ? "#biblioteca" : "#treinos"); return; }

    // Filtros da biblioteca
    if (el.classList.contains("chip")) {
      est.filtros[el.dataset.f] = el.dataset.v || null;
      document.querySelectorAll(`.chip[data-f="${el.dataset.f}"]`).forEach((c) => c.setAttribute("aria-pressed", String(c === el)));
      desenharListaEx();
      return;
    }

    // Registo do atleta
    if (el.classList.contains("seg-op")) {
      $("rEstado").value = el.dataset.estado;
      document.querySelectorAll(".seg-op").forEach((b) => b.setAttribute("aria-pressed", String(b === el)));
      $("rCamposFeito").hidden = el.dataset.estado !== "feito";
      return;
    }
    if (el.classList.contains("rpe-op")) {
      const n = Number(el.dataset.rpe);
      $("rRpe").value = n;
      document.querySelectorAll(".rpe-op").forEach((b) => b.setAttribute("aria-pressed", String(b === el)));
      $("rpeNum").textContent = n;
      $("rpeNome").textContent = ESCALA_RPE[n][1];
      $("rpeLegenda").textContent = ESCALA_RPE[n][2];
      $("rpeVisor").style.setProperty("--c", corRpe(n));
      atualizarCargaViva();
      return;
    }
    if (el.classList.contains("passo-min")) {
      const atual = Number($("rDur").value) || 0;
      $("rDur").value = Math.min(600, Math.max(1, atual + Number(el.dataset.min)));
      atualizarCargaViva();
      return;
    }
    if (el.dataset.registar) est.irParaRegisto = true;

    // Treinador
    if (el.dataset.aprovar) { aprovar(el.dataset.aprovar, true); return; }
    if (el.dataset.recusar) {
      if (el.dataset.confirmar !== "1") {
        el.dataset.confirmar = "1";
        el.textContent = "Confirmar recusa";
        setTimeout(() => { if (el.isConnected) { el.dataset.confirmar = ""; el.textContent = "Recusar"; } }, 4000);
        return;
      }
      aprovar(el.dataset.recusar, false);
      return;
    }
    if (el.dataset.duplicar && est.treinoAtual) {
      est.duplicarDe = est.treinoAtual;
      location.hash = "#novo";
      return;
    }
    if (el.dataset.apagarComent) { apagarComentario(el); return; }
    if (el.dataset.guardarFeedback) { guardarFeedback(el, el.dataset.guardarFeedback); return; }
    if (el.dataset.editarFeedback) {
      const f = (est.feedbacksAtleta || []).find((x) => x.id === el.dataset.editarFeedback);
      if (f) {
        $("rsSemana").value = f.semana;
        $("rsTexto").value = f.texto;
        $("rsSaida").hidden = false;
        avisoFeedbackExistente();
        $("rsTexto").focus();
      }
      return;
    }
    if (el.dataset.copiarSemana) { copiarSemana(el, el.dataset.copiarSemana); return; }
    if (el.dataset.resumo && est.treinosAtleta) {
      const a = est.atletas.find((x) => x.id === el.dataset.resumo) || {};
      $("rsTexto").value = gerarResumo(a, est.treinosAtleta.data, $("rsSemana").value);
      $("rsSaida").hidden = false;
      return;
    }
    if (el.dataset.copiarResumo) {
      const txt = $("rsTexto").value;
      const falhou = () => { $("rsTexto").select(); toast("Seleciona e copia o texto (Ctrl+C)."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => toast("Resumo copiado."), falhou);
      else falhou();
      return;
    }
    if (el.classList.contains("chip-nivel")) {
      est.nivel = el.dataset.nivel;
      try { localStorage.setItem("nivelPlaneamento", est.nivel); } catch (_) { /* sem armazenamento */ }
      const cont = $("planeamento");
      if (cont) cont.outerHTML = htmlPlaneamento();
      return;
    }
    if (el.dataset.planoAcao && est.plano) {
      lerFormPlano();
      if (el.dataset.planoAcao === "todos") est.plano.atletas = est.atletas.filter((a) => a.aprovado).map((a) => a.id);
      if (el.dataset.planoAcao === "nenhum") est.plano.atletas = [];
      vistaPlano(est.plano.chave);
      return;
    }
    if (el.dataset.usarModelo) {
      est.modeloPendente = el.dataset.usarModelo;
      location.hash = "#novo";
      return;
    }
    const acao = el.dataset.acao;
    if (acao && est.rascunho) {
      if (acao === "apagar") { apagarTreino(el); return; }
      lerFormTreino();
      const r = est.rascunho;
      if (acao === "todos-atletas") r.atletas = est.atletas.filter((a) => a.aprovado).map((a) => a.id);
      if (acao === "nenhum-atleta") r.atletas = [];
      if (acao === "add-bloco") r.blocos.push({ titulo: `Bloco ${r.blocos.length + 1}`, itens: [{ ex: "", dose: "", descanso: "" }] });
      if (acao === "rem-bloco") r.blocos.splice(Number(el.dataset.bi), 1);
      if (acao === "add-item") r.blocos[Number(el.dataset.bi)].itens.push({ ex: "", dose: "", descanso: "" });
      if (acao === "rem-item") r.blocos[Number(el.dataset.bi)].itens.splice(Number(el.dataset.ii), 1);
      vistaFormTreino({});
    }
  });

  document.addEventListener("change", async (ev) => {
    const el = ev.target;
    if (el.dataset && el.dataset.cand) {
      const { error } = await sb.from("candidaturas").update({ estado: el.value }).eq("id", el.dataset.cand);
      if (error) return erro(error);
      toast("Estado atualizado.");
      el.closest(".cand").classList.toggle("cand-nova", el.value === "nova");
      return;
    }
    if (el.id === "rsSemana") { avisoFeedbackExistente(); return; }
    if (el.id === "tModelo" && est.rascunho) {
      lerFormTreino();
      if (el.value) aplicarModelo(el.value);
      else est.rascunho.sessao_id = "";
      vistaFormTreino({});
    }
    if (el.closest && el.closest("#fPlano") && est.plano) {
      lerFormPlano();
      if (el.id === "pSemanas") el.value = est.plano.semanas;
      atualizarResumoPlano();
      return;
    }
    // Atualiza o resumo da repetição.
    if ((el.name === "dia" || el.name === "atleta" || el.id === "tSemanas" || el.id === "tData") && est.rascunho && $("resumoRepetir")) {
      lerFormTreino();
      $("resumoRepetir").textContent = textoRepetir(est.rascunho);
    }
    // Ao escolher um exercício, sugere a dose habitual (se a dose estiver vazia
    // ou ainda for a dose sugerida do exercício anterior).
    if (el.classList.contains("i-ex")) {
      const dose = el.closest(".item-edit").querySelector(".i-dose");
      const e = est.exPorId[el.value];
      const antes = est.exPorId[el.dataset.ex];
      if (e && (!dose.value || (antes && dose.value === antes.dose))) dose.value = e.dose;
      el.dataset.ex = el.value;
    }
  });

  document.addEventListener("input", (ev) => {
    if (ev.target.id === "rDur") { atualizarCargaViva(); return; }
    if (ev.target.id === "fPesquisa") {
      est.filtros.texto = ev.target.value;
      desenharListaEx();
    }
  });

  $("btnSair").addEventListener("click", async () => {
    const { error } = await sb.auth.signOut();
    if (error) return erro(error);
  });

  // Abrir um feedback marca-o como lido.
  document.addEventListener("toggle", (ev) => {
    const d = ev.target;
    if (d.open && d.classList && d.classList.contains("fb") && d.dataset.fb) marcarFeedbackLido(d);
  }, true);

  window.addEventListener("hashchange", rota);

  // ======================================================================
  // Arranque
  // ======================================================================
  sb.auth.onAuthStateChange((evento, sessao) => {
    // Corre fora do callback para não bloquear o cliente Supabase.
    setTimeout(async () => {
      if (evento === "PASSWORD_RECOVERY") {
        est.utilizador = sessao ? sessao.user : null;
        est.recuperacao = true;
        vistaEntrar("nova");
        return;
      }
      if (evento === "SIGNED_OUT" || !sessao) {
        if (evento === "SIGNED_OUT" && location.hash) history.replaceState(null, "", location.pathname + location.search);
        est.utilizador = null;
        est.perfil = null;
        est.rascunho = null;
        est.plano = null;
        vistaEntrar("entrar");
        return;
      }
      if (evento === "INITIAL_SESSION" || evento === "SIGNED_IN") {
        const mudou = !est.utilizador || est.utilizador.id !== sessao.user.id;
        est.utilizador = sessao.user;
        if (mudou && !est.recuperacao) await iniciarSessao();
      }
    }, 0);
  });
})();
