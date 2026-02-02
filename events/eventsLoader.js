import { db } from "./firebase.js";
import { getDocs, getDoc, collection, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { daysBetween, formatDifference, nextBirthday, nextAnniversary } from "./utils.js";

let events = [];

export async function loadEvents() {
  events = [];

  // 🎂 Birthdays
  const birthdaysSnap = await getDocs(collection(db, "birthdays"));
  birthdaysSnap.forEach(docSnap => {
    const b = docSnap.data();
    const next = nextBirthday(b.month, b.day);
    const age = next.getFullYear() - b.birthYear;
    events.push({ name: b.name, date: next, icon: b.icon || "🎂", birthYear: b.birthYear, age });
  });

  // 💞 First together
  const firstSnap = await getDoc(doc(db, "firstTogether", "main"));
  if (firstSnap.exists()) {
    const first = firstSnap.data();
    const firstDate = new Date(first.date);
    events.push({ name: "Den, kdy jsme spolu začali", date: firstDate, icon: first.icon || "💞" });
    const ann = nextAnniversary(firstDate);
    events.push({ name: `${ann.number}. Výročí`, date: ann.date, icon: "🎉" });
  }

  // 📌 Fixed events
  const fixedSnap = await getDocs(collection(db, "fixedEvents"));
  fixedSnap.forEach(docSnap => {
    const e = docSnap.data();
    events.push({ name: e.name, date: new Date(e.date), icon: e.icon || "📌" });
  });

  events.sort((a, b) => a.date - b.date);
  renderEvents();
  renderNextEvent();
}

export function renderEvents() {
  const container = document.getElementById("events");
  container.innerHTML = "";
  events.forEach(ev => {
    const diffDays = daysBetween(ev.date);
    const extraInfo = ev.birthYear ? `<p class="mb-0">${ev.age}</p>` : "";
    container.innerHTML += `
      <div class="card p-3 mt-3">
        <h5><span class="event-icon">${ev.icon}</span>${ev.name}</h5>
        ${extraInfo}
        <p class="mb-1"><strong>${formatDifference(diffDays)}</strong></p>
        <p class="text-muted mb-0">
          ${ev.date.toLocaleDateString("cs-CZ", { weekday: "long" })},
          ${ev.date.toLocaleDateString("cs-CZ")}
        </p>
      </div>
    `;
  });
}

export function renderNextEvent() {
  const upcoming = events.find(e => daysBetween(e.date) >= 0);
  if (!upcoming) return;
  const diffDays = daysBetween(upcoming.date);
  const extraInfo = upcoming.birthYear ? `<p class="mb-0">${upcoming.age}</p>` : "";
  document.getElementById("nextEvent").innerHTML = `
    <div class="card p-3">
      <h5><span class="event-icon">${upcoming.icon}</span>${upcoming.name}</h5>
      ${extraInfo}
      <p><strong>${formatDifference(diffDays)}</strong></p>
      <p class="text-muted mb-0">
        ${upcoming.date.toLocaleDateString("cs-CZ", { weekday: "long" })},
        ${upcoming.date.toLocaleDateString("cs-CZ")}
      </p>
    </div>
  `;
}
