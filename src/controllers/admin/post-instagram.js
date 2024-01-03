const router = require('express').Router();
const { apiUrl } = require('../../config');
const { instagram } = require('../../integrations/instagram-auth');

const redirectUri = `${apiUrl}/admin/post-instagram/callback`;

router.get('/', async (req, res) => {
  res.redirect(
    instagram.getAuthorizationUrl(redirectUri, {
      state: 'offline'
    }));
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await instagram.authorizeUser(code, redirectUri);
    console.log(data)
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;