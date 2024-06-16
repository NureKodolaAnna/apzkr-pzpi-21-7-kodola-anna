import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AppointmentHistory.css';

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let response;
                if (role === 'patient') {
                    response = await axios.get(`http://localhost:3000/api/appointments/patient/${localStorage.getItem('userId')}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    response = await axios.get('http://localhost:3000/api/appointments/all', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                setAppointments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
                setError('Failed to fetch appointments');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [token, role]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="appointment-history">
            <h2>Appointment History</h2>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment._id}>
                            <strong>Doctor:</strong> {appointment.doctor_id.first_name} {appointment.doctor_id.last_name}
                            <br />
                            <strong>Date:</strong> {appointment.appointment_date}
                            <br />
                            <strong>Time:</strong> {appointment.appointment_time}
                            <br />
                            <strong>Services:</strong> {appointment.services.join(', ')}
                            <br />
                            <strong>Total Price:</strong> {appointment.total_price} UAH
                            <br />
                            <strong>Status:</strong> {appointment.status}
                            <br />
                            {appointment.clinic_id && (
                                <>
                                    <strong>Clinic:</strong> {appointment.clinic_id.name}
                                    <br />
                                    <strong>Address:</strong> {appointment.clinic_id.address}
                                </>
                            )}
                            {appointment.status === 'unpaid' && (
                                <button onClick={() => navigate(`/pay/${appointment._id}`)}>Pay</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

};

export default AppointmentHistory;
