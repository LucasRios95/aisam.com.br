import { inject, injectable } from "tsyringe";
import { Noticia } from "../../infra/typeorm/entities/Noticia";
import { INoticiasRepository } from "../../repositories/INoticiasRepository";
import { INoticiaWebhookDTO } from "../../dtos/INoticiaDTO";

@injectable()
export class WebhookNoticiaUseCase {
  constructor(
    @inject("NoticiasRepository")
    private noticiasRepository: INoticiasRepository
  ) {}

  async execute(data: INoticiaWebhookDTO): Promise<Noticia> {
    const noticia = new Noticia();
    Object.assign(noticia, {
      titulo: data.titulo,
      resumo: data.resumo || null,
      conteudo: data.conteudo,
      imagem_url: data.imagem_url || null,
      autor: data.autor || "Automação N8N",
      fonte: "n8n",
      fonte_url: data.fonte_url || null,
      tags: data.tags || [],
      publicada: true, // Webhook sempre publica automaticamente
      destaque: false, // Pode ser alterado manualmente depois
      data_publicacao: data.data_publicacao
        ? new Date(data.data_publicacao)
        : new Date(),
    });

    const novaNoticia = await this.noticiasRepository.criar(noticia);
    return novaNoticia;
  }
}
