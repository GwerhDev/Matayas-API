const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const { message } = require("../messages");
const { adminEmails } = require("../config");
const { status, roles, methods } = require("../misc/consts-user-model");
const { createToken } = require("../integrations/jwt");
const { sendEmailVerification } = require("../integrations/sendgrid");

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : req.body.email;

    if(!username || !password || !email) return res.status(400).send({ error: message.signup.error });

    const existingUser = await userSchema.findOne({ email });

    // Nunca emitir un token para una cuenta existente sin credenciales:
    // eso permitía tomar cuentas ajenas (incluidas admin) con solo el email.
    if (existingUser) {
      return res.status(409).send({ error: message.signup.existinguser });
    }
    
    const userData = {
      username,
      password,
      hasPassword: true,
      email,
      profilePic: null,
      profilePicSource: "none",
      status: status.inactive,
      isVerified: false,
      method: methods.inner,
      role: roles.freemium,
      googleId: null,
      googlePic: null
    };
    
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(password, salt);

    if(adminEmails.includes(email)) userData.role = roles.admin;
    
    const userCreated = await userSchema.create(userData);

    const tokenData = {
      id: userCreated._id,
      role: userCreated.role,
      isVerified: userCreated.isVerified
    };
    
    const token = await createToken(tokenData, 3);

    await sendEmailVerification(userData, token);

    return res.status(200).send({ msg: message.signup.success, signed: true, token });

  } catch (error) {
    return res.status(400).send({ error: message.signup.error });
  }
});

module.exports = router;