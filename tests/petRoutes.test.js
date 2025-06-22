const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Usuario = require('../models/Users');
const Pet = require('../models/Pet');

let token;
let userId;
let petId;

beforeAll(async () => {
  //await Usuario.deleteMany({});
  //await Pet.deleteMany({});

  // Cria um usuário para ser dono do pet
  const userData = {
    nome: "Dono",
    sobreNome: "Teste",
    email: "dono@email.com",
    cpf: "12345678999",
    telefone: "11999999998",
    dt_nascimento: "1990-01-01",
    genero: "masculino",
    fotoPerfil: "https://exemplo.com/foto.jpg",
    password: "senha123",
    regiao: "Taguatinga"
  };

  const res = await request(app)
    .post('/api/usuarios')
    .send(userData);

  userId = res.body._id;

  // Login para obter token
  const loginRes = await request(app)
    .post('/api/login')
    .send({ email: userData.email, password: userData.password });

  token = loginRes.body.token;
  // Debug: veja se o token foi gerado corretamente
  // console.log("TOKEN:", token);
});

afterAll(async () => {
  await Usuario.deleteMany({});
  await Pet.deleteMany({});
  await mongoose.connection.close();
});

describe('Rotas de Pet', () => {
  const petData = {
    nome: "Rex",
    raca: "Labrador",
    idade: 3,
    displasia_coxofemural: "A",
    consanguinidade: "Cadastrada",
    pedigree: true,
    id_usuario: null,         // será preenchido no teste
    regiao: "Taguatinga",     // obrigatório
    sexo: "macho",            // obrigatório (ajuste conforme enum do seu schema)
    cor: "preto",             // obrigatório
    // Adicione outros campos obrigatórios do seu schema aqui, por exemplo:
    // especie: "cachorro",
    // peso: 30
  };

  it('Deve criar um novo pet e adicionar ao usuário', async () => {
    petData.id_usuario = userId;
    const res = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(petData);

    // Debug: veja o corpo da resposta em caso de erro
    if (res.statusCode !== 201) console.log(res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.nome).toBe(petData.nome);
    petId = res.body._id;

    // Verifica se o pet foi adicionado ao array de pets do usuário
    const usuario = await Usuario.findById(userId);
    expect(usuario.pets.length).toBe(1);
    expect(usuario.pets[0].nome).toBe(petData.nome);
  });

  it('Deve buscar o pet pelo ID', async () => {
    const res = await request(app)
      .get(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    if (res.statusCode !== 200) console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(petId);
    expect(res.body.nome).toBe(petData.nome);
    expect(res.body.id_usuario).toBe(userId);
  });

  it('Deve buscar todos os pets do usuário', async () => {
    const res = await request(app)
      .get(`/api/pets/usuario/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    if (res.statusCode !== 200) console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id_usuario).toBe(userId);
  });

  it('Deve atualizar dados do pet e refletir no usuário', async () => {
    const res = await request(app)
      .put(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: "Rex Atualizado", idade: 4 });

    if (res.statusCode !== 200) console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Rex Atualizado");
    expect(res.body.idade).toBe(4);

    // Verifica se o array de pets do usuário foi atualizado
    const usuario = await Usuario.findById(userId);
    expect(usuario.pets[0].nome).toBe("Rex Atualizado");
    expect(usuario.pets[0].idade).toBe(4);
  });

  it('Deve remover o pet e do array do usuário', async () => {
    const res = await request(app)
      .delete(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    if (res.statusCode !== 200) console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Pet removido com sucesso');

    // Verifica se o pet foi removido do usuário
    const usuario = await Usuario.findById(userId);
    expect(usuario.pets.length).toBe(0);

    // Verifica se o pet foi removido da collection Pet
    const pet = await Pet.findById(petId);
    expect(pet).toBeNull();
  });
});