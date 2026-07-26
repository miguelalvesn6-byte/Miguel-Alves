const THEME_KEY = "triathlonDashboard.theme";

export function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
    });
  });
}

export function initTheme() {
  const btn = document.getElementById("btnTheme");
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme")
        || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }
}

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

export const TYPE_LABELS = {
  corrida: "Corrida",
  tecnica: "Técnica",
  ginasio: "Ginásio",
  alongamento: "Alongamentos",
  ciclismo: "Ciclismo",
  natacao: "Natação",
  outro: "Outro",
};
