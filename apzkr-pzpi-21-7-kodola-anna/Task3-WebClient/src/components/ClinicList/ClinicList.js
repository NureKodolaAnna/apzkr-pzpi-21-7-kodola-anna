import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ClinicList.css';

const ClinicList = () => {
    const [clinics, setClinics] = useState([]);

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


    const handleDelete = async (clinicId) => {
        try {
            await axios.delete(`http://localhost:3000/api/clinics/delete/${clinicId}`);
            setClinics(clinics.filter(clinic => clinic._id !== clinicId));
        } catch (error) {
            console.error('Error deleting clinic:', error);
        }
    };

    return (
        <div className="clinic-list">
            <h2>All Clinics</h2>
            <ul>
                {clinics.map(clinic => (
                    <li key={clinic._id}>
                        <strong>Name: </strong> {clinic.name} <br/>
                        <strong>Location: </strong> {clinic.city}, {clinic.address} <br/>
                        <strong>Phone: </strong> {clinic.phone}<br/>
                        <strong>Email: </strong> {clinic.email}<br/>
                        <div className="list-buttons">
                            <Link to={`/clinics/edit/${clinic._id}`} className="edit-list-button">Edit</Link>
                            <button onClick={() => handleDelete(clinic._id)} className="delete-list-button">Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClinicList;
