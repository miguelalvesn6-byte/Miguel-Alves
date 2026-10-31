(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  $("ano").textContent = new Date().getFullYear();

  // ---------- Menu no telemóvel ----------
  const topo = $("topo");
  const menuBotao = topo.querySelector(".menu-botao");
  const menu = $("menuPrincipal");
  function abrirMenu(abrir) {
    topo.classList.toggle("aberto", abrir);
    menuBotao.setAttribute("aria-expanded", String(abrir));
    menuBotao.querySelector(".menu-botao-txt").textContent = abrir ? "Fechar" : "Menu";
  }
  menuBotao.addEventListener("click", () => {
    const abrir = menuBotao.getAttribute("aria-expanded") !== "true";
    abrirMenu(abrir);
    if (abrir) { const l = menu.querySelector("a"); if (l) l.focus(); }
  });
  menu.addEventListener("click", (ev) => { if (ev.target.closest("a")) abrirMenu(false); });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && topo.classList.contains("aberto")) { abrirMenu(false); menuBotao.focus(); }
  });
  document.addEventListener("click", (ev) => {
    if (topo.classList.contains("aberto") && !topo.contains(ev.target)) abrirMenu(false);
  });
  topo.addEventListener("focusout", (ev) => {
    if (topo.classList.contains("aberto") && ev.relatedTarget && !topo.contains(ev.relatedTarget)) abrirMenu(false);
  });
  window.matchMedia("(min-width: 52.01rem)").addEventListener("change", (m) => { if (m.matches) abrirMenu(false); });

  // ---------- Preços: triatlo / corrida ----------
  const botoesMod = document.querySelectorAll(".modalidade button");
  function definirModalidade(mod, anunciar) {
    botoesMod.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.mod === mod)));
    document.querySelectorAll("[data-preco-triatlo]").forEach((el) => {
      el.textContent = el.dataset["preco" + (mod === "corrida" ? "Corrida" : "Triatlo")];
    });
    if (anunciar) $("modalidadeEstado").textContent = "Preços de " + (mod === "corrida" ? "corrida" : "triatlo");
  }
  botoesMod.forEach((b) => {
    b.addEventListener("click", () => {
      definirModalidade(b.dataset.mod, true);
      $("cMod").value = b.dataset.mod;
    });
  });
  // Mudar a modalidade no formulário também atualiza os preços.
  $("cMod").addEventListener("change", (ev) => definirModalidade(ev.target.value, false));

  // ---------- Barra fixa "Candidata-te" (telemóvel) ----------
  const barra = $("barraCta");
  const hero = document.querySelector(".hero");
  const cand = $("candidatura");
  let pendente = false;
  function atualizarBarra() {
    pendente = false;
    const passouHero = hero.getBoundingClientRect().bottom < 0;
    const perto = cand.getBoundingClientRect().top < window.innerHeight; // formulário (ou rodapé) à vista
    const visivel = passouHero && !perto;
    barra.classList.toggle("visivel", visivel);
    barra.setAttribute("aria-hidden", String(!visivel));
    barra.querySelector("a").tabIndex = visivel ? 0 : -1;
  }
  const pedir = () => { if (!pendente) { pendente = true; requestAnimationFrame(atualizarBarra); } };
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  atualizarBarra();

  // Escolher um plano preenche o formulário.
  document.querySelectorAll("[data-plano]").forEach((a) => {
    a.addEventListener("click", () => { $("cPlano").value = a.dataset.plano; });
  });

  // ---------- Candidatura → Supabase (tabela candidaturas) ----------
  // Os limites seguem as restrições da tabela (sql/04-candidaturas.sql).
  const form = $("fCandidatura");
  const estado = $("formEstado");
  const btn = form.querySelector("button[type=submit]");
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TEL = /^[0-9+()\s.\-]+$/;
  let enviando = false;

  function mostrar(msg, tipo) {
    estado.textContent = msg;
    estado.className = "form-estado " + (tipo || "");
  }
  function erroCampo(id, msg) {
    const campo = $(id);
    const caixa = $(campo.getAttribute("aria-describedby").split(" ")[0]);
    caixa.textContent = msg || "";
    if (msg) campo.setAttribute("aria-invalid", "true"); else campo.removeAttribute("aria-invalid");
  }

  // Contador da mensagem
  const msgCampo = $("cMsg");
  const conta = $("cMsgConta");
  const atualizarConta = () => { conta.textContent = msgCampo.value.length + "/2000"; };
  msgCampo.addEventListener("input", atualizarConta);

  // Ao corrigir um campo, o erro desaparece.
  ["cNome", "cEmail", "cTel", "cObj", "cMsg", "cConsent"].forEach((id) => {
    $(id).addEventListener(id === "cConsent" ? "change" : "input", () => {
      if ($(id).getAttribute("aria-invalid")) erroCampo(id, validar()[id]);
    });
  });

  function lerDados() {
    return {
      nome: $("cNome").value.trim(),
      email: $("cEmail").value.trim(),
      telefone: $("cTel").value.trim(),
      modalidade: $("cMod").value,
      nivel: $("cNivel").value,
      horas: $("cHoras").value,
      objetivo: $("cObj").value.trim(),
      plano: $("cPlano").value,
      mensagem: $("cMsg").value.trim(),
      consentimento: $("cConsent").checked
    };
  }
  function validar() {
    const d = lerDados();
    const e = {};
    if (d.nome.length < 2) e.cNome = "Escreve o teu nome (pelo menos 2 letras).";
    else if (d.nome.length > 120) e.cNome = "O nome pode ter no máximo 120 caracteres.";
    if (!d.email) e.cEmail = "Escreve o teu email.";
    else if (d.email.length < 5 || d.email.length > 200 || !EMAIL.test(d.email)) e.cEmail = "Confirma o email (ex.: nome@exemplo.pt).";
    if (d.telefone && (d.telefone.length > 30 || !TEL.test(d.telefone) || d.telefone.replace(/\D/g, "").length < 6)) e.cTel = "Confirma o número: só algarismos, espaços e o sinal +.";
    if (d.objetivo.length > 300) e.cObj = "O objetivo pode ter no máximo 300 caracteres.";
    if (d.mensagem.length > 2000) e.cMsg = "A mensagem pode ter no máximo 2000 caracteres.";
    if (!d.consentimento) e.cConsent = "Para te contactarmos, precisamos que aceites guardar estes dados.";
    return e;
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (enviando) return;
    const erros = validar();
    ["cNome", "cEmail", "cTel", "cObj", "cMsg", "cConsent"].forEach((id) => erroCampo(id, erros[id]));
    const ids = Object.keys(erros);
    if (ids.length) {
      mostrar(ids.length === 1 ? "Falta corrigir um campo." : "Falta corrigir " + ids.length + " campos.", "erro");
      $(ids[0]).focus();
      return;
    }
    const dados = lerDados();
    if (dados.modalidade !== "triatlo" && dados.modalidade !== "corrida") dados.modalidade = "triatlo";
    dados.nivel = dados.nivel.slice(0, 60);
    dados.plano = dados.plano.slice(0, 60);
    dados.horas = dados.horas.slice(0, 30);

    enviando = true;
    btn.disabled = true;
    form.setAttribute("aria-busy", "true");
    mostrar("A enviar…");
    const ctrl = "AbortController" in window ? new AbortController() : null;
    const limite = ctrl ? setTimeout(() => ctrl.abort(), 15000) : 0;
    try {
      const cfg = window.CONFIG || {};
      if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) throw new Error("Configuração em falta");
      const r = await fetch(`${cfg.supabaseUrl}/rest/v1/candidaturas`, {
        method: "POST",
        headers: {
          apikey: cfg.supabaseAnonKey,
          Authorization: `Bearer ${cfg.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(dados),
        signal: ctrl ? ctrl.signal : undefined
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      form.reset();
      atualizarConta();
      definirModalidade($("cMod").value, false);
      mostrar("Candidatura enviada. Obrigado! Entramos em contacto no prazo de 48 horas.", "ok");
    } catch (e) {
      console.warn("Candidatura não enviada:", e && e.message);
      mostrar("Não foi possível enviar agora. Os teus dados continuam no formulário: tenta outra vez dentro de alguns minutos.", "erro");
    } finally {
      clearTimeout(limite);
      enviando = false;
      btn.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
})();
