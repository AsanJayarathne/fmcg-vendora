import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  
  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== 'DRIVER') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
