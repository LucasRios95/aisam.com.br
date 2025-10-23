import { Request, Response } from "express";
import { container } from "tsyringe";
import { WebhookNoticiaUseCase } from "./WebhookNoticiaUseCase";

export class WebhookNoticiaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    // Validação básica
    if (!data.titulo || !data.conteudo) {
      return response.status(400).json({
        error: "Campos obrigatórios: titulo, conteudo",
      });
    }

    const webhookNoticiaUseCase = container.resolve(WebhookNoticiaUseCase);
    const noticia = await webhookNoticiaUseCase.execute(data);

    return response.status(201).json({
      message: "Notícia criada via webhook com sucesso",
      noticia,
    });
  }
}
