import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'patient',
        clinic_id: ''
    });

    const [errors, setErrors] = useState({});
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/clinics/all');
                setClinics(response.data);
            } catch (error) {
                console.error('Error fetching clinics:', error);
            }
        };

        fetchClinics();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter and one number';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (!formData.first_name) {
            newErrors.first_name = 'First name is required';
        }

        if (!formData.last_name) {
            newErrors.last_name = 'Last name is required';
        }

        if (formData.role === 'doctor' && !formData.clinic_id) {
            newErrors.clinic_id = 'Clinic is required for doctors';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3000/api/users/register', formData);
                const { token, role } = response.data;

                // Save token to local storage
                localStorage.setItem('token', token);

                // Redirect based on role
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'doctor') {
                    navigate('/doctor');
                } else {
                    navigate('/patient');
                }
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    setErrors({ form: error.response.data.error });
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    setErrors({ form: 'No response from server. Please try again later.' });
                } else {
                    console.error('Error setting up request:', error.message);
                    setErrors({ form: 'An error occurred. Please try again.' });
                }
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.username && <p className="error-message">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {formData.role === 'doctor' && (
                    <div className="form-group">
                        <label>Clinic</label>
                        <select name="clinic_id" value={formData.clinic_id} onChange={handleChange} required>
                            <option value="">Select Clinic</option>
                            {clinics.map(clinic => (
                                <option key={clinic._id} value={clinic._id}>{clinic.name}</option>
                            ))}
                        </select>
                        {errors.clinic_id && <p className="error-message">{errors.clinic_id}</p>}
                    </div>
                )}
                <button type="submit">Register</button>
                {errors.form && <p className="error-message">{errors.form}</p>}
            </form>
        </div>
    );
};

export default Register;
