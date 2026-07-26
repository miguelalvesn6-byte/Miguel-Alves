import { requireRole, logout } from "./auth.js";
import { initTabs, initTheme, escapeHtml, TYPE_LABELS } from "./ui.js";
import { formatDuration, formatDistance, formatPace } from "./tcx-import.js";
import {
  db,
  secondaryAuth,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  createUserWithEmailAndPassword,
  signOut,
} from "./firestore-helpers.js";

initTabs();
initTheme();
document.getElementById("btnLogout").addEventListener("click", logout);

let athletes = []; // { uid, name, email }

requireRole("admin", (user) => {
  document.getElementById("welcomeMsg").textContent = `Área do coach — ${user.name || user.email}`;
  watchAthletes();
  watchPlans();
  watchWorkoutsFilter();
});

// ---------- Atletas ----------
function watchAthletes() {
  const q = query(collection(db, "users"), where("role", "==", "athlete"));
  onSnapshot(q, (snap) => {
    athletes = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    renderAthletes();
    fillAthleteSelects();
  });
}

function renderAthletes() {
  const el = document.getElementById("athletesList");
  if (athletes.length === 0) {
    el.innerHTML = `<p class="empty-state">Ainda não criaste nenhum atleta.</p>`;
    return;
  }
  el.innerHTML = athletes
    .map(
      (a) => `
      <div class="list-item">
        <div class="list-item-main">
          <span class="list-item-title">${escapeHtml(a.name)}</span>
          <span class="list-item-meta">${escapeHtml(a.email)}</span>
        </div>
      </div>`
    )
    .join("");
}

function fillAthleteSelects() {
  const options = athletes.map((a) => `<option value="${a.uid}">${escapeHtml(a.name)}</option>`).join("");
  const planSelect = document.getElementById("planAthlete");
  planSelect.innerHTML = athletes.length ? options : `<option value="">Sem atletas</option>`;

  const filterSelect = document.getElementById("workoutsAthleteFilter");
  const prev = filterSelect.value;
  filterSelect.innerHTML = athletes.length
    ? options
    : `<option value="">Sem atletas</option>`;
  if (prev && athletes.some((a) => a.uid === prev)) filterSelect.value = prev;
  else if (athletes.length) {
    filterSelect.value = athletes[0].uid;
    watchWorkouts(athletes[0].uid);
  }
}

document.getElementById("newAthleteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("athleteName").value.trim();
  const email = document.getElementById("athleteEmail").value.trim();
  const password = document.getElementById("athletePassword").value;
  const msg = document.getElementById("newAthleteMsg");
  msg.textContent = "A criar...";
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      role: "athlete",
      name,
      email,
      createdAt: serverTimestamp(),
    });
    await signOut(secondaryAuth);
    msg.textContent = `Conta criada para ${name}.`;
    e.target.reset();
  } catch (err) {
    msg.textContent = "Erro: " + (err.message || "não foi possível criar a conta.");
  }
});

// ---------- Planos de treino ----------
function watchPlans() {
  const q = query(collection(db, "trainingPlans"), orderBy("date", "desc"));
  onSnapshot(q, (snap) => {
    const plans = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderPlans(plans);
  });
}

function renderPlans(plans) {
  const el = document.getElementById("plansList");
  if (plans.length === 0) {
    el.innerHTML = `<p class="empty-state">Ainda não criaste nenhum treino.</p>`;
    return;
  }
  el.innerHTML = plans
    .map((p) => {
      const athlete = athletes.find((a) => a.uid === p.athleteId);
      return `
      <div class="list-item">
        <div class="list-item-main">
          <span class="list-item-title">${escapeHtml(p.title)} <span class="badge badge-${p.type}">${TYPE_LABELS[p.type] || p.type}</span></span>
          <span class="list-item-meta">${escapeHtml(athlete ? athlete.name : "Atleta removido")} — ${escapeHtml(p.date)}${p.description ? " — " + escapeHtml(p.description) : ""}</span>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-small btn-danger" data-id="${p.id}">Eliminar</button>
        </div>
      </div>`;
    })
    .join("");

  el.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => deleteDoc(doc(db, "trainingPlans", btn.dataset.id)));
  });
}

document.getElementById("newPlanForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const athleteId = document.getElementById("planAthlete").value;
  const msg = document.getElementById("newPlanMsg");
  if (!athleteId) {
    msg.textContent = "Cria primeiro um atleta.";
    return;
  }
  await addDoc(collection(db, "trainingPlans"), {
    athleteId,
    type: document.getElementById("planType").value,
    date: document.getElementById("planDate").value,
    title: document.getElementById("planTitle").value.trim(),
    description: document.getElementById("planDescription").value.trim(),
    createdAt: serverTimestamp(),
  });
  msg.textContent = "Treino adicionado.";
  e.target.reset();
});

// ---------- Treinos (histórico dos atletas) ----------
let unsubscribeWorkouts = null;

function watchWorkoutsFilter() {
  document.getElementById("workoutsAthleteFilter").addEventListener("change", (e) => {
    watchWorkouts(e.target.value);
  });
}

function watchWorkouts(athleteId) {
  if (unsubscribeWorkouts) unsubscribeWorkouts();
  if (!athleteId) return;
  const q = query(collection(db, "workouts"), where("athleteId", "==", athleteId), orderBy("date", "desc"));
  unsubscribeWorkouts = onSnapshot(q, (snap) => {
    const workouts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderWorkoutsStats(workouts);
    renderWorkoutsList(workouts);
  });
}

function renderWorkoutsStats(workouts) {
  const el = document.getElementById("workoutsStats");
  const totalDistance = workouts.reduce((s, w) => s + (w.distanceM || 0), 0);
  const totalDuration = workouts.reduce((s, w) => s + (w.durationSec || 0), 0);
  el.innerHTML = `
    <div class="stat"><span class="stat-value">${workouts.length}</span><span class="stat-label">treinos</span></div>
    <div class="stat"><span class="stat-value">${formatDistance(totalDistance)}</span><span class="stat-label">distância total</span></div>
    <div class="stat"><span class="stat-value">${formatDuration(totalDuration)}</span><span class="stat-label">tempo total</span></div>
  `;
}

function renderWorkoutsList(workouts) {
  const el = document.getElementById("workoutsList");
  if (workouts.length === 0) {
    el.innerHTML = `<p class="empty-state">Sem treinos registados para este atleta.</p>`;
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
