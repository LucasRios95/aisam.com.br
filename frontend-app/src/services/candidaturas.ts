import api from './api';

export interface Candidatura {
  id: string;
  vaga_id: string;
  candidato_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  vaga?: {
    titulo: string;
    empresa_anonima: boolean;
    associado?: {
      razao_social: string;
    };
  };
  candidato?: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
    resumo_curriculo: string;
    areas_atuacao: string[];
    curriculo_url?: string;
    curriculo_upload_date?: string;
  };
}

export interface CriarCandidaturaDTO {
  vaga_id: string;
}

class CandidaturasService {
  async criar(candidatura: CriarCandidaturaDTO): Promise<Candidatura> {
    const response = await api.post<Candidatura>('/candidaturas', candidatura);
    return response.data;
  }

  async listar(filtros?: { vaga_id?: string; candidato_id?: string }): Promise<Candidatura[]> {
    const params = new URLSearchParams();

    if (filtros?.vaga_id) {
      params.append('vaga_id', filtros.vaga_id);
    }
    if (filtros?.candidato_id) {
      params.append('candidato_id', filtros.candidato_id);
    }

    const response = await api.get<Candidatura[]>(`/candidaturas?${params.toString()}`);
    return response.data;
  }

  async buscarPorId(id: string): Promise<Candidatura> {
    const response = await api.get<Candidatura>(`/candidaturas/${id}`);
    return response.data;
  }

  async cancelar(id: string): Promise<void> {
    await api.delete(`/candidaturas/${id}`);
  }

  async atualizarStatus(id: string, status: string): Promise<Candidatura> {
    const response = await api.patch<Candidatura>(`/candidaturas/${id}/status`, { status });
    return response.data;
  }
}

export default new CandidaturasService();
