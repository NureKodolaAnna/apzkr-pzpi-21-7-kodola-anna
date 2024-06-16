import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let role = '';
    let userId = '';

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken.role;
            userId = decodedToken.userId;
        } catch (error) {
            console.error('Failed to decode token:', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">Health Connect</div>
            <nav>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    {!token ? (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    ) : (
                        <>
                            {role === 'admin' && (
                                <>
                                    <li><Link to="/create-schedule">Create Schedule</Link></li>
                                    <li><Link to="/view-schedules">View Schedules</Link></li>
                                    <li><Link to="/user-list">Manage Users</Link></li>
                                    <li><Link to="/create-clinic">Create Clinic</Link></li>
                                    <li><Link to="/clinics">Clinic List</Link></li>
                                    <li><Link to="/medical-records">Medical Records</Link></li>
                                </>
                            )}
                            {role === 'doctor' && (
                                <>
                                    <li><Link to="/view-schedules">View Schedules</Link></li>
                                    <li><Link to="/doctor-appointments">My Appointments</Link></li>
                                    <li><Link to="/medical-records">Medical Records</Link></li>
                                </>
                            )}
                            {role === 'patient' && (
                                <>
                                    <li><Link to="/create-appointment">Book Appointment</Link></li>
                                    <li><Link to="/appointment-history">Appointment History</Link></li>
                                    <li><Link to={`/patient-record/${userId}`}>Medical Records</Link></li>
                                </>
                            )}

                            <li><Link to="/profile"><i className="bi bi-person-circle"></i></Link></li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};


export default Header;
