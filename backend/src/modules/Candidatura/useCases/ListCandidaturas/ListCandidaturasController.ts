import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCandidaturasUseCase } from "./ListCandidaturasUseCase";

class ListCandidaturasController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { candidato_id, vaga_id, status, limit, offset } = request.query;
        const { user } = request;

        const listCandidaturasUseCase = container.resolve(ListCandidaturasUseCase);

        // Se o usuário é RECRUTADOR, filtra apenas candidaturas de suas vagas
        const filters: any = {
            candidato_id: candidato_id as string,
            vaga_id: vaga_id as string,
            status: status as any,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined
        };

        // CRÍTICO: Recrutadores só podem ver candidaturas das vagas que ELE cadastrou
        if (user.papel === 'RECRUTADOR') {
            // SEMPRE filtra por recrutador_id para garantir que só vê suas próprias vagas
            filters.recrutador_id = user.id;
        }

        // Se for candidato, força o filtro por suas candidaturas
        if (user.papel === 'CANDIDATO') {
            filters.candidato_id = user.id;
        }

        const candidaturas = await listCandidaturasUseCase.execute(filters);

        return response.json(candidaturas);
    }
}

export { ListCandidaturasController };
