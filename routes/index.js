const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const petRoutes = require('./petRoutes'); // Adicione esta linha

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api', petRoutes); // Adicione esta linha

module.exports = router;