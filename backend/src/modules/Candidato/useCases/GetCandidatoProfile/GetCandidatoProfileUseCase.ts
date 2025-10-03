import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "../../repositories/ICandidatoRepository";
import { Candidato } from "../../infra/typeorm/entities/Candidato";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    candidato_id: string;
}

interface IResponse {
    candidato: Candidato;
    dias_restantes: number;
    acesso_ativo: boolean;
}

@injectable()
class GetCandidatoProfileUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) { }

    async execute({ candidato_id }: IRequest): Promise<IResponse> {
        const candidato = await this.candidatoRepository.findById(candidato_id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        const now = new Date();
        const expirationDate = candidato.acesso_expirado || new Date(
            new Date(candidato.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
        );

        const diasRestantes = Math.max(
            0,
            Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        );

        const acesso_ativo = now < expirationDate;

        return {
            candidato,
            dias_restantes: diasRestantes,
            acesso_ativo
        };
    }
}

export { GetCandidatoProfileUseCase };
