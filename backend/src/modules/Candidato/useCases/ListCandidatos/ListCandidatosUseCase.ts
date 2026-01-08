import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { Candidato } from "@modules/Candidato/infra/typeorm/entities/Candidato";

interface IRequest {
    limit?: number;
    offset?: number;
    areas_atuacao?: string[];
}

@injectable()
class ListCandidatosUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) {}

    async execute({ limit, offset, areas_atuacao }: IRequest): Promise<Candidato[]> {
        let candidatos: Candidato[];

        if (areas_atuacao && areas_atuacao.length > 0) {
            candidatos = await this.candidatoRepository.findByAreasAtuacao(areas_atuacao);
        } else {
            candidatos = await this.candidatoRepository.list(limit, offset);
        }

        return candidatos;
    }
}

export { ListCandidatosUseCase };
