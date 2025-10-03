import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCandidatoUseCase } from "./CreateCandidatoUseCase";

class CreateCandidatoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date,
            consentimento_dados
        } = request.body;

        const createCandidatoUseCase = container.resolve(CreateCandidatoUseCase);

        const candidato = await createCandidatoUseCase.execute({
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao,
            curriculo_url,
            curriculo_upload_date,
            consentimento_dados
        });

        return response.status(201).json(candidato);
    }
}

export { CreateCandidatoController };
