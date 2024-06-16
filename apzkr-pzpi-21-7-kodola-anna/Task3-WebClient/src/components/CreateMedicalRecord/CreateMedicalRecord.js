import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MedicalRecordList from '../MedicalRecordList/MedicalRecordList';
import './CreateMedicalRecord.css';

const CreateMedicalRecord = () => {
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        time: '',
        description: '',
        diagnosis: '',
        treatment: ''
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [errors, setErrors] = useState({});
    const [showRecordList, setShowRecordList] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPatientsAndDoctors = async () => {
            try {
                const [patientsResponse, doctorsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/users/patients', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:3000/api/users/doctors', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setPatients(patientsResponse.data);
                setDoctors(doctorsResponse.data);
            } catch (error) {
                console.error('Error fetching patients and doctors:', error);
            }
        };

        fetchPatientsAndDoctors();
    }, [token]);

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
            const response = await axios.post('http://localhost:3000/api/medical-records/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data.message);
            setShowRecordList(true);
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
    };

    return (
        <div className="form-container">
            <h2>Create Medical Record</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Patient</label>
                    <select
                        name="patient_id"
                        value={formData.patient_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                            <option key={patient._id} value={patient._id}>
                                {patient.first_name} {patient.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Doctor</label>
                    <select
                        name="doctor_id"
                        value={formData.doctor_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
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
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Time</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Diagnosis</label>
                    <textarea
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Treatment</label>
                    <textarea
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit">Create Record</button>
                {errors.form && <p className="error-message">{errors.form}</p>}
            </form>
            {showRecordList && <MedicalRecordList />}
        </div>
    );
};

export default CreateMedicalRecord;
