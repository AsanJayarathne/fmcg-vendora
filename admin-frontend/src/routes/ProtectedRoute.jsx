import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  
  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== 'SUPER_ADMIN') {
    // If somehow authenticated but not SUPER_ADMIN, deny access by redirecting to login (or logout and login)
    return <Navigate to="/login" replace />;
  }

  return children;
}
