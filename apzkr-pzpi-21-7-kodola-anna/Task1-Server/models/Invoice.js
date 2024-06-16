const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date_issued: { type: String, required: true},
    status: { type: String, enum: ['paid', 'unpaid'], required: true },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
