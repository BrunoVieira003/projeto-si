import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoutes from './routes/PrivateRoutes';
import PortabilityCallback from './pages/PortabilityCallback';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      {/* Rota pública (sem autenticação, sem layout) */}
      <Route path="/" element={<Login />} />
      <Route path="/portability/callback" element={<PortabilityCallback />} />

      {/* Rotas privadas (com Navbar e auth obrigatória) */}
      <Route element={<PrivateRoutes />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
