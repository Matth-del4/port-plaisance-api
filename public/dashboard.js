/**
 * dashboard.js
 * Script pour la page dashboard.html
 * Gère l'affichage des informations utilisateur et des réservations en cours
 */

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  window.location.href = "/";
}

document.getElementById("username").textContent = user.username;
document.getElementById("userEmail").textContent = user.email;

const today = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
document.getElementById("currentDate").textContent = today.toLocaleDateString(
  "fr-FR",
  options,
);

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
});

async function loadReservations() {
  try {
    const response = await fetch(
      "https://port-plaisance-api-qjgi.onrender.com/catways",
    );
    const catways = await response.json();

    let reservations = [];
    for (let catway of catways) {
      const resResponse = await fetch(
        `https://port-plaisance-api-qjgi.onrender.com/catways/${catway.catwayNumber}/reservations`,
      );
      const res = await resResponse.json();
      reservations = reservations.concat(res);
    }

    const today = new Date();
    const currentReservations = reservations.filter((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return start <= today && end >= today;
    });

    displayReservations(currentReservations);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function displayReservations(reservations) {
  const container = document.getElementById("reservationsTable");

  if (reservations.length === 0) {
    container.innerHTML = "<p>Aucune réservation en cours</p>";
    return;
  }

  let html =
    "<table><thead><tr><th>Catway</th><th>Client</th><th>Bateau</th><th>Début</th><th>Fin</th></tr></thead><tbody>";

  reservations.forEach((r) => {
    html += `<tr>
      <td>${r.catwayNumber}</td>
      <td>${r.clientName}</td>
      <td>${r.boatName}</td>
      <td>${new Date(r.startDate).toLocaleDateString("fr-FR")}</td>
      <td>${new Date(r.endDate).toLocaleDateString("fr-FR")}</td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

loadReservations();
