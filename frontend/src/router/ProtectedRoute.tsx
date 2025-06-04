import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Array<'student' | 'teacher' | 'admin'>; // Roles that are allowed to access this route
  children?: React.ReactNode; // Allow children to be passed for element-based routing
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role
    // Redirect to an unauthorized page or back to login/home
    // For simplicity, redirecting to login or a generic unauthorized page
    // An <UnauthorizedPage /> component could be created for this.
    console.warn(`User with role '${user.role}' tried to access a route restricted to roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />; 
    // Or, <Navigate to="/" replace />; if you prefer sending them to a safe default.
  }

  // If children are provided (for element={<ProtectedRoute><Page /></ProtectedRoute>} usage)
  if (children) {
    return <>{children}</>;
  }

  // If no children are provided (for <Route path="..." element={<ProtectedRoute />}><Route .../></Route> outlet usage)
  return <Outlet />; // Renders the nested child route
};

export default ProtectedRoute;
