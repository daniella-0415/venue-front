import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
    const { user, role } = useAuth();

    // If not logged in at all, redirect to login page
    if (!user) {
        return 
        <Navigate to="/login" replace />;
    }

    // If roles are specified and the user's role isn't authorized, redirect to an unauthorized page or home
    if (allowedRoles && !allowedRoles.includes(role)) {
        return 
        <Navigate to="/unauthorized" replace />;
    }

    // If checks pass, render the child routes
    return 
    <Outlet />;
}

export default ProtectedRoute;
