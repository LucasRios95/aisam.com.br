import api from './api';

// Interface que representa o Associado conforme retornado pelo backend
export interface Associado {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  ativo: boolean; // Convertido de status no backend
  created_at: string;
  updated_at: string;
}

// DTO para criar associado (conforme esperado pelo backend)
export interface CriarAssociadoDTO {
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

// DTO para atualizar associado (conforme esperado pelo backend)
export interface AtualizarAssociadoDTO {
  razao_social?: string;
  nome_fantasia?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  ativo?: boolean; // Será convertido para status no backend
}

class AssociadosService {
  async listar(apenasAtivos: boolean = true): Promise<Associado[]> {
    const params = new URLSearchParams();
    if (apenasAtivos) {
      params.append('ativo', 'true');
    }

    const response = await api.get<Associado[]>(`/associados?${params.toString()}`);
    return response.data;
  }

  async buscarPorId(id: string): Promise<Associado> {
    const response = await api.get<Associado>(`/associados/${id}`);
    return response.data;
  }

  async criar(associado: CriarAssociadoDTO): Promise<Associado> {
    const response = await api.post<Associado>('/associados', associado);
    return response.data;
  }

  async atualizar(id: string, associado: AtualizarAssociadoDTO): Promise<Associado> {
    const response = await api.patch<Associado>(`/associados/${id}`, associado);
    return response.data;
  }

  async deletar(id: string): Promise<void> {
    await api.delete(`/associados/${id}`);
  }
}

export default new AssociadosService();
