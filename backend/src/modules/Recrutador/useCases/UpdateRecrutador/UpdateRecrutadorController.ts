import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateRecrutadorUseCase } from "./UpdateRecrutadorUseCase";

class UpdateRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { nome, email, perfil, status, associado_id } = request.body;

        const updateRecrutadorUseCase = container.resolve(UpdateRecrutadorUseCase);

        const recrutador = await updateRecrutadorUseCase.execute({
            id,
            nome,
            email,
            perfil,
            status,
            associado_id
        });

        return response.json(recrutador);
    }
}

export { UpdateRecrutadorController };
