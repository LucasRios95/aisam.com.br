import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN_AISAM' | 'RECRUTADOR' | 'CANDIDATO';
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, senha: string, userType: 'admin' | 'recrutador') => Promise<void>;
  signInCandidato: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('@AisamRecrutamento:token');
    const storedUser = localStorage.getItem('@AisamRecrutamento:user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, senha: string, userType: 'admin' | 'recrutador') {
    try {
      const response = await api.post(`/auth/${userType}`, { email, senha });

      const { token: newToken } = response.data;
      const userData = response.data[userType === 'admin' ? 'admin' : 'recrutador'];

      const user: User = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        role: userType === 'admin' ? 'ADMIN_AISAM' : 'RECRUTADOR',
      };

      localStorage.setItem('@AisamRecrutamento:token', newToken);
      localStorage.setItem('@AisamRecrutamento:user', JSON.stringify(user));

      setToken(newToken);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  }

  async function signInCandidato(email: string) {
    try {
      const response = await api.post('/auth/candidato/magic-link', { email });

      const { token: newToken, expires_at } = response.data;

      const user: User = {
        id: '',
        nome: '',
        email,
        role: 'CANDIDATO',
      };

      localStorage.setItem('@AisamRecrutamento:token', newToken);
      localStorage.setItem('@AisamRecrutamento:user', JSON.stringify(user));
      localStorage.setItem('@AisamRecrutamento:expires_at', expires_at);

      setToken(newToken);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao gerar link mágico');
    }
  }

  function signOut() {
    localStorage.removeItem('@AisamRecrutamento:token');
    localStorage.removeItem('@AisamRecrutamento:user');
    localStorage.removeItem('@AisamRecrutamento:expires_at');

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signInCandidato, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
