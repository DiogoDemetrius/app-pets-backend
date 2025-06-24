const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const petRoutes = require('./petRoutes');
const matchRoutes = require('./matchRoutes');

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api', petRoutes);
router.use('/api', matchRoutes);

module.exports = router;