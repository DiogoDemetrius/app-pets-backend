const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Usuario = require('../models/Users');
const { sendResetPasswordEmail } = require('./emailService');

const authService = {
  async register({
    nome,
    sobreNome,
    email,
    cpf,
    telefone,
    dt_nascimento,
    genero,
    fotoPerfil,
    password,
    regiao,
  }) {
    const user = await Usuario.create({
      nome,
      sobreNome,
      email,
      cpf,
      telefone,
      dt_nascimento,
      genero,
      fotoPerfil,
      password,
      regiao,
    });
    return user;
  },

  async login({ email, password }) {
    const user = await Usuario.findOne({ email });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Senha incorreta");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user, token };
  },

  async forgotPassword(email) {
    const user = await Usuario.findOne({ email });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    await sendResetPasswordEmail(email, resetToken);
  },

  async resetPassword(token, newPassword) {
    const user = await Usuario.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token inválido ou expirado");
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
  },

  async getUserById(userId) {
    const user = await Usuario.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  },

  async getAllUsers() {
    const allUsers = await Usuario.find();
    return allUsers;
  },

  async updateFotoPerfil(userId, fotoPerfilUrl) {
    const user = await Usuario.findByIdAndUpdate(
      userId,
      { fotoPerfil: fotoPerfilUrl },
      { new: true }
    );
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  },

  async loginSocial({ nome, email, fotoPerfil, uid }) {
    let user = await Usuario.findOne({ email });

    // Se o usuário ainda não existir, cria um novo
    if (!user) {
      user = await Usuario.create({
        nome,
        sobreNome: null,
        email,
        cpf: null,
        telefone: null,
        dt_nascimento: null,
        genero: null,
        fotoPerfil,
        password: uid, // pode ser UID como valor default fake
        regiao: null,
      });
    }

    // Gera JWT normalmente
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user, token };
  },
};

module.exports = authService;