import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateAdminUseCase } from "./AuthenticateAdminUseCase";

class AuthenticateAdminController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, senha } = request.body;

        const authenticateAdminUseCase = container.resolve(AuthenticateAdminUseCase);

        const result = await authenticateAdminUseCase.execute({
            email,
            senha
        });

        return response.json(result);
    }
}

export { AuthenticateAdminController };
