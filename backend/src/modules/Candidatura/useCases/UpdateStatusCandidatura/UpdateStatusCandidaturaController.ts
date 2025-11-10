import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "shared/errors/AppError";
import { UpdateStatusCandidaturaUseCase } from "./UpdateStatusCandidaturaUseCase";
import { ICandidaturaRepository } from "modules/Candidatura/repositories/ICandidaturaRepository";

class UpdateStatusCandidaturaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { status, observacoes_recrutador } = request.body;
        const { user } = request;

        // CRÍTICO: Recrutadores só podem atualizar candidaturas das vagas que ELE cadastrou
        if (user.papel === 'RECRUTADOR') {
            const candidaturaRepository = container.resolve<ICandidaturaRepository>("CandidaturaRepository");
            const candidatura = await candidaturaRepository.findById(id);

            if (!candidatura) {
                throw new AppError("Candidatura não encontrada!", 404);
            }

            if (candidatura.vaga.recrutador_id !== user.id) {
                throw new AppError("Você não tem permissão para atualizar o status desta candidatura", 403);
            }
        }

        const updateStatusCandidaturaUseCase = container.resolve(UpdateStatusCandidaturaUseCase);

        const candidatura = await updateStatusCandidaturaUseCase.execute({
            id,
            status,
            observacoes_recrutador
        });

        return response.json(candidatura);
    }
}

export { UpdateStatusCandidaturaController };
