(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  $("ano").textContent = new Date().getFullYear();

  document.documentElement.classList.add("js");

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
  const form = $("fCandidatura");
  const estado = $("formEstado");

  function mostrar(msg, tipo) {
    estado.textContent = msg;
    estado.className = "form-estado " + (tipo || "");
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const dados = {
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
    if (dados.nome.length < 2) return mostrar("Escreve o teu nome.", "erro");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) return mostrar("Confirma o teu email.", "erro");
    if (!dados.consentimento) return mostrar("Para te contactarmos, precisamos que aceites guardar estes dados.", "erro");

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    mostrar("A enviar…");
    try {
      const cfg = window.CONFIG || {};
      const r = await fetch(`${cfg.supabaseUrl}/rest/v1/candidaturas`, {
        method: "POST",
        headers: {
          apikey: cfg.supabaseAnonKey,
          Authorization: `Bearer ${cfg.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(dados)
      });
      if (!r.ok) throw new Error(String(r.status));
      form.reset();
      mostrar("Candidatura enviada. Entramos em contacto em até 48 horas.", "ok");
    } catch (e) {
      console.error(e);
      mostrar("Não foi possível enviar agora. Tenta outra vez dentro de alguns minutos.", "erro");
    } finally {
      btn.disabled = false;
    }
  });
})();
