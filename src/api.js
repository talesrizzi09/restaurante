// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarDB = require('./src/model/db'); // Certifique-se que o arquivo de conexão está correto
const reservasRouter = require('./src/routers/reservas');
const authRouter = require('./src/routers/auth'); // Rota de autenticação

dotenv.config();

const app = express();

// Conectar ao MongoDB
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Para fazer o parsing do JSON nas requisições

// Usando as rotas
app.use('/api/reservas', reservasRouter);
app.use('/api/auth', authRouter); // Adicionando a rota de autenticação

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
