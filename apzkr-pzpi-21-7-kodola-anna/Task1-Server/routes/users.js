const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Clinic = require('../models/Clinic');
const router = express.Router();

require('dotenv').config();

// Реєстрація
router.post('/register', async (req, res) => {
    const { username, password, email, first_name, last_name, role, clinic_id } = req.body;

    // Список допустимих ролей
    const validRoles = ['patient', 'doctor', 'admin'];

    try {
        // Перевірка правильності введення ролі
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be one of: patient, doctor, admin' });
        }

        // Перевірка чи існує користувач з таким же username або email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створення нового користувача
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            first_name,
            last_name,
            role,
            clinic_id: role === 'doctor' ? clinic_id : undefined
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token, role: newUser.role });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Авторизація
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name, role, clinic_id } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (role) {
            if (['patient', 'doctor', 'admin'].includes(role)) {
                user.role = role;
            } else {
                return res.status(400).json({ error: 'Invalid role' });
            }
        }

        if (clinic_id) {
            user.clinic_id = clinic_id;
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.deleteOne({ _id: id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId).select('-password').populate('clinic_id', 'name'); // виключаємо пароль з відповіді та заповнюємо додаткове поле clinic_id
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

router.get('/patients', async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' }, 'first_name last_name');
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

router.get('/doctors', async (req, res) => {
    const { clinic_id } = req.query;

    const filter = { role: 'doctor' };
    if (clinic_id) {
        filter.clinic_id = clinic_id;
    }

    try {
        const doctors = await User.find(filter, 'first_name last_name');
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Маршрут для отримання списку клінік
router.get('/clinics', async (req, res) => {
    try {
        const clinics = await Clinic.find();
        res.status(200).json(clinics);
    } catch (error) {
        console.error('Error fetching clinics:', error);
        res.status(500).json({ error: 'Failed to fetch clinics' });
    }
});

module.exports = router;
