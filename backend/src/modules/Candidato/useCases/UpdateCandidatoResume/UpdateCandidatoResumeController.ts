import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCandidatoResumeUseCase } from "./UpdateCandidatoResumeUseCase";

class UpdateCandidatoResumeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { user_id } = request;
        const { nome, email, telefone, cidade, estado, resumo_curriculo, areas_atuacao } = request.body;

        const updateCandidatoResumeUseCase = container.resolve(UpdateCandidatoResumeUseCase);

        await updateCandidatoResumeUseCase.execute({
            candidatoId: user_id,
            nome,
            email,
            telefone,
            cidade,
            estado,
            resumo_curriculo,
            areas_atuacao
        });

        return response.status(200).json({
            message: "Currículo atualizado com sucesso"
        });
    }
}

export { UpdateCandidatoResumeController };
