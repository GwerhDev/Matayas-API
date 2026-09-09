const router = require("express").Router();
const userSchema = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const { publicUser } = require("../misc/serializers");
const { message } = require("../messages");

router.get("/my-data", requireAuth, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    return res.status(200).send({ logged: true, userData: publicUser(user) });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

module.exports = router;
