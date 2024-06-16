import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUser.css';

const EditUser = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'patient',
        clinic: '',
    });
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
                setSelectedClinic(response.data.clinic);
            } catch (error) {
                setError('Failed to fetch user');
            }
        };

        const fetchClinics = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/clinics/all');
                setClinics(response.data);
            } catch (error) {
                console.error('Error fetching clinics:', error);
            }
        };

        fetchUser();
        fetchClinics();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'clinic') {
            setSelectedClinic(value);
        }
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/users/update/${id}`, { ...userData, clinic: selectedClinic }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            updateClinicName(selectedClinic, token);
            navigate(`/profile`);
        } catch (error) {
            setError('Failed to update user');
        }
    };

    const updateClinicName = async (clinicId, token) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/clinics/${clinicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const clinicName = response.data.name;
            return clinicName;
        } catch (error) {
            console.error('Error fetching clinic name:', error);
            return 'Clinic not found';
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="edit-user-form">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={userData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={userData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={userData.role} onChange={handleChange} required>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {userData.role === 'doctor' && (
                    <div className="form-group">
                        <label>Clinic</label>
                        <select name="clinic" value={selectedClinic} onChange={handleChange} required>
                            <option value="">Select Clinic</option>
                            {clinics.map(clinic => (
                                <option key={clinic._id} value={clinic._id}>{clinic.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button type="submit">Update User</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default EditUser;
