const router = require('express').Router();
const gallerySchema = require('../models/Gallery');

router.get('/', async (req, res) => {
  try {
    const response = await gallerySchema.find();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await gallerySchema.findById(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;