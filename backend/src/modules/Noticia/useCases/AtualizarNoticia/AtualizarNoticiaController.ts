import { Request, Response } from "express";
import { container } from "tsyringe";
import { AtualizarNoticiaUseCase } from "./AtualizarNoticiaUseCase";

export class AtualizarNoticiaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    const atualizarNoticiaUseCase = container.resolve(AtualizarNoticiaUseCase);
    const noticia = await atualizarNoticiaUseCase.execute(id, data);

    return response.json(noticia);
  }
}
