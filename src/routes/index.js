const router = require('express').Router();
const auth = require('../controllers/auth');
const admin = require('../controllers/admin');
const search = require('../controllers/search');
const account = require('../controllers/account');
const gallery = require('../controllers/gallery');
const products = require('../controllers/products');
const loginInner = require('../controllers/login-inner');
const signupInner = require('../controllers/signup-inner');
const loginGoogle = require('../controllers/login-google');
const signupGoogle = require('../controllers/signup-google');
const emailVerification = require('../controllers/email-verification');

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/search", search);
router.use("/account", account);
router.use("/gallery", gallery);
router.use("/products", products);
router.use("/login-inner", loginInner);
router.use("/signup-inner", signupInner);
router.use("/login-google", loginGoogle);
router.use("/signup-google", signupGoogle);
router.use("/email-verification", emailVerification);

module.exports = router;