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

class NoticiasService {
  async listar(): Promise<Noticia[]> {
    // Busca apenas notícias publicadas
    const response = await api.get<Noticia[]>('/noticias?publicada=true');
    return response.data;
  }

  async buscarPorSlug(slug: string): Promise<Noticia> {
    const response = await api.get<Noticia>(`/noticias/${slug}?tipo=slug`);
    return response.data;
  }

  async listarDestaques(): Promise<Noticia[]> {
    const response = await api.get<Noticia[]>('/noticias?publicada=true&destaque=true');
    return response.data;
  }
}

export default new NoticiasService();
