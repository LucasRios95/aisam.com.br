import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateRecrutadorUseCase } from "../UpdateRecrutador/UpdateRecrutadorUseCase";
import { StatusRecrutador } from "../../infra/typeorm/entities/Recrutador";

class AtivarRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const updateRecrutadorUseCase = container.resolve(UpdateRecrutadorUseCase);

        const recrutador = await updateRecrutadorUseCase.execute({
            id,
            status: StatusRecrutador.ATIVO
        });

        return response.json(recrutador);
    }
}

export { AtivarRecrutadorController };
