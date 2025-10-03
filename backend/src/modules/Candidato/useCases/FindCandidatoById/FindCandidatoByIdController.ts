import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCandidatoByIdUseCase } from "./FindCandidatoByIdUseCase";

class FindCandidatoByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const findCandidatoByIdUseCase = container.resolve(FindCandidatoByIdUseCase);

        const candidato = await findCandidatoByIdUseCase.execute(id);

        return response.json(candidato);
    }
}

export { FindCandidatoByIdController };
