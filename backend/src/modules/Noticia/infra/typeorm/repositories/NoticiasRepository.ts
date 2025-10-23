import { getConnection, Repository } from "typeorm";
import { Noticia } from "../entities/Noticia";
import {
  INoticiasRepository,
  IFiltrosNoticias,
} from "@modules/Noticia/repositories/INoticiasRepository";

export class NoticiasRepository implements INoticiasRepository {
  private repository: Repository<Noticia>;

  constructor() {
    this.repository = getConnection("noticias").getRepository(Noticia);
  }

  async criar(noticia: Noticia): Promise<Noticia> {
    const novaNoticia = this.repository.create(noticia);
    await this.repository.save(novaNoticia);
    return novaNoticia;
  }

  async buscarPorId(id: string): Promise<Noticia | null> {
    const noticia = await this.repository.findOne({ where: { id } });
    return noticia;
  }

  async buscarPorSlug(slug: string): Promise<Noticia | null> {
    const noticia = await this.repository.findOne({ where: { slug } });
    return noticia;
  }

  async listar(filtros?: IFiltrosNoticias): Promise<Noticia[]> {
    const query = this.repository.createQueryBuilder("noticia");

    if (filtros?.publicada !== undefined) {
      query.andWhere("noticia.publicada = :publicada", {
        publicada: filtros.publicada,
      });
    }

    if (filtros?.destaque !== undefined) {
      query.andWhere("noticia.destaque = :destaque", {
        destaque: filtros.destaque,
      });
    }

    if (filtros?.tags && filtros.tags.length > 0) {
      query.andWhere("noticia.tags && :tags", { tags: filtros.tags });
    }

    if (filtros?.busca) {
      query.andWhere(
        "(noticia.titulo ILIKE :busca OR noticia.resumo ILIKE :busca OR noticia.conteudo ILIKE :busca)",
        { busca: `%${filtros.busca}%` }
      );
    }

    query.orderBy("noticia.data_publicacao", "DESC");

    const noticias = await query.getMany();
    return noticias;
  }

  async atualizar(noticia: Noticia): Promise<Noticia> {
    await this.repository.save(noticia);
    return noticia;
  }

  async deletar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async incrementarVisualizacoes(id: string): Promise<void> {
    await this.repository.increment({ id }, "visualizacoes", 1);
  }

  async listarDestaques(limite: number = 3): Promise<Noticia[]> {
    const noticias = await this.repository.find({
      where: { publicada: true, destaque: true },
      order: { data_publicacao: "DESC" },
      take: limite,
    });
    return noticias;
  }
}
