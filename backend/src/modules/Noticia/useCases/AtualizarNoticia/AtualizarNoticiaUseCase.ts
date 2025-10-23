import { inject, injectable } from "tsyringe";
import { Noticia } from "../../infra/typeorm/entities/Noticia";
import { INoticiasRepository } from "../../repositories/INoticiasRepository";
import { IAtualizarNoticiaDTO } from "../../dtos/INoticiaDTO";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class AtualizarNoticiaUseCase {
  constructor(
    @inject("NoticiasRepository")
    private noticiasRepository: INoticiasRepository
  ) {}

  async execute(id: string, data: IAtualizarNoticiaDTO): Promise<Noticia> {
    const noticia = await this.noticiasRepository.buscarPorId(id);

    if (!noticia) {
      throw new AppError("Notícia não encontrada", 404);
    }

    // Verificar se o novo slug já está em uso
    if (data.slug && data.slug !== noticia.slug) {
      const noticiaComSlug = await this.noticiasRepository.buscarPorSlug(
        data.slug
      );
      if (noticiaComSlug) {
        throw new AppError("Já existe uma notícia com este slug", 400);
      }
    }

    Object.assign(noticia, data);

    const noticiaAtualizada = await this.noticiasRepository.atualizar(noticia);
    return noticiaAtualizada;
  }
}
