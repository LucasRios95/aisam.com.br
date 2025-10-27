import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateVagaUseCase } from "./CreateVagaUseCase";

class CreateVagaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            titulo,
            descricao,
            senioridade,
            areas_atuacao,
            regime,
            localidade,
            email_contato,
            empresa_anonima
        } = request.body;

        // Pega o recrutador_id do usuário autenticado
        const recrutador_id = request.user.id;

        const createVagaUseCase = container.resolve(CreateVagaUseCase);

        const vaga = await createVagaUseCase.execute({
            titulo,
            descricao,
            senioridade,
            areas_atuacao,
            regime,
            localidade,
            email_contato,
            empresa_anonima,
            recrutador_id
        });

        return response.status(201).json(vaga);
    }
}

export { CreateVagaController };
