const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

/**
 * Récupère toutes les réservations d'un catway
 * @route GET /catways/:id/reservations
 * @param {number} id - Le numéro du catway
 * @returns {Array} 200 - Un tableau de réservations
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/catways/:id/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Récupère une réservation par son ID
 * @route GET /catways/:id/reservations/:idReservation
 * @param {number} id - Le numéro du catway
 * @param {string} idReservation - L'ID de la réservation
 * @returns {Object} 200 - Un objet réservation
 * @returns {Error} 404 - Réservation non trouvée
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/catways/:id/reservations/:idReservation", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Crée une nouvelle réservation
 * @route POST /catways/:id/reservations
 * @param {number} id - Le numéro du catway
 * @param {Object} reservation - Les données de la réservation à créer
 * @returns {Object} 201 - La réservation créée
 * @returns {Error} 400 - Données invalides
 */
router.post("/catways/:id/reservations", async (req, res) => {
  try {
    const reservation = new Reservation({
      catwayNumber: req.params.id,
      ...req.body,
    });
    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Met à jour une réservation existante
 * @route PUT /catways/:id/reservations/:idReservation
 * @param {number} id - Le numéro du catway
 * @param {string} idReservation - L'ID de la réservation à mettre à jour
 * @param {Object} reservation - Les données de la réservation à mettre à jour
 * @returns {Object} 200 - La réservation mise à jour
 * @returns {Error} 404 - Réservation non trouvée
 * @returns {Error} 400 - Données invalides
 */
router.put("/catways/:id/reservations/:idReservation", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });

    Object.keys(req.body).forEach((key) => {
      if (req.body[key]) reservation[key] = req.body[key];
    });

    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Supprime une réservation existante
 * @route DELETE /catways/:id/reservations/:idReservation
 * @param {number} id - Le numéro du catway
 * @param {string} idReservation - L'ID de la réservation à supprimer
 * @returns {Object} 200 - Message de suppression réussie
 * @returns {Error} 404 - Réservation non trouvée
 * @returns {Error} 500 - Erreur serveur
 */
router.delete("/catways/:id/reservations/:idReservation", async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(
      req.params.idReservation,
    );
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
