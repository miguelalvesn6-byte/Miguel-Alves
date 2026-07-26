import {
  auth,
  db,
  doc,
  getDoc,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "./firestore-helpers.js";

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("loginError");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "A entrar...";
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (!userDoc.exists()) {
        errorEl.textContent = "Esta conta não tem perfil associado. Contacta o teu coach.";
        await signOut(auth);
        return;
      }
      const role = userDoc.data().role;
      window.location.href = role === "admin" ? "admin.html" : "athlete.html";
    } catch (err) {
      errorEl.textContent = mapAuthError(err.code);
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar";
    }
  });
}

function mapAuthError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email ou password incorretos.";
    case "auth/too-many-requests":
      return "Demasiadas tentativas. Tenta novamente daqui a pouco.";
    default:
      return "Não foi possível iniciar sessão. Tenta novamente.";
  }
}

// Protege páginas admin.html/athlete.html: só deixa entrar quem tiver
// sessão iniciada e o papel esperado no Firestore.
export function requireRole(expectedRole, onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== expectedRole) {
      await signOut(auth);
      window.location.href = "index.html";
      return;
    }
    onReady({ uid: user.uid, ...userDoc.data() });
  });
}

export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}
