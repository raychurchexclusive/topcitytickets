// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Assume you've created a spinner component

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    // Optionally, show a spinner or loading screen while auth state is loading
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to unauthorized page if the user's role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
