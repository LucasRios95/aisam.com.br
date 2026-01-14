import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAdminProfileUseCase } from "./UpdateAdminProfileUseCase";

class UpdateAdminProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: adminId } = request.user;
        const { nome, senha_atual, nova_senha } = request.body;

        const updateAdminProfileUseCase = container.resolve(UpdateAdminProfileUseCase);

        const admin = await updateAdminProfileUseCase.execute({
            adminId,
            nome,
            senha_atual,
            nova_senha
        });

        return response.json(admin);
    }
}

export { UpdateAdminProfileController };
