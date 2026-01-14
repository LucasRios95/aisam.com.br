import api from './api';

export interface AdminProfile {
  id: string;
  nome: string;
  email: string;
  mfa_enabled: boolean;
  created_at: string;
}

export interface UpdateAdminProfileDTO {
  nome?: string;
  senha_atual?: string;
  nova_senha?: string;
}

class AdminService {
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/admin-aisam/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, senha: string): Promise<{ message: string }> {
    const response = await api.post('/admin-aisam/reset-password', { token, senha });
    return response.data;
  }

  async getProfile(): Promise<AdminProfile> {
    const response = await api.get<AdminProfile>('/admin-aisam/profile');
    return response.data;
  }

  async updateProfile(dados: UpdateAdminProfileDTO): Promise<AdminProfile> {
    const response = await api.put<AdminProfile>('/admin-aisam/profile', dados);
    return response.data;
  }
}

export default new AdminService();
