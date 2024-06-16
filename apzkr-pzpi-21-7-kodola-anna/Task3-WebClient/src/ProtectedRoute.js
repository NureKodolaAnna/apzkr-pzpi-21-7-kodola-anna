import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (role && role !== userRole) {
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error('Failed to decode token:', error);
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
