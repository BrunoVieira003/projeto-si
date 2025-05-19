import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  authenticated: boolean;
  userId: string | null;
  token: string | null;
  login: (data: { access_token: string; userId: string}) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userId');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserId(storedUser);
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = (data: { access_token: string; userId: string }) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', data.userId);
    setToken(data.access_token);
    setUserId(data.userId);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, userId, token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
