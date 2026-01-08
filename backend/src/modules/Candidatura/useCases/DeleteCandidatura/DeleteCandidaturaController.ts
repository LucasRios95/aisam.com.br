import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { DeleteCandidaturaUseCase } from "./DeleteCandidaturaUseCase";
import { ICandidaturaRepository } from "@modules/Candidatura/repositories/ICandidaturaRepository";

class DeleteCandidaturaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { user } = request;

        // Verificação de autorização
        const candidaturaRepository = container.resolve<ICandidaturaRepository>("CandidaturaRepository");
        const candidatura = await candidaturaRepository.findById(id);

        if (!candidatura) {
            throw new AppError("Candidatura não encontrada!", 404);
        }

        // Apenas o próprio candidato ou admin podem deletar
        if (user.papel === 'CANDIDATO' && candidatura.candidato_id !== user.id) {
            throw new AppError("Você não tem permissão para deletar esta candidatura", 403);
        }

        // CRÍTICO: Recrutadores só podem deletar candidaturas das vagas que ELE cadastrou
        if (user.papel === 'RECRUTADOR') {
            if (candidatura.vaga.recrutador_id !== user.id) {
                throw new AppError("Você não tem permissão para deletar esta candidatura", 403);
            }
        }

        const deleteCandidaturaUseCase = container.resolve(DeleteCandidaturaUseCase);

        await deleteCandidaturaUseCase.execute(id);

        return response.status(204).send();
    }
}

export { DeleteCandidaturaController };
