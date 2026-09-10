const router = require('express').Router();
const { createToken } = require('../integrations/jwt');
const { message } = require('../messages');
const userSchema = require('../models/User');
const bcrypt = require("bcryptjs");

router.post('/', async(req,res) => { 
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : req.body.email;
    const user = await userSchema.findOne({ email });
    // Sin contraseña definida (cuenta creada solo con Google): no permite
    // acceso por clave hasta que el usuario cree una desde su cuenta.
    if(!user || !user.password) return res.status(400).send({ logged: false, message: message.login.failure });

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if(passwordMatch) {
      const { id, role } = user;
      const data = { id, role };
      const token = await createToken(data, 3);
      return res.status(200).send({ logged: true, token, message: message.login.success });

    } else {
      return res.status(400).send({ logged: false, message: message.login.error });
    }
    
  } catch(error) {
    return res.status(400).send({ logged: false, message: message.login.error });
  }
});

module.exports = router;