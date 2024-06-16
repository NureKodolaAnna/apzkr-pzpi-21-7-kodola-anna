import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditMedicalRecord.css';

const EditMedicalRecord = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        time: '',
        description: '',
        diagnosis: '',
        treatment: ''
    });
    const [patientName, setPatientName] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMedicalRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/medical-records/${id}`);
                const record = response.data;
                setFormData(record);
                setPatientName(`${record.patient_id.first_name} ${record.patient_id.last_name}`);
                setDoctorName(`${record.doctor_id.first_name} ${record.doctor_id.last_name}`);
            } catch (error) {
                console.error('Error fetching medical record:', error);
                setError('Failed to fetch medical record');
            }
        };

        fetchMedicalRecord();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:3001/api/medical-records/update/${id}`, formData);
            navigate('/medical-records'); // Перенаправление на страницу списка медицинских записей
        } catch (error) {
            console.error('Error updating medical record:', error);
            setError('Failed to update medical record');
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Medical Record</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Patient</label>
                    <input
                        type="text"
                        name="patient_name"
                        value={patientName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Doctor</label>
                    <input
                        type="text"
                        name="doctor_name"
                        value={doctorName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Time</label>
                    <input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Diagnosis</label>
                    <input
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Treatment</label>
                    <input
                        type="text"
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Medical Record</button>
            </form>
        </div>
    );
};

export default EditMedicalRecord;
