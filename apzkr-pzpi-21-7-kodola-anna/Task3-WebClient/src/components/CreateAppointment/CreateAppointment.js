import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './CreateAppointment.css';

const CreateAppointment = () => {
    const [cities, setCities] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [appointmentData, setAppointmentData] = useState({
        city: '',
        clinic_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        services: []
    });
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/clinics/all');
                const clinicsData = response.data;
                const citiesData = [...new Set(clinicsData.map(clinic => clinic.city))];
                setCities(citiesData);
                setClinics(clinicsData);
            } catch (error) {
                console.error('Failed to fetch cities and clinics:', error);
            }
        };

        fetchCities();
    }, []);

    const handleCityChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData({
            ...appointmentData,
            [name]: value,
            clinic_id: '',
            doctor_id: ''
        });

        const filteredClinics = clinics.filter(clinic => clinic.city === value);
        setClinics(filteredClinics);
        setDoctors([]);
        setSchedules([]);
        setAvailableDates([]);
        setAvailableTimes([]);
    };

    const handleClinicChange = async (e) => {
        const { name, value } = e.target;
        const clinicId = value;

        setAppointmentData(prevData => ({
            ...prevData,
            [name]: value,
            clinic_id: clinicId,
            doctor_id: ''
        }));

        try {
            const response = await axios.get(`http://localhost:3000/api/users/doctors?clinic_id=${clinicId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoctors(response.data);
            setSchedules([]);
            setAvailableDates([]);
            setAvailableTimes([]);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
    };



    const handleDoctorChange = async (e) => {
        const { name, value } = e.target;
        setAppointmentData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        try {
            const response = await axios.get('http://localhost:3000/api/schedules/all', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const doctorSchedules = response.data.filter((schedule) => schedule.doctor_id._id === value);
            setSchedules(doctorSchedules);
            const uniqueDates = [...new Set(doctorSchedules.map(schedule => schedule.date))];
            setAvailableDates(uniqueDates);
            setAvailableTimes([]);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
        }
    };


    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData({
            ...appointmentData,
            [name]: value,
        });

        const selectedDateSchedule = schedules.filter(schedule => schedule.date === value);
        const times = [];
        selectedDateSchedule.forEach(schedule => {
            let currentTime = parseTime(schedule.start_time);
            const endTime = parseTime(schedule.end_time);
            while (currentTime < endTime) {
                times.push(formatTime(currentTime));
                currentTime += 30 * 60 * 1000;
            }
        });
        setAvailableTimes(times);
    };

    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return new Date(0, 0, 0, hours, minutes).getTime();
    };

    const formatTime = (time) => {
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };


    const handleServiceChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setAppointmentData({
                ...appointmentData,
                services: [...appointmentData.services, value]
            });
        } else {
            setAppointmentData({
                ...appointmentData,
                services: appointmentData.services.filter(service => service !== value)
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData({
            ...appointmentData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { doctor_id, appointment_date, appointment_time, services, clinic_id } = appointmentData;
        const patient_id = jwtDecode(token).userId;

        try {
            await axios.post(
                'http://localhost:3000/api/appointments/create',
                { patient_id, doctor_id, appointment_date, appointment_time, services, clinic_id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            navigate('/appointment-history');
        } catch (error) {
            setError('Failed to create appointment');
        }
    };


    return (
        <div className="create-appointment-form">
            <h2>Create Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>City</label>
                    <select name="city" value={appointmentData.city} onChange={handleCityChange} required>
                        <option value="">Select a city</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
                {appointmentData.city && (
                    <div className="form-group">
                        <label>Clinic</label>
                        <select name="clinic_id" value={appointmentData.clinic_id} onChange={handleClinicChange}
                                required>
                            <option value="">Select a clinic</option>
                            {clinics.map(clinic => (
                                <option key={clinic._id} value={clinic._id}>
                                    {clinic.name} - {clinic.address}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {appointmentData.clinic_id && (
                    <div className="form-group">
                        <label>Doctor</label>
                        <select name="doctor_id" value={appointmentData.doctor_id} onChange={handleDoctorChange}
                                required>
                            <option value="">Select a doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.first_name} {doctor.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {availableDates.length > 0 && (
                    <div className="form-group">
                        <label>Date</label>
                        <select name="appointment_date" value={appointmentData.appointment_date}
                                onChange={handleDateChange} required>
                            <option value="">Select a date</option>
                            {availableDates.map((date, index) => (
                                <option key={index} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {availableTimes.length > 0 && (
                    <div className="form-group">
                        <label>Time</label>
                        <select name="appointment_time" value={appointmentData.appointment_time} onChange={handleChange}
                                required>
                            <option value="">Select a time</option>
                            {availableTimes.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label>Services</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                value="Consultation"
                                checked={appointmentData.services.includes('Consultation')}
                                onChange={handleServiceChange}
                            />
                            <span className="checkbox-label">Consultation (200 UAH)</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Ultrasound"
                                checked={appointmentData.services.includes('Ultrasound')}
                                onChange={handleServiceChange}
                            />
                            <span className="checkbox-label">Ultrasound (300 UAH)</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Blood Test"
                                checked={appointmentData.services.includes('Blood Test')}
                                onChange={handleServiceChange}
                            />
                            <span className="checkbox-label">Blood Test (150 UAH)</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="X-Ray"
                                checked={appointmentData.services.includes('X-Ray')}
                                onChange={handleServiceChange}
                            />
                            <span className="checkbox-label">X-Ray (200 UAH)</span>
                        </label>
                    </div>
                </div>
                <button type="submit">Create Appointment</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreateAppointment;