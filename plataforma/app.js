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
    if (n <= 3) return "var(--rpe-low)";
    if (n <= 6) return "var(--rpe-mid)";
    return "var(--rpe-high)";
  }
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
    if (m.includes("password should be")) return "A palavra-passe tem de ter pelo menos 6 caracteres.";
    if (m.includes("rate limit")) return "Demasiadas tentativas. Espera uns minutos e tenta outra vez.";
    if (m.includes("failed to fetch")) return "Sem ligação. Verifica a internet.";
    return msg;
  }

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
      ...todas.filter((s) => !s.completa).sort((x, y) => x.nome.localeCompare(y.nome, "pt"))
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
      <section class="auth">
        <h1>${titulos[modo]}</h1>
        <p class="muted">${ajuda[modo]}</p>
        <form id="fAuth" class="form" data-modo="${modo}" novalidate>
          ${campos[modo]}
          <button class="btn primario grande" type="submit">${botoes[modo]}</button>
        </form>
        <div class="auth-links">${links[modo]}</div>
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

  async function iniciarSessao() {
    try {
      await carregarPerfil();
    } catch (e) {
      erro(e);
      return;
    }
    $("conta").hidden = false;
    $("contaNome").textContent = (est.perfil && est.perfil.nome) || est.utilizador.email;

    if (!est.perfil || (!est.perfil.aprovado && !eTreinador())) {
      $("menu").hidden = true;
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
      erro(e);
      return;
    }
    desenharMenu();
    rota();
  }

  // ======================================================================
  // Menu e rotas
  // ======================================================================
  function desenharMenu() {
    const itens = eTreinador()
      ? [["atletas", "Atletas"], ["biblioteca", "Biblioteca"], ["escala", "Escala RPE"]]
      : [["treinos", "Treinos"], ["biblioteca", "Biblioteca"], ["escala", "Escala RPE"]];
    $("menu").innerHTML = itens.map(([h, t]) => `<a class="tab" href="#${h}" data-tab="${h}">${t}</a>`).join("");
    $("menu").hidden = false;
  }

  function marcarTab(tab) {
    document.querySelectorAll("#menu .tab").forEach((t) => t.classList.toggle("ativo", t.dataset.tab === tab));
  }

  let ultimaRota = "";
  async function rota() {
    if (!est.utilizador || est.recuperacao || !est.perfil) return;
    if (!est.perfil.aprovado && !eTreinador()) return;
    const inicial = eTreinador() ? "atletas" : "treinos";
    const h = decodeURIComponent(location.hash.slice(1)) || inicial;
    if (est.rascunhoRota !== h) est.rascunho = null;
    est.rascunhoRota = h;

    try {
      if (h === "biblioteca") { marcarTab("biblioteca"); vistaBiblioteca(); }
      else if (h === "escala") { marcarTab("escala"); vistaEscala(); }
      else if (h.startsWith("ex-")) { marcarTab("biblioteca"); vistaExercicio(h.slice(3)); }
      else if (h.startsWith("m-")) { marcarTab("biblioteca"); vistaModelo(h.slice(2)); }
      else if (h.startsWith("t-")) { marcarTab(eTreinador() ? "atletas" : "treinos"); await vistaTreino(h.slice(2)); }
      else if (eTreinador() && h.startsWith("a-")) { marcarTab("atletas"); await vistaAtleta(h.slice(2)); }
      else if (eTreinador() && (h === "novo" || h.startsWith("novo-"))) { marcarTab("atletas"); vistaFormTreino({ atletaId: h.slice(5) || null }); }
      else if (eTreinador() && h.startsWith("plano-")) { marcarTab("atletas"); vistaPlano(h.slice(6)); }
      else if (eTreinador() && h.startsWith("editar-")) { marcarTab("atletas"); await vistaFormTreino({ treinoId: h.slice(7) }); }
      else if (eTreinador()) { marcarTab("atletas"); await vistaAtletas(); }
      else { marcarTab("treinos"); await vistaMeusTreinos(); }
    } catch (e) {
      erro(e);
    }
    if (h !== ultimaRota) window.scrollTo(0, 0);
    ultimaRota = h;
  }

  // ======================================================================
  // Blocos de uma sessão (usado no treino e nos modelos)
  // ======================================================================
  function htmlBlocos(blocos) {
    let n = 0;
    return (blocos || []).map((b) => `
      <div class="bloco">
        <h3>${esc(b.titulo)}</h3>
        <ol class="passos">
          ${(b.itens || []).map((i) => {
            n += 1;
            const e = est.exPorId[i.ex];
            const nome = e ? `<a class="nome" href="#ex-${esc(e.id)}">${esc(e.nome)}</a>` : `<span class="nome">${esc(i.ex)}</span>`;
            const desc = e ? `<span class="desc">${esc(e.musculos)}</span>` : "";
            const nota = i.nota ? `<span class="desc nota-item">${esc(i.nota)}</span>` : "";
            const descanso = i.descanso && i.descanso !== "—" ? `<small>desc. ${esc(i.descanso)}</small>` : "";
            return `<li class="passo"><span class="n">${n}</span><div>${nome}${desc}${nota}</div><div class="dose">${esc(i.dose)}${descanso}</div></li>`;
          }).join("")}
        </ol>
      </div>`).join("");
  }

  function linhaTreino(t, mostrarAtleta) {
    const atleta = mostrarAtleta ? est.atletas.find((a) => a.id === t.atleta_id) : null;
    const rpe = t.estado === "feito" && t.rpe != null
      ? `<span class="rpe-mini"><i style="background:${corRpe(t.rpe)}"></i>RPE ${t.rpe}</span>`
      : "";
    const cg = carga(t) ? `<span class="muted"> · ${carga(t)} UA</span>` : "";
    return `
      <a class="linha-treino" href="#t-${t.id}">
        <div>
          <span class="data">${esc(dataBonita(t.data))}</span>
          <strong>${esc(t.titulo)}</strong>
          ${atleta ? `<span class="muted">${esc(atleta.nome || atleta.email)}</span>` : ""}
        </div>
        <div class="lado">${pillEstado(t.estado, t.data)}${rpe}${cg}</div>
      </a>`;
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
    const semana = data.filter((t) => t.data > somarDias(h, -7) && t.data <= h);
    const feitos = semana.filter((t) => t.estado === "feito").length;
    const cargaSemana = semana.reduce((s, t) => s + carga(t), 0);

    app().innerHTML = `
      <section class="vista">
        <div class="ola">
          <h1>Olá, ${esc((est.perfil.nome || "").split(" ")[0] || "atleta")}</h1>
          <p class="muted">Últimos 7 dias: <strong>${feitos}</strong> de ${semana.length} treinos feitos · carga <strong>${cargaSemana}</strong> UA</p>
        </div>

        <h2 class="titulo-secao">Hoje</h2>
        ${deHoje.length
          ? `<div class="cartoes-hoje">${deHoje.map((t) => `
              <a class="cartao-hoje" href="#t-${t.id}">
                <div class="minutos"><div><b>${t.duracao_prevista || "–"}</b><br><span>min</span></div></div>
                <div>
                  <h3>${esc(t.titulo)}</h3>
                  <p class="muted">${t.rpe_alvo ? `RPE alvo ${esc(t.rpe_alvo)} · ` : ""}${pillEstado(t.estado)}</p>
                  ${t.notas_treinador ? `<p class="obj">${esc(t.notas_treinador)}</p>` : ""}
                </div>
              </a>`).join("")}</div>`
          : `<p class="vazio-caixa">Hoje não tens treino físico marcado.</p>`}

        <h2 class="titulo-secao">Próximos</h2>
        ${proximos.length ? `<div class="lista-treinos">${proximos.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Sem treinos marcados.</p>`}

        <h2 class="titulo-secao">Últimas 4 semanas</h2>
        ${anteriores.length ? `<div class="lista-treinos">${anteriores.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Ainda sem histórico.</p>`}
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
        <div><dt>Duração prevista</dt><dd>${t.duracao_prevista ? t.duracao_prevista + " min" : "—"}</dd></div>
        <div><dt>RPE alvo</dt><dd>${t.rpe_alvo ? esc(t.rpe_alvo) + " / 10" : "—"}</dd></div>
        <div><dt>Estado</dt><dd>${pillEstado(t.estado, t.data)}</dd></div>
      </dl>`;

    const resultado = t.estado === "planeado" ? "" : `
      <div class="resultado">
        <h3>Registo do atleta</h3>
        ${t.estado === "feito" ? `
          <div class="numeros">
            <div><span>RPE</span><b style="color:${corRpe(t.rpe ?? 0)}">${t.rpe ?? "—"}</b></div>
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
          <h2>${esc(t.titulo)}</h2>
          ${factos}
          ${acoesTreinador}
        </div>
        ${t.notas_treinador ? `<p class="nota">${esc(t.notas_treinador)}</p>` : ""}
        ${eTreinador() ? resultado : ""}
        ${htmlBlocos(t.blocos)}
        ${eTreinador() ? "" : formRegisto(t)}
      </section>`;
  }

  function formRegisto(t) {
    const estado = t.estado === "planeado" ? "feito" : t.estado;
    const rpe = t.rpe ?? null;
    const dur = t.duracao_real ?? t.duracao_prevista ?? "";
    return `
      <form class="registo" id="fRegisto" data-id="${t.id}">
        <h3>Como correu?</h3>
        <p class="muted">Regista 15–30 min depois de acabares. ${t.estado !== "planeado" ? "Já registaste este treino; podes corrigir." : ""}</p>
        <div class="seg" role="radiogroup" aria-label="Fizeste o treino?">
          <button type="button" class="seg-op" data-estado="feito" aria-pressed="${estado === "feito"}">Fiz o treino</button>
          <button type="button" class="seg-op" data-estado="nao_feito" aria-pressed="${estado === "nao_feito"}">Não consegui fazer</button>
        </div>
        <input type="hidden" id="rEstado" value="${estado}" />
        <div id="rCamposFeito" ${estado === "feito" ? "" : "hidden"}>
          <fieldset class="rpe-escolha">
            <legend>Esforço da sessão (RPE 0–10)</legend>
            <div class="rpe-botoes">
              ${ESCALA_RPE.map(([n, nome]) => `
                <button type="button" class="rpe-op" data-rpe="${n}" aria-pressed="${rpe === n}" style="--c:${corRpe(n)}" title="${nome}">${n}</button>`).join("")}
            </div>
            <p class="rpe-legenda" id="rpeLegenda">${rpe != null ? esc(ESCALA_RPE[rpe][1] + " — " + ESCALA_RPE[rpe][2]) : "Toca num número."}</p>
            <input type="hidden" id="rRpe" value="${rpe ?? ""}" />
          </fieldset>
          <label class="campo curto"><span>Minutos que treinaste</span><input id="rDur" type="number" inputmode="numeric" min="1" max="600" value="${esc(dur)}" /></label>
        </div>
        <label class="campo"><span>Comentário para o treinador (opcional)</span><textarea id="rComentario" rows="3" placeholder="Dores, cargas usadas, como te sentiste…">${esc(t.comentario_atleta)}</textarea></label>
        <button class="btn primario grande" type="submit">Guardar registo</button>
      </form>`;
  }

  async function submeterRegisto(form) {
    const estado = $("rEstado").value;
    const rpe = $("rRpe").value === "" ? null : Number($("rRpe").value);
    const dur = $("rDur").value === "" ? null : Number($("rDur").value);
    if (estado === "feito" && (rpe == null || !dur)) {
      toast("Indica o RPE e os minutos.");
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
      return { semana: semana.length, feitos: feitos.length, proximos, cg, porRegistar };
    };

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
            <h2 class="titulo-secao">Hoje · ${feitos} de ${deHoje.length} registados</h2>
            <div class="lista-treinos">${deHoje.map((t) => linhaTreino(t, true)).join("")}</div>`;
        })()}

        ${ativos.length ? `
          <p class="muted legenda-tabela">Últimos 7 dias · carga = soma de RPE × minutos (UA)</p>
          <div class="lista-atletas">
            ${ativos.map((a) => {
              const r = resumo(a);
              return `
                <a class="linha-atleta" href="#a-${a.id}">
                  <div>
                    <strong>${esc(a.nome || a.email)}</strong>
                    <span class="muted">${r.proximos} treino${r.proximos === 1 ? "" : "s"} nos próximos 14 dias</span>
                  </div>
                  <div class="numeros-mini">
                    <span><b>${r.feitos}/${r.semana}</b> feitos</span>
                    <span><b>${r.cg}</b> UA</span>
                    ${r.porRegistar ? `<span class="aviso">${r.porRegistar} por registar</span>` : ""}
                  </div>
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

    const proximos = data.filter((t) => t.data >= h);
    const anteriores = data.filter((t) => t.data < h).reverse();

    app().innerHTML = `
      <section class="vista">
        <a class="voltar" href="#atletas">← Atletas</a>
        <div class="cab-linha">
          <div>
            <h1>${esc(a.nome || a.email)}</h1>
            <p class="muted">${esc(a.email)}</p>
          </div>
          <div class="acoes-linha">
            <a class="btn primario" href="#novo-${a.id}">+ Atribuir treino</a>
            <button class="btn" type="button" data-copiar-semana="${a.id}">Copiar esta semana para a próxima</button>
          </div>
        </div>

        <div class="grafico">
          <h2 class="titulo-secao">Carga semanal (RPE × min)</h2>
          <div class="barras" role="img" aria-label="Carga semanal das últimas 8 semanas">
            ${cargaSem.map((v, i) => `
              <div class="barra-col">
                <span class="barra-val">${v || ""}</span>
                <div class="barra" style="height:${Math.round((v / max) * 100)}%" ${i === 7 ? 'data-atual="1"' : ""}></div>
                <span class="barra-lab">${semanas[i].slice(8)}/${semanas[i].slice(5, 7)}</span>
              </div>`).join("")}
          </div>
          <p class="muted pequeno-txt">Cada barra é uma semana, a começar à segunda-feira. A última é a semana atual.</p>
        </div>

        <h2 class="titulo-secao">Próximos</h2>
        ${proximos.length ? `<div class="lista-treinos">${proximos.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Sem treinos marcados.</p>`}

        <h2 class="titulo-secao">Anteriores (8 semanas)</h2>
        ${anteriores.length ? `<div class="lista-treinos">${anteriores.map((t) => linhaTreino(t)).join("")}</div>` : `<p class="vazio-caixa">Sem histórico.</p>`}
      </section>`;
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

          <div class="linha-campos">
            <label class="campo"><span>Data</span><input id="tData" type="date" value="${esc(r.data)}" required /></label>
            <label class="campo"><span>Partir de uma sessão-modelo</span>
              <select id="tModelo">
                <option value="">— Em branco —</option>
                ${[...(window.PLANEAMENTO ? window.PLANEAMENTO.niveis.map((n) => [`Planeamento · ${n.nome}`, (s) => s.nivel === n.id]) : []),
                   ["Sessões curtas e blocos", (s) => !s.nivel]].map(([grupo, filtro]) => `
                  <optgroup label="${grupo}">
                    ${est.sessoes.filter(filtro)
                      .map((s) => `<option value="${esc(s.id)}" ${s.id === r.sessao_id ? "selected" : ""}>${esc(s.nivel ? `${s.fase} · Dia ${s.dia} (${s.foco})` : s.nome)} · ${s.duracao} min</option>`).join("")}
                  </optgroup>`).join("")}
              </select>
            </label>
          </div>

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

          <label class="campo"><span>Título</span><input id="tTitulo" type="text" value="${esc(r.titulo)}" placeholder="Ex.: Força base — semana 3" required /></label>
          <div class="linha-campos">
            <label class="campo"><span>Duração prevista (min)</span><input id="tDur" type="number" inputmode="numeric" min="0" max="600" value="${esc(r.duracao_prevista)}" /></label>
            <label class="campo"><span>RPE alvo</span><input id="tRpe" type="text" value="${esc(r.rpe_alvo)}" placeholder="Ex.: 6–7" /></label>
          </div>
          <label class="campo"><span>Notas para o atleta</span><textarea id="tNotas" rows="3" placeholder="Cargas, foco técnico, o que fazer se estiver cansado…">${esc(r.notas_treinador)}</textarea></label>

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
                    <select class="i-ex" aria-label="Exercício">${opcoesEx(it.ex)}</select>
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
  function datasRepetir(r) {
    if (r.id || !r.dias.length) return r.data ? [r.data] : [];
    const semanas = Math.min(16, Math.max(1, Number(r.semanas) || 1));
    const inicio = segundaDe(r.data);
    const datas = [];
    for (let w = 0; w < semanas; w++) {
      r.dias.forEach((i) => {
        const dt = somarDias(inicio, w * 7 + i);
        if (dt >= r.data) datas.push(dt);
      });
    }
    return datas.sort();
  }

  function textoRepetir(r) {
    const datas = datasRepetir(r);
    const n = Math.max(1, r.atletas.length);
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
      r.semanas = $("tSemanas").value;
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
    r.sessao_id = s.id;
    r.titulo = s.nome;
    r.duracao_prevista = s.duracao;
    r.rpe_alvo = s.rpe;
    if (!r.notas_treinador) r.notas_treinador = s.nota;
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

  function datasPlano(p) {
    const semanas = Math.min(16, Math.max(1, Number(p.semanas) || 1));
    const inicio = segundaDe(p.inicio);
    const lista = [];
    for (let w = 0; w < semanas; w++) {
      [[p.dia1, 0], [p.dia2, 1]].forEach(([d, i]) => {
        const data = somarDias(inicio, w * 7 + Number(d));
        if (data >= p.inicio) lista.push({ data, dia: i, semana: w + 1 });
      });
    }
    return lista.sort((a, b) => a.data.localeCompare(b.data));
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
          <div class="linha-campos">
            <label class="campo"><span>Começa na semana de</span><input id="pInicio" type="date" value="${esc(p.inicio)}" /></label>
            <label class="campo"><span>Semanas</span><input id="pSemanas" type="number" inputmode="numeric" min="1" max="16" value="${esc(p.semanas)}" /></label>
          </div>
          <div class="linha-campos">
            <label class="campo"><span>Dia 1 (${esc(f.dias[0].foco)})</span>${sel("pDia1", p.dia1)}</label>
            <label class="campo"><span>Dia 2 (${esc(f.dias[1].foco)})</span>${sel("pDia2", p.dia2)}</label>
          </div>
          <label class="check"><input type="checkbox" id="pDescarga" ${p.descarga ? "checked" : ""} /> Semana de descarga a cada 4.ª semana (uma série a menos em cada exercício)</label>
          <p class="resumo-plano">${datas.length && nAtl
            ? `<strong>${datas.length * nAtl}</strong> treinos: ${datas.length} por atleta, de ${esc(dataBonita(datas[0].data))} a ${esc(dataBonita(datas[datas.length - 1].data))}.`
            : !nAtl ? "Escolhe pelo menos um atleta." : "Nenhuma data a partir do início escolhido."}</p>
          <button class="btn primario grande" type="submit" ${datas.length && nAtl ? "" : "disabled"}>Criar treinos</button>
        </form>
      </section>`;
  }

  function lerFormPlano() {
    const p = est.plano;
    if (!p || !$("fPlano")) return;
    p.atletas = [...document.querySelectorAll('input[name="pAtleta"]:checked')].map((i) => i.value);
    p.inicio = $("pInicio").value || p.inicio;
    p.semanas = $("pSemanas").value;
    p.dia1 = Number($("pDia1").value);
    p.dia2 = Number($("pDia2").value);
    p.descarga = $("pDescarga").checked;
  }

  async function guardarPlano() {
    lerFormPlano();
    const p = est.plano;
    if (p.dia1 === p.dia2) return toast("Escolhe dois dias diferentes.");
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
          blocos: s.blocos
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
    const novos = data.map((t) => ({
      atleta_id: t.atleta_id, data: somarDias(t.data, 7), sessao_id: t.sessao_id, titulo: t.titulo,
      duracao_prevista: t.duracao_prevista, rpe_alvo: t.rpe_alvo, notas_treinador: t.notas_treinador, blocos: t.blocos
    }));
    const res = await sb.from("treinos").insert(novos).select("id");
    if (res.error) { btn.disabled = false; return erro(res.error); }
    toast(`${novos.length} treino${novos.length === 1 ? "" : "s"} copiado${novos.length === 1 ? "" : "s"} para a próxima semana.`);
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

        ${[["Sessões curtas e blocos", false]].map(([grupo, comp]) => `
        <h2 class="titulo-secao">${grupo}</h2>
        <div class="lista-sessoes">
          ${est.sessoes.filter((s) => !s.nivel).map((s) => `
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
  });

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("button, a");
    if (!el) return;

    if (el.dataset.modo) { vistaEntrar(el.dataset.modo); return; }
    if (el.id === "btnRecarregar") { iniciarSessao(); return; }
    if (el.dataset.voltar) { ev.preventDefault(); history.length > 1 ? history.back() : (location.hash = "#biblioteca"); return; }

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
      $("rpeLegenda").textContent = `${ESCALA_RPE[n][1]} — ${ESCALA_RPE[n][2]}`;
      return;
    }

    // Treinador
    if (el.dataset.aprovar) { aprovar(el.dataset.aprovar, true); return; }
    if (el.dataset.recusar) { aprovar(el.dataset.recusar, false); return; }
    if (el.dataset.duplicar && est.treinoAtual) {
      est.duplicarDe = est.treinoAtual;
      location.hash = "#novo";
      return;
    }
    if (el.dataset.copiarSemana) { copiarSemana(el, el.dataset.copiarSemana); return; }
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

  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (el.id === "tModelo" && est.rascunho) {
      lerFormTreino();
      if (el.value) aplicarModelo(el.value);
      else est.rascunho.sessao_id = "";
      vistaFormTreino({});
    }
    if (el.closest && el.closest("#fPlano") && est.plano) {
      lerFormPlano();
      vistaPlano(est.plano.chave);
      return;
    }
    // Atualiza o resumo da repetição.
    if ((el.name === "dia" || el.name === "atleta" || el.id === "tSemanas" || el.id === "tData") && est.rascunho && $("resumoRepetir")) {
      lerFormTreino();
      $("resumoRepetir").textContent = textoRepetir(est.rascunho);
    }
    // Ao escolher um exercício sem dose, sugere a dose habitual.
    if (el.classList.contains("i-ex")) {
      const dose = el.closest(".item-edit").querySelector(".i-dose");
      const e = est.exPorId[el.value];
      if (e && !dose.value) dose.value = e.dose;
    }
  });

  document.addEventListener("input", (ev) => {
    if (ev.target.id === "fPesquisa") {
      est.filtros.texto = ev.target.value;
      desenharListaEx();
    }
  });

  $("btnSair").addEventListener("click", async () => {
    await sb.auth.signOut();
  });

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
        est.utilizador = null;
        est.perfil = null;
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
