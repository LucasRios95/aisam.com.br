import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAdminAisamUseCase } from "./CreateAdminAisamUseCase";

class CreateAdminAisamController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { nome, email, senha, mfa_enabled } = request.body;

        const createAdminAisamUseCase = container.resolve(CreateAdminAisamUseCase);

        const adminAisam = await createAdminAisamUseCase.execute({
            nome,
            email,
            senha,
            mfa_enabled,
        });

        return response.status(201).json(adminAisam);

    }
}

export { CreateAdminAisamController };