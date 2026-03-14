const mongoose = require("mongoose");

/**
 * Shéma Moongoose pour les réservations de catways.
 * Chaque réservation contient le numéro du catway, le nom du client, le nom du bateau,
 * ainsi que les dates de début et de fin de la réservation.
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Le numéro du catway réservé.
 * @property {string} clientName - Le nom du client qui a effectué la réservation.
 * @property {string} boatName - Le nom du bateau réservé.
 * @property {Date} startDate - La date de début de la réservation.
 * @property {Date} endDate - La date de fin de la réservation.
 * @property {Date} createdAt - La date de création de la réservation (générée automatiquement).
 * @property {Date} updatedAt - La date de dernière mise à jour de la réservation (générée automatiquement).
 */
const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    boatName: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reservation", reservationSchema);
