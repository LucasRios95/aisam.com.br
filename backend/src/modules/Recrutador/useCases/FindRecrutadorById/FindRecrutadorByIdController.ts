import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindRecrutadorByIdUseCase } from "./FindRecrutadorByIdUseCase";

class FindRecrutadorByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const findRecrutadorByIdUseCase = container.resolve(FindRecrutadorByIdUseCase);

        const recrutador = await findRecrutadorByIdUseCase.execute(id);

        return response.json(recrutador);
    }
}

export { FindRecrutadorByIdController };
