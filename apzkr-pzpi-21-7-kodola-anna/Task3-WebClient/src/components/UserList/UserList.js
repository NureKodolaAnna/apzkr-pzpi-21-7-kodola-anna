import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleEdit = (id) => {
        navigate(`/edit-user/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            setError('Failed to delete user');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-list">
            <h2>Manage Users</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>
                            <strong>Username:</strong> {user.username}<br/>
                            <strong>Email:</strong> {user.email}<br/>
                            <strong>First Name:</strong> {user.first_name}<br/>
                            <strong>Last Name:</strong> {user.last_name}<br/>
                            <strong>Role:</strong> {user.role}<br/>
                            <div className="list-buttons">
                                <button onClick={() => handleEdit(user._id)} className="edit-list-button">Edit</button>
                                <button onClick={() => handleDelete(user._id)} className="delete-list-button">Delete</button>
                            </div>
                        </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
