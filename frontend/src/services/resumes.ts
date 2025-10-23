import api from './api';

export interface Resume {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  resumo_curriculo: string;
  areas_atuacao: string[];
  curriculo_url: string | null;
  curriculo_upload_date: Date | null;
}

export interface UpdateResumeData {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  resumo_curriculo?: string;
  areas_atuacao?: string[];
}

export const resumesService = {
  buscarMeuCurriculo: async (): Promise<Resume> => {
    const response = await api.get('/candidatos/resume/me');
    return response.data;
  },

  atualizar: async (data: UpdateResumeData): Promise<void> => {
    await api.put('/candidatos/resume', data);
  },

  uploadCurriculo: async (candidatoId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('curriculo', file);

    await api.patch(`/candidatos/${candidatoId}/curriculo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};
