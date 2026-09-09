const { decodeToken } = require("../integrations/jwt");
const { message } = require("../messages");

/**
 * Middleware de autenticación.
 * Valida el JWT del header `Authorization` y deja el payload en `req.user`
 * (`{ id, role, ... }`). Responde 401 si falta o es inválido/expiró.
 */
async function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ logged: false, message: message.user.unauthorized });
  }

  const decoded = await decodeToken(token);

  if (!decoded || !decoded.data || !decoded.data.id) {
    return res.status(401).send({ logged: false, message: message.user.unauthorized });
  }

  req.user = decoded.data;
  next();
}

module.exports = requireAuth;
