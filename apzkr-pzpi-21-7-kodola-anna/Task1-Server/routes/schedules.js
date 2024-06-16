const express = require('express');
const Schedule = require('../models/schedule');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const router = express.Router();

// Создание нового расписания
router.post('/create', async (req, res) => {
    const { doctor_id, clinic_id, date, start_time, end_time } = req.body;

    try {
        const doctor = await User.findById(doctor_id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({ error: 'Invalid doctor ID' });
        }

        const clinic = await Clinic.findById(clinic_id);
        if (!clinic) {
            return res.status(400).json({ error: 'Invalid clinic ID' });
        }

        const newSchedule = new Schedule({ doctor_id, clinic_id, date, start_time, end_time });
        await newSchedule.save();
        res.status(201).json({ message: 'Doctor schedule created successfully' });
    } catch (error) {
        console.error('Error creating doctor schedule:', error);
        res.status(500).json({ error: 'Failed to create doctor schedule' });
    }
});

// Просмотр всех расписаний
router.get('/all', async (req, res) => {
    try {
        const schedules = await Schedule.find({})
            .populate('doctor_id', 'first_name last_name')
            .populate('clinic_id', 'name')
            .sort({ date: 1, start_time: 1 });
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
});

// Редактирование расписания
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { doctor_id, clinic_id, day_of_week, start_time, end_time } = req.body;

    try {
        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return res.status(404).json({ error: 'Doctor schedule not found' });
        }

        if (doctor_id) {
            const doctor = await User.findById(doctor_id);
            if (!doctor || doctor.role !== 'doctor') {
                return res.status(400).json({ error: 'Invalid doctor ID' });
            }
            schedule.doctor_id = doctor_id;
        }

        if (clinic_id) {
            const clinic = await Clinic.findById(clinic_id);
            if (!clinic) {
                return res.status(400).json({ error: 'Invalid clinic ID' });
            }
            schedule.clinic_id = clinic_id;
        }

        if (day_of_week) schedule.day_of_week = day_of_week;
        if (start_time) schedule.start_time = start_time;
        if (end_time) schedule.end_time = end_time;

        await schedule.save();
        res.status(200).json({ message: 'Doctor schedule updated successfully', doctorSchedule: schedule });
    } catch (error) {
        console.error('Error updating doctor schedule:', error);
        res.status(500).json({ error: 'Failed to update doctor schedule' });
    }
});

// Удаление расписания
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Schedule.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Doctor schedule not found' });
        }

        res.status(200).json({ message: 'Doctor schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor schedule:', error);
        res.status(500).json({ error: 'Failed to delete doctor schedule' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const schedule = await Schedule.findById(id)
            .populate('doctor_id', 'first_name last_name')
            .populate('clinic_id', 'name');
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});

module.exports = router;
