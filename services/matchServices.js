const Pet = require('../models/Pet');

/**
 * Busca pets compatíveis para cruzamento, considerando raça, sexo oposto, cor
 * e regras de displasia coxofemural. Permite cruzamento entre pets com e sem pedigree.
 * @param {Object} params - { raca, sexo, cor, pedigree, displasia_coxofemural }
 * @returns {Promise<Array>} - Lista de pets compatíveis
 */
async function buscarMatchesPet({ raca, sexo, cor, pedigree, displasia_coxofemural }) {
  // Define sexo oposto
  const sexoOposto = sexo === 'Macho' ? 'Fêmea' : 'Macho';

  // Função para filtrar displasia compatível
  function displasiaCompat(entrada, candidato) {
    if (entrada === 'A' || entrada === 'B') {
      return candidato === 'A' || candidato === 'B' || (entrada === 'A' && candidato === 'C');
    }
    if (entrada === 'C') {
      return candidato === 'A'; // C só pode cruzar com A (com risco)
    }
    // D ou E nunca devem cruzar
    return false;
  }

  // Busca todos os pets da mesma raça, sexo oposto e cor (sem filtrar por pedigree)
  const candidatos = await Pet.find({
    raca,
    sexo: sexoOposto,
  });

  // Filtra por displasia compatível
  const matches = candidatos.filter(pet => displasiaCompat(displasia_coxofemural, pet.displasia_coxofemural));

  return matches;
}

module.exports = { buscarMatchesPet };