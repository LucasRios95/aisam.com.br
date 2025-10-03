import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindVagaByIdUseCase } from "./FindVagaByIdUseCase";

class FindVagaByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const findVagaByIdUseCase = container.resolve(FindVagaByIdUseCase);

        const vaga = await findVagaByIdUseCase.execute(id);

        return response.json(vaga);
    }
}

export { FindVagaByIdController };
