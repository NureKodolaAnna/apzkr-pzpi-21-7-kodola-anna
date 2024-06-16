import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditSchedule.css';

const EditSchedule = () => {
    const { id } = useParams();
    const [scheduleData, setScheduleData] = useState({
        doctor_id: '',
        date: '',
        start_time: '',
        end_time: ''
    });
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/schedules/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setScheduleData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch schedule');
                setLoading(false);
            }
        };

        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users/doctors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            }
        };

        fetchSchedule();
        fetchDoctors();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setScheduleData({
            ...scheduleData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/schedules/update/${id}`, scheduleData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/view-schedules');
        } catch (error) {
            setError('Failed to update schedule');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="edit-schedule-form">
            <h2>Edit Schedule</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Doctor</label>
                    <select
                        name="doctor_id"
                        value={scheduleData.doctor_id}
                        onChange={handleChange}
                        required
                    >
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.first_name} {doctor.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={scheduleData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Time</label>
                    <input
                        type="time"
                        name="start_time"
                        value={scheduleData.start_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Time</label>
                    <input
                        type="time"
                        name="end_time"
                        value={scheduleData.end_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" onClick={handleSubmit}>Update Schedule</button>
            </form>
        </div>
    );
};

export default EditSchedule;
