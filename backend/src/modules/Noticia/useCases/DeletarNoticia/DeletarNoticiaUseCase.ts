import { inject, injectable } from "tsyringe";
import { INoticiasRepository } from "../../repositories/INoticiasRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class DeletarNoticiaUseCase {
  constructor(
    @inject("NoticiasRepository")
    private noticiasRepository: INoticiasRepository
  ) {}

  async execute(id: string): Promise<void> {
    const noticia = await this.noticiasRepository.buscarPorId(id);

    if (!noticia) {
      throw new AppError("Notícia não encontrada", 404);
    }

    await this.noticiasRepository.deletar(id);
  }
}
