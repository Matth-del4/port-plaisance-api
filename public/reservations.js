/**
 * reservations.js
 * Script pour la page reservations.html
 * Gère l'affichage, la création, la modification et la suppression des réservations
 */

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.querySelector(".close");
const reservationForm = document.getElementById("reservationForm");
let editingId = null;
let editingCatwayNumber = null;

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "/";
});

addBtn.addEventListener("click", () => {
  editingId = null;
  editingCatwayNumber = null;
  document.getElementById("modalTitle").textContent = "Nouvelle Réservation";
  reservationForm.reset();
  loadCatwaysForSelect();
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

async function loadCatwaysForSelect() {
  try {
    const response = await fetch(
      "https://port-plaisance-api-qjgi.onrender.com/catways",
    );
    const catways = await response.json();

    const select = document.getElementById("catwayNumber");
    select.innerHTML = '<option value="">Sélectionnez un catway</option>';

    catways.forEach((c) => {
      select.innerHTML += `<option value="${c.catwayNumber}">Catway ${c.catwayNumber} (${c.catwayType})</option>`;
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

reservationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const catwayNumber = document.getElementById("catwayNumber").value;
  const data = {
    clientName: document.getElementById("clientName").value,
    boatName: document.getElementById("boatName").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
  };

  try {
    const url = editingId
      ? `https://port-plaisance-api-qjgi.onrender.com/catways/${editingCatwayNumber}/reservations/${editingId}`
      : `https://port-plaisance-api-qjgi.onrender.com/catways/${catwayNumber}/reservations`;

    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      modal.style.display = "none";
      loadReservations();
    } else {
      alert("Erreur lors de l'enregistrement");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur de connexion");
  }
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

    displayReservations(reservations);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function displayReservations(reservations) {
  const container = document.getElementById("reservationsList");

  if (reservations.length === 0) {
    container.innerHTML = "<p>Aucune réservation</p>";
    return;
  }

  let html =
    "<table><thead><tr><th>Catway</th><th>Client</th><th>Bateau</th><th>Début</th><th>Fin</th><th>Actions</th></tr></thead><tbody>";

  reservations.forEach((r) => {
    html += `<tr>
      <td>${r.catwayNumber}</td>
      <td>${r.clientName}</td>
      <td>${r.boatName}</td>
      <td>${new Date(r.startDate).toLocaleDateString("fr-FR")}</td>
      <td>${new Date(r.endDate).toLocaleDateString("fr-FR")}</td>
      <td>
        <button class="btn-edit" onclick="editReservation(${r.catwayNumber}, '${r._id}')">Modifier</button>
        <button class="btn-danger" onclick="deleteReservation(${r.catwayNumber}, '${r._id}')">Supprimer</button>
      </td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

async function editReservation(catwayNumber, id) {
  try {
    const response = await fetch(
      `https://port-plaisance-api-qjgi.onrender.com/catways/${catwayNumber}/reservations/${id}`,
    );
    const reservation = await response.json();

    editingId = id;
    editingCatwayNumber = catwayNumber;
    document.getElementById("modalTitle").textContent = "Modifier Réservation";
    await loadCatwaysForSelect();
    document.getElementById("catwayNumber").value = reservation.catwayNumber;
    document.getElementById("catwayNumber").disabled = true;
    document.getElementById("clientName").value = reservation.clientName;
    document.getElementById("boatName").value = reservation.boatName;
    document.getElementById("startDate").value =
      reservation.startDate.split("T")[0];
    document.getElementById("endDate").value =
      reservation.endDate.split("T")[0];
    modal.style.display = "block";
  } catch (error) {
    console.error("Erreur:", error);
  }
}

async function deleteReservation(catwayNumber, id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?"))
    return;

  try {
    const response = await fetch(
      `https://port-plaisance-api-qjgi.onrender.com/catways/${catwayNumber}/reservations/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      loadReservations();
    } else {
      alert("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}

loadReservations();
