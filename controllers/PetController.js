const petService = require('../services/petService');

module.exports = {
  async createPet(req, res) {
    try {
      const pet = await petService.createPet(req.body);
      return res.status(201).json(pet);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  async getPetById(req, res) {
    try {
      const pet = await petService.getPetById(req.params.id);
      if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
      return res.status(200).json(pet);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  async getPetsByUser(req, res) {
    try {
      const pets = await petService.getPetsByUser(req.params.userId);
      return res.status(200).json(pets);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  async updatePet(req, res) {
    try {
      const pet = await petService.updatePet(req.params.id, req.body);
      return res.status(200).json(pet);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  async deletePet(req, res) {
    try {
      const pet = await petService.deletePet(req.params.id);
      return res.status(200).json({ message: 'Pet removido com sucesso', pet });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },
};