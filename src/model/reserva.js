const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
    num_people: { type: Number, required: true },
    status: {
        type: String,
        default: 'pendente',
        enum: ['pendente', 'confirmada', 'cancelada'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Reserva', reservaSchema);

