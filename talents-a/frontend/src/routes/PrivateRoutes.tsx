import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function PrivateRoutes() {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
      <Outlet />
  );
}
