const Pet = require('../models/Pet');
const Usuario = require('../models/Users');

const petService = {
  async createPet(petData) {
    // Busca o usuário dono
    const usuario = await Usuario.findById(petData.id_usuario);
    if (!usuario) throw new Error('Usuário (dono) não encontrado');

    // Cria o pet na collection Pet
    const pet = await Pet.create({
      ...petData,
      nomeDono: usuario.nome, // snapshot do nome do dono
    });

    // Adiciona o pet ao array de pets do usuário (redundância)
    usuario.pets = usuario.pets || [];
    usuario.pets.push({
      petId: pet._id,
      nome: pet.nome,
      raca: pet.raca,
      idade: pet.idade,
      displasia_coxofemural: pet.displasia_coxofemural,
      consanguinidade: pet.consanguinidade,
      pedigree: pet.pedigree,
      regiao: pet.regiao,      // <-- adicione estes campos
      sexo: pet.sexo,          // <-- adicione estes campos
      cor: pet.cor,            // <-- adicione estes campos
      status_reproducao: pet.status_reproducao // se for obrigatório
    });
    await usuario.save();

    return pet;
  },

  async getPetById(petId) {
    return await Pet.findById(petId).populate('id_usuario', 'nome email');
  },

  async getPetsByUser(userId) {
    return await Pet.find({ id_usuario: userId });
  },

  async updatePet(petId, updateData) {
    const pet = await Pet.findByIdAndUpdate(petId, updateData, { new: true });
    if (!pet) throw new Error('Pet não encontrado');

    // Atualiza também no array de pets do usuário
    const usuario = await Usuario.findById(pet.id_usuario);
    if (usuario && usuario.pets) {
      const petIndex = usuario.pets.findIndex(p => p.petId.toString() === petId);
      if (petIndex !== -1) {
        usuario.pets[petIndex] = {
          petId: pet._id,
          nome: pet.nome,
          raca: pet.raca,
          idade: pet.idade,
          displasia_coxofemural: pet.displasia_coxofemural,
          consanguinidade: pet.consanguinidade,
          pedigree: pet.pedigree,
        };
        await usuario.save();
      }
    }

    return pet;
  },

  async deletePet(petId) {
    const pet = await Pet.findByIdAndDelete(petId);
    if (!pet) throw new Error('Pet não encontrado');

    // Remove do array de pets do usuário
    const usuario = await Usuario.findById(pet.dono);
    if (usuario && usuario.pets) {
      usuario.pets = usuario.pets.filter(p => p.petId.toString() !== petId);
      await usuario.save();
    }

    return pet;
  },
};

module.exports = petService;