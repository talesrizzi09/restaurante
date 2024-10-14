const Reserva = require('../model/reserva'); // Importar o modelo Reserva

// Função para criar uma nova reserva
const criarReserva = async (req, res) => {
    const { name, phone, date, notes, num_people } = req.body;

    try {
        const novaReserva = new Reserva({
            name,
            phone,
            date,
            notes,
            num_people,
        });

        await novaReserva.save();
        res.status(201).json(novaReserva);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar reserva', error: error.message });
    }
};

// Função para listar reservas
const listarReservas = async (req, res) => {
    const { date } = req.query; // Obtém a data da query string
    console.log("Data recebida para filtragem:", date); // Log da data recebida

    try {
        let query = {}; // Inicializa a consulta

        // Se uma data foi fornecida, filtra as reservas por essa data
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1); // Define o final do dia

            query.date = {
                $gte: startDate, // Data maior ou igual
                $lt: endDate, // Data menor que o final do dia
            };
            console.log("Consulta de reservas:", query); // Log da consulta
        }

        const reservas = await Reserva.find(query);
        console.log("Reservas encontradas:", reservas); // Log das reservas encontradas
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Erro ao listar reservas:", error); // Log do erro
        res.status(500).json({ message: 'Erro ao listar reservas', error: error.message });
    }
};






module.exports = { criarReserva, listarReservas };
