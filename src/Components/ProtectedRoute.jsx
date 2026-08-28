import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

function ProtectedRoute({ allowedRoles }) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div className="page-loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;