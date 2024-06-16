import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditClinic.css';

const EditClinic = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState({
        name: '',
        city: '',
        address: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        const fetchClinic = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/clinics/${id}`);
                setClinic(response.data);
            } catch (error) {
                console.error('Error fetching clinic:', error);
            }
        };

        fetchClinic();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClinic({
            ...clinic,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/clinics/edit/${id}`, clinic);
            navigate('/clinics');
        } catch (error) {
            console.error('Error editing clinic:', error);
        }
    };

    // Перевірка, чи об'єкт clinic має значення перед відображенням форми
    if (!clinic.name || !clinic.city || !clinic.address || !clinic.phone || !clinic.email) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-clinic-form">
            <h2>Edit Clinic</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={clinic.name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={clinic.city || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={clinic.address || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={clinic.phone || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={clinic.email || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Clinic</button>
            </form>
        </div>
    );
};

export default EditClinic;
