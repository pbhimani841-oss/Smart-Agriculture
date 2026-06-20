import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
        if (user.role === 'farmer') return <Navigate to="/farmer/profile" />;
        if (user.role === 'customer') return <Navigate to="/customer/profile" />;
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
