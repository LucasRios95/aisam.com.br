import { inject, injectable } from "tsyringe";
import { Noticia } from "../../infra/typeorm/entities/Noticia";
import {
  INoticiasRepository,
  IFiltrosNoticias,
} from "../../repositories/INoticiasRepository";

@injectable()
export class ListarNoticiasUseCase {
  constructor(
    @inject("NoticiasRepository")
    private noticiasRepository: INoticiasRepository
  ) {}

  async execute(filtros?: IFiltrosNoticias): Promise<Noticia[]> {
    const noticias = await this.noticiasRepository.listar(filtros);
    return noticias;
  }
}
