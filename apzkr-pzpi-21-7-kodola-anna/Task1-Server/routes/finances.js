const express = require('express');
const Invoice = require('../models/invoice');
const User = require('../models/user');
const router = express.Router();

// Створення фінансового запису
router.post('/create', async (req, res) => {
    const { patient_id, amount, date_issued, status } = req.body;

    try {
        const patient = await User.findById(patient_id);
        if (!patient || patient.role !== 'patient') {
            return res.status(400).json({ error: 'Invalid patient ID' });
        }

        const newInvoice = new Invoice({ patient_id, amount, date_issued, status });
        await newInvoice.save();
        res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// Редагування рахунка
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { patient_id, amount, date_issued, status } = req.body;

    try {
        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (patient_id) {
            const patient = await User.findById(patient_id);
            if (!patient || patient.role !== 'patient') {
                return res.status(400).json({ error: 'Invalid patient ID' });
            }
            invoice.patient_id = patient_id;
        }

        if (amount) invoice.amount = amount;
        if (date_issued) invoice.date_issued = date_issued;
        if (status) invoice.status = status;

        await invoice.save();
        res.status(200).json({ message: 'Invoice updated successfully', invoice });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
});

// Видалення рахунка
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Invoice.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
});

// Отримання всіх рахунків
router.get('/all', async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('patient_id');
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

module.exports = router;
