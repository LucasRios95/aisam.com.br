import api from './api';

export interface Noticia {
  id: string;
  titulo: string;
  slug: string;
  resumo?: string;
  conteudo: string;
  imagem_url?: string;
  autor?: string;
  fonte?: string;
  fonte_url?: string;
  tags?: string[];
  publicada: boolean;
  destaque: boolean;
  data_publicacao: string;
  visualizacoes: number;
  created_at: string;
  updated_at: string;
}

export interface CriarNoticiaDTO {
  titulo: string;
  slug?: string;
  resumo?: string;
  conteudo: string;
  imagem_url?: string;
  autor?: string;
  tags?: string[];
  publicada?: boolean;
  destaque?: boolean;
  data_publicacao?: string;
}

export interface AtualizarNoticiaDTO {
  titulo?: string;
  slug?: string;
  resumo?: string;
  conteudo?: string;
  imagem_url?: string;
  autor?: string;
  tags?: string[];
  publicada?: boolean;
  destaque?: boolean;
  data_publicacao?: string;
}

export interface FiltrosNoticias {
  publicada?: boolean;
  destaque?: boolean;
  tags?: string[];
  busca?: string;
}

class NoticiasService {
  async listar(filtros?: FiltrosNoticias): Promise<Noticia[]> {
    const params = new URLSearchParams();

    if (filtros?.publicada !== undefined) {
      params.append('publicada', filtros.publicada.toString());
    }
    if (filtros?.destaque !== undefined) {
      params.append('destaque', filtros.destaque.toString());
    }
    if (filtros?.tags && filtros.tags.length > 0) {
      params.append('tags', filtros.tags.join(','));
    }
    if (filtros?.busca) {
      params.append('busca', filtros.busca);
    }

    const response = await api.get<Noticia[]>(`/noticias?${params.toString()}`);
    return response.data;
  }

  async buscarPorId(id: string): Promise<Noticia> {
    const response = await api.get<Noticia>(`/noticias/${id}`);
    return response.data;
  }

  async buscarPorSlug(slug: string): Promise<Noticia> {
    const response = await api.get<Noticia>(`/noticias/${slug}?tipo=slug`);
    return response.data;
  }

  async criar(noticia: CriarNoticiaDTO): Promise<Noticia> {
    const response = await api.post<Noticia>('/noticias', noticia);
    return response.data;
  }

  async atualizar(id: string, noticia: AtualizarNoticiaDTO): Promise<Noticia> {
    const response = await api.patch<Noticia>(`/noticias/${id}`, noticia);
    return response.data;
  }

  async deletar(id: string): Promise<void> {
    await api.delete(`/noticias/${id}`);
  }
}

export default new NoticiasService();
