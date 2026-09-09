const rateLimit = require("express-rate-limit");

/**
 * Limitador para endpoints sensibles de autenticación (login, signup,
 * verificación de correo, recuperación de contraseña).
 * 20 intentos por IP cada 15 minutos.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta nuevamente en unos minutos." },
});

module.exports = { authLimiter };
