import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListVagasUseCase } from "./ListVagasUseCase";
import { VagaSerializer } from "../../utils/VagaSerializer";

class ListVagasController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { areas_atuacao, senioridade, regime, localidade, status, limit, offset } = request.query;

        const listVagasUseCase = container.resolve(ListVagasUseCase);

        const vagas = await listVagasUseCase.execute({
            areas_atuacao: areas_atuacao ? (areas_atuacao as string).split(',') : undefined,
            senioridade: senioridade as any,
            regime: regime as any,
            localidade: localidade as string,
            status: status as any,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined
        });

        // Se o usuário estiver autenticado, incluir mais detalhes
        const isAuthenticated = !!request.user;
        const serializedVagas = VagaSerializer.serializeList(vagas, isAuthenticated);

        return response.json(serializedVagas);
    }
}

export { ListVagasController };
