import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReabrirVagaUseCase } from "./ReabrirVagaUseCase";

class ReabrirVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const reabrirVagaUseCase = container.resolve(ReabrirVagaUseCase);

        const vaga = await reabrirVagaUseCase.execute(id);

        return response.json(vaga);
    }
}

export { ReabrirVagaController };
