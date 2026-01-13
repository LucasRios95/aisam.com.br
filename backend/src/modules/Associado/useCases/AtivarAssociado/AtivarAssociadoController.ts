import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAssociadoUseCase } from "../UpdateAssociado/UpdateAssociadoUseCase";
import { StatusAssociado } from "../../infra/typeorm/entities/Associado";

class AtivarAssociadoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const updateAssociadoUseCase = container.resolve(UpdateAssociadoUseCase);

        const associado = await updateAssociadoUseCase.execute({
            id,
            status: StatusAssociado.ATIVO
        });

        return response.json(associado);
    }
}

export { AtivarAssociadoController };
