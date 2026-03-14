const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Schéma mongoose pour les utilisateurs.
 * @typedef {Object} User
 * @property {string} username - Le nom d'utilisateur de l'utilisateur.
 * @property {string} email - L'adresse e-mail de l'utilisateur.
 * @property {string} password - Le mot de passe de l'utilisateur (hashé).
 * @property {Date} createdAt - La date de création de l'utilisateur.
 * @property {Date} updatedAt - La date de la dernière mise à jour de l'utilisateur.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Middleware pre-save pour hacher le mot de passe avant de sauvegarder l'utilisateur.
 * Hash automatiquement le mot de passe avant de le stocker dans la base de données, assurant ainsi la sécurité des données utilisateur.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
