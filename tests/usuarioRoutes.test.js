const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Usuario = require('../models/Users');

let token;
let userId;
let resetToken;

beforeAll(async () => {
  // Conecte ao banco de testes, se necessário
});

afterAll(async () => {
  //await Usuario.deleteMany({});
  await mongoose.connection.close();
});

describe('Rotas de Usuário', () => {
  const userData = {
    nome: "Test",
    sobreNome: "User",
    email: "testuser@email.com",
    cpf: "12345678901",
    telefone: "11999999999",
    dt_nascimento: "1990-01-01",
    genero: "masculino",
    fotoPerfil: "https://exemplo.com/foto.jpg",
    password: "senha123",
    regiao: "Taguatinga" // Campo obrigatório do seu model
  };

  it('Deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    userId = res.body._id;
  });

  it('Deve fazer login e retornar token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('Deve retornar o usuário logado (getMe)', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
  });

  it('Deve atualizar dados do usuário', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: "NovoNome", regiao: "Taguatinga" }); // regiao é obrigatório
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("NovoNome");
  });

  it('Deve atualizar a foto de perfil', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${userId}/fotoPerfil`)
      .set('Authorization', `Bearer ${token}`)
      .send({ fotoPerfil: "https://novaurl.com/foto.jpg" });
    expect(res.statusCode).toBe(200);
    expect(res.body.fotoPerfil).toBe("https://novaurl.com/foto.jpg");
  });

  it('Deve atualizar a senha', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${userId}/senha`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newPassword: "novaSenha123" });
    expect(res.statusCode).toBe(200);
    // Opcional: tente logar com a nova senha para garantir
    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: userData.email, password: "novaSenha123" });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });

  it('Deve iniciar o processo de recuperação de senha (forgotPassword)', async () => {
    const res = await request(app)
      .post('/api/forgot-password')
      .send({ email: userData.email });
    expect(res.statusCode).toBe(200);
    // Pegue o token diretamente do banco para o próximo teste
    const user = await Usuario.findOne({ email: userData.email });
    resetToken = user.resetToken;
    expect(resetToken).toBeDefined();
  });

  it('Deve redefinir a senha com o token (resetPassword)', async () => {
    const res = await request(app)
      .post('/api/reset-password')
      .send({ token: resetToken, newPassword: "senhaResetada123" });
    expect(res.statusCode).toBe(200);
    // Teste login com a nova senha
    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: userData.email, password: "senhaResetada123" });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });

  it('Deve listar todos os usuários', async () => {
    const res = await request(app)
      .get('/api/allUsers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThan(0);
  });
});