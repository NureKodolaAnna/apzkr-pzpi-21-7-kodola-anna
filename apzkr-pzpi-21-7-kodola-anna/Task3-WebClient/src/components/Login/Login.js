import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.data);
                setError(error.response.data.error);
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('No response from server. Please try again later.');
            } else {
                console.error('Error setting up request:', error.message);
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="form-container-login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
