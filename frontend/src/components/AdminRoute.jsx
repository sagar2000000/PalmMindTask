import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    // Not logged in or not admin — redirect to homepage or login
    return 
    <Navigate to="/" replace />;
  }

  return (
    children
  )
}

export default AdminRoute;
