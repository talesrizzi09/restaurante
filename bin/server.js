const express = require('express');
const conectarDB = require('../src/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const reservasRoutes = require('../src/routers/reservas');
const authRoutes = require('../src/routers/auth'); 

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());


conectarDB();


app.use('/api/reservas', reservasRoutes);
app.use('/api/auth', authRoutes); 


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
