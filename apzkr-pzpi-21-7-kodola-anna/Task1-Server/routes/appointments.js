const express = require('express');
const Appointment = require('../models/appointment');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const { jwtDecode } = require('jwt-decode');
const router = express.Router();

const servicesPrices = {
    "Consultation": 200,
    "Ultrasound": 300,
    "Blood Test": 150,
    "X-Ray": 200
};

// Створення запису
router.post('/create', async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, services, clinic_id }  = req.body;

    try {
        const patient = await User.findById(patient_id);
        if (!patient || patient.role !== 'patient') {
            return res.status(400).json({ error: 'Invalid patient ID' });
        }

        const doctor = await User.findById(doctor_id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({ error: 'Invalid doctor ID' });
        }

        let totalPrice = servicesPrices["Consultation"];
        services.forEach(service => {
            if (servicesPrices[service]) {
                totalPrice += servicesPrices[service];
            }
        });

        const newAppointment = new Appointment({
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            services,
            clinic_id,
            total_price: totalPrice
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Редагування запису
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (patient_id) {
            const patient = await User.findById(patient_id);
            if (!patient) {
                return res.status(400).json({ error: 'Invalid patient ID' });
            }
            appointment.patient_id = patient_id;
        }

        if (doctor_id) {
            const doctor = await User.findById(doctor_id);
            if (!doctor) {
                return res.status(400).json({ error: 'Invalid doctor ID' });
            }
            appointment.doctor_id = doctor_id;
        }

        if (appointment_date) appointment.appointment_date = appointment_date;
        if (appointment_time) appointment.appointment_time = appointment_time;

        await appointment.save();
        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// Видалення запису
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Appointment.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient_id', 'first_name last_name email')
            .populate('doctor_id', 'first_name last_name email')
            .populate('clinic_id', 'name address');;

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

router.get('/doctor/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const { userId, role } = jwtDecode(token);

    try {
        if (role === 'doctor' && userId === doctorId) {
            const appointments = await Appointment.find({ doctor_id: doctorId })
                .populate('patient_id', 'first_name last_name email _id')
                .populate('doctor_id', 'first_name last_name email');

            res.status(200).json(appointments);
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ error: 'Failed to fetch doctor appointments' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id)
            .populate('patient_id', 'first_name last_name email')
            .populate('doctor_id', 'first_name last_name email');

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

router.post('/pay', async (req, res) => {
    const { appointmentId, cardNumber, cvv, expiryDate } = req.body;

    // Валидация данных карты (эмуляция)
    if (cardNumber.length !== 16 || cvv.length !== 3) {
        return res.status(400).json({ error: 'Invalid card details' });
    }

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Обновление статуса приема на "оплачено"
        appointment.status = 'paid';
        await appointment.save();

        res.status(200).json({ message: 'Payment successful', appointment });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});


// Обработка платежа
router.post('/pay/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = 'paid';
        await appointment.save();

        res.status(200).json({ message: 'Payment successful', appointment });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

router.get('/patient/:patient_id', async (req, res) => {
    const { patient_id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const { userId, role } = jwtDecode(token);

    try {
        if (role === 'patient' && userId === patient_id) {
            const appointments = await Appointment.find({ patient_id })
                .populate('patient_id', 'first_name last_name email')
                .populate('doctor_id', 'first_name last_name email')
                .populate('clinic_id', 'name address');
            res.status(200).json(appointments);
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error('Error fetching appointment history:', error);
        res.status(500).json({ error: 'Failed to fetch appointment history' });
    }
});


module.exports = router;
