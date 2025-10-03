import { inject, injectable } from "tsyringe";
import { ICandidaturaRepository } from "modules/Candidatura/repositories/ICandidaturaRepository";
import { Candidatura, StatusCandidatura } from "modules/Candidatura/infra/typeorm/entities/Candidatura";

interface IRequest {
    candidato_id?: string;
    vaga_id?: string;
    status?: StatusCandidatura;
    limit?: number;
    offset?: number;
}

@injectable()
class ListCandidaturasUseCase {
    constructor(
        @inject("CandidaturaRepository")
        private candidaturaRepository: ICandidaturaRepository
    ) {}

    async execute(filters: IRequest): Promise<Candidatura[]> {
        const candidaturas = await this.candidaturaRepository.list(filters);
        return candidaturas;
    }
}

export { ListCandidaturasUseCase };
