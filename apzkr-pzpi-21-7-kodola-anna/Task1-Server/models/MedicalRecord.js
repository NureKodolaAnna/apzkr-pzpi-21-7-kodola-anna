const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic'},
    date: { type: String, required: true},
    time: { type: String, required: true},
    description: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
