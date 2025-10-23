import api from './api';

export interface Candidato {
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
  consentimento_dados: boolean;
  acesso_expirado?: string;
  created_at: string;
  updated_at: string;
}

export interface CriarCandidatoDTO {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  resumo_curriculo: string;
  areas_atuacao: string[];
  consentimento_dados: boolean;
}

export interface AtualizarCandidatoDTO {
  nome?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  resumo_curriculo?: string;
  areas_atuacao?: string[];
}

class CandidatosService {
  async criar(candidato: CriarCandidatoDTO): Promise<Candidato> {
    const response = await api.post<Candidato>('/candidatos', candidato);
    return response.data;
  }

  async buscarPerfil(): Promise<Candidato> {
    const response = await api.get<Candidato>('/candidatos/profile');
    return response.data;
  }

  async atualizar(id: string, candidato: AtualizarCandidatoDTO): Promise<Candidato> {
    const response = await api.patch<Candidato>(`/candidatos/${id}`, candidato);
    return response.data;
  }

  async uploadCurriculo(id: string, arquivo: File): Promise<void> {
    const formData = new FormData();
    formData.append('curriculo', arquivo);

    await api.patch(`/candidatos/${id}/curriculo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async gerarLinkMagico(email: string): Promise<{ token: string; expires_at: string }> {
    const response = await api.post('/candidatos/magic-link', { email });
    return response.data;
  }
}

export default new CandidatosService();
