import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './DoctorAppointments.css';
import QRCode from "qrcode.react";
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import QrReaderComponent from "../QrReaderComponent/QrReaderComponent";
import { v4 as uuidv4 } from 'uuid';


const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const [scanning, setScanning] = useState(false);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [showMedicalRecords, setShowMedicalRecords] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const doctorId = decodedToken.userId;

                const response = await axios.get(`http://localhost:3000/api/appointments/doctor/${doctorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAppointments(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch appointments');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleScanQr = (qrCodeUrl) => {
        setScanning(qrCodeUrl);
    };

    const handleScanComplete = (data, qrCodeUrl) => {
        // Process the scanned data and qrCodeUrl here
        console.log(data, qrCodeUrl);
        // Reset scanning state or other logic as needed
        setScanning(null);
    };

    async function sendQRCode(patientId) {
        try {
            const url = `http://localhost:3000/api/medical-records/patient/${patientId}`;

            const response = await axios.post('http://localhost:1880/scan-qr', { URL: url });

            console.log('QR Code sent successfully:', response.data);
            const response2 = await axios.get(response.data, { URL: url });
            console.log(response2.data);
            setMedicalRecords(response2.data);
            setShowMedicalRecords(true);
        } catch (error) {
            console.error('Error generating or sending QR code:', error);
        }
    }

    function displayMedicalRecords(records) {
        return records.map((record, index) => (
            <div key={index}>
                <h3>Date: {record.date}</h3>
                <p>Description: {record.description}</p>
                <p>Diagnosis: {record.diagnosis}</p>
                <p>Time: {record.time}</p>
                <p>Treatment: {record.treatment}</p>
                <hr />
            </div>
        ));
    }


    return (
        <div className="appointments-list">
            <h2>My Appointments</h2>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment._id}>
                            <div className="appointment-details">
                                <strong>Patient:</strong> {appointment.patient_id.first_name} {appointment.patient_id.last_name}
                            </div>
                            <div className="appointment-details">
                                <strong>Date:</strong> {appointment.appointment_date}
                            </div>
                            <div className="appointment-details">
                                <strong>Time:</strong> {appointment.appointment_time}
                            </div>
                            <div className="appointment-details">
                                <QRCode value={`http://localhost:1880/generate-qr?id=${appointment.patient_id._id}`}/>
                            </div>
                            <div className="appointment-details">
                                <button onClick={() => sendQRCode(appointment.patient_id._id)}>Scan Qr-code</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showMedicalRecords && (
                <div className="medical-records">
                    <h2>Medical Records</h2>
                    {medicalRecords.length === 0 ? (
                        <p>No medical records found.</p>
                    ) : (
                        <div>
                            {displayMedicalRecords(medicalRecords)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
