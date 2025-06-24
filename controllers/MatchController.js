const { buscarMatchesPet } = require('../services/matchServices');

module.exports = {
  async buscarMatches(req, res) {
    try {
      const { raca, sexo, cor, pedigree, displasia_coxofemural } = req.body;
      if (!raca || !sexo || !cor || pedigree === undefined || !displasia_coxofemural) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }
      const matches = await buscarMatchesPet({ raca, sexo, cor, pedigree, displasia_coxofemural });
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};