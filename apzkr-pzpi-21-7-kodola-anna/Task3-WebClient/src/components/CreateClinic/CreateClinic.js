import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateClinic = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        phone: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

        if (!formData.city) {
            newErrors.city = 'City is required';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3000/api/clinics/create', formData);
                navigate('/admin'); // Перенаправлення на сторінку адміністратора після успішного створення клініки
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
            <h2>Create Clinic</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                    {errors.city && <p className="error-message">{errors.city}</p>}
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
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
                <button type="submit">Create Clinic</button>
                {errors.form && <p className="error-message">{errors.form}</p>}
            </form>
        </div>
    );
};

export default CreateClinic;
