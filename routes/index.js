const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');

const router = express.Router();

router.use('/api', usuarioRoutes);

module.exports = router;