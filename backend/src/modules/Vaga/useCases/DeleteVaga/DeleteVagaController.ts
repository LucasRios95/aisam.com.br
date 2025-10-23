import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteVagaUseCase } from "./DeleteVagaUseCase";

class DeleteVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteVagaUseCase = container.resolve(DeleteVagaUseCase);

        await deleteVagaUseCase.execute(id);

        return response.status(204).send();
    }
}

export { DeleteVagaController };
