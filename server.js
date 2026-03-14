/**
 * Serveur principal de l'application Catway
 * Gère les routes, la connexion à MongoDB et le rendu des vues EJS
 *@module server
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

require("dotenv").config();

const app = express();

// Configuration de EJS pour le rendu des vues
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Importation des routes
const catwayRoutes = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

/**
 * Route principale de l'application
 * @route GET /
 * @description Rendu de la page d'accueil
 * @returns {HTML} Page d'accueil
 */
app.get("/", (req, res) => {
  res.render("index");
});

// Utilisation des routes
app.use("/catways", catwayRoutes);
app.use("/", reservationRoutes);
app.use("/users", userRoutes);
app.use("/", authRoutes);

/**
 * Route pour le tableau de bord
 * @route GET /dashboard
 * @description Rendu de la page du tableau de bord
 * @returns {HTML} Page du tableau de bord
 */
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

/**
 * Route pour la page des catways
 * @route GET /catways-page
 * @description Rendu de la page des catways
 * @returns {HTML} Page des catways
 */
app.get("/catways-page", (req, res) => {
  res.render("catways");
});

/**
 * Route pour la page des réservations
 * @route GET /reservations-page
 * @description Rendu de la page des réservations
 * @returns {HTML} Page des réservations
 */
app.get("/reservations-page", (req, res) => {
  res.render("reservations");
});

/**
 * Route pour la page des utilisateurs
 * @route GET /users-page
 * @description Rendu de la page des utilisateurs
 * @returns {HTML} Page des utilisateurs
 */
app.get("/users-page", (req, res) => {
  res.render("users");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
