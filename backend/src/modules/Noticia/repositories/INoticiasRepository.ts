import { Noticia } from "../infra/typeorm/entities/Noticia";

export interface IFiltrosNoticias {
  publicada?: boolean;
  destaque?: boolean;
  tags?: string[];
  busca?: string;
}

export interface INoticiasRepository {
  criar(noticia: Noticia): Promise<Noticia>;
  buscarPorId(id: string): Promise<Noticia | null>;
  buscarPorSlug(slug: string): Promise<Noticia | null>;
  listar(filtros?: IFiltrosNoticias): Promise<Noticia[]>;
  atualizar(noticia: Noticia): Promise<Noticia>;
  deletar(id: string): Promise<void>;
  incrementarVisualizacoes(id: string): Promise<void>;
  listarDestaques(limite?: number): Promise<Noticia[]>;
}
