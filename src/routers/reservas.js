const express = require('express');
const { criarReserva, listarReservas, confirmarReserva } = require('../controllers/reservasController'); // Importando funções do controlador

const router = express.Router();

// Rota para criar uma nova reserva
router.post('/', criarReserva);

// Rota para listar reservas
router.get('/', listarReservas);

router.post('/:id/confirmar', confirmarReserva);


module.exports = router;
