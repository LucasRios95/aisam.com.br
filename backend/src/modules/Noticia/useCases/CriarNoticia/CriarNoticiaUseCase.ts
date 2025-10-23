import { inject, injectable } from "tsyringe";
import { Noticia } from "../../infra/typeorm/entities/Noticia";
import { INoticiasRepository } from "../../repositories/INoticiasRepository";
import { ICriarNoticiaDTO } from "../../dtos/INoticiaDTO";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class CriarNoticiaUseCase {
  constructor(
    @inject("NoticiasRepository")
    private noticiasRepository: INoticiasRepository
  ) {}

  async execute(data: ICriarNoticiaDTO): Promise<Noticia> {
    // Verificar se já existe notícia com mesmo slug
    if (data.slug) {
      const noticiaExistente = await this.noticiasRepository.buscarPorSlug(
        data.slug
      );
      if (noticiaExistente) {
        throw new AppError("Já existe uma notícia com este slug", 400);
      }
    }

    const noticia = new Noticia();
    Object.assign(noticia, {
      ...data,
      publicada: data.publicada !== undefined ? data.publicada : true,
      destaque: data.destaque !== undefined ? data.destaque : false,
      data_publicacao: data.data_publicacao || new Date(),
    });

    const novaNoticia = await this.noticiasRepository.criar(noticia);
    return novaNoticia;
  }
}
