(function () {
  "use strict";

  const CATEGORIAS = {
    forca: "Força",
    core: "Core",
    mobilidade: "Mobilidade",
    prevencao: "Prevenção",
    ativacao: "Ativação",
    pliometria: "Pliometria",
    tecnica: "Técnica de corrida"
  };
  const DISCIPLINAS = { natacao: "Natação", ciclismo: "Ciclismo", corrida: "Corrida" };
  const MATERIAIS = {
    ginasio: "Ginásio",
    halteres: "Halteres",
    elastico: "Elástico",
    "peso-corporal": "Peso corporal",
    kettlebell: "Kettlebell",
    fitball: "Fitball",
    rolo: "Rolo",
    trx: "TRX",
    "bola-medicinal": "Bola medicinal",
    "escada-agilidade": "Escada de agilidade"
  };
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

  const exPorId = Object.fromEntries(EXERCICIOS.map((e) => [e.id, e]));
  const filtros = { texto: "", categoria: null, disciplina: null, material: null };
  let ultimaLista = "sessoes";

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function corRpe(n) {
    if (n <= 3) return "var(--rpe-1)";
    if (n <= 6) return "var(--rpe-2)";
    if (n <= 8) return "var(--rpe-3)";
    return "var(--rpe-4)";
  }

  function tagsDisciplinas(lista) {
    return lista.map((d) => `<span class="tag d-${d}">${DISCIPLINAS[d]}</span>`).join("");
  }

  const ICONE_LINK = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>`;
  const ESTRUTURA = ["Mobilidade", "Técnica de corrida", "Pliometria", "Força inferior", "Força superior e core"];

  // ---------- Sessões ----------
  function renderSessoes() {
    const cartao = (s) => {
      const disc = new Set();
      s.blocos.forEach((b) => b.itens.forEach((i) => (exPorId[i.ex]?.disciplinas || []).forEach((d) => disc.add(d))));
      const nEx = s.blocos.reduce((t, b) => t + b.itens.length, 0);
      return `
        <a class="cartao-sessao" href="#s-${s.id}">
          <div class="minutos"><b>${s.duracao}</b><span>min</span></div>
          <div class="cartao-corpo">
            <h3>${esc(s.nome)}</h3>
            <p class="meta"><span>${esc(s.fase)}</span><span>${esc(s.frequencia)}</span><span class="mono">RPE ${esc(s.rpe)}</span></p>
            <p class="obj">${esc(s.objetivo)}</p>
            <div class="tags">${tagsDisciplinas([...disc])}<span class="tag tag-num">${nEx} exercícios</span></div>
          </div>
          <span class="seta" aria-hidden="true">→</span>
        </a>`;
    };
    const casa = SESSOES.filter((s) => s.casa);
    const outras = SESSOES.filter((s) => !s.completa && !s.casa);
    $("listaSessoes").innerHTML = `
      <section class="grupo" aria-labelledby="gPlaneamento">
        <header class="grupo-cab">
          <p class="sobretitulo">Plano da época</p>
          <h2 id="gPlaneamento">Planeamento por fases</h2>
          <p>2 dias por semana. Cada sessão dura até 1 h e segue sempre a mesma ordem:</p>
          <ol class="estrutura">${ESTRUTURA.map((t, i) => `<li><span class="mono">${i + 1}</span>${t}</li>`).join("")}</ol>
        </header>
        ${htmlPlaneamento(nivelAtual, (id) => "#s-" + id)}
      </section>
      <section class="grupo" aria-labelledby="gCasa">
        <header class="grupo-cab">
          <p class="sobretitulo">Sem ginásio</p>
          <h2 id="gCasa">Em casa</h2>
          <p>Só peso do corpo ou pouco material.</p>
        </header>
        <div class="grelha-sessoes">${casa.map(cartao).join("")}</div>
      </section>
      <section class="grupo" aria-labelledby="gCurtas">
        <header class="grupo-cab">
          <p class="sobretitulo">Complementos</p>
          <h2 id="gCurtas">Sessões curtas e blocos</h2>
          <p>Ativações, core, prevenção, técnica e pliometria para juntar ao treino.</p>
        </header>
        <div class="grelha-sessoes">${outras.map(cartao).join("")}</div>
      </section>`;
  }

  // ---------- Planeamento por fases e níveis ----------
  let nivelAtual = "basico";
  try { nivelAtual = localStorage.getItem("nivelPlaneamento") || "basico"; } catch (_) { /* sem armazenamento */ }

  function htmlPlaneamento(nivel, linkSessao) {
    const P = window.PLANEAMENTO;
    if (!P) return "";
    const nv = P.niveis.find((n) => n.id === nivel) || P.niveis[0];
    const porId = Object.fromEntries(SESSOES.map((s) => [s.id, s]));
    return `
      <div class="painel-nivel">
        <p class="rotulo-filtro" id="lNivel">O teu nível</p>
        <div class="niveis" role="group" aria-labelledby="lNivel">
          ${P.niveis.map((n) => `<button type="button" class="chip-nivel" data-nivel="${n.id}" aria-pressed="${n.id === nv.id}">${n.nome}</button>`).join("")}
        </div>
        <p class="nivel-desc">${esc(nv.descricao)}</p>
      </div>
      <ol class="fases">
        ${P.fases.map((f, i) => `
          <li class="fase">
            <span class="fase-n mono" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
            <div class="fase-corpo">
              <div class="fase-cab">
                <h3><span class="sr">Fase ${i + 1}: </span>${esc(f.nome)}</h3>
                <p class="fase-sem"><span class="mono">${esc(f.semanas)}</span><span class="mono">RPE ${esc(f.rpe[P.niveis.indexOf(nv)])}</span></p>
              </div>
              <p class="fase-obj">${esc(f.objetivo)}</p>
              ${f.nota ? `<p class="fase-nota">${esc(f.nota)}</p>` : ""}
              <div class="fase-dias">
                ${f.sessoes[nv.id].map((id) => {
                  const s = porId[id];
                  return `<a class="dia-link" href="${linkSessao(id)}"><b>Dia ${s.dia}</b><span>${esc(s.foco)}</span><small class="mono">${s.duracao} min</small><i aria-hidden="true">→</i></a>`;
                }).join("")}
              </div>
            </div>
          </li>`).join("")}
      </ol>`;
  }

  function cabBloco(titulo) {
    const m = String(titulo).match(/^(.*?)\s*\((\d+)\s*min\)\s*$/);
    const nome = m ? m[1] : titulo;
    const num = nome.match(/^(\d+)\s*·\s*(.+)$/);
    return `<h3>${num ? `<span class="bloco-num mono">${num[1]}</span>${esc(num[2])}` : esc(nome)}</h3>${m ? `<span class="bloco-min mono">${m[2]} min</span>` : ""}`;
  }

  function renderSessao(id) {
    const s = SESSOES.find((x) => x.id === id);
    const vista = $("vista-sessao");
    if (!s) {
      vista.innerHTML = `<a class="voltar" href="#sessoes">← Sessões</a><p class="vazio">Sessão não encontrada.</p>`;
      return null;
    }
    const rpeNum = parseFloat(s.rpe);
    let n = 0;
    const blocos = s.blocos.map((b) => `
      <section class="bloco">
        <div class="bloco-cab">${cabBloco(b.titulo)}</div>
        <ol class="passos">
          ${b.itens.map((i) => {
            n += 1;
            const e = exPorId[i.ex];
            const nome = e ? `<a class="nome" href="#ex-${e.id}">${esc(e.nome)}</a>` : `<span class="nome">${esc(i.ex)}</span>`;
            const desc = e ? `<span class="desc">${esc(e.musculos)}</span>` : "";
            const desc2 = i.descanso && i.descanso !== "—" ? `<small class="descanso">desc. ${esc(i.descanso)}</small>` : "";
            const m = String(i.dose || "").match(/^(.*?)\s*\((.+)\)\s*$/);
            const extra = m ? `<small>${esc(m[2])}</small>` : "";
            return `<li class="passo"><span class="n mono">${n}</span><div class="passo-info">${nome}${desc}</div><div class="dose"><span class="dose-v">${esc(m ? m[1] : i.dose)}</span>${extra}${desc2}</div></li>`;
          }).join("")}
        </ol>
      </section>`).join("");

    const nivelNome = s.nivel ? ((window.PLANEAMENTO.niveis.find((x) => x.id === s.nivel) || {}).nome || s.nivel) : "";
    vista.innerHTML = `
      <a class="voltar" href="#sessoes">← Sessões</a>
      <div class="det-cab">
        <p class="sobretitulo">${s.nivel ? `${esc(nivelNome)} · Dia ${s.dia} · ${esc(s.foco)}` : s.casa ? "Em casa" : "Sessão"}</p>
        <h2>${esc(s.nome)}</h2>
        <p class="obj">${esc(s.objetivo)}</p>
        <dl class="factos">
          <div><dt>Duração</dt><dd class="mono">${s.duracao} min</dd></div>
          <div><dt>RPE alvo</dt><dd><span class="rpe-alvo"><i style="background:${corRpe(rpeNum)}"></i><span class="mono">${esc(s.rpe)} / 10</span></span></dd></div>
          <div><dt>Fase</dt><dd>${esc(s.fase)}</dd></div>
          ${s.nivel ? `<div><dt>Nível · dia</dt><dd>${esc(nivelNome)} · Dia ${s.dia} (${esc(s.foco)})</dd></div>` : ""}
          <div><dt>Frequência</dt><dd>${esc(s.frequencia)}</dd></div>
          <div class="facto-largo"><dt>Onde</dt><dd>${esc(s.local)}</dd></div>
        </dl>
        <div class="acoes">
          <button class="btn primario so-largo" type="button" data-copiar="s-${s.id}">${ICONE_LINK}Copiar link para o TrainingPeaks</button>
          <a class="btn" href="#escala">Ver escala RPE</a>
        </div>
      </div>
      ${s.nota ? `<p class="nota"><strong>Nota</strong>${esc(s.nota)}</p>` : ""}
      ${blocos}
      <div class="barra-fixa">
        <button class="btn primario" type="button" data-copiar="s-${s.id}">${ICONE_LINK}Copiar link para o TrainingPeaks</button>
      </div>`;
    return s.nome;
  }


  // ---------- Exercícios ----------
  function renderChips(contentorId, mapa, chave) {
    const el = $(contentorId);
    el.innerHTML =
      `<button class="chip" type="button" data-f="${chave}" data-v="" aria-pressed="${filtros[chave] === null}">Todos</button>` +
      Object.entries(mapa)
        .map(([v, label]) => `<button class="chip" type="button" data-f="${chave}" data-v="${v}" aria-pressed="${filtros[chave] === v}">${label}</button>`)
        .join("");
  }

  function renderFiltros() {
    renderChips("fCategoria", CATEGORIAS, "categoria");
    renderChips("fDisciplina", DISCIPLINAS, "disciplina");
    renderChips("fMaterial", MATERIAIS, "material");
  }

  function normalizar(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function haFiltros() {
    return Boolean(filtros.texto.trim() || filtros.categoria || filtros.disciplina || filtros.material);
  }

  function renderExercicios() {
    const t = normalizar(filtros.texto.trim());
    const lista = EXERCICIOS.filter((e) => {
      if (filtros.categoria && e.categoria !== filtros.categoria) return false;
      if (filtros.disciplina && !e.disciplinas.includes(filtros.disciplina)) return false;
      if (filtros.material && !e.material.includes(filtros.material)) return false;
      if (t && !normalizar(`${e.nome} ${e.musculos} ${e.nomeEn}`).includes(t)) return false;
      return true;
    });
    $("contagem").innerHTML = `<b class="mono">${lista.length}</b> de <span class="mono">${EXERCICIOS.length}</span> exercícios`;
    $("fLimpar").hidden = !haFiltros();
    $("listaExercicios").innerHTML = lista.length
      ? lista.map((e) => `
        <a class="linha-ex" href="#ex-${e.id}">
          <div class="linha-corpo">
            <span class="tag tag-cat c-${e.categoria}">${CATEGORIAS[e.categoria]}</span>
            <h3>${esc(e.nome)}</h3>
            <p class="musc">${esc(e.musculos)}</p>
            ${e.disciplinas.length ? `<div class="tags">${tagsDisciplinas(e.disciplinas)}</div>` : ""}
          </div>
          <span class="dose-mini mono">${esc(e.dose)}</span>
        </a>`).join("")
      : `<div class="vazio"><p>Nenhum exercício com estes filtros.</p><button class="btn" type="button" data-limpar>Limpar filtros</button></div>`;
  }

  function limparFiltros() {
    filtros.texto = "";
    filtros.categoria = filtros.disciplina = filtros.material = null;
    $("fPesquisa").value = "";
    renderFiltros();
    renderExercicios();
  }

  function linkVideo(e) {
    if (e.video) return { href: e.video, texto: "Ver vídeo" };
    const q = encodeURIComponent(`${e.nomeEn} exercise technique`);
    return { href: `https://www.youtube.com/results?search_query=${q}`, texto: "Procurar vídeo no YouTube" };
  }

  function renderExercicio(id) {
    const e = exPorId[id];
    const vista = $("vista-exercicio");
    if (!e) {
      vista.innerHTML = `<a class="voltar" href="#exercicios">← Exercícios</a><p class="vazio">Exercício não encontrado.</p>`;
      return null;
    }
    const v = linkVideo(e);
    const sessoes = SESSOES.filter((s) => s.blocos.some((b) => b.itens.some((i) => i.ex === e.id)));
    const voltar = ultimaLista.startsWith("s-")
      ? `<a class="voltar" href="#${ultimaLista}">← Voltar à sessão</a>`
      : `<a class="voltar" href="#exercicios">← Exercícios</a>`;

    vista.innerHTML = `
      ${voltar}
      <div class="det-cab">
        <div class="tags"><span class="tag tag-cat c-${e.categoria}">${CATEGORIAS[e.categoria]}</span>${tagsDisciplinas(e.disciplinas)}</div>
        <h2>${esc(e.nome)}</h2>
        <p class="obj">${esc(e.musculos)}</p>
        <dl class="factos">
          <div><dt>Dose habitual</dt><dd class="dose-grande mono">${esc(e.dose)}</dd></div>
          <div><dt>Material</dt><dd>${e.material.map((m) => MATERIAIS[m]).join(", ")}</dd></div>
        </dl>
        <div class="acoes">
          <a class="btn primario" href="${esc(v.href)}" target="_blank" rel="noopener"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>${v.texto} <span aria-hidden="true">↗</span><span class="sr"> (abre noutra janela)</span></a>
          <button class="btn" type="button" data-copiar="ex-${e.id}">${ICONE_LINK}Copiar link</button>
        </div>
      </div>

      <section class="secao-ex">
        <h3>Execução</h3>
        <ol class="execucao">${e.execucao.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
      </section>

      <section class="secao-ex erros-caixa">
        <h3><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.3"/></svg>Erros comuns</h3>
        <ul class="erros">${e.erros.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </section>

      <section class="secao-ex duas" aria-label="Variações">
        <div class="var-facil"><h4><span aria-hidden="true">↓</span> Mais fácil</h4><p>${esc(e.regressao)}</p></div>
        <div class="var-dificil"><h4><span aria-hidden="true">↑</span> Mais difícil</h4><p>${esc(e.progressao)}</p></div>
      </section>

      ${sessoes.length ? `
      <section class="secao-ex">
        <h3>Aparece nas sessões</h3>
        <div class="usado-em">${sessoes.map((s) => `<a class="btn" href="#s-${s.id}">${esc(s.nome)}</a>`).join("")}</div>
      </section>` : ""}`;
    return e.nome;
  }

  // ---------- Escala ----------
  function renderEscala() {
    $("escala").innerHTML = ESCALA_RPE.map(([n, nome, desc]) =>
      `<li style="--c:${corRpe(n)}"><b class="mono">${n}</b><div><strong>${nome}</strong><span>${desc}</span></div></li>`
    ).join("");
  }

  // ---------- Navegação ----------
  const VISTAS = ["sessoes", "exercicios", "escala", "sessao", "exercicio"];
  const TITULOS = { sessoes: "Sessões", exercicios: "Exercícios", escala: "Escala RPE" };

  function mostrar(vista, tabAtiva, titulo) {
    VISTAS.forEach((v) => ($("vista-" + v).hidden = v !== vista));
    document.body.dataset.vista = vista;
    document.querySelectorAll(".tab").forEach((t) => {
      const ativo = t.dataset.tab === tabAtiva;
      t.classList.toggle("ativo", ativo);
      if (ativo) t.setAttribute("aria-current", "page");
      else t.removeAttribute("aria-current");
    });
    document.title = `${titulo || TITULOS[tabAtiva] || "Biblioteca"} · Biblioteca · CF Training`;
  }

  function rota() {
    const h = decodeURIComponent(location.hash.slice(1)) || "sessoes";
    if (h.startsWith("s-")) {
      const nome = renderSessao(h.slice(2));
      mostrar("sessao", "sessoes", nome);
      ultimaLista = h;
    } else if (h.startsWith("ex-")) {
      const nome = renderExercicio(h.slice(3));
      mostrar("exercicio", ultimaLista.startsWith("s-") ? "sessoes" : "exercicios", nome);
    } else if (h === "exercicios") {
      mostrar("exercicios", "exercicios");
      ultimaLista = h;
    } else if (h === "escala") {
      mostrar("escala", "escala");
    } else {
      mostrar("sessoes", "sessoes");
      ultimaLista = "sessoes";
    }
    window.scrollTo(0, 0);
  }

  // ---------- Copiar link ----------
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.hidden = true), 2200);
  }

  function copiar(token) {
    const url = location.href.split("#")[0] + "#" + token;
    const fallback = () => {
      const i = document.createElement("input");
      i.value = url;
      document.body.appendChild(i);
      i.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_) { /* ignorado */ }
      i.remove();
      toast(ok ? "Link copiado" : url);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => toast("Link copiado"), fallback);
    } else {
      fallback();
    }
  }

  // ---------- Eventos ----------
  document.addEventListener("click", (ev) => {
    const chipNivel = ev.target.closest(".chip-nivel");
    if (chipNivel) {
      nivelAtual = chipNivel.dataset.nivel;
      try { localStorage.setItem("nivelPlaneamento", nivelAtual); } catch (_) { /* sem armazenamento */ }
      renderSessoes();
      const foco = document.querySelector(`.chip-nivel[data-nivel="${nivelAtual}"]`);
      if (foco) foco.focus();
      return;
    }
    if (ev.target.closest("[data-limpar], #fLimpar")) {
      limparFiltros();
      $("fPesquisa").focus();
      return;
    }
    const chip = ev.target.closest(".chip");
    if (chip) {
      filtros[chip.dataset.f] = chip.dataset.v || null;
      renderFiltros();
      renderExercicios();
      return;
    }
    const c = ev.target.closest("[data-copiar]");
    if (c) copiar(c.dataset.copiar);
  });

  $("fPesquisa").addEventListener("input", (ev) => {
    filtros.texto = ev.target.value;
    renderExercicios();
  });

  window.addEventListener("hashchange", rota);

  renderSessoes();
  renderFiltros();
  renderExercicios();
  renderEscala();
  rota();
})();
