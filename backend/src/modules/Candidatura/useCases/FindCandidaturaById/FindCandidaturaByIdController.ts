import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "shared/errors/AppError";
import { FindCandidaturaByIdUseCase } from "./FindCandidaturaByIdUseCase";

class FindCandidaturaByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { user } = request;

        const findCandidaturaByIdUseCase = container.resolve(FindCandidaturaByIdUseCase);

        const candidatura = await findCandidaturaByIdUseCase.execute(id);

        // CRÍTICO: Recrutadores só podem acessar candidaturas das vagas que ELE cadastrou
        if (user.papel === 'RECRUTADOR') {
            if (candidatura.vaga.recrutador_id !== user.id) {
                throw new AppError("Você não tem permissão para acessar esta candidatura", 403);
            }
        }

        // Verificação de autorização para CANDIDATO
        if (user.papel === 'CANDIDATO' && candidatura.candidato_id !== user.id) {
            throw new AppError("Você não tem permissão para acessar esta candidatura", 403);
        }

        return response.json(candidatura);
    }
}

export { FindCandidaturaByIdController };
