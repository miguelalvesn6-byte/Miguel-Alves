(function () {
  "use strict";

  const STORAGE_KEY = "workDashboard.v1";
  const THEME_KEY = "workDashboard.theme";

  const STATUS_LABELS = {
    "planeamento": "Planeamento",
    "em-curso": "Em curso",
    "concluido": "Concluído",
    "concluida": "Concluída",
    "bloqueado": "Bloqueado",
    "bloqueada": "Bloqueada",
    "pendente": "Pendente",
  };

  const PRIORITY_LABELS = { alta: "Alta", media: "Média", baixa: "Baixa" };

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function seedData() {
    const p1 = uid(), p2 = uid();
    return {
      projects: [
        { id: p1, name: "Migração de sistema interno", desc: "Substituição da ferramenta antiga de gestão de pedidos.", status: "em-curso", progress: 45, deadline: addDays(14) },
        { id: p2, name: "Relatório trimestral", desc: "Consolidação de indicadores para a direção.", status: "planeamento", progress: 10, deadline: addDays(30) },
      ],
      tasks: [
        { id: uid(), title: "Reunião de alinhamento com fornecedor", projectId: p1, priority: "alta", status: "pendente", deadline: addDays(2), notes: "" },
        { id: uid(), title: "Rever dados do trimestre anterior", projectId: p2, priority: "media", status: "em-curso", deadline: addDays(5), notes: "" },
        { id: uid(), title: "Testar novo fluxo de aprovações", projectId: p1, priority: "alta", status: "bloqueada", deadline: addDays(-1), notes: "À espera de acesso ao ambiente de testes." },
        { id: uid(), title: "Enviar resumo semanal ao chefe", projectId: null, priority: "media", status: "concluida", deadline: addDays(-2), notes: "" },
      ],
    };
  }

  function addDays(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt storage */ }
    const seeded = seedData();
    saveState(seeded);
    return seeded;
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();

  // ---------- Theme ----------
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }

  // ---------- Tabs ----------
  function initTabs() {
    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
        if (btn.dataset.tab === "report") renderReport();
      });
    });
  }

  // ---------- Helpers ----------
  function isOverdue(item) {
    const doneStatuses = ["concluida", "concluido"];
    return item.deadline && item.deadline < todayISO() && !doneStatuses.includes(item.status);
  }

  function statusColorVar(status) {
    switch (status) {
      case "concluida": case "concluido": return "var(--good)";
      case "em-curso": return "var(--series-blue)";
      case "bloqueada": case "bloqueado": return "var(--serious)";
      default: return "var(--baseline)";
    }
  }

  function projectById(id) {
    return state.projects.find((p) => p.id === id);
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
  }

  // ---------- Rendering: Overview ----------
  function renderKpis() {
    const tasks = state.tasks;
    const pending = tasks.filter((t) => t.status !== "concluida").length;
    const overdue = tasks.filter(isOverdue).length;
    const activeProjects = state.projects.filter((p) => p.status === "em-curso").length;
    const avgProgress = state.projects.length
      ? Math.round(state.projects.reduce((s, p) => s + Number(p.progress || 0), 0) / state.projects.length)
      : 0;

    const kpis = [
      { label: "Tarefas pendentes", value: pending, color: "var(--text-primary)" },
      { label: "Tarefas atrasadas", value: overdue, color: overdue > 0 ? "var(--critical)" : "var(--good)" },
      { label: "Projetos em curso", value: activeProjects, color: "var(--text-primary)" },
      { label: "Conclusão média dos projetos", value: avgProgress + "%", color: "var(--text-primary)" },
    ];

    document.getElementById("kpiRow").innerHTML = kpis.map((k) => `
      <div class="kpi-tile">
        <div class="kpi-value" style="color:${k.color}">${k.value}</div>
        <div class="kpi-label">${k.label}</div>
      </div>
    `).join("");
  }

  function renderUpcoming() {
    const upcoming = state.tasks
      .filter((t) => t.status !== "concluida" && t.deadline)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 6);

    const el = document.getElementById("upcomingList");
    if (!upcoming.length) {
      el.innerHTML = `<div class="list-empty">Sem prazos agendados.</div>`;
      return;
    }
    el.innerHTML = upcoming.map((t) => {
      const proj = projectById(t.projectId);
      const overdue = isOverdue(t);
      return `
        <div class="list-item">
          <div>
            <div class="list-item-title">${escapeHtml(t.title)}</div>
            <div class="list-item-sub">${proj ? escapeHtml(proj.name) : "Sem projeto"}</div>
          </div>
          <span class="badge ${overdue ? "badge-atrasada" : "badge-" + t.status}">${overdue ? "Atrasada" : fmtDate(t.deadline)}</span>
        </div>`;
    }).join("");
  }

  function renderProjectProgress() {
    const el = document.getElementById("projectProgressList");
    if (!state.projects.length) {
      el.innerHTML = `<div class="list-empty">Ainda não há projetos.</div>`;
      return;
    }
    el.innerHTML = state.projects.map((p) => `
      <div>
        <div class="list-item" style="border-bottom:none;padding-bottom:0;">
          <span class="list-item-title">${escapeHtml(p.name)}</span>
          <span class="list-item-sub">${p.progress || 0}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${p.progress || 0}%;background:${statusColorVar(p.status)}"></div>
        </div>
      </div>
    `).join("");
  }

  // ---------- Rendering: Projects ----------
  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!state.projects.length) {
      grid.innerHTML = `<div class="list-empty">Ainda não há projetos. Cria o primeiro.</div>`;
      return;
    }
    grid.innerHTML = state.projects.map((p) => {
      const taskCount = state.tasks.filter((t) => t.projectId === p.id).length;
      return `
      <div class="project-card" data-id="${p.id}">
        <div class="project-card-head">
          <h3>${escapeHtml(p.name)}</h3>
          <span class="badge badge-${p.status}">${STATUS_LABELS[p.status]}</span>
        </div>
        <p>${escapeHtml(p.desc || "")}</p>
        <div class="progress-track">
          <div class="progress-fill" style="width:${p.progress || 0}%;background:${statusColorVar(p.status)}"></div>
        </div>
        <div class="project-meta">
          <span>${taskCount} tarefa${taskCount === 1 ? "" : "s"}</span>
          <span>Prazo: ${fmtDate(p.deadline)}</span>
        </div>
      </div>`;
    }).join("");

    grid.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => openProjectModal(card.dataset.id));
    });
  }

  function refreshProjectSelects() {
    const filterSel = document.getElementById("filterProject");
    const taskSel = document.getElementById("taskProject");
    const projOptions = state.projects.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("");
    filterSel.innerHTML = `<option value="">Todos os projetos</option>` + projOptions;
    taskSel.innerHTML = `<option value="">— Sem projeto —</option>` + projOptions;
  }

  // ---------- Rendering: Tasks ----------
  function renderTasks() {
    const fProject = document.getElementById("filterProject").value;
    const fStatus = document.getElementById("filterStatus").value;
    const fPriority = document.getElementById("filterPriority").value;

    let tasks = [...state.tasks];
    if (fProject) tasks = tasks.filter((t) => t.projectId === fProject);
    if (fStatus) tasks = tasks.filter((t) => t.status === fStatus);
    if (fPriority) tasks = tasks.filter((t) => t.priority === fPriority);
    tasks.sort((a, b) => (a.deadline || "9999").localeCompare(b.deadline || "9999"));

    const tbody = document.getElementById("taskTableBody");
    if (!tasks.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="list-empty" style="padding:16px;">Sem tarefas para os filtros escolhidos.</td></tr>`;
      return;
    }
    tbody.innerHTML = tasks.map((t) => {
      const proj = projectById(t.projectId);
      const overdue = isOverdue(t);
      return `
      <tr data-id="${t.id}">
        <td>${escapeHtml(t.title)}</td>
        <td>${proj ? escapeHtml(proj.name) : "—"}</td>
        <td class="task-priority-${t.priority}">${PRIORITY_LABELS[t.priority]}</td>
        <td>${fmtDate(t.deadline)}${overdue ? ' <span class="badge badge-atrasada">Atrasada</span>' : ""}</td>
        <td><span class="badge badge-${t.status}">${STATUS_LABELS[t.status]}</span></td>
        <td></td>
      </tr>`;
    }).join("");

    tbody.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", () => openTaskModal(row.dataset.id));
    });
  }

  // ---------- Rendering: Report ----------
  function renderReport() {
    const tasks = state.tasks;
    const completed = tasks.filter((t) => t.status === "concluida");
    const overdue = tasks.filter(isOverdue);
    const blocked = tasks.filter((t) => t.status === "bloqueada" || t.status === "bloqueado");
    const upcoming = tasks
      .filter((t) => t.status !== "concluida" && t.deadline && t.deadline >= todayISO())
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 8);

    const el = document.getElementById("reportView");
    el.innerHTML = `
      <h1>Resumo de trabalho</h1>
      <div class="report-meta">Gerado em ${fmtDate(todayISO())} · ${state.projects.length} projeto(s) · ${tasks.length} tarefa(s) no total</div>

      <div class="report-section">
        <h3>Projetos</h3>
        ${state.projects.map((p) => `
          <div class="report-line">
            <span>${escapeHtml(p.name)} — ${STATUS_LABELS[p.status]}</span>
            <span>${p.progress || 0}% · prazo ${fmtDate(p.deadline)}</span>
          </div>
        `).join("") || `<div class="list-empty">Sem projetos.</div>`}
      </div>

      <div class="report-section">
        <h3>Concluído recentemente (${completed.length})</h3>
        ${completed.slice(0, 8).map((t) => `<div class="report-line"><span>${escapeHtml(t.title)}</span><span>${fmtDate(t.deadline)}</span></div>`).join("") || `<div class="list-empty">Nada concluído ainda.</div>`}
      </div>

      <div class="report-section">
        <h3>Próximos prazos (${upcoming.length})</h3>
        ${upcoming.map((t) => `<div class="report-line"><span>${escapeHtml(t.title)}</span><span>${fmtDate(t.deadline)}</span></div>`).join("") || `<div class="list-empty">Sem prazos futuros.</div>`}
      </div>

      <div class="report-section">
        <h3>Atrasadas (${overdue.length})</h3>
        ${overdue.map((t) => `<div class="report-line"><span>${escapeHtml(t.title)}</span><span>${fmtDate(t.deadline)}</span></div>`).join("") || `<div class="list-empty">Sem tarefas atrasadas.</div>`}
      </div>

      <div class="report-section">
        <h3>Bloqueadas / a precisar de apoio (${blocked.length})</h3>
        ${blocked.map((t) => `<div class="report-line"><span>${escapeHtml(t.title)}${t.notes ? " — " + escapeHtml(t.notes) : ""}</span><span></span></div>`).join("") || `<div class="list-empty">Sem bloqueios.</div>`}
      </div>
    `;
  }

  // ---------- Full render ----------
  function renderAll() {
    renderKpis();
    renderUpcoming();
    renderProjectProgress();
    renderProjects();
    refreshProjectSelects();
    renderTasks();
    if (document.getElementById("tab-report").classList.contains("active")) renderReport();
  }

  // ---------- Project modal ----------
  const projectModal = document.getElementById("projectModal");
  function openProjectModal(id) {
    const form = document.getElementById("projectForm");
    form.reset();
    const p = id ? projectById(id) : null;
    document.getElementById("projectModalTitle").textContent = p ? "Editar projeto" : "Novo projeto";
    document.getElementById("projectId").value = p ? p.id : "";
    document.getElementById("projectName").value = p ? p.name : "";
    document.getElementById("projectDesc").value = p ? p.desc || "" : "";
    document.getElementById("projectStatus").value = p ? p.status : "planeamento";
    document.getElementById("projectProgress").value = p ? p.progress : 0;
    document.getElementById("projectDeadline").value = p ? p.deadline || "" : "";
    document.getElementById("projectDelete").hidden = !p;
    projectModal.classList.remove("hidden");
  }
  function closeProjectModal() { projectModal.classList.add("hidden"); }

  document.getElementById("btnNewProject").addEventListener("click", () => openProjectModal(null));
  document.getElementById("projectCancel").addEventListener("click", closeProjectModal);
  document.getElementById("projectModal").addEventListener("click", (e) => { if (e.target === projectModal) closeProjectModal(); });

  document.getElementById("projectForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("projectId").value;
    const data = {
      name: document.getElementById("projectName").value.trim(),
      desc: document.getElementById("projectDesc").value.trim(),
      status: document.getElementById("projectStatus").value,
      progress: Math.max(0, Math.min(100, Number(document.getElementById("projectProgress").value) || 0)),
      deadline: document.getElementById("projectDeadline").value,
    };
    if (!data.name) return;
    if (id) {
      Object.assign(projectById(id), data);
    } else {
      state.projects.push({ id: uid(), ...data });
    }
    saveState(state);
    closeProjectModal();
    renderAll();
  });

  document.getElementById("projectDelete").addEventListener("click", () => {
    const id = document.getElementById("projectId").value;
    if (!id) return;
    if (!confirm("Eliminar este projeto? As tarefas associadas ficam sem projeto.")) return;
    state.projects = state.projects.filter((p) => p.id !== id);
    state.tasks.forEach((t) => { if (t.projectId === id) t.projectId = null; });
    saveState(state);
    closeProjectModal();
    renderAll();
  });

  // ---------- Task modal ----------
  const taskModal = document.getElementById("taskModal");
  function openTaskModal(id) {
    const form = document.getElementById("taskForm");
    form.reset();
    refreshProjectSelects();
    const t = id ? state.tasks.find((x) => x.id === id) : null;
    document.getElementById("taskModalTitle").textContent = t ? "Editar tarefa" : "Nova tarefa";
    document.getElementById("taskId").value = t ? t.id : "";
    document.getElementById("taskTitle").value = t ? t.title : "";
    document.getElementById("taskProject").value = t ? t.projectId || "" : "";
    document.getElementById("taskPriority").value = t ? t.priority : "media";
    document.getElementById("taskStatus").value = t ? t.status : "pendente";
    document.getElementById("taskDeadline").value = t ? t.deadline || "" : "";
    document.getElementById("taskNotes").value = t ? t.notes || "" : "";
    document.getElementById("taskDelete").hidden = !t;
    taskModal.classList.remove("hidden");
  }
  function closeTaskModal() { taskModal.classList.add("hidden"); }

  document.getElementById("btnNewTask").addEventListener("click", () => openTaskModal(null));
  document.getElementById("taskCancel").addEventListener("click", closeTaskModal);
  document.getElementById("taskModal").addEventListener("click", (e) => { if (e.target === taskModal) closeTaskModal(); });

  document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("taskId").value;
    const data = {
      title: document.getElementById("taskTitle").value.trim(),
      projectId: document.getElementById("taskProject").value || null,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      deadline: document.getElementById("taskDeadline").value,
      notes: document.getElementById("taskNotes").value.trim(),
    };
    if (!data.title) return;
    if (id) {
      Object.assign(state.tasks.find((x) => x.id === id), data);
    } else {
      state.tasks.push({ id: uid(), ...data });
    }
    saveState(state);
    closeTaskModal();
    renderAll();
  });

  document.getElementById("taskDelete").addEventListener("click", () => {
    const id = document.getElementById("taskId").value;
    if (!id) return;
    if (!confirm("Eliminar esta tarefa?")) return;
    state.tasks = state.tasks.filter((t) => t.id !== id);
    saveState(state);
    closeTaskModal();
    renderAll();
  });

  // ---------- Filters ----------
  ["filterProject", "filterStatus", "filterPriority"].forEach((id) => {
    document.getElementById(id).addEventListener("change", renderTasks);
  });

  // ---------- Export / Import ----------
  document.getElementById("btnExport").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-trabalho-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("btnImport").addEventListener("click", () => {
    document.getElementById("fileImport").click();
  });
  document.getElementById("fileImport").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!imported.projects || !imported.tasks) throw new Error("Formato inválido");
        if (confirm("Importar vai substituir os dados atuais. Continuar?")) {
          state = imported;
          saveState(state);
          renderAll();
        }
      } catch (err) {
        alert("Não foi possível importar o ficheiro: " + err.message);
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });

  document.getElementById("btnPrint").addEventListener("click", () => window.print());
  document.getElementById("btnTheme").addEventListener("click", toggleTheme);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  // ---------- Init ----------
  initTheme();
  initTabs();
  renderAll();
})();
