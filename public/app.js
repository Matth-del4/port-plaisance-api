/**
 * App.js - Script principal pour la gestion de l'interface utilisateur
 * Gère les interactions de connexion et d'inscription
 */

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  try {
    const response = await fetch(
      "https://port-plaisance-api-qjgi.onrender.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      messageDiv.textContent = "Connexion réussie ! Redirection...";
      messageDiv.className = "success";
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } else {
      messageDiv.textContent = data.message || "Erreur de connexion";
      messageDiv.className = "error";
    }
  } catch (error) {
    messageDiv.textContent = "Erreur de connexion au serveur";
    messageDiv.className = "error";
  }
});
