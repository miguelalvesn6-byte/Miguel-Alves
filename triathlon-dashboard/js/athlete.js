import { requireRole, logout } from "./auth.js";
import { initTabs, initTheme, escapeHtml, TYPE_LABELS } from "./ui.js";
import { parseTCX, formatDuration, formatDistance, formatPace } from "./tcx-import.js";
import {
  db,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "./firestore-helpers.js";

initTabs();
initTheme();
document.getElementById("btnLogout").addEventListener("click", logout);

let currentUid = null;

requireRole("athlete", (user) => {
  currentUid = user.uid;
  document.getElementById("welcomeMsg").textContent = `Olá, ${user.name || user.email}`;
  watchPlan(user.uid);
  watchWorkouts(user.uid);
});

// ---------- Plano de treino ----------
function watchPlan(uid) {
  const q = query(collection(db, "trainingPlans"), where("athleteId", "==", uid), orderBy("date", "desc"));
  onSnapshot(q, (snap) => {
    const plans = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderPlan(plans);
  });
}

function renderPlan(plans) {
  const el = document.getElementById("planList");
  if (plans.length === 0) {
    el.innerHTML = `<p class="empty-state">O teu coach ainda não atribuiu nenhum treino.</p>`;
    return;
  }
  el.innerHTML = plans
    .map(
      (p) => `
      <div class="list-item">
        <div class="list-item-main">
          <span class="list-item-title">${escapeHtml(p.title)} <span class="badge badge-${p.type}">${TYPE_LABELS[p.type] || p.type}</span></span>
          <span class="list-item-meta">${escapeHtml(p.date)}${p.description ? " — " + escapeHtml(p.description) : ""}</span>
        </div>
      </div>`
    )
    .join("");
}

// ---------- Treinos ----------
function watchWorkouts(uid) {
  const q = query(collection(db, "workouts"), where("athleteId", "==", uid), orderBy("date", "desc"));
  onSnapshot(q, (snap) => {
    const workouts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderWorkouts(workouts);
  });
}

function renderWorkouts(workouts) {
  const el = document.getElementById("workoutsList");
  if (workouts.length === 0) {
    el.innerHTML = `<p class="empty-state">Ainda não tens treinos registados.</p>`;
    return;
  }
  el.innerHTML = workouts
    .map(
      (w) => `
      <div class="list-item">
        <div class="list-item-main">
          <span class="list-item-title">${TYPE_LABELS[w.sport] || w.sport} <span class="badge">${w.source === "import" ? "TrainingPeaks" : "manual"}</span></span>
          <span class="list-item-meta">${escapeHtml(w.date)} — ${formatDistance(w.distanceM)} — ${formatDuration(w.durationSec)} — ${formatPace(w.avgPaceSecPerKm)}${w.avgHR ? " — FC média " + w.avgHR + " bpm" : ""}${w.notes ? " — " + escapeHtml(w.notes) : ""}</span>
        </div>
      </div>`
    )
    .join("");
}

// ---------- Import .tcx ----------
document.getElementById("tcxFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const msg = document.getElementById("importMsg");
  if (!file) return;
  msg.textContent = "A processar...";
  try {
    const text = await file.text();
    const summary = parseTCX(text);
    await addDoc(collection(db, "workouts"), {
      athleteId: currentUid,
      source: "import",
      importedAt: serverTimestamp(),
      ...summary,
    });
    msg.textContent = `Treino de ${summary.date} importado com sucesso.`;
  } catch (err) {
    msg.textContent = "Erro: " + err.message;
  } finally {
    e.target.value = "";
  }
});

// ---------- Registo manual ----------
document.getElementById("manualWorkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const durationMin = parseFloat(document.getElementById("wDuration").value);
  const distanceKm = parseFloat(document.getElementById("wDistance").value);
  const durationSec = Number.isFinite(durationMin) ? Math.round(durationMin * 60) : null;
  const distanceM = Number.isFinite(distanceKm) ? Math.round(distanceKm * 1000) : null;
  await addDoc(collection(db, "workouts"), {
    athleteId: currentUid,
    source: "manual",
    date: document.getElementById("wDate").value,
    sport: document.getElementById("wSport").value,
    durationSec,
    distanceM,
    avgHR: null,
    avgPaceSecPerKm: durationSec && distanceM ? Math.round(durationSec / (distanceM / 1000)) : null,
    notes: document.getElementById("wNotes").value.trim(),
    importedAt: serverTimestamp(),
  });
  e.target.reset();
});
