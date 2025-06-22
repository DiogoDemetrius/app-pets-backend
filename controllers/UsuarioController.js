const authService = require('../services/authService');

module.exports = {
  async registrar(req, res) {
    try {
      const {
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
      } = req.body;

      const user = await authService.register({
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
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login({ email, password });
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      return res
        .status(200)
        .json({ message: "Email de redefinição de senha enviado" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      return res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getMe(req, res) {
    try {
      const user = await authService.getUserById(req.userId);
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Erro ao obter usuário:", error); // Adicionado
      return res.status(400).json({ error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await authService.getAllUsers();
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = await authService.updateUser(id, updateData);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error); // Adicionado
      return res.status(400).json({ error: error.message });
    }
  },

  async updateFotoPerfil(req, res) {
    try {
      const { id } = req.params;
      const { fotoPerfil } = req.body;

      if (!fotoPerfil)
        return res.status(400).json({ error: "URL da foto é obrigatória" });

      const user = await authService.updateFotoPerfil(id, fotoPerfil);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error); // Adicionado
      return res.status(400).json({ error: error.message });
    }
  },

  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      const user = await authService.updatePassword(id, newPassword);
      return res.status(200).json({ message: "Senha atualizada com sucesso", user });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error); // Adicionado
      return res.status(400).json({ error: error.message });
    }
  },
};