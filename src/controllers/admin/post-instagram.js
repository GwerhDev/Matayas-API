const router = require('express').Router();
const { apiUrl, clientUrl } = require('../../config');
const { instagram } = require('../../integrations/instagram-auth');
const passport = require('passport');

passport.use('instagram', instagram);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('instagram'));

router.get('/callback', passport.authenticate('instagram', {
  successRedirect: '/admin/post-instagram/success',
  failureRedirect: '/admin/post-instagram/failure'
}));

router.get('/failure', (req, res) => {
  return res.status(400).redirect(`${clientUrl}/#/instagram-error`);
});

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user;

    console.log(user)

  } catch (error) {
    console.error(error);
    return res.status(500).redirect(`${clientUrl}/#/instagram-error`);
  }
});

module.exports = router;