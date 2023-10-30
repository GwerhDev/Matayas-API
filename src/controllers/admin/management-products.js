const router = require('express').Router();
const { decodeToken } = require('../../integrations/jwt');
const { message } = require('../../messages');
const { roles } = require('../../misc/consts-user-model');
const productSchema = require('../../models/Product');

router.post('/create', async(req, res) => {
  try {
    const userToken = req.headers.authorization;
    if (!userToken) return res.status(403).json({ message: message.admin.permissionDenied });

    const decodedToken = await decodeToken(userToken);
    if (decodedToken?.data?.role !== roles.admin) return res.status(403).json({ message: message.admin.permissionDenied });

    const newProduct = new productSchema(req.body);
    await newProduct.save();
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

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;