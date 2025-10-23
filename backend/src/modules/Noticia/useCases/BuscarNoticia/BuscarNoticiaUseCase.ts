import { inject, injectable } from "tsyringe";
import { Noticia } from "../../infra/typeorm/entities/Noticia";
import { INoticiasRepository } from "../../repositories/INoticiasRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class BuscarNoticiaUseCase {
  constructor(
    @inject("NoticiasRepository")
    private noticiasRepository: INoticiasRepository
  ) {}

  async execute(identificador: string, porSlug: boolean = false): Promise<Noticia> {
    let noticia: Noticia | null;

    if (porSlug) {
      noticia = await this.noticiasRepository.buscarPorSlug(identificador);
    } else {
      noticia = await this.noticiasRepository.buscarPorId(identificador);
    }

    if (!noticia) {
      throw new AppError("Notícia não encontrada", 404);
    }

    // Incrementar visualizações
    await this.noticiasRepository.incrementarVisualizacoes(noticia.id);

    return noticia;
  }
}
