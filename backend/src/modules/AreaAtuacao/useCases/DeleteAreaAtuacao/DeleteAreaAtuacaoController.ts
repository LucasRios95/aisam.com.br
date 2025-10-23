import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteAreaAtuacaoUseCase } from "./DeleteAreaAtuacaoUseCase";

export class DeleteAreaAtuacaoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteAreaAtuacaoUseCase = container.resolve(DeleteAreaAtuacaoUseCase);

        await deleteAreaAtuacaoUseCase.execute(id);

        return response.status(204).send();
    }
}
