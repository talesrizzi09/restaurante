// Supondo que você já tenha o express configurado e o mongoose para o MongoDB
const express = require("express");
const twilio = require("twilio");
const Reserva = require("../src/model/reserva"); // Modelo mongoose para a coleção de reservas

const router = express.Router();

// Configuração do Twilio (substitua pelos dados reais)
const client = twilio('ACdc931f028e2a1b0d05a36e1eca67b2fb', '68e55fe775b9d0994b2f1d3695df0df6');

// Endpoint para confirmar reserva
router.post("/api/reservas/:id/confirmar", async (req, res) => {
    try {
        const { id } = req.params;

        // Atualiza o status da reserva para "confirmada"
        const reserva = await Reserva.findByIdAndUpdate(id, { status: "confirmada" }, { new: true });

        if (!reserva) {
            return res.status(404).json({ message: "Reserva não encontrada." });
        }

        // Envia a mensagem de confirmação para o telefone do cliente
        await client.messages.create({
            body: `Olá, ${reserva.name}! Sua reserva para ${new Date(reserva.date).toLocaleDateString()} foi confirmada. Número de pessoas: ${reserva.num_people}.`,
            from: '+5551998611390', // Número Twilio
            to: reserva.phone
        });

        res.status(200).json({ message: "Reserva confirmada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao confirmar a reserva." });
    }
});

module.exports = router;
