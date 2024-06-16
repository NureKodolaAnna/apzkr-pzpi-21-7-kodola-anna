const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Clinic', clinicSchema);
