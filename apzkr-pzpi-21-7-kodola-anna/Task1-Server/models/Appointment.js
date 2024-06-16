const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    appointment_date: { type: String, required: true},
    appointment_time: { type: String, required: true},
    services: [{ type: String }],
    total_price: { type: Number, required: true, default: 200 },
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);