import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateRecrutadorUseCase } from "./CreateRecrutadorUseCase";

class CreateRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { nome, email, senha, perfil, status, associado_id } = request.body;

        const createRecrutadorUseCase = container.resolve(CreateRecrutadorUseCase);

        const recrutador = await createRecrutadorUseCase.execute({
            nome,
            email,
            senha,
            perfil,
            status,
            associado_id
        });

        return response.status(201).json(recrutador);
    }
}

export { CreateRecrutadorController };
