const router = require('express').Router();
const { message } = require('../../messages');
const requireAdmin = require('../../middlewares/requireAdmin');
const productSchema = require('../../models/Product');
const productGallerySchema = require('../../models/ProductGallery');

router.use(requireAdmin);

router.post('/create', async (req, res) => {
  try {
    const { productGallery } = req.body;

    for (let i = 0; i < productGallery.length; i++) {
      const newProductGallery = new productGallerySchema({ file: productGallery[i] });
      await newProductGallery.save();
      req.body.productGallery[i] = newProductGallery._id;
    }

    const newProduct = new productSchema(req.body);
    await newProduct.save();
    return res.status(201).json({ message: message.admin.createproduct.success, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productGallery } = req.body;

    for (let i = 0; i < productGallery.length; i++) {
      if (productGallery[i]._id) await productGallerySchema.findByIdAndUpdate(productGallery[i]._id, { file: productGallery[i].file });
      else {
        const newProductGallery = new productGallerySchema({ file: productGallery[i].file });
        await newProductGallery.save();
        req.body.productGallery[i] = newProductGallery._id;
      }
    }

    await productSchema.findByIdAndUpdate(id, req.body);

    return res.status(200).json({ message: message.admin.updateproduct.success, success: true });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await productSchema.findByIdAndDelete(id);

    return res.status(200).json({ message: message.admin.deleteproduct.success, success: true });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
