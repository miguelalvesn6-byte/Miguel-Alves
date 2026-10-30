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
    if (n <= 3) return "var(--rpe-low)";
    if (n <= 6) return "var(--rpe-mid)";
    return "var(--rpe-high)";
  }

  function tagsDisciplinas(lista) {
    return lista.map((d) => `<span class="tag d-${d}">${DISCIPLINAS[d]}</span>`).join("");
  }

  // ---------- Sessões ----------
  function renderSessoes() {
    const cartao = (s) => {
      const disc = new Set();
      s.blocos.forEach((b) => b.itens.forEach((i) => (exPorId[i.ex]?.disciplinas || []).forEach((d) => disc.add(d))));
      return `
        <a class="cartao-sessao" href="#s-${s.id}">
          <div class="minutos"><div><b>${s.duracao}</b><br><span>min</span></div></div>
          <div>
            <h2>${esc(s.nome)}</h2>
            <p class="meta">${esc(s.fase)} · ${esc(s.frequencia)} · RPE ${esc(s.rpe)}</p>
            <p class="obj">${esc(s.objetivo)}</p>
            <div class="tags" style="margin-top:.5rem">${tagsDisciplinas([...disc])}</div>
          </div>
        </a>`;
    };
    const casa = SESSOES.filter((s) => s.casa);
    const outras = SESSOES.filter((s) => !s.completa && !s.casa);
    $("listaSessoes").innerHTML = `
      <h2 class="titulo-grupo">Planeamento por fases · 2 dias por semana</h2>
      <p class="muted-grupo">Cada sessão (até 1 h): Mobilidade → Técnica de corrida → Pliometria → Força inferior → Força superior e core</p>
      ${htmlPlaneamento(nivelAtual, (id) => "#s-" + id)}
      <h2 class="titulo-grupo">Em casa · só peso do corpo ou pouco material</h2>
      ${casa.map(cartao).join("")}
      <h2 class="titulo-grupo">Sessões curtas e blocos</h2>
      ${outras.map(cartao).join("")}`;
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
      <div class="niveis" role="group" aria-label="Nível">
        ${P.niveis.map((n) => `<button type="button" class="chip-nivel" data-nivel="${n.id}" aria-pressed="${n.id === nv.id}">${n.nome}</button>`).join("")}
      </div>
      <p class="nivel-desc">${esc(nv.descricao)}</p>
      <ol class="fases">
        ${P.fases.map((f) => `
          <li class="fase">
            <div class="fase-cab">
              <h3>${esc(f.nome)}</h3>
              <span class="fase-sem">${esc(f.semanas)} · RPE ${esc(f.rpe[P.niveis.indexOf(nv)])}</span>
            </div>
            <p class="fase-obj">${esc(f.objetivo)}</p>
            ${f.nota ? `<p class="fase-nota">${esc(f.nota)}</p>` : ""}
            <div class="fase-dias">
              ${f.sessoes[nv.id].map((id) => {
                const s = porId[id];
                return `<a class="dia-link" href="${linkSessao(id)}"><b>Dia ${s.dia}</b><span>${esc(s.foco)}</span><small>${s.duracao} min</small></a>`;
              }).join("")}
            </div>
          </li>`).join("")}
      </ol>`;
  }

  function renderSessao(id) {
    const s = SESSOES.find((x) => x.id === id);
    const vista = $("vista-sessao");
    if (!s) {
      vista.innerHTML = `<a class="voltar" href="#sessoes">← Sessões</a><p class="vazio">Sessão não encontrada.</p>`;
      return;
    }
    const rpeNum = parseFloat(s.rpe);
    let n = 0;
    const blocos = s.blocos.map((b) => `
      <div class="bloco">
        <h3>${esc(b.titulo)}</h3>
        <ol class="passos">
          ${b.itens.map((i) => {
            n += 1;
            const e = exPorId[i.ex];
            const nome = e ? `<a class="nome" href="#ex-${e.id}">${esc(e.nome)}</a>` : `<span class="nome">${esc(i.ex)}</span>`;
            const desc = e ? `<span class="desc">${esc(e.musculos)}</span>` : "";
            const desc2 = i.descanso && i.descanso !== "—" ? `<small>desc. ${esc(i.descanso)}</small>` : "";
            const m = String(i.dose || "").match(/^(.*?)\s*\((.+)\)\s*$/);
            const extra = m ? `<small>${esc(m[2])}</small>` : "";
            return `<li class="passo"><span class="n">${n}</span><div>${nome}${desc}</div><div class="dose">${esc(m ? m[1] : i.dose)}${extra}${desc2}</div></li>`;
          }).join("")}
        </ol>
      </div>`).join("");

    vista.innerHTML = `
      <a class="voltar" href="#sessoes">← Sessões</a>
      <div class="det-cab">
        <h2>${esc(s.nome)}</h2>
        <p class="obj">${esc(s.objetivo)}</p>
        <dl class="factos">
          <div><dt>Duração</dt><dd>${s.duracao} min</dd></div>
          <div><dt>Fase</dt><dd>${esc(s.fase)}</dd></div>
          ${s.nivel ? `<div><dt>Nível · dia</dt><dd>${esc((window.PLANEAMENTO.niveis.find((n) => n.id === s.nivel) || {}).nome || s.nivel)} · Dia ${s.dia} (${esc(s.foco)})</dd></div>` : ""}
          <div><dt>Frequência</dt><dd>${esc(s.frequencia)}</dd></div>
          <div><dt>Onde</dt><dd>${esc(s.local)}</dd></div>
          <div><dt>RPE alvo</dt><dd><span class="rpe-alvo"><i style="background:${corRpe(rpeNum)}"></i>${esc(s.rpe)} / 10</span></dd></div>
        </dl>
        <div class="acoes">
          <button class="btn primario" type="button" data-copiar="s-${s.id}">Copiar link para o TrainingPeaks</button>
          <a class="btn" href="#escala">Ver escala RPE</a>
        </div>
      </div>
      ${s.nota ? `<p class="nota">${esc(s.nota)}</p>` : ""}
      ${blocos}`;
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

  function renderExercicios() {
    const t = normalizar(filtros.texto.trim());
    const lista = EXERCICIOS.filter((e) => {
      if (filtros.categoria && e.categoria !== filtros.categoria) return false;
      if (filtros.disciplina && !e.disciplinas.includes(filtros.disciplina)) return false;
      if (filtros.material && !e.material.includes(filtros.material)) return false;
      if (t && !normalizar(`${e.nome} ${e.musculos} ${e.nomeEn}`).includes(t)) return false;
      return true;
    });
    $("contagem").textContent = `${lista.length} de ${EXERCICIOS.length} exercícios`;
    $("listaExercicios").innerHTML = lista.length
      ? lista.map((e) => `
        <a class="linha-ex" href="#ex-${e.id}">
          <div>
            <h3>${esc(e.nome)}</h3>
            <p class="musc">${esc(e.musculos)}</p>
            <div class="tags"><span class="tag">${CATEGORIAS[e.categoria]}</span>${tagsDisciplinas(e.disciplinas)}</div>
          </div>
          <span class="dose-mini">${esc(e.dose)}</span>
        </a>`).join("")
      : `<p class="vazio">Nenhum exercício com estes filtros.</p>`;
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
      return;
    }
    const v = linkVideo(e);
    const sessoes = SESSOES.filter((s) => s.blocos.some((b) => b.itens.some((i) => i.ex === e.id)));
    const voltar = ultimaLista.startsWith("s-")
      ? `<a class="voltar" href="#${ultimaLista}">← Voltar à sessão</a>`
      : `<a class="voltar" href="#exercicios">← Exercícios</a>`;

    vista.innerHTML = `
      ${voltar}
      <div class="det-cab">
        <div class="tags"><span class="tag">${CATEGORIAS[e.categoria]}</span>${tagsDisciplinas(e.disciplinas)}</div>
        <h2>${esc(e.nome)}</h2>
        <p class="obj">${esc(e.musculos)}</p>
        <dl class="factos">
          <div><dt>Dose habitual</dt><dd class="dose-grande">${esc(e.dose)}</dd></div>
          <div><dt>Material</dt><dd>${e.material.map((m) => MATERIAIS[m]).join(", ")}</dd></div>
        </dl>
        <div class="acoes">
          <a class="btn primario" href="${esc(v.href)}" target="_blank" rel="noopener">${v.texto} ↗</a>
          <button class="btn" type="button" data-copiar="ex-${e.id}">Copiar link</button>
        </div>
      </div>

      <div class="secao-ex">
        <h3>Execução</h3>
        <ol class="execucao">${e.execucao.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
      </div>

      <div class="secao-ex">
        <h3>Erros comuns</h3>
        <ul class="erros">${e.erros.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>

      <div class="secao-ex duas">
        <div><h4>Mais fácil</h4><p>${esc(e.regressao)}</p></div>
        <div><h4>Mais difícil</h4><p>${esc(e.progressao)}</p></div>
      </div>

      ${sessoes.length ? `
      <div class="secao-ex">
        <h3>Aparece nas sessões</h3>
        <div class="usado-em">${sessoes.map((s) => `<a class="btn" href="#s-${s.id}">${esc(s.nome)}</a>`).join("")}</div>
      </div>` : ""}`;
  }

  // ---------- Escala ----------
  function renderEscala() {
    $("escala").innerHTML = ESCALA_RPE.map(([n, nome, desc]) =>
      `<li style="--c:${corRpe(n)}"><b>${n}</b><div><strong>${nome}</strong><span>${desc}</span></div></li>`
    ).join("");
  }

  // ---------- Navegação ----------
  const VISTAS = ["sessoes", "exercicios", "escala", "sessao", "exercicio"];

  function mostrar(vista, tabAtiva) {
    VISTAS.forEach((v) => ($("vista-" + v).hidden = v !== vista));
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("ativo", t.dataset.tab === tabAtiva));
  }

  function rota() {
    const h = decodeURIComponent(location.hash.slice(1)) || "sessoes";
    if (h.startsWith("s-")) {
      renderSessao(h.slice(2));
      mostrar("sessao", "sessoes");
      ultimaLista = h;
    } else if (h.startsWith("ex-")) {
      renderExercicio(h.slice(3));
      mostrar("exercicio", ultimaLista.startsWith("s-") ? "sessoes" : "exercicios");
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
