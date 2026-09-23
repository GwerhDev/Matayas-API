const router = require('express').Router();
const { message } = require('../../messages');
const requireAdmin = require('../../middlewares/requireAdmin');
const gallerySchema = require('../../models/Gallery');

router.use(requireAdmin);

router.post('/create', async (req, res) => {
  try {
    const newGallery = new gallerySchema(req.body);
    await newGallery.save();
    return res.status(201).json({ message: message.admin.createproduct.success, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await gallerySchema.findByIdAndUpdate(id, req.body);

    return res.status(200).json({ message: message.admin.updateproduct.success, success: true });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await gallerySchema.findByIdAndDelete(id);

    return res.status(200).json({ message: message.admin.deleteproduct.success, success: true });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
