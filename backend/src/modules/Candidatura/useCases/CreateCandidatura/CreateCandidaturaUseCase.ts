import { inject, injectable } from "tsyringe";
import { ICandidaturaRepository } from "@modules/Candidatura/repositories/ICandidaturaRepository";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Candidatura } from "@modules/Candidatura/infra/typeorm/entities/Candidatura";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    candidato_id: string;
    vaga_id: string;
    mensagem?: string;
}

@injectable()
class CreateCandidaturaUseCase {
    constructor(
        @inject("CandidaturaRepository")
        private candidaturaRepository: ICandidaturaRepository,
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository,
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute({ candidato_id, vaga_id, mensagem }: IRequest): Promise<Candidatura> {
        const candidato = await this.candidatoRepository.findById(candidato_id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado!", 404);
        }

        const vaga = await this.vagaRepository.findById(vaga_id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        // Verifica se já existe candidatura do candidato para essa vaga
        const candidaturaExistente = await this.candidaturaRepository.findByCandidatoAndVaga(
            candidato_id,
            vaga_id
        );

        if (candidaturaExistente) {
            throw new AppError("Candidato já se candidatou para esta vaga!", 400);
        }

        const candidatura = await this.candidaturaRepository.create({
            candidato_id,
            vaga_id,
            mensagem
        });

        return candidatura;
    }
}

export { CreateCandidaturaUseCase };
