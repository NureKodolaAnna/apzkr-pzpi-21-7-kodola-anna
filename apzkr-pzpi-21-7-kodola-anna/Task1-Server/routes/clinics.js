const express = require('express');
const Clinic = require('../models/Clinic');
const mongoose = require("mongoose");
const router = express.Router();

// Створення нової клініки
router.post('/create', async (req, res) => {
    const { name, city, address, phone, email } = req.body;

    try {
        const newClinic = new Clinic({ name, city, address, phone, email });
        await newClinic.save();
        res.status(201).json({ message: 'Clinic created successfully' });
    } catch (error) {
        console.error('Error creating clinic:', error);
        res.status(500).json({ error: 'Failed to create clinic' });
    }
});

// Отримання списку всіх клінік
router.get('/all', async (req, res) => {
    try {
        const clinics = await Clinic.find({});
        res.status(200).json(clinics);
    } catch (error) {
        console.error('Error fetching clinics:', error);
        res.status(500).json({ error: 'Failed to fetch clinics' });
    }
});

// Отримання клініки по ід
router.get('/:id', async (req, res) => {
    try {
        const clinicId = req.params.id;

        // Перевірка на валідність ObjectId
        if (!mongoose.Types.ObjectId.isValid(clinicId)) {
            return res.status(400).json({ error: 'Invalid clinic ID format' });
        }

        const clinic = await Clinic.findById(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }

        res.status(200).json(clinic);
    } catch (error) {
        console.error('Error fetching clinic:', error);
        res.status(500).json({ error: 'Failed to fetch clinic' });
    }
});


// Редагування клініки за ID
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, city, address, phone, email } = req.body;

    try {
        const clinic = await Clinic.findByIdAndUpdate(id, { name, city, address, phone, email }, { new: true });
        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }
        res.status(200).json({ message: 'Clinic updated successfully' });
    } catch (error) {
        console.error('Error updating clinic:', error);
        res.status(500).json({ error: 'Failed to update clinic' });
    }
});

// Видалення клініки за ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const clinic = await Clinic.findByIdAndDelete(id);
        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }
        res.status(200).json({ message: 'Clinic deleted successfully' });
    } catch (error) {
        console.error('Error deleting clinic:', error);
        res.status(500).json({ error: 'Failed to delete clinic' });
    }
});

module.exports = router;
