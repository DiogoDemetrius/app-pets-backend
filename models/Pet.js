const mongoose = require("mongoose");

const regioesDF = [
  "Plano Piloto", "Gama", "Taguatinga", "Brazlândia", "Sobradinho", "Planaltina",
  "Paranoá", "Núcleo Bandeirante", "Ceilândia", "Guará", "Cruzeiro", "Samambaia",
  "Santa Maria", "São Sebastião", "Recanto das Emas", "Lago Sul", "Riacho Fundo",
  "Lago Norte", "Candangolândia", "Águas Claras", "Riacho Fundo II",
  "Sudoeste/Octogonal", "Varjão", "Park Way", "Fercal", "Jardim Botânico",
  "Itapoã", "SCIA/Estrutural", "SIA", "Vicente Pires", "Arniqueira",
  "Arapoanga", "Sol Nascente/Pôr do Sol"
];

const PetSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    raca: { type: String, required: true },
    imagem: { type: String, required: false },
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
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", PetSchema);
