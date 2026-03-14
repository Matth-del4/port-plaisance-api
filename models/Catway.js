const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour les catways.
 * Chaque catway a un numéro unique, un type (long ou court) et un état.
 * Les timestamps sont activés pour suivre la création et la mise à jour des catways.
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Le numéro unique du catway.
 * @property {string} catwayType - Le type du catway (long ou court).
 * @property {string} catwayState - L'état actuel du catway.
 * @property {Date} createdAt - La date de création du catway (générée automatiquement).
 * @property {Date} updatedAt - La date de la dernière mise à jour du catway (générée automatiquement).
 */
const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    catwayType: {
      type: String,
      required: true,
      enum: ["long", "short"],
    },
    catwayState: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Catway", catwaySchema);
