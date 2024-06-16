import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import './ScheduleList.css';

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    let role = '';

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken.role;
        } catch (error) {
            console.error('Failed to decode token:', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/schedules/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSchedules(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch schedules');
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [token]);

    const groupedSchedules = schedules.reduce((acc, schedule) => {
        const doctorId = schedule.doctor_id._id;
        if (!acc[doctorId]) {
            acc[doctorId] = {
                doctor: `${schedule.doctor_id.first_name} ${schedule.doctor_id.last_name}`,
                schedules: []
            };
        }
        acc[doctorId].schedules.push(schedule);
        return acc;
    }, {});

    const handleCreateSchedule = () => {
        navigate('/create-schedule');
    };

    const handleEditSchedule = (id) => {
        navigate(`/edit-schedule/${id}`);
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/schedules/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(schedules.filter(schedule => schedule._id !== id));
        } catch (error) {
            console.error('Failed to delete schedule:', error);
        }
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        let y = 10;
        doc.setFontSize(14);
        doc.text('Doctor Schedules', 10, y);
        y += 10;

        Object.values(groupedSchedules).forEach(group => {
            doc.setFontSize(12);
            doc.text(`Doctor: ${group.doctor}`, 10, y);
            y += 10;

            group.schedules.forEach(schedule => {
                doc.setFontSize(10);
                doc.text(`Date: ${schedule.date}`, 10, y);
                doc.text(`Time: ${schedule.start_time} - ${schedule.end_time}`, 60, y);
                y += 10;
            });

            y += 10;
        });

        doc.save('doctor_schedules.pdf');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="schedule-list">
            <h2>Doctor Schedules</h2>
            {role === 'admin' && (
                <div className="admin-button">
                    <button className="create-schedule-button" onClick={handleCreateSchedule}>Create Schedule</button>
                    <button className="download-pdf-button" onClick={handleDownloadPdf}>Download PDF</button>
                </div>
            )}
            {Object.keys(groupedSchedules).length === 0 ? (
                <p>No schedules found.</p>
            ) : (
                <ul>
                    {Object.values(groupedSchedules).map(group => (
                        <li key={group.doctor}>
                            <strong>Doctor:</strong> <span>{group.doctor}</span>
                            <ul>
                                {group.schedules.map(schedule => (
                                    <li key={schedule._id} className="schedule-item">
                                        <div>
                                            <strong>Date:</strong> <span>{schedule.date}</span>
                                            <strong>Time:</strong> <span>{schedule.start_time} - {schedule.end_time}</span>
                                        </div>
                                        {role === 'admin' && (
                                            <div className="schedule-buttons">
                                                <button onClick={() => handleEditSchedule(schedule._id)} className="edit-button">Edit</button>
                                                <button onClick={() => handleDeleteSchedule(schedule._id)} className="delete-button">Delete</button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ScheduleList;
