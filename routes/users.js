const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * Récupère tous les utilisateurs
 * @route GET /users
 * @returns {Array} 200 - Un tableau d'utilisateurs
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Récupère un utilisateur par son email
 * @route GET /users/:email
 * @param {string} email - L'email de l'utilisateur
 * @returns {Object} 200 - Un objet utilisateur
 * @returns {Error} 404 - Utilisateur non trouvé
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password",
    );
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Crée un nouvel utilisateur
 * @route POST /users
 * @param {Object} user - Les données de l'utilisateur à créer
 * @returns {Object} 201 - L'utilisateur créé
 * @returns {Error} 400 - Données invalides
 */
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Met à jour un utilisateur existant
 * @route PUT /users/:email
 * @param {string} email - L'email de l'utilisateur à mettre à jour
 * @param {Object} user - Les données de l'utilisateur à mettre à jour
 * @returns {Object} 200 - L'utilisateur mis à jour
 * @returns {Error} 404 - Utilisateur non trouvé
 * @returns {Error} 400 - Données invalides
 */
router.put("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] && key !== "email") user[key] = req.body[key];
    });

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Supprime un utilisateur existant
 * @route DELETE /users/:email
 * @param {string} email - L'email de l'utilisateur à supprimer
 * @returns {Object} 200 - Message de suppression réussie
 * @returns {Error} 404 - Utilisateur non trouvé
 * @returns {Error} 500 - Erreur serveur
 */
router.delete("/:email", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
