const mongoose = require('mongoose');
require('dotenv').config(); 

const conectarDB = async () => {
    const uri = `${process.env.DB_HOST}${process.env.DB_NAME}`; 
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); 
    }
};

module.exports = conectarDB;
