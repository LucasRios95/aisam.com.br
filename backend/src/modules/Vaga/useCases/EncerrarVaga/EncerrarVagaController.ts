import { Request, Response } from "express";
import { container } from "tsyringe";
import { EncerrarVagaUseCase } from "./EncerrarVagaUseCase";

class EncerrarVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const encerrarVagaUseCase = container.resolve(EncerrarVagaUseCase);

        const vaga = await encerrarVagaUseCase.execute(id);

        return response.json(vaga);
    }
}

export { EncerrarVagaController };
