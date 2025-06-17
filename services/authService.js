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

  async updateUser(userId, updateData) {
    // Remove campos que não devem ser atualizados diretamente
    delete updateData.password;
    delete updateData.resetToken;
    delete updateData.resetTokenExpires;

    const user = await Usuario.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  },

  async updatePassword(userId, newPassword) {
    const user = await Usuario.findById(userId);
    if (!user) throw new Error("Usuário não encontrado");

    user.password = newPassword;
    await user.save();
    return user;
  },
};

module.exports = authService;