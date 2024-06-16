const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Імпорт маршрутів
const userRoutes = require('./routes/users');
const medicalRecordRoutes = require('./routes/medicalRecords');
const appointmentRoutes = require('./routes/appointments');
const scheduleRoutes = require('./routes/schedules');
const financeRoutes = require('./routes/finances');
const clinicRoutes = require('./routes/clinics');

// Завантаження змінних середовища з .env файлу
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Підключення до бази даних MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Налаштування CORS для доступу з різних доменів
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/clinics', clinicRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
