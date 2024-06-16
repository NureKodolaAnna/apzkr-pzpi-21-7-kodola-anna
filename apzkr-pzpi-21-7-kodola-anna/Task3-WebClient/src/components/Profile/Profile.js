import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { Link } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [clinicName, setClinicName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in again.');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
                if (response.data.clinic_id) {
                    const newClinicName = await fetchClinicName(response.data.clinic_id, token);
                    setClinicName(newClinicName);
                } else {
                    setClinicName('No Clinic Assigned');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                if (error.response && error.response.status === 400) {
                    setError('Invalid Token');
                } else {
                    setError('Failed to fetch user profile');
                }
            }
        };

        fetchUserProfile();
    }, []);

    const fetchClinicName = async (id, token) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/clinics/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.name;
        } catch (error) {
            console.error('Error fetching clinic name:', error);
            return 'Clinic not found';
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="profile-details">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>First Name:</strong> {user.first_name}</p>
                <p><strong>Last Name:</strong> {user.last_name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {user.clinic_id && user.role === 'doctor' && (
                    <p><strong>Clinic Name:</strong> {user.clinic_id.name}</p>
                )}
                <div className="list-buttons">
                    <Link to={`/edit-user/${user._id}`} className="edit-profile-button">Edit Profile</Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
