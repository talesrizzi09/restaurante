const mongoose = require('mongoose');
require('dotenv').config(); // Adicione esta linha para garantir que o dotenv esteja carregando

const conectarDB = async () => {
    const uri = `${process.env.DB_HOST}${process.env.DB_NAME}`; // Concatenar DB_HOST e DB_NAME
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); // Encerra o processo em caso de erro
    }
};

module.exports = conectarDB;
