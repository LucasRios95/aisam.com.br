import { Request, Response } from "express";
import { container } from "tsyringe";
import { BuscarNoticiaUseCase } from "./BuscarNoticiaUseCase";

export class BuscarNoticiaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { identificador } = request.params;
    const { tipo } = request.query; // 'slug' ou 'id'

    const buscarNoticiaUseCase = container.resolve(BuscarNoticiaUseCase);
    const noticia = await buscarNoticiaUseCase.execute(
      identificador,
      tipo === "slug"
    );

    return response.json(noticia);
  }
}
