const router = require('express').Router();
const { decodeToken } = require('../../integrations/jwt');
const { message } = require('../../messages');
const { roles } = require('../../misc/consts-user-model');
const gallerySchema = require('../../models/Gallery');

router.post('/create', async(req, res) => {
  try {
    const userToken = req.headers.authorization;
    if (!userToken) return res.status(403).json({ message: message.admin.permissionDenied });

    const decodedToken = await decodeToken(userToken);
    if (decodedToken?.data?.role !== roles.admin) return res.status(403).json({ message: message.admin.permissionDenied });

    const newGallery = new gallerySchema(req.body);
    await newGallery.save();
    return res.status(201).json({ message: message.admin.createproduct.success, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const userToken = req.headers.authorization;
    if (!userToken) return res.status(403).json({ message: message.admin.permissionDenied });
    
    const decodedToken = await decodeToken(userToken);
    if (decodedToken?.data?.role !== roles.admin) return res.status(403).json({ message: message.admin.permissionDenied });
    
    const { id } = req.params;
    
    await gallerySchema.findByIdAndUpdate(id, req.body);

    return res.status(200).json({ message: message.admin.updateproduct.success, success: true });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.delete('/delete/:id', async(req, res) => {
  try {
    const userToken = req.headers.authorization;
    if (!userToken) return res.status(403).json({ message: message.admin.permissionDenied });

    const decodedToken = await decodeToken(userToken);
    if (decodedToken?.data?.role !== roles.admin) return res.status(403).json({ message: message.admin.permissionDenied });

    const { id } = req.params;

    await gallerySchema.findByIdAndDelete(id);

    return res.status(200).json({ message: message.admin.deleteproduct.success, success: true });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;