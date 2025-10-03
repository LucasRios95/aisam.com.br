import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateVagaUseCase } from "./UpdateVagaUseCase";

class UpdateVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const {
            titulo,
            descricao,
            senioridade,
            areas_atuacao,
            regime,
            localidade,
            email_contato,
            empresa_anonima,
            status
        } = request.body;

        const updateVagaUseCase = container.resolve(UpdateVagaUseCase);

        const vaga = await updateVagaUseCase.execute({
            id,
            titulo,
            descricao,
            senioridade,
            areas_atuacao,
            regime,
            localidade,
            email_contato,
            empresa_anonima,
            status
        });

        return response.json(vaga);
    }
}

export { UpdateVagaController };
