const express = require('express');
const conectarDB = require('../src/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const reservasRoutes = require('../src/routers/reservas');
const authRoutes = require('../src/routers/auth'); // Importa o roteador de autenticação

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar ao MongoDB
conectarDB();

// Usar as rotas
app.use('/api/reservas', reservasRoutes);
app.use('/api/auth', authRoutes); // Usar o roteador de autenticação

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
