import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateRecrutadorUseCase } from "./AuthenticateRecrutadorUseCase";

class AuthenticateRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, senha } = request.body;

        const authenticateRecrutadorUseCase = container.resolve(AuthenticateRecrutadorUseCase);

        const result = await authenticateRecrutadorUseCase.execute({
            email,
            senha
        });

        return response.json(result);
    }
}

export { AuthenticateRecrutadorController };
