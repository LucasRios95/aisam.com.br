import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCandidatoUseCase } from "./UpdateCandidatoUseCase";

class UpdateCandidatoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const {
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date
        } = request.body;

        const updateCandidatoUseCase = container.resolve(UpdateCandidatoUseCase);

        const candidato = await updateCandidatoUseCase.execute({
            id,
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date
        });

        return response.json(candidato);
    }
}

export { UpdateCandidatoController };
