const jwt = require("jsonwebtoken");
const { privateSecret } = require("../config");

/**
 * Crea un JWT firmado.
 * @param {object} data  Payload de negocio (se guarda en `decoded.data`).
 * @param {number|{days?:number,minutes?:number}} expiresIn
 *        Número => días de vigencia (compatibilidad con el uso previo `createToken(data, 3)`).
 *        Objeto => { days } y/o { minutes }.
 */
const createToken = async (data, expiresIn = 3) => {
  let seconds;
  if (typeof expiresIn === "number") {
    seconds = expiresIn * 60 * 60 * 24;
  } else {
    const { days = 0, minutes = 0 } = expiresIn || {};
    seconds = days * 60 * 60 * 24 + minutes * 60;
  }

  const payload = {
    data,
    exp: Math.floor(Date.now() / 1000) + seconds
  };

  return jwt.sign(payload, privateSecret);
};

/**
 * Verifica y decodifica un JWT.
 * @returns {object|null} El payload decodificado, o `null` si el token es
 *          inválido, expiró o no vino. Nunca devuelve el objeto Error.
 */
const decodeToken = async (token) => {
  try {
    return jwt.verify(token, privateSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  decodeToken
};
