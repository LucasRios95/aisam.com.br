import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCandidaturaUseCase } from "./CreateCandidaturaUseCase";

class CreateCandidaturaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { candidato_id, vaga_id, mensagem } = request.body;

        const createCandidaturaUseCase = container.resolve(CreateCandidaturaUseCase);

        const candidatura = await createCandidaturaUseCase.execute({
            candidato_id,
            vaga_id,
            mensagem
        });

        return response.status(201).json(candidatura);
    }
}

export { CreateCandidaturaController };
