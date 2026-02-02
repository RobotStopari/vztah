import { db } from "./firebase.js";
import { collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ================================
// EMAIL / USER HELPERS
// ================================
export async function getUserEmail(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].data().email;
  return null;
}

export async function getOtherUserEmail(username) {
  const q = query(collection(db, "users"), where("username", "!=", username));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].data().email;
  return null;
}

// ================================
// SEND MESSAGE SETUP
// ================================
export function setupMessageSending(displayLatestMessages) {
  const sendBtn = document.getElementById("sendMessageBtn");

  // Ensure only **one listener** is attached
  sendBtn.replaceWith(sendBtn.cloneNode(true));
  const newSendBtn = document.getElementById("sendMessageBtn");

  newSendBtn.addEventListener("click", async () => {
    const text = document.getElementById("messageText").value.trim();
    if (!text) {
      document.getElementById("messageError").style.display = "block";
      return;
    }
    document.getElementById("messageError").style.display = "none";

    const username = sessionStorage.getItem("loggedInUser");
    const name = sessionStorage.getItem("loggedInName");
    if (!username) {
      alert("You must be logged in to send a message!");
      return;
    }

    const email = await getUserEmail(username);
    const otherEmail = await getOtherUserEmail(username);

    const timestamp = new Date().toISOString();

    // Save message in Firestore
    await addDoc(collection(db, "messages"), {
      authorUsername: username,
      authorName: name,
      text,
      timestamp,
      email
    });

    // Send **only one email**, fully overriding template values
    try {
      await emailjs.send("nase_stranka", "nase_vztahova_stranka", {
        to_email: otherEmail,      // recipient
        from_name: name,           // logged-in user name
        from_email: email,         // logged-in user email
        message: text,
        timestamp: new Date().toLocaleString("cs-CZ", {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        })
      });
      console.log("Email sent successfully");
    } catch (err) {
      console.error("Email send error:", err);
    }

    // Close modal & clear textarea
    bootstrap.Modal.getInstance(document.getElementById("messageModal")).hide();
    document.getElementById("messageText").value = "";

    // Refresh messages
    displayLatestMessages();
  });
}

// ================================
// DISPLAY LATEST MESSAGES
// ================================
export async function displayLatestMessages() {
  const messagesSnap = await getDocs(collection(db, "messages"));
  const now = new Date();
  let recentMessages = [];

  messagesSnap.forEach(docSnap => {
    const msg = docSnap.data();
    if ((now - new Date(msg.timestamp)) / (1000 * 60 * 60) <= 24) {
      recentMessages.push(msg);
    }
  });

  // newest first
  recentMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const messagesToDisplay = recentMessages.slice(0, 2);

  let container = document.getElementById("messageContainer");
  if (!container) {
    const h1 = document.querySelector("h1");
    container = document.createElement("div");
    container.id = "messageContainer";
    container.className = "mb-3";
    h1.insertAdjacentElement("afterend", container);
  }

  container.innerHTML = messagesToDisplay.map(msg => {
    const msgDate = new Date(msg.timestamp);
    return `
      <div class="card p-3 mb-2">
        <strong>${msg.authorName}:</strong> ${msg.text} <br>
        <small class="text-muted">${msgDate.toLocaleDateString("cs-CZ")} ${msgDate.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}</small>
      </div>
    `;
  }).join("");
}
