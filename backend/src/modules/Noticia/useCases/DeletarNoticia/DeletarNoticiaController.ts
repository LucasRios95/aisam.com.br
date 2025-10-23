import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeletarNoticiaUseCase } from "./DeletarNoticiaUseCase";

export class DeletarNoticiaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deletarNoticiaUseCase = container.resolve(DeletarNoticiaUseCase);
    await deletarNoticiaUseCase.execute(id);

    return response.status(204).send();
  }
}
