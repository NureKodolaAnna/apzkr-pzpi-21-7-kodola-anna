const express = require('express');
const MedicalRecord = require('../models/medicalRecord');
const router = express.Router();
const User = require('../models/User');

// Створення нового медичного запису
router.post('/create', async (req, res) => {
    const { patient_id, doctor_id, date, time, description, diagnosis, treatment } = req.body;

    try {
        const patient = await User.findById(patient_id);
        const doctor = await User.findById(doctor_id);

        if (!patient || !doctor) {
            return res.status(400).json({ error: 'Invalid patient or doctor ID' });
        }

        const newMedicalRecord = new MedicalRecord({
            patient_id,
            doctor_id,
            date,
            time,
            description,
            diagnosis,
            treatment
        });

        await newMedicalRecord.save();
        res.status(201).json({ message: 'Medical record created successfully' });
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({ error: 'Failed to create medical record' });
    }
});

// Оновлення існуючого медичного запису
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, date, time, description, diagnosis, treatment } = req.body;

    try {
        const medicalRecord = await MedicalRecord.findById(id);

        if (!medicalRecord) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        if (patient_id) {
            const patient = await User.findById(patient_id);
            if (!patient) {
                return res.status(400).json({ error: 'Invalid patient ID' });
            }
            medicalRecord.patient_id = patient_id;
        }

        if (doctor_id) {
            const doctor = await User.findById(doctor_id);
            if (!doctor) {
                return res.status(400).json({ error: 'Invalid doctor ID' });
            }
            medicalRecord.doctor_id = doctor_id;
        }

        if (date) medicalRecord.date = date;
        if (time) medicalRecord.time = time;
        if (description) medicalRecord.description = description;
        if (diagnosis) medicalRecord.diagnosis = diagnosis;
        if (treatment) medicalRecord.treatment = treatment;

        await medicalRecord.save();
        res.status(200).json({ message: 'Medical record updated successfully' });
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.status(500).json({ error: 'Failed to update medical record' });
    }
});

// Видалення медичного запису
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const medicalRecord = await MedicalRecord.findById(id);

        if (!medicalRecord) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        await MedicalRecord.deleteOne({ _id: id });
        res.status(200).json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        console.error('Error deleting medical record:', error);
        res.status(500).json({ error: 'Failed to delete medical record' });
    }
});

// Отримання всіх медичних записів
router.get('/all', async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find({})
            .populate('patient_id', 'first_name last_name')
            .populate('doctor_id', 'first_name last_name');
        res.status(200).json(medicalRecords);
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ error: 'Failed to fetch medical records' });
    }
});

// Отримання медичного запису за його ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const medicalRecord = await MedicalRecord.findById(id)
            .populate('patient_id', 'first_name last_name')
            .populate('doctor_id', 'first_name last_name');

        if (!medicalRecord) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        res.status(200).json(medicalRecord);
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ error: 'Failed to fetch medical record' });
    }
});

// Отримання всіх медичних записів пацієнта за його ID
router.get('/patient/:patient_id', async (req, res) => {
    const { patient_id } = req.params;

    try {
        const medicalRecords = await MedicalRecord.find({ patient_id })
            .populate('patient_id', 'first_name last_name')
            .populate('doctor_id', 'first_name last_name');

        if (!medicalRecords.length) {
            return res.status(404).json({ error: 'No medical records found for this patient' });
        }

        const recordsData = medicalRecords.map(record => ({
            date: record.date,
            time: record.time,
            description: record.description,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            doctor_id: record.doctor_id
        }));

        res.status(200).json(recordsData);
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ error: 'Failed to fetch medical records' });
    }
});

module.exports = router;
