const router = require('express').Router();
const requireAdmin = require('../../middlewares/requireAdmin');
const userSchema = require('../../models/User');

router.use(requireAdmin);

router.get('/', async (req, res) => {
  try {
    const response = await userSchema.find();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Estos tres endpoints no tienen lógica implementada todavía (el body
// siempre estuvo vacío). Antes, con el bloque try vacío y sin ningún
// res.*, la request quedaba colgada para siempre en vez de fallar. Se
// responde 501 explícito mientras no se implementen.
router.post('/create', async (req, res) => {
  return res.status(501).json({ message: 'No implementado.' });
});

router.patch('/update/:id', async (req, res) => {
  return res.status(501).json({ message: 'No implementado.' });
});

router.delete('/delete/:id', async (req, res) => {
  return res.status(501).json({ message: 'No implementado.' });
});

module.exports = router;
