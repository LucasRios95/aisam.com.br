import api from './api';

export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  senioridade: string;
  areas_atuacao: string[];
  regime: string;
  localidade: string;
  email_contato: string;
  empresa_anonima: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  associado?: {
    id?: string;
    razao_social?: string;
    cnpj?: string;
    email?: string;
  };
  recrutador?: {
    id?: string;
    nome?: string;
    email?: string;
  };
}

export interface FiltrosVagas {
  areas_atuacao?: string[];
  senioridade?: string;
  regime?: string;
  localidade?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

class VagasService {
  async listar(filtros?: FiltrosVagas): Promise<Vaga[]> {
    const params = new URLSearchParams();

    if (filtros?.areas_atuacao && filtros.areas_atuacao.length > 0) {
      params.append('areas_atuacao', filtros.areas_atuacao.join(','));
    }
    if (filtros?.senioridade) {
      params.append('senioridade', filtros.senioridade);
    }
    if (filtros?.regime) {
      params.append('regime', filtros.regime);
    }
    if (filtros?.localidade) {
      params.append('localidade', filtros.localidade);
    }
    if (filtros?.status) {
      params.append('status', filtros.status);
    }
    if (filtros?.limit) {
      params.append('limit', filtros.limit.toString());
    }
    if (filtros?.offset) {
      params.append('offset', filtros.offset.toString());
    }

    const response = await api.get<Vaga[]>(`/vagas?${params.toString()}`);
    return response.data;
  }

  async listarMinhasVagas(): Promise<Vaga[]> {
    const response = await api.get<Vaga[]>('/vagas/minhas');
    return response.data;
  }

  async buscarPorId(id: string): Promise<Vaga> {
    const response = await api.get<Vaga>(`/vagas/${id}`);
    return response.data;
  }

  async criar(vaga: Partial<Vaga>): Promise<Vaga> {
    const response = await api.post<Vaga>('/vagas', vaga);
    return response.data;
  }

  async atualizar(id: string, vaga: Partial<Vaga>): Promise<Vaga> {
    const response = await api.put<Vaga>(`/vagas/${id}`, vaga);
    return response.data;
  }

  async arquivar(id: string): Promise<void> {
    await api.patch(`/vagas/${id}/arquivar`);
  }

  async encerrar(id: string): Promise<void> {
    await api.patch(`/vagas/${id}/encerrar`);
  }

  async deletar(id: string): Promise<void> {
    await api.delete(`/vagas/${id}`);
  }

  async pausar(id: string): Promise<void> {
    await api.patch(`/vagas/${id}/pausar`);
  }

  async reabrir(id: string): Promise<void> {
    await api.patch(`/vagas/${id}/reabrir`);
  }
}

export default new VagasService();
