import { Request, Response } from "express";
import { container } from "tsyringe";
import { CriarNoticiaUseCase } from "./CriarNoticiaUseCase";

export class CriarNoticiaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const criarNoticiaUseCase = container.resolve(CriarNoticiaUseCase);
    const noticia = await criarNoticiaUseCase.execute(data);

    return response.status(201).json(noticia);
  }
}
