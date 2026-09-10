// Un hash bcrypt siempre empieza así. Sirve para distinguir una contraseña
// real de la "sentinel" que llevaban las cuentas de Google antiguas.
const BCRYPT_HASH = /^\$2[abxy]?\$\d{2}\$/;

/**
 * ¿La cuenta puede iniciar sesión con contraseña?
 * true si tiene el flag `hasPassword` o si `password` es un hash bcrypt real.
 * (Deriva el valor para las cuentas previas a la migración del campo.)
 */
const hasUsablePassword = (user) =>
  !!user.hasPassword || (typeof user.password === "string" && BCRYPT_HASH.test(user.password));

/**
 * Origen de la foto de perfil. Para cuentas previas al campo, conserva el
 * comportamiento anterior: la foto de Google se mostraba por fallback.
 */
const resolvePicSource = (user) => {
  if (user.profilePicSource === "google" || user.profilePicSource === "none") {
    return user.profilePicSource;
  }
  return !user.profilePic && user.googlePic ? "google" : "none";
};

/**
 * Forma pública de un usuario (lo que se expone al cliente).
 * Centraliza lo que antes estaba duplicado en auth.js y account.js.
 */
const publicUser = (user) => {
  const picSource = resolvePicSource(user);
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    role: user.role,
    method: user.method,
    // Métodos de acceso disponibles para esta cuenta.
    hasPassword: hasUsablePassword(user),
    hasGoogle: !!user.googleId,
    // Foto: la de Google si el usuario la eligió; si no, ninguna.
    googlePic: user.googlePic || null,
    profilePicSource: picSource,
    profilePic: picSource === "google" ? (user.googlePic || null) : (user.profilePic || null),
  };
};

module.exports = { publicUser, hasUsablePassword };
