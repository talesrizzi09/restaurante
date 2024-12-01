const Reserva = require('../model/reserva'); 
const twilio = require ('twilio');
const accountSid = 'ACdc931f028e2a1b0d05a36e1eca67b2fb'; // Substitua com suas credenciais
const authToken = '3abac777aa984cc88d024825f6dce992'; // Substitua com suas credenciais
const client = twilio(accountSid, authToken);


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
async function enviarMensagemWhatsApp(nome, dataReserva) {
    try {
      const data = new Date(dataReserva);
      data.setSeconds(0);
  
      const dia = data.toLocaleDateString();
      const hora = data.toLocaleTimeString();
      
      await client.messages
        .create({
          from: "whatsapp:+14155238886",
          contentSid: "HX2cf91d30472ac14098462687ef1c1961",
          contentVariables: `{"1": "${nome}","2":"${dia}", "3":"${hora}"}`,
          to: "whatsapp:+555198611390",
        })
        .then((message) => console.log(message.sid))
    } catch (error) {
      console.error(error);
    }
  }

async function confirmarReserva(req, res) {
    const { id } = req.params; // Pega o ID da reserva da URL
    console.log("123");
    const { id } = req.params; 
    console.log("123");
    try {
        const reserva = await Reserva.findById(id); // Encontra a reserva pelo ID

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        // Lógica para confirmar a reserva
        reserva.status = 'confirmada'; // Supondo que você tenha um campo de status
        await reserva.save(); // Salva as alterações no banco de dados
        
        await enviarMensagemWhatsApp(reserva.name, reserva.date); 
        
        return res.status(200).json({ message: 'Reserva confirmada com sucesso.' });
    } catch (error) {
        console.error('Erro ao confirmar reserva:', error);
        return res.status(500).json({ message: 'Erro ao confirmar reserva.' });
    }
}



exports.getReservasPorNome = async (req, res) => {
    const { name } = req.query; // Obtém o nome do cliente a partir da query string
    try {
        const reservas = await Reserva.find({ name: name }); // Busca reservas com o nome fornecido
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reservas' });
    }
};





module.exports = { criarReserva, listarReservas, confirmarReserva };
