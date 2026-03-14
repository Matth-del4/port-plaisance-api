const express = require("express");
const router = express.Router();
const Catway = require("../models/Catway");

/**
 * Récupère tous les catways
 * @route GET /catways
 * @returns {Array} 200 - Un tableau de catways
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/", async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Récupère un catway par son numéro
 * @route GET /catways/:id
 * @param {string} id - Le numéro du catway
 * @returns {Object} 200 - Un objet catway
 * @returns {Error} 404 - Catway non trouvé
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.json(catway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Crée un nouveau catway
 * @route POST /catways
 * @param {Object} catway - Les données du catway à créer
 * @returns {Object} 201 - Le catway créé
 * @returns {Error} 400 - Données invalides
 */
router.post("/", async (req, res) => {
  try {
    const catway = new Catway(req.body);
    const newCatway = await catway.save();
    res.status(201).json(newCatway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Met à jour l'état d'un catway
 * @route PUT /catways/:id
 * @param {string} id - Le numéro du catway à mettre à jour
 * @param {Object} catway - Les données du catway à mettre à jour
 * @returns {Object} 200 - Le catway mis à jour
 * @returns {Error} 400 - Données invalides
 * @returns {Error} 404 - Catway non trouvé
 */
router.put("/:id", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });

    if (req.body.catwayState) catway.catwayState = req.body.catwayState;

    const updatedCatway = await catway.save();
    res.json(updatedCatway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Supprime un catway
 * @route DELETE /catways/:id
 * @param {number} id - Le numéro du catway à supprimer
 * @returns {Object} 200 - Message de succès
 * @returns {Error} 404 - Catway non trouvé
 * @returns {Error} 500 - Erreur serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({
      catwayNumber: req.params.id,
    });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.json({ message: "Catway supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
