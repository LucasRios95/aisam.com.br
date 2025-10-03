import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCandidatosUseCase } from "./ListCandidatosUseCase";

class ListCandidatosController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { limit, offset, areas_atuacao } = request.query;

        const listCandidatosUseCase = container.resolve(ListCandidatosUseCase);

        const candidatos = await listCandidatosUseCase.execute({
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            areas_atuacao: areas_atuacao ? (areas_atuacao as string).split(',') : undefined
        });

        return response.json(candidatos);
    }
}

export { ListCandidatosController };
