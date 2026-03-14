const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification pour protéger les routes nécessitant une authentification.
 * Ce middleware vérifie la présence d'un token JWT dans les en-têtes de la requête,
 * le valide et ajoute les informations de l'utilisateur décodé à l'objet req.
 * @param {Object} req - L'objet requête de Express.
 * @param {Object} res - L'objet réponse de Express.
 * @param {Function} next - La fonction next pour passer au middleware suivant.
 * @returns {Object} - Une réponse JSON en cas d'erreur d'authentification ou la continuation du middleware en cas de succès.
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
