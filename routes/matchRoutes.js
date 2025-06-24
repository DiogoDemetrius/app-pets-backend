const express = require('express');
const MatchController = require('../controllers/MatchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/match/pets
router.post('/match/pets', authMiddleware, MatchController.buscarMatches);

module.exports = router;