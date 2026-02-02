import { db } from "./firebase.js";
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

export async function loadChildren() {
  const boysContainer = document.getElementById("boys");
  const girlsContainer = document.getElementById("girls");
  boysContainer.innerHTML = "";
  girlsContainer.innerHTML = "";

  const q = query(collection(db, "children"), orderBy("order"));
  const snap = await getDocs(q);
  snap.forEach(docSnap => {
    const child = docSnap.data();
    const card = document.createElement("div");
    card.className = "card p-2 text-center mb-2";
    card.textContent = child.name;
    if (child.gender === "boy") boysContainer.appendChild(card);
    if (child.gender === "girl") girlsContainer.appendChild(card);
  });
}
