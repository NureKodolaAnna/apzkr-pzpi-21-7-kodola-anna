const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    date: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
});

module.exports = mongoose.model('Schedule', scheduleSchema);