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

export interface EnviarConviteDTO {
  nome: string;
  email: string;
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

  async enviarConvite(convite: EnviarConviteDTO): Promise<{ message: string }> {
    const response = await api.post('/recrutadores/convite', convite);
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
}

export default new RecrutadoresService();
