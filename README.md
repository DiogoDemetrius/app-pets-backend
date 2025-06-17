# Pet Love - Backend

Este é o backend do projeto **Pet Love**, desenvolvido em Node.js com Express e MongoDB. Ele gerencia autenticação, cadastro, atualização e recuperação de senha de usuários, além de outras funcionalidades essenciais para um sistema moderno.

## 🚀 Tecnologias

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (JSON Web Token)
- Jest & Supertest (para testes automatizados)

## 📁 Estrutura de Pastas

```
backend/
│
├── controllers/
│   └── UsuarioController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   └── Users.js
├── routes/
│   └── usuarioRoutes.js
├── services/
│   └── authService.js
├── config/
│   ├── db.js
│   └── env.js
├── tests/
│   └── usuarioRoutes.test.js
├── app.js
├── server.js
├── package.json
└── .env
```

## ⚙️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seuusuario/petlove-backend.git
   cd petlove-backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`:**
   ```
   MONGODB_URI=seu_mongodb_uri
   JWT_SECRET=sua_chave_secreta
   ```

4. **Inicie o servidor:**
   ```bash
   npm start
   ```

## 🧪 Testes Automatizados

Execute todos os testes automatizados com:
```bash
npm test
```
Os testes cobrem todos os fluxos principais de usuário, incluindo cadastro, login, atualização, recuperação e redefinição de senha.

## 🔒 Rotas Principais

- **POST `/api/usuarios`**  
  Cadastro de usuário.
- **POST `/api/login`**  
  Login e geração de token JWT.
- **GET `/api/me`**  
  Retorna dados do usuário autenticado.
- **PUT `/api/usuarios/:id`**  
  Atualiza dados do usuário.
- **PUT `/api/usuarios/:id/fotoPerfil`**  
  Atualiza a foto de perfil.
- **PUT `/api/usuarios/:id/senha`**  
  Atualiza a senha do usuário autenticado.
- **POST `/api/forgot-password`**  
  Inicia o processo de recuperação de senha.
- **POST `/api/reset-password`**  
  Redefine a senha usando o token enviado por e-mail.
- **GET `/api/allUsers`**  
  Lista todos os usuários.

## 📄 Exemplo de JSON para Cadastro

```json
{
  "usuario": "joaosilva",
  "nome": "João",
  "sobreNome": "Silva",
  "email": "joao.silva@email.com",
  "cpf": "12345678900",
  "telefone": "11999999999",
  "dt_nascimento": "1990-05-20",
  "genero": "masculino",
  "fotoPerfil": "https://meusite.com/fotos/joao.jpg",
  "password": "senhaSegura123"
}
```

## 🛡️ Segurança

- Todas as rotas sensíveis são protegidas por autenticação JWT.
- Senhas são armazenadas de forma criptografada.
- Tokens de redefinição de senha possuem expiração.

---

**Pet Love** © 2025