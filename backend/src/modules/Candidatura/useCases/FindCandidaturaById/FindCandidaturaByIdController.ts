import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCandidaturaByIdUseCase } from "./FindCandidaturaByIdUseCase";

class FindCandidaturaByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const findCandidaturaByIdUseCase = container.resolve(FindCandidaturaByIdUseCase);

        const candidatura = await findCandidaturaByIdUseCase.execute(id);

        return response.json(candidatura);
    }
}

export { FindCandidaturaByIdController };
