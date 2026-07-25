(function () {
  "use strict";

  const STORAGE_KEY = "workDashboard.fcporto.v1";
  const API_BASE = "https://api.app.fcporto.pt/v2";

  const MODALITIES = [
    { key: "andebol", label: "Andebol", sportName: "Andebol", auto: true },
    { key: "basquetebol", label: "Basquetebol", sportName: "Basquetebol", auto: true },
    { key: "hoquei", label: "Hóquei em Patins", sportName: "Hóquei em Patins", auto: true },
    { key: "futsal", label: "Futsal", auto: false },
    { key: "voleibol", label: "Voleibol", auto: false },
  ];

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Plantel de voleibol feminino ainda em formação para 2026/27 — jogadoras confirmadas
  // (renovações/reforços oficializados) segundo noticiário do FC Porto e imprensa desportiva
  // a 25/07/2026. Sem calendário divulgado ainda. Confirma e ajusta em "Modalidades FC Porto"
  // à medida que saem mais anúncios.
  const SEED_VOLEIBOL_SQUAD = [
    { id: "seed-1", number: "", name: "Beatriz Basto", position: "Líbero" },
    { id: "seed-2", number: "", name: "Annie Cesar", position: "Líbero" },
    { id: "seed-3", number: "", name: "Milana Bozic", position: "Distribuidora" },
    { id: "seed-4", number: "", name: "Saska Durovic", position: "Central" },
    { id: "seed-5", number: "", name: "Kelsey Veltman", position: "Central" },
    { id: "seed-6", number: "", name: "Natalia Murek", position: "Zona 4" },
    { id: "seed-7", number: "", name: "Caylen Alexander", position: "Zona 4" },
  ];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt storage */ }
    return { voleibol: { squad: SEED_VOLEIBOL_SQUAD.slice(), matches: [] } };
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();
  let activeModality = "andebol";

  function modalityState(key) {
    if (!state[key]) state[key] = {};
    return state[key];
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function fmtDateTime(iso) {
    if (!iso) return "—";
    const d = new Date(iso.replace(" ", "T"));
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }) + " · " +
      d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  }
  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
  }
  function fmtUpdatedAt(iso) {
    if (!iso) return "Nunca atualizado";
    const d = new Date(iso);
    return "Atualizado em " + d.toLocaleDateString("pt-PT") + " às " + d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  }

  // ---------- FC Porto API ----------
  async function apiGet(path) {
    const res = await fetch(API_BASE + path, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    return json.data;
  }

  function normalizePlayer(p) {
    return {
      id: p.id,
      number: p.number || "",
      name: p.full_name || p.short_name || "",
      position: (p.position && p.position.name) || "",
      photo: (p.profile && (p.profile.thumb || p.profile.image)) || "",
    };
  }

  function normalizeMatch(m) {
    const home = m.home_team || {};
    const away = m.away_team || {};
    return {
      id: m.id,
      date: m.date,
      home: home.short_name || home.acronym || "?",
      homeBadge: (home.badge && (home.badge.thumb || home.badge.image)) || "",
      away: away.short_name || away.acronym || "?",
      awayBadge: (away.badge && (away.badge.thumb || away.badge.image)) || "",
      homeScore: m.home_team_score,
      awayScore: m.away_team_score,
      competition: (m.competition && m.competition.name) || "",
      place: m.place || "",
    };
  }

  function normalizeStandingRow(r) {
    const team = r.team || {};
    return {
      position: r.position ?? r.rank ?? "",
      team: team.short_name || team.name || r.team_name || "",
      played: r.played ?? r.games_played ?? "",
      won: r.won ?? r.wins ?? "",
      drawn: r.drawn ?? r.draws ?? "",
      lost: r.lost ?? r.losses ?? "",
      points: r.points ?? "",
      isFcPorto: /porto/i.test(team.short_name || team.name || r.team_name || ""),
    };
  }

  async function updateAutoModality(key) {
    const mod = MODALITIES.find((m) => m.key === key);
    const ms = modalityState(key);
    ms.loading = true;
    ms.error = null;
    renderModalityContent(key);

    try {
      const sports = await apiGet("/sports");
      const sport = (sports || []).find((s) => s.name === mod.sportName);
      if (!sport || !sport.main_team) throw new Error("Modalidade não encontrada na API do FC Porto");
      const teamId = sport.main_team.id;

      const [players, matches, standings] = await Promise.all([
        apiGet(`/teams/${teamId}/players`).catch(() => []),
        apiGet(`/teams/${teamId}/matches?limit=50`).catch(() => []),
        apiGet(`/teams/${teamId}/standings`).catch(() => []),
      ]);

      ms.team = {
        id: teamId,
        name: sport.main_team.short_name || "FC Porto",
        badge: (sport.main_team.badge && (sport.main_team.badge.thumb || sport.main_team.badge.image)) || "",
        coach: (sport.main_team.coach && sport.main_team.coach.full_name) || "",
      };
      ms.squad = (players || []).map(normalizePlayer);
      ms.matches = (matches || []).map(normalizeMatch);
      ms.standings = (standings || []).map(normalizeStandingRow);
      ms.updatedAt = new Date().toISOString();
      ms.error = null;
    } catch (err) {
      ms.error = "Não foi possível atualizar: " + err.message;
    } finally {
      ms.loading = false;
      saveState();
      renderModalityContent(key);
    }
  }

  // ---------- Rendering ----------
  function renderPills() {
    const el = document.getElementById("modalityPills");
    el.innerHTML = MODALITIES.map((m) => `
      <button class="modality-pill ${m.key === activeModality ? "active" : ""}" data-modality="${m.key}">
        ${escapeHtml(m.label)}${!m.auto ? '<span class="dot manual" title="Atualização manual"></span>' : ""}
      </button>
    `).join("");
    el.querySelectorAll(".modality-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeModality = btn.dataset.modality;
        renderPills();
        renderModalityContent(activeModality);
      });
    });
  }

  function renderModalityContent(key) {
    if (key !== activeModality) return;
    const mod = MODALITIES.find((m) => m.key === key);
    const el = document.getElementById("modalityContent");
    if (mod.auto) {
      el.innerHTML = renderAutoModality(mod, modalityState(key));
      wireAutoModalityEvents(key);
    } else {
      el.innerHTML = renderManualModality(mod, modalityState(key));
      wireManualModalityEvents(key);
    }
  }

  function renderAutoModality(mod, ms) {
    const team = ms.team;
    const squad = ms.squad || [];
    const matches = ms.matches || [];
    const standings = ms.standings || [];
    const now = new Date();
    const upcoming = matches.filter((m) => new Date(m.date.replace(" ", "T")) >= now).slice(0, 8);
    const played = matches.filter((m) => m.homeScore != null && m.awayScore != null).slice(-5).reverse();

    return `
      <div class="modality-header">
        ${team && team.badge ? `<img class="badge-img" src="${team.badge}" alt="" />` : ""}
        <div>
          <p class="modality-title">${team ? escapeHtml(team.name) : escapeHtml(mod.label)} — ${escapeHtml(mod.label)}</p>
          <p class="modality-sub">${team && team.coach ? "Treinador: " + escapeHtml(team.coach) : "Dados oficiais do site do FC Porto"}</p>
        </div>
        <div class="spacer"></div>
        <div>
          <div class="updated-at">${fmtUpdatedAt(ms.updatedAt)}</div>
          <button class="btn btn-primary" id="btnUpdateModality" style="margin-top:6px;" ${ms.loading ? "disabled" : ""}>
            ${ms.loading ? "A atualizar…" : "Atualizar dados"}
          </button>
        </div>
      </div>

      ${ms.error ? `<div class="card" style="border-color:var(--critical);color:var(--critical);margin-bottom:16px;">${escapeHtml(ms.error)}</div>` : ""}

      ${!ms.updatedAt && !ms.loading && !ms.error ? `<div class="card list-empty">Ainda sem dados. Clica em "Atualizar dados" para ir buscar o plantel, calendário e classificação ao site oficial do FC Porto.</div>` : ""}

      ${ms.updatedAt ? `
      <div class="modality-section">
        <h3>Plantel (${squad.length})</h3>
        <div class="squad-grid">
          ${squad.map((p) => `
            <div class="player-card">
              <div class="player-number">${escapeHtml(p.number)}</div>
              ${p.photo ? `<img src="${p.photo}" alt="" />` : `<div style="width:64px;height:64px;border-radius:50%;background:var(--surface-2);margin:0 auto;"></div>`}
              <div class="player-name">${escapeHtml(p.name)}</div>
              <div class="player-position">${escapeHtml(p.position)}</div>
            </div>
          `).join("") || `<div class="list-empty">Sem plantel disponível.</div>`}
        </div>
      </div>

      <div class="grid-2">
        <div class="modality-section">
          <h3>Próximos jogos</h3>
          <div class="match-list">
            ${upcoming.map(matchRow).join("") || `<div class="list-empty">Sem jogos agendados.</div>`}
          </div>
        </div>
        <div class="modality-section">
          <h3>Últimos resultados</h3>
          <div class="match-list">
            ${played.map(matchRow).join("") || `<div class="list-empty">Sem resultados recentes.</div>`}
          </div>
        </div>
      </div>

      <div class="modality-section">
        <h3>Classificação</h3>
        ${standings.length ? `
        <div class="table-wrap">
          <table class="standings-table">
            <thead><tr><th>#</th><th>Equipa</th><th>J</th><th>V</th><th>E</th><th>D</th><th>Pts</th></tr></thead>
            <tbody>
              ${standings.map((r) => `
                <tr class="${r.isFcPorto ? "is-fcporto" : ""}">
                  <td>${escapeHtml(r.position)}</td>
                  <td>${escapeHtml(r.team)}</td>
                  <td>${escapeHtml(r.played)}</td>
                  <td>${escapeHtml(r.won)}</td>
                  <td>${escapeHtml(r.drawn)}</td>
                  <td>${escapeHtml(r.lost)}</td>
                  <td>${escapeHtml(r.points)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ` : `<div class="card list-empty">Classificação ainda não disponível (normalmente só sai depois da época começar).</div>`}
      </div>
      ` : ""}
    `;
  }

  function matchRow(m) {
    return `
      <div class="match-row">
        <div class="match-date">${fmtDateTime(m.date)}</div>
        <div class="match-teams">
          ${m.homeBadge ? `<img src="${m.homeBadge}" alt="" />` : ""}
          <span>${escapeHtml(m.home)}</span>
          <span class="match-score">${m.homeScore != null ? m.homeScore : "-"} : ${m.awayScore != null ? m.awayScore : "-"}</span>
          <span>${escapeHtml(m.away)}</span>
          ${m.awayBadge ? `<img src="${m.awayBadge}" alt="" />` : ""}
        </div>
        <div class="match-competition">${escapeHtml(m.competition)}</div>
      </div>
    `;
  }

  function wireAutoModalityEvents(key) {
    const btn = document.getElementById("btnUpdateModality");
    if (btn) btn.addEventListener("click", () => updateAutoModality(key));
  }

  // ---------- Manual modalities (Futsal / Voleibol) ----------
  function renderManualModality(mod, ms) {
    const squad = ms.squad || [];
    const matches = ms.matches || [];
    const sorted = [...matches].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));

    return `
      <div class="modality-header">
        <div>
          <p class="modality-title">${escapeHtml(mod.label)}</p>
          <p class="modality-sub"><span class="manual-badge">Atualização manual</span></p>
        </div>
        <div class="spacer"></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="section-head" style="margin-bottom:10px;">
            <h2 style="font-size:1rem;">Plantel (${squad.length})</h2>
            <button class="btn btn-ghost" id="btnAddManualPlayer">+ Jogador</button>
          </div>
          <div class="list">
            ${squad.map((p) => `
              <div class="list-item" data-player-id="${p.id}">
                <div>
                  <span class="list-item-title">${p.number ? "#" + escapeHtml(p.number) + " · " : ""}${escapeHtml(p.name)}</span>
                  <div class="list-item-sub">${escapeHtml(p.position || "")}</div>
                </div>
                <button class="btn btn-ghost manual-player-edit" data-id="${p.id}">Editar</button>
              </div>
            `).join("") || `<div class="list-empty">Sem jogadores. Adiciona o plantel manualmente.</div>`}
          </div>
        </div>

        <div class="card">
          <div class="section-head" style="margin-bottom:10px;">
            <h2 style="font-size:1rem;">Jogos (${matches.length})</h2>
            <button class="btn btn-ghost" id="btnAddManualMatch">+ Jogo</button>
          </div>
          <div class="list">
            ${sorted.map((m) => `
              <div class="list-item" data-match-id="${m.id}">
                <div>
                  <span class="list-item-title">FC Porto ${m.venue === "casa" ? "vs" : "@"} ${escapeHtml(m.opponent)}</span>
                  <div class="list-item-sub">${fmtDate(m.date)}${m.competition ? " · " + escapeHtml(m.competition) : ""}${m.result ? " · " + escapeHtml(m.result) : ""}</div>
                </div>
                <button class="btn btn-ghost manual-match-edit" data-id="${m.id}">Editar</button>
              </div>
            `).join("") || `<div class="list-empty">Sem jogos registados.</div>`}
          </div>
        </div>
      </div>
    `;
  }

  function wireManualModalityEvents(key) {
    const addPlayerBtn = document.getElementById("btnAddManualPlayer");
    if (addPlayerBtn) addPlayerBtn.addEventListener("click", () => openManualPlayerModal(key, null));
    document.querySelectorAll(".manual-player-edit").forEach((btn) => {
      btn.addEventListener("click", () => openManualPlayerModal(key, btn.dataset.id));
    });

    const addMatchBtn = document.getElementById("btnAddManualMatch");
    if (addMatchBtn) addMatchBtn.addEventListener("click", () => openManualMatchModal(key, null));
    document.querySelectorAll(".manual-match-edit").forEach((btn) => {
      btn.addEventListener("click", () => openManualMatchModal(key, btn.dataset.id));
    });
  }

  // ---------- Manual player modal ----------
  const manualPlayerModal = document.getElementById("manualPlayerModal");
  let manualPlayerModality = null;

  function openManualPlayerModal(modalityKey, playerId) {
    manualPlayerModality = modalityKey;
    const ms = modalityState(modalityKey);
    const player = playerId ? (ms.squad || []).find((p) => p.id === playerId) : null;
    document.getElementById("manualPlayerModalTitle").textContent = player ? "Editar jogador" : "Novo jogador";
    document.getElementById("manualPlayerId").value = player ? player.id : "";
    document.getElementById("manualPlayerNumber").value = player ? player.number : "";
    document.getElementById("manualPlayerName").value = player ? player.name : "";
    document.getElementById("manualPlayerPosition").value = player ? player.position : "";
    document.getElementById("manualPlayerDelete").hidden = !player;
    manualPlayerModal.classList.remove("hidden");
  }
  function closeManualPlayerModal() { manualPlayerModal.classList.add("hidden"); }

  document.getElementById("manualPlayerCancel").addEventListener("click", closeManualPlayerModal);
  manualPlayerModal.addEventListener("click", (e) => { if (e.target === manualPlayerModal) closeManualPlayerModal(); });

  document.getElementById("manualPlayerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const ms = modalityState(manualPlayerModality);
    if (!ms.squad) ms.squad = [];
    const id = document.getElementById("manualPlayerId").value;
    const data = {
      number: document.getElementById("manualPlayerNumber").value.trim(),
      name: document.getElementById("manualPlayerName").value.trim(),
      position: document.getElementById("manualPlayerPosition").value.trim(),
    };
    if (!data.name) return;
    if (id) {
      Object.assign(ms.squad.find((p) => p.id === id), data);
    } else {
      ms.squad.push({ id: uid(), ...data });
    }
    saveState();
    closeManualPlayerModal();
    renderModalityContent(manualPlayerModality);
  });

  document.getElementById("manualPlayerDelete").addEventListener("click", () => {
    const ms = modalityState(manualPlayerModality);
    const id = document.getElementById("manualPlayerId").value;
    if (!id || !confirm("Eliminar este jogador?")) return;
    ms.squad = (ms.squad || []).filter((p) => p.id !== id);
    saveState();
    closeManualPlayerModal();
    renderModalityContent(manualPlayerModality);
  });

  // ---------- Manual match modal ----------
  const manualMatchModal = document.getElementById("manualMatchModal");
  let manualMatchModality = null;

  function openManualMatchModal(modalityKey, matchId) {
    manualMatchModality = modalityKey;
    const ms = modalityState(modalityKey);
    const match = matchId ? (ms.matches || []).find((m) => m.id === matchId) : null;
    document.getElementById("manualMatchModalTitle").textContent = match ? "Editar jogo" : "Novo jogo";
    document.getElementById("manualMatchId").value = match ? match.id : "";
    document.getElementById("manualMatchDate").value = match ? match.date : "";
    document.getElementById("manualMatchOpponent").value = match ? match.opponent : "";
    document.getElementById("manualMatchVenue").value = match ? match.venue : "casa";
    document.getElementById("manualMatchCompetition").value = match ? match.competition : "";
    document.getElementById("manualMatchResult").value = match ? match.result : "";
    document.getElementById("manualMatchDelete").hidden = !match;
    manualMatchModal.classList.remove("hidden");
  }
  function closeManualMatchModal() { manualMatchModal.classList.add("hidden"); }

  document.getElementById("manualMatchCancel").addEventListener("click", closeManualMatchModal);
  manualMatchModal.addEventListener("click", (e) => { if (e.target === manualMatchModal) closeManualMatchModal(); });

  document.getElementById("manualMatchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const ms = modalityState(manualMatchModality);
    if (!ms.matches) ms.matches = [];
    const id = document.getElementById("manualMatchId").value;
    const data = {
      date: document.getElementById("manualMatchDate").value,
      opponent: document.getElementById("manualMatchOpponent").value.trim(),
      venue: document.getElementById("manualMatchVenue").value,
      competition: document.getElementById("manualMatchCompetition").value.trim(),
      result: document.getElementById("manualMatchResult").value.trim(),
    };
    if (!data.date || !data.opponent) return;
    if (id) {
      Object.assign(ms.matches.find((m) => m.id === id), data);
    } else {
      ms.matches.push({ id: uid(), ...data });
    }
    saveState();
    closeManualMatchModal();
    renderModalityContent(manualMatchModality);
  });

  document.getElementById("manualMatchDelete").addEventListener("click", () => {
    const ms = modalityState(manualMatchModality);
    const id = document.getElementById("manualMatchId").value;
    if (!id || !confirm("Eliminar este jogo?")) return;
    ms.matches = (ms.matches || []).filter((m) => m.id !== id);
    saveState();
    closeManualMatchModal();
    renderModalityContent(manualMatchModality);
  });

  // ---------- Init ----------
  renderPills();

  const fcpTabBtn = document.querySelector('.tab[data-tab="fcporto"]');
  if (fcpTabBtn) {
    fcpTabBtn.addEventListener("click", () => renderModalityContent(activeModality));
  }
})();
