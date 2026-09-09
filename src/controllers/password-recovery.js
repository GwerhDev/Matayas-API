const router = require("express").Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const { message } = require("../messages");
const { passwordResetTokenMinutes, isProd, clientUrl } = require("../config");
const { sendPasswordReset } = require("../integrations/sendgrid");

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

const hashToken = (token) =>
  crypto.createHash("sha256").update(String(token)).digest("hex");

// Paso 1: el usuario pide el enlace de recuperación con su email.
// Responde SIEMPRE 200 (salvo body inválido) para no revelar si el correo existe.
router.post("/", async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) return res.status(400).send({ error: message.passwordRecovery.error });

  try {
    const user = await userSchema.findOne({ email });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = hashToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + passwordResetTokenMinutes * 60 * 1000);
      await user.save();

      // En desarrollo, imprime el enlace para poder probar sin correo real.
      if (!isProd) {
        console.log(`[password-recovery] ${clientUrl}/password-recovery/reset?token=${rawToken}`);
      }

      try {
        await sendPasswordReset(user, rawToken);
      } catch (mailError) {
        console.error("No se pudo enviar el correo de recuperación:", mailError?.message || mailError);
      }
    }
  } catch (error) {
    console.error("Error en /password-recovery:", error?.message || error);
  }

  return res.status(200).send({ message: message.passwordRecovery.requested });
});

// Paso 2: el usuario abre el enlace del correo y define la contraseña nueva.
router.post("/reset", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).send({ success: false, message: message.passwordRecovery.invalidToken });
    }

    if (String(password).length < 6) {
      return res.status(400).send({ success: false, message: message.passwordRecovery.weakPassword });
    }

    const user = await userSchema.findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).send({ success: false, message: message.passwordRecovery.invalidToken });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isVerified = true; // recibir el correo demuestra que el email es suyo
    await user.save();

    return res.status(200).send({ success: true, message: message.passwordRecovery.success });
  } catch (error) {
    return res.status(500).send({ success: false, message: message.passwordRecovery.error });
  }
});

module.exports = router;
