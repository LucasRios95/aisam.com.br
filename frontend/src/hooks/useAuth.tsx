import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

interface User {
  id: string;
  nome?: string;
  email: string;
  role: 'CANDIDATO' | 'RECRUTADOR' | 'ADMIN_AISAM';
  razao_social?: string; // Para recrutadores/associados
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInCandidato: (email: string) => Promise<{ success: boolean; message?: string }>;
  signUpCandidato: (data: SignUpCandidatoData) => Promise<{ success: boolean; message?: string }>;
  signInRecrutador: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  signInAdmin: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  verifyMagicToken: (token: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

interface SignUpCandidatoData {
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  consentimento_dados: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@AisamAuth:token';
const USER_KEY = '@AisamAuth:user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT token to extract user info
  const decodeToken = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);

        if (token && savedUser) {
          const parsed = JSON.parse(savedUser);

          // Check if token is expired
          const decoded = decodeToken(token);
          if (decoded && decoded.exp) {
            const isExpired = Date.now() >= decoded.exp * 1000;
            if (isExpired) {
              // Token expired, clear auth
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              setUser(null);
            } else {
              setUser(parsed);
            }
          } else {
            setUser(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign up candidato
  const signUpCandidato = async (data: SignUpCandidatoData): Promise<{ success: boolean; message?: string }> => {
    try {
      await axios.post(`${API_URL}/candidatos`, data);
      return {
        success: true,
        message: 'Cadastro realizado! Você receberá um email com link de acesso.'
      };
    } catch (error: any) {
      console.error('SignUp error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar conta'
      };
    }
  };

  // Sign in candidato (magic link)
  const signInCandidato = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await axios.post(`${API_URL}/auth/candidato/magic-link`, { email });
      return {
        success: true,
        message: 'Link de acesso enviado para seu email!'
      };
    } catch (error: any) {
      console.error('SignIn candidato error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao enviar link de acesso'
      };
    }
  };

  // Verify magic token
  const verifyMagicToken = async (token: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Set token in header
      const response = await axios.get(`${API_URL}/candidatos/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const candidato = response.data;
      const userData: User = {
        id: candidato.id,
        nome: candidato.nome,
        email: candidato.email,
        role: 'CANDIDATO'
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      console.error('Verify token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Token inválido ou expirado'
      };
    }
  };

  // Sign in recrutador
  const signInRecrutador = async (email: string, senha: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/recrutador`, { email, senha });
      const { token, recrutador } = response.data;

      const userData: User = {
        id: recrutador.id,
        nome: recrutador.nome,
        email: recrutador.email,
        role: 'RECRUTADOR',
        razao_social: recrutador.associado?.razao_social
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      console.error('SignIn recrutador error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Email ou senha incorretos'
      };
    }
  };

  // Sign in admin
  const signInAdmin = async (email: string, senha: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/admin`, { email, senha });
      const { token, admin } = response.data;

      const userData: User = {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: 'ADMIN_AISAM'
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      console.error('SignIn admin error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Email ou senha incorretos'
      };
    }
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Helper functions
  const isAuthenticated = () => !!user;

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.role === role;
  };

  const isAdmin = () => hasRole('ADMIN_AISAM');

  const value: AuthContextType = {
    user,
    loading,
    signInCandidato,
    signUpCandidato,
    signInRecrutador,
    signInAdmin,
    verifyMagicToken,
    signOut,
    isAuthenticated,
    hasRole,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
