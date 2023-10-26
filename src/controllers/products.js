const router = require('express').Router();
const { instagramPosts } = require('../integrations/instagram-posts');

router.get('/', async (req, res) => {
  try {
    const response = await instagramPosts();
    console.log(response)
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;