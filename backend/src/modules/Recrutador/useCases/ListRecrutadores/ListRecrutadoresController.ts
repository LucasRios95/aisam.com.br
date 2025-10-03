import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListRecrutadoresUseCase } from "./ListRecrutadoresUseCase";

class ListRecrutadoresController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listRecrutadoresUseCase = container.resolve(ListRecrutadoresUseCase);

        const recrutadores = await listRecrutadoresUseCase.execute();

        return response.json(recrutadores);
    }
}

export { ListRecrutadoresController };
