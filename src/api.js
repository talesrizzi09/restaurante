
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarDB = require('./src/model/db'); 
const reservasRouter = require('./src/routers/reservas');
const authRouter = require('./src/routers/auth'); 

dotenv.config();

const app = express();


conectarDB();


app.use(cors());
app.use(express.json()); 


app.use('/api/reservas', reservasRouter);
app.use('/api/auth', authRouter); 


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
