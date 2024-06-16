import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PatientRecords.css';

const PatientRecords = () => {
    const { patient_id } = useParams();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/medical-records/patient/${patient_id}`);
                setRecords(response.data);
            } catch (err) {
                setError('Failed to fetch medical records');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [patient_id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="medical-record-list">
            <h2>Medical Records</h2>
            {records.length === 0 ? (
                <div className="no-records">No medical records found</div>
            ) : (
                <ul>
                    {records.map(record => (
                        <li key={record._id}>
                            <p><strong>Date:</strong> <span>{record.date}</span></p>
                            <p><strong>Time:</strong> <span>{record.time}</span></p>
                            <p><strong>Description:</strong> <span>{record.description}</span></p>
                            <p><strong>Diagnosis:</strong> <span>{record.diagnosis}</span></p>
                            <p><strong>Treatment:</strong> <span>{record.treatment}</span></p>
                            <p><strong>Doctor:</strong> <span>{record.doctor_id.first_name} {record.doctor_id.last_name}</span></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PatientRecords;
