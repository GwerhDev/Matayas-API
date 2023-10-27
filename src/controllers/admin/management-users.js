const router = require('express').Router();
const userSchema = require('../../models/User');

router.get('/', async(req, res) => {
  try {
    const response = await userSchema.find();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.post('/create', async(req, res) => {
  try {

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.patch('/update/:id', async(req, res) => {
  try {

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.delete('/delete/:id', async(req, res) => {
  try {

  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;