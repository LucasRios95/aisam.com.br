import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCandidaturaUseCase } from "./DeleteCandidaturaUseCase";

class DeleteCandidaturaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteCandidaturaUseCase = container.resolve(DeleteCandidaturaUseCase);

        await deleteCandidaturaUseCase.execute(id);

        return response.status(204).send();
    }
}

export { DeleteCandidaturaController };
