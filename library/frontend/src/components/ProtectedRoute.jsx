import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  // In a full app, these might come from a React Context or Redux store
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // Not logged in at all, kick them to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in, but lacks the specific role (e.g., a VISITOR trying to hit an ADMIN route)
    return <Navigate to="/catalog" replace />;
  }

  // Authorized, render the child route
  return <Outlet />;
}
