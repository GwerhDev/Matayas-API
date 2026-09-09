/**
 * Forma pública de un usuario (lo que se expone al cliente).
 * Centraliza lo que antes estaba duplicado en auth.js y account.js.
 */
const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  isVerified: user.isVerified,
  role: user.role,
  profilePic: user.profilePic || user.googlePic,
});

module.exports = { publicUser };
