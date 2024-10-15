const Reserva = require('../model/reserva'); 


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


const listarReservas = async (req, res) => {
    const { date } = req.query; 
    console.log("Data recebida para filtragem:", date); 

    try {
        let query = {}; 

        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1); 

            query.date = {
                $gte: startDate, 
                $lt: endDate, 
            };
            console.log("Consulta de reservas:", query); 
        }

        const reservas = await Reserva.find(query);
        console.log("Reservas encontradas:", reservas); 
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Erro ao listar reservas:", error); 
        res.status(500).json({ message: 'Erro ao listar reservas', error: error.message });
    }
};






module.exports = { criarReserva, listarReservas };
