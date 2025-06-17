const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const e = require("express");

const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    sobreNome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
    telefone: {
      type: String,
      required: true,
    },
    dt_nascimento: {
      type: Date,
      required: true,
    },
    genero: {
      type: String,
      required: true,
    },
    fotoPerfil: {
      type: String,
    }, // URL da foto de perfil
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UsuarioSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UsuarioSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
