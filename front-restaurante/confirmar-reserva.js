const express = require('express');
const app = express();
const twilio = require ('twilio');

const accountSid = 'ACdc931f028e2a1b0d05a36e1eca67b2fb';
const authToken = '3abac777aa984cc88d024825f6dce992';
const client = new twilio(accountSid, authToken);

// Função para enviar a notificação via WhatsApp
function enviarMensagemWhatsApp(nomeCliente, numeroCliente, reservaId) {
  // Formate a mensagem a ser enviada
  const mensagem = `Olá ${nomeCliente},\n\nSua reserva foi confirmada com sucesso!\nID da reserva: ${reservaId}\nObrigado por escolher nosso serviço!`;

  // Enviar mensagem pelo Twilio via WhatsApp
  client.messages
    .create({
      body: mensagem,
      from: 'whatsapp:+14155238886', // Número do WhatsApp do Twilio (número de sandbox)
      to: `whatsapp:+5551998611390` // Número do cliente (exemplo no formato +55 para o Brasil)
    })
    .then(message => console.log(`Mensagem enviada com sucesso! SID: ${message.sid}`))
    .catch(error => console.log('Erro ao enviar mensagem:', error));
}

// Rota para confirmar a reserva
app.post('/api/reservas/:id/confirmar', async (req, res) => {
  const reservaId = req.params.id;

  try {
    // Aqui você confirma a reserva no banco de dados
    

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }

    // Atualize o status da reserva para "Confirmada"
    reserva.status = 'Confirmada';
    await reserva.save();
    const reserva = data.reserva; // Suponha que a resposta contenha os dados da reserva confirmada
    enviarMensagemWhatsApp(reserva.name, reserva.phone, reserva._id);

    
    return res.status(200).json({ message: 'Reserva confirmada com sucesso!' });
} catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    res.status(500).json({ message: 'Erro ao confirmar a reserva.' });
  }
});

module.exports = {enviarMensagemWhatsApp}