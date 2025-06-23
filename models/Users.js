const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const regioesDF = [
  "Plano Piloto", "Gama", "Taguatinga", "Brazlândia", "Sobradinho", "Planaltina",
  "Paranoá", "Núcleo Bandeirante", "Ceilândia", "Guará", "Cruzeiro", "Samambaia",
  "Santa Maria", "São Sebastião", "Recanto das Emas", "Lago Sul", "Riacho Fundo",
  "Lago Norte", "Candangolândia", "Águas Claras", "Riacho Fundo II",
  "Sudoeste/Octogonal", "Varjão", "Park Way", "Fercal", "Jardim Botânico",
  "Itapoã", "SCIA/Estrutural", "SIA", "Vicente Pires", "Arniqueira",
  "Arapoanga", "Sol Nascente/Pôr do Sol"
];

const PetSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  nome: { type: String, required: true },
  raca: { type: String, required: true },
  idade: { type: Number, required: true },
  cor: { type: String, required: true },
  sexo: { type: String, required: true, enum: ["Macho", "Fêmea"] },
  status_reproducao: {
    type: String,
    required: true,
    enum: ["Indisponível", "Disponível"],
    default: "Disponível",
  },
  displasia_coxofemural: {
    type: String,
    required: true,
    enum: ["Não Registrada", "A", "B", "C", "D", "E"],
    default: "Não Registrada",
  },
  consanguinidade: {
    type: String,
    required: true,
    enum: ["Não Registrada", "Cadastrada"],
    default: "Não Registrada",
  },
  pedigree: { type: Boolean, required: true, default: false },
  regiao: { type: String, required: true, enum: regioesDF },
});

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    sobreNome: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: false, unique: false, default: null },
    telefone: { type: String, required: false, default: null },
    dt_nascimento: { type: Date, required: false, default: null },
    genero: { type: String, required: false, default: null },
    fotoPerfil: { type: String, default: null },
    password: { type: String, required: false, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    regiao: { type: String, required: false, enum: regioesDF, default: null },
    pets: [PetSchema],
  },
  { timestamps: true }
);

UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UsuarioSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
