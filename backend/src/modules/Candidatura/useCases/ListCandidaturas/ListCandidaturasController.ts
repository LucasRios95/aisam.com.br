import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCandidaturasUseCase } from "./ListCandidaturasUseCase";

class ListCandidaturasController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { candidato_id, vaga_id, status, limit, offset } = request.query;

        const listCandidaturasUseCase = container.resolve(ListCandidaturasUseCase);

        const candidaturas = await listCandidaturasUseCase.execute({
            candidato_id: candidato_id as string,
            vaga_id: vaga_id as string,
            status: status as any,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined
        });

        return response.json(candidaturas);
    }
}

export { ListCandidaturasController };
