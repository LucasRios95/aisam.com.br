import { Request, Response } from "express";
import { container } from "tsyringe";
import { EnviarConviteRecrutadorUseCase } from "./EnviarConviteRecrutadorUseCase";

class EnviarConviteRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { nome, email, associado_id, perfil } = request.body;

        const enviarConviteRecrutadorUseCase = container.resolve(EnviarConviteRecrutadorUseCase);

        const result = await enviarConviteRecrutadorUseCase.execute({
            nome,
            email,
            associado_id,
            perfil
        });

        return response.status(201).json(result);
    }
}

export { EnviarConviteRecrutadorController };
