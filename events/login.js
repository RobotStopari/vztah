import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { hashPassword } from "./utils.js";

export function setupLogin() {
  document.getElementById("loginButton").addEventListener("click", async () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    if (!username || !password) return;

    const passwordHash = await hashPassword(password);
    const q = query(collection(db, "users"), where("username", "==", username), where("passwordHash", "==", passwordHash));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const userDoc = snap.docs[0].data();
      const displayName = userDoc.name || username;
      sessionStorage.setItem("loggedInUser", username);
      sessionStorage.setItem("loggedInName", displayName);
      document.getElementById("loginError").style.display = "none";

      const loginModalEl = document.getElementById("loginModal");
      bootstrap.Modal.getInstance(loginModalEl).hide();
      showLoggedInUser(displayName);
    } else {
      document.getElementById("loginError").style.display = "block";
    }
  });
}

export function showLoggedInUser(name) {
  const navItem = document.getElementById("loginNavLink").parentElement;
  navItem.innerHTML = `
    <div class="dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        ${name}
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        <li><a class="dropdown-item" href="#" id="messageBtn">Napsat zprávu</a></li>
        <li><a class="dropdown-item" href="#" id="logoutBtn">Odhlásit se</a></li>
      </ul>
    </div>
  `;

  document.getElementById("messageBtn").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("messageModal")).show();
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInName");
    navItem.innerHTML = `<a class="nav-link" href="#" id="loginNavLink" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>`;
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginError").style.display = "none";
  });
}
