const express = require('express');
const { criarReserva, listarReservas } = require('../controllers/reservasController'); // Importando funções do controlador

const router = express.Router();

// Rota para criar uma nova reserva
router.post('/', criarReserva);

// Rota para listar reservas
router.get('/', listarReservas);

module.exports = router;
