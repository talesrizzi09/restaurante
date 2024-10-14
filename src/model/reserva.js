const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
    num_people: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reserva', reservaSchema);
