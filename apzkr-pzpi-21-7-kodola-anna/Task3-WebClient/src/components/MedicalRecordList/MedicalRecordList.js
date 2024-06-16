import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import QRCode from 'qrcode.react';
import QrReaderComponent from '../QrReaderComponent/QrReaderComponent';
import './MedicalRecordList.css';

const MedicalRecordList = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const [scanning, setScanning] = useState(false);
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
        const fetchMedicalRecords = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/medical-records/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedicalRecords(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch medical records');
                setLoading(false);
            }
        };

        fetchMedicalRecords();
    }, [token]);

    const handleCreateRecord = () => {
        navigate('/create-medical-record');
    };

    const handleEditRecord = (id) => {
        navigate(`/edit-medical-record/${id}`);
    };

    const handleDeleteRecord = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/medical-records/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicalRecords(medicalRecords.filter(record => record._id !== id));
        } catch (error) {
            console.error('Error deleting medical record:', error);
            setError('Failed to delete medical record');
        }
    };

    const handleScanQr = (qrCodeUrl) => {
        setScanning(qrCodeUrl);
    };

    const handleScanComplete = (data, qrCodeUrl) => {
        // Process the scanned data and qrCodeUrl here
        console.log(data, qrCodeUrl);
        // Reset scanning state or other logic as needed
        setScanning(null);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="medical-record-list">
            <h2>Medical Records</h2>
            {role === 'doctor' && (
                <button onClick={handleCreateRecord} className="create-record-button">Create Medical Record</button>
            )}
            {medicalRecords.length === 0 ? (
                <p>No medical records found.</p>
            ) : (
                <ul>
                    {medicalRecords.map(record => (
                        <li key={record._id}>
                            <strong>Patient:</strong> <span>{record.patient_id.first_name} {record.patient_id.last_name}</span>
                            <strong>Doctor:</strong> <span>{record.doctor_id.first_name} {record.doctor_id.last_name}</span>
                            <strong>Date:</strong> <span>{record.date}</span>
                            <strong>Time:</strong> <span>{record.time}</span>
                            <strong>Description:</strong> <span>{record.description}</span>
                            <strong>Diagnosis:</strong> <span>{record.diagnosis}</span>
                            <strong>Treatment:</strong> <span>{record.treatment}</span>
                            {role === 'doctor' && (
                                <div className="record-buttons">
                                    <button onClick={() => handleEditRecord(record._id)} className="edit-record-button">Edit</button>
                                    <button onClick={() => handleDeleteRecord(record._id)} className="delete-record-button">Delete</button>
                                </div>
                            )}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MedicalRecordList;
