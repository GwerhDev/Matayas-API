const router = require('express').Router();
const productSchema = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const response = await productSchema.find();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.get('/lasts', async (req, res) => {
  try {
    const response = await productSchema.find().sort({ _id: -1 }).limit(3);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await productSchema.findById(id).populate('productGallery');
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;