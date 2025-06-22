const express = require('express');
const PetController = require('../controllers/PetController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/pets', authMiddleware, PetController.createPet);
router.get('/pets/:id', authMiddleware, PetController.getPetById);
router.get('/pets/usuario/:userId', authMiddleware, PetController.getPetsByUser);
router.put('/pets/:id', authMiddleware, PetController.updatePet);
router.delete('/pets/:id', authMiddleware, PetController.deletePet);

module.exports = router;