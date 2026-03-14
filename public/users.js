/**
 * users.js
 * Script pour la page users.html
 * Gère l'affichage, la création, la modification et la suppression des utilisateurs
 */

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.querySelector(".close");
const userForm = document.getElementById("userForm");
let editingEmail = null;

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "/";
});

addBtn.addEventListener("click", () => {
  editingEmail = null;
  document.getElementById("modalTitle").textContent = "Nouvel Utilisateur";
  userForm.reset();
  document.getElementById("email").disabled = false;
  document.getElementById("password").required = true;
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

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const url = editingEmail
      ? `https://port-plaisance-api-qjgi.onrender.com/users/${editingEmail}`
      : "https://port-plaisance-api-qjgi.onrender.com/users";

    const method = editingEmail ? "PUT" : "POST";

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
      loadUsers();
    } else {
      alert("Erreur lors de l'enregistrement");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur de connexion");
  }
});

async function loadUsers() {
  try {
    const response = await fetch(
      "https://port-plaisance-api-qjgi.onrender.com/users",
    );
    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function displayUsers(users) {
  const container = document.getElementById("usersList");

  if (users.length === 0) {
    container.innerHTML = "<p>Aucun utilisateur</p>";
    return;
  }

  let html =
    "<table><thead><tr><th>Nom</th><th>Email</th><th>Actions</th></tr></thead><tbody>";

  users.forEach((u) => {
    html += `<tr>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>
        <button class="btn-edit" onclick="editUser('${u.email}')">Modifier</button>
        <button class="btn-danger" onclick="deleteUser('${u.email}')">Supprimer</button>
      </td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

async function editUser(email) {
  try {
    const response = await fetch(
      `https://port-plaisance-api-qjgi.onrender.com/users/${email}`,
    );
    const user = await response.json();

    editingEmail = email;
    document.getElementById("modalTitle").textContent = "Modifier Utilisateur";
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("email").disabled = true;
    document.getElementById("password").value = "";
    document.getElementById("password").required = false;
    modal.style.display = "block";
  } catch (error) {
    console.error("Erreur:", error);
  }
}

async function deleteUser(email) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

  try {
    const response = await fetch(
      `https://port-plaisance-api-qjgi.onrender.com/users/${email}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      loadUsers();
    } else {
      alert("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}

loadUsers();
