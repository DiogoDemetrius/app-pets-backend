const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
//const cors = require('./config/cors');
require('./config/env');

const app = express();
connectDB();

//app.use(cors());

app.use(express.json());
app.use(routes);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro global:", err);
  res.status(500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;