const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const userSchema = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const { authLimiter } = require("../middlewares/rateLimit");
const { publicUser, hasUsablePassword } = require("../misc/serializers");
const { message } = require("../messages");
const { clientUrl } = require("../config");
const { createToken, decodeToken } = require("../integrations/jwt");
const { linkGoogle } = require("../integrations/google-auth");

passport.use("link-google", linkGoogle);

const accountUrl = `${clientUrl}/account`;

router.get("/my-data", requireAuth, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    return res.status(200).send({ logged: true, userData: publicUser(user) });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

// Editar los datos propios: nombre y origen de la foto de perfil.
router.patch("/update", requireAuth, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);

    if (!user) return res.status(404).send({ message: message.account.notfound });

    const { username, profilePicSource } = req.body;

    if (username !== undefined) {
      const clean = String(username).trim();
      if (clean.length < 2 || clean.length > 40) {
        return res.status(400).send({ message: message.account.invalidUsername });
      }
      user.username = clean;
    }

    if (profilePicSource !== undefined) {
      if (profilePicSource === "google") {
        if (!user.googleId || !user.googlePic) {
          return res.status(400).send({ message: message.account.noGooglePic });
        }
        user.profilePicSource = "google";
      } else {
        user.profilePicSource = "none";
      }
      user.profilePic = null;
    }

    await user.save();

    return res.status(200).send({ userData: publicUser(user), message: message.account.updated });
  } catch (error) {
    return res.status(500).send({ message: message.account.error });
  }
});

// Cambiar o crear la contraseña.
// - Si la cuenta ya tiene contraseña: exige y verifica la actual.
// - Si no (cuenta creada solo con Google): permite crear una, ya que la
//   sesión (JWT) prueba la identidad.
router.post("/change-password", authLimiter, requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).send({ message: message.account.weakPassword });
    }

    const user = await userSchema.findById(req.user.id);

    if (!user) return res.status(404).send({ message: message.account.notfound });

    const hadPassword = hasUsablePassword(user);

    if (hadPassword) {
      const matches = currentPassword
        ? await bcrypt.compare(String(currentPassword), user.password)
        : false;
      if (!matches) {
        return res.status(400).send({ message: message.account.wrongPassword });
      }
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(String(newPassword), salt);
    user.hasPassword = true;
    await user.save();

    return res.status(200).send({
      message: hadPassword ? message.account.passwordChanged : message.account.passwordCreated,
    });
  } catch (error) {
    return res.status(500).send({ message: message.account.error });
  }
});

// Desvincular Google. Solo si la cuenta tiene contraseña propia, para no
// quedar sin ningún método de acceso.
router.post("/unlink-google", requireAuth, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);

    if (!user) return res.status(404).send({ message: message.account.notfound });
    if (!user.googleId) return res.status(400).send({ message: message.account.googleNotLinked });
    if (!hasUsablePassword(user)) return res.status(400).send({ message: message.account.needPasswordFirst });

    user.googleId = null;
    user.googlePic = null;
    if (user.profilePicSource === "google") user.profilePicSource = "none";
    await user.save();

    return res.status(200).send({ userData: publicUser(user), message: message.account.googleUnlinked });
  } catch (error) {
    return res.status(500).send({ message: message.account.error });
  }
});

// --- Vincular Google (OAuth) ---------------------------------------------
// El cliente redirige el navegador a /account/link-google?token=<JWT sesión>.
// El id del usuario se reempaqueta en un `state` (JWT de 10 min) que se valida
// al volver del callback. No usa la sesión de passport.

router.get("/link-google", async (req, res, next) => {
  const decoded = await decodeToken(req.query.token);
  const uid = decoded?.data?.id;

  if (!uid) return res.redirect(`${accountUrl}?link=error`);

  const state = await createToken({ uid }, { minutes: 10 });

  return passport.authenticate("link-google", { state, session: false })(req, res, next);
});

router.get(
  "/link-google/callback",
  passport.authenticate("link-google", {
    session: false,
    failureRedirect: `${clientUrl}/account?link=error`,
  }),
  async (req, res) => {
    try {
      const decoded = await decodeToken(req.query.state);
      const uid = decoded?.data?.uid;
      const googleProfile = req.user;

      if (!uid || !googleProfile?.googleId) {
        return res.redirect(`${accountUrl}?link=error`);
      }

      const user = await userSchema.findById(uid);
      if (!user) return res.redirect(`${accountUrl}?link=error`);

      const sameEmail =
        String(googleProfile.email || "").trim().toLowerCase() ===
        String(user.email || "").trim().toLowerCase();

      if (!sameEmail) return res.redirect(`${accountUrl}?link=email-mismatch`);

      const takenBy = await userSchema.findOne({ googleId: googleProfile.googleId });
      if (takenBy && String(takenBy._id) !== String(user._id)) {
        return res.redirect(`${accountUrl}?link=in-use`);
      }

      user.googleId = googleProfile.googleId;
      user.googlePic = googleProfile.photo || user.googlePic || null;
      if (user.method === undefined || user.method === null) user.method = "inner";
      await user.save();

      return res.redirect(`${accountUrl}?link=ok`);
    } catch (error) {
      return res.redirect(`${accountUrl}?link=error`);
    }
  }
);

module.exports = router;
