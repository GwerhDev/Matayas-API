const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const { message } = require("../messages");
const { adminEmailList } = require("../config");
const { status, roles, methods } = require("../misc/consts-user-model");
const { createToken } = require("../integrations/jwt");
const { sendEmailVerification } = require("../integrations/sendgrid");

router.post('/', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if(!username || !password || !email) return res.status(400).send({ error: message.signup.error });
    
    const existingUser = await userSchema.findOne({ email });
    
    if(existingUser) {
      const tokenData = {
        id: existingUser._id,
        role: existingUser.role,
        isVerified: existingUser.isVerified
      };
      const token = await createToken(tokenData, 3);
      return res.status(200).send({token});
    };
    
    const userData = {
      username,
      password,
      email,
      profilePic: null,
      status: status.inactive,
      isVerified: false,
      method: methods.inner,
      role: roles.freemium,
      googleId: null,
      googlePic: null
    };
    
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(password, salt);

    if(adminEmailList.includes(email)) userData.role = roles.admin;
    
    const userCreated = await userSchema.create(userData);

    const tokenData = {
      id: userCreated._id,
      role: userCreated.role,
      isVerified: userCreated.isVerified
    };
    
    const token = await createToken(tokenData, 3);

    const response = await sendEmailVerification(userData, token);

    return res.status(200).send({ msg: message.signup.success, signed: true, token });

  } catch (error) {
    return res.status(400).send({ error: message.signup.error });
  };
});

module.exports = router;