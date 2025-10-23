import { Request, Response } from "express";
import { container } from "tsyringe";
import { PausarVagaUseCase } from "./PausarVagaUseCase";

class PausarVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const pausarVagaUseCase = container.resolve(PausarVagaUseCase);

        const vaga = await pausarVagaUseCase.execute(id);

        return response.json(vaga);
    }
}

export { PausarVagaController };
