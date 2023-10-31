const router = require("express").Router();
const productSchema = require("../models/Product");
const { message } = require("../messages");

router.get('/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const products = await productSchema.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).send(products);

  } catch (error) {
    return res.status(500).send({ error: message.search.error })
  }
});


module.exports = router;