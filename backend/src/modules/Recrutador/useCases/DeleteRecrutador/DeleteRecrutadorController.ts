import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteRecrutadorUseCase } from "./DeleteRecrutadorUseCase";

class DeleteRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteRecrutadorUseCase = container.resolve(DeleteRecrutadorUseCase);

        await deleteRecrutadorUseCase.execute(id);

        return response.status(204).send();
    }
}

export { DeleteRecrutadorController };
