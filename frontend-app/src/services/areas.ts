import api from './api';

export interface AreaAtuacao {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

class AreasService {
  async listar(apenasAtivas: boolean = true): Promise<AreaAtuacao[]> {
    const params = new URLSearchParams();
    params.append('apenasAtivas', apenasAtivas.toString());

    const response = await api.get<AreaAtuacao[]>(`/areas-atuacao?${params.toString()}`);
    return response.data;
  }

  async criar(area: Omit<AreaAtuacao, 'id' | 'created_at' | 'updated_at'>): Promise<AreaAtuacao> {
    const response = await api.post<AreaAtuacao>('/areas-atuacao', area);
    return response.data;
  }

  async atualizar(id: string, area: Partial<Omit<AreaAtuacao, 'id' | 'created_at' | 'updated_at'>>): Promise<AreaAtuacao> {
    const response = await api.put<AreaAtuacao>(`/areas-atuacao/${id}`, area);
    return response.data;
  }

  async deletar(id: string): Promise<void> {
    await api.delete(`/areas-atuacao/${id}`);
  }
}

export default new AreasService();
