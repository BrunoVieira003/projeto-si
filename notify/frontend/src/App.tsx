import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserPage from './pages/users/UserPage';
import PrivateRoutes from './routes/PrivateRoutes';
import CreateUserPage from './pages/users/CreateUserPage';
import Unauthorized from './components/Unauthorized/Unauthorized';

export default function App() {
  return (
    <Routes>
      {/* Rota pública (sem autenticação, sem layout) */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/create" element={<CreateUserPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rotas privadas (com Navbar e auth obrigatória) */}
      <Route element={<PrivateRoutes  allowedRoles={['ADMIN']}/>}>
        <Route path="/users" element={<UserPage />} />
      </Route>
    </Routes>
  );
}
