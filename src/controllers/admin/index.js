const router = require('express').Router();
const postInstagram = require('./post-instagram');
const usersManagement = require('./management-users');
const galleryManagement = require('./management-gallery');
const productsManagement = require('./management-products');

router.use("/post-instagram", postInstagram);
router.use("/management-users", usersManagement);
router.use("/management-gallery", galleryManagement);
router.use("/management-products", productsManagement);

module.exports = router;