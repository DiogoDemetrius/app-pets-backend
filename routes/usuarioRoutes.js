const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/usuarios/:id/fotoPerfil', authMiddleware, UsuarioController.updateFotoPerfil);
router.put('/usuarios/:id', authMiddleware, UsuarioController.updateUser);
router.put('/usuarios/:id/senha', authMiddleware, UsuarioController.updatePassword);
router.post('/usuarios', UsuarioController.registrar);
router.post('/login', UsuarioController.login);
router.post('/forgot-password', UsuarioController.forgotPassword);
router.post('/reset-password', UsuarioController.resetPassword);
router.get('/me', authMiddleware, UsuarioController.getMe);
router.get('/allUsers', UsuarioController.getAllUsers);


module.exports = router;