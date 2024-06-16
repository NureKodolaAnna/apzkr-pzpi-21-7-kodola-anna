import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateSchedule.css';

const CreateSchedule = () => {
    const [doctor_id, setDoctorId] = useState('');
    const [schedules, setSchedules] = useState([{ date: '', start_time: '', end_time: '' }]);
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users/all');
                setDoctors(response.data.filter(user => user.role === 'doctor'));
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorChange = (e) => {
        setDoctorId(e.target.value);
    };

    const handleScheduleChange = (index, e) => {
        const { name, value } = e.target;
        const newSchedules = [...schedules];
        newSchedules[index][name] = value;
        setSchedules(newSchedules);
    };

    const handleAddSchedule = () => {
        setSchedules([...schedules, { date: '', start_time: '', end_time: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            for (const schedule of schedules) {
                await axios.post('http://localhost:3000/api/schedules/create', {
                    doctor_id,
                    clinic_id: doctors.find(doctor => doctor._id === doctor_id).clinic_id,
                    date: schedule.date,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigate('/schedules');
        } catch (error) {
            console.error('Error creating schedule:', error);
            setError('Failed to create schedule');
        }
    };

    return (
        <div className="create-schedule">
            <h2>Create Doctor Schedule</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Doctor</label>
                    <select name="doctor_id" value={doctor_id} onChange={handleDoctorChange} required>
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor._id} value={doctor._id}>{doctor.first_name} {doctor.last_name}</option>
                        ))}
                    </select>
                </div>
                {schedules.map((schedule, index) => (
                    <div key={index} className="schedule-item">
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={schedule.date}
                                onChange={(e) => handleScheduleChange(index, e)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="start_time"
                                value={schedule.start_time}
                                onChange={(e) => handleScheduleChange(index, e)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                name="end_time"
                                value={schedule.end_time}
                                onChange={(e) => handleScheduleChange(index, e)}
                                required
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddSchedule}>Add Another Schedule</button>
                <button type="submit">Create Schedule</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default CreateSchedule;
