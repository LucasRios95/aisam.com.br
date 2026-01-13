import api from './api';

export interface Recrutador {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'recrutador';
  associado_id: string;
  associado?: {
    razao_social: string;
  };
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CriarRecrutadorDTO {
  nome: string;
  email: string;
  senha: string;
  perfil: 'admin' | 'recrutador';
  associado_id: string;
}

class RecrutadoresService {
  async listar(): Promise<Recrutador[]> {
    const response = await api.get<Recrutador[]>('/recrutadores');
    return response.data;
  }

  async buscarPorId(id: string): Promise<Recrutador> {
    const response = await api.get<Recrutador>(`/recrutadores/${id}`);
    return response.data;
  }

  async criar(dados: CriarRecrutadorDTO): Promise<Recrutador> {
    const response = await api.post('/recrutadores', dados);
    return response.data;
  }

  async ativar(id: string): Promise<Recrutador> {
    const response = await api.patch<Recrutador>(`/recrutadores/${id}/ativar`);
    return response.data;
  }

  async desativar(id: string): Promise<Recrutador> {
    const response = await api.patch<Recrutador>(`/recrutadores/${id}/desativar`);
    return response.data;
  }

  async deletar(id: string): Promise<void> {
    await api.delete(`/recrutadores/${id}`);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/recrutadores/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, senha: string): Promise<{ message: string }> {
    const response = await api.post('/recrutadores/reset-password', { token, senha });
    return response.data;
  }
}

export default new RecrutadoresService();
