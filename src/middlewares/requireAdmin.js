const { decodeToken } = require("../integrations/jwt");
const { message } = require("../messages");
const { roles } = require("../misc/consts-user-model");

/**
 * Middleware de autorización para el panel de administración.
 * Reemplaza el chequeo de rol que antes se repetía copiado en cada
 * handler de /admin/management-*. Responde 403 si falta el token o el
 * rol decodificado no es admin.
 */
async function requireAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: message.admin.permissionDenied });
  }

  const decoded = await decodeToken(token);

  if (decoded?.data?.role !== roles.admin) {
    return res.status(403).json({ message: message.admin.permissionDenied });
  }

  req.user = decoded.data;
  next();
}

module.exports = requireAdmin;
