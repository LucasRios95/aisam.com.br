import { Request, Response } from "express";
import { container } from "tsyringe";
import { ArquivarVagaUseCase } from "./ArquivarVagaUseCase";

class ArquivarVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const arquivarVagaUseCase = container.resolve(ArquivarVagaUseCase);

        const vaga = await arquivarVagaUseCase.execute(id);

        return response.json(vaga);
    }
}

export { ArquivarVagaController };
