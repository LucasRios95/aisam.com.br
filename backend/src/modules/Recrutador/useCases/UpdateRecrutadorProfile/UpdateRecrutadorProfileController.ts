import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateRecrutadorProfileUseCase } from "./UpdateRecrutadorProfileUseCase";

class UpdateRecrutadorProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: recrutadorId } = request.user;
        const { nome, senha_atual, nova_senha } = request.body;

        const updateRecrutadorProfileUseCase = container.resolve(UpdateRecrutadorProfileUseCase);

        const recrutador = await updateRecrutadorProfileUseCase.execute({
            recrutadorId,
            nome,
            senha_atual,
            nova_senha
        });

        return response.json(recrutador);
    }
}

export { UpdateRecrutadorProfileController };