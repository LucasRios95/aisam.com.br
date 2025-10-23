import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListarNoticiasUseCase } from "./ListarNoticiasUseCase";

export class ListarNoticiasController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { publicada, destaque, tags, busca } = request.query;

    const filtros = {
      publicada: publicada === "true" ? true : publicada === "false" ? false : undefined,
      destaque: destaque === "true" ? true : destaque === "false" ? false : undefined,
      tags: tags ? (tags as string).split(",") : undefined,
      busca: busca as string,
    };

    const listarNoticiasUseCase = container.resolve(ListarNoticiasUseCase);
    const noticias = await listarNoticiasUseCase.execute(filtros);

    return response.json(noticias);
  }
}
