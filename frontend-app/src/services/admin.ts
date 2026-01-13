import api from './api';

class AdminService {
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/admin-aisam/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, senha: string): Promise<{ message: string }> {
    const response = await api.post('/admin-aisam/reset-password', { token, senha });
    return response.data;
  }
}

export default new AdminService();
