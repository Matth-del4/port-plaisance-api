/**
 * catways.js
 * Script pour la page catways.html
 * Gère l'affichage, la création, la modification et la suppression des catways
 */

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.querySelector(".close");
const catwayForm = document.getElementById("catwayForm");
let editingId = null;

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "/";
});

addBtn.addEventListener("click", () => {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Nouveau Catway";
  catwayForm.reset();
  document.getElementById("catwayNumber").disabled = false;
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

catwayForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    catwayNumber: parseInt(document.getElementById("catwayNumber").value),
    catwayType: document.getElementById("catwayType").value,
    catwayState: document.getElementById("catwayState").value,
  };

  try {
    const url = editingId
      ? `http://localhost:3000/catways/${editingId}`
      : "http://localhost:3000/catways";

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
      loadCatways();
    } else {
      alert("Erreur lors de l'enregistrement");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur de connexion");
  }
});

async function loadCatways() {
  try {
    const response = await fetch("http://localhost:3000/catways");
    const catways = await response.json();
    displayCatways(catways);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function displayCatways(catways) {
  const container = document.getElementById("catwaysList");

  if (catways.length === 0) {
    container.innerHTML = "<p>Aucun catway</p>";
    return;
  }

  let html =
    "<table><thead><tr><th>Numéro</th><th>Type</th><th>État</th><th>Actions</th></tr></thead><tbody>";

  catways.forEach((c) => {
    html += `<tr>
      <td>${c.catwayNumber}</td>
      <td>${c.catwayType}</td>
      <td>${c.catwayState}</td>
      <td>
        <button class="btn-edit" onclick="editCatway(${c.catwayNumber})">Modifier</button>
        <button class="btn-danger" onclick="deleteCatway(${c.catwayNumber})">Supprimer</button>
      </td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

async function editCatway(id) {
  try {
    const response = await fetch(`http://localhost:3000/catways/${id}`);
    const catway = await response.json();

    editingId = id;
    document.getElementById("modalTitle").textContent = "Modifier Catway";
    document.getElementById("catwayNumber").value = catway.catwayNumber;
    document.getElementById("catwayNumber").disabled = true;
    document.getElementById("catwayType").value = catway.catwayType;
    document.getElementById("catwayState").value = catway.catwayState;
    modal.style.display = "block";
  } catch (error) {
    console.error("Erreur:", error);
  }
}

async function deleteCatway(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce catway ?")) return;

  try {
    const response = await fetch(`http://localhost:3000/catways/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      loadCatways();
    } else {
      alert("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}

loadCatways();
