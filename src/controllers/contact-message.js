const { sendContactMessage } = require("../integrations/sendgrid");
const { message } = require("../messages");

const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    sendContactMessage(req.body);

    return res.status(200).json({ message: message.contactMessage.success });
  } catch (error) {
    return res.status(500).json({ message: message.contactMessage.error });
  }
});

module.exports = router;