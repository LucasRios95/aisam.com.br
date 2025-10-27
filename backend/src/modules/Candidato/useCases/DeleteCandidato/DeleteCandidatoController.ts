import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCandidatoUseCase } from "./DeleteCandidatoUseCase";

class DeleteCandidatoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteCandidatoUseCase = container.resolve(DeleteCandidatoUseCase);

        await deleteCandidatoUseCase.execute(id);

        return response.status(204).send();
    }
}

export { DeleteCandidatoController };
