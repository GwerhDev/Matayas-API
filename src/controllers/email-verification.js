const router = require('express').Router();
const userSchema = require('../models/User');
const { decodeToken } = require('../integrations/jwt');
const { message } = require('../messages');

router.post("/", async(req, res) => {
  try {    
    const { token } = req.body;
    const decodedToken = await decodeToken(token);
    const user = await userSchema.findByIdAndUpdate(decodedToken.data.id, { isVerified: true });
  
    return res.status(200).send({ verified: true });
  } catch (error) {
    return res.status(500).send({ error: message.user.error, verified: false })
  }
});

module.exports = router;