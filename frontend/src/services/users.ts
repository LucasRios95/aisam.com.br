import api from './api';

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  approved_by?: string;
  approved_at?: Date;
}

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  company?: string;
  created_at: Date;
  user_roles: UserRole[];
}

export const usersService = {
  listar: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  atualizarRole: async (userId: string, role: string): Promise<void> => {
    await api.put(`/users/${userId}/role`, { role });
  }
};
