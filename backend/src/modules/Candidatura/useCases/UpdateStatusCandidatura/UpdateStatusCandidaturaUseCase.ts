import { inject, injectable } from "tsyringe";
import { ICandidaturaRepository } from "modules/Candidatura/repositories/ICandidaturaRepository";
import { Candidatura, StatusCandidatura } from "modules/Candidatura/infra/typeorm/entities/Candidatura";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    id: string;
    status: StatusCandidatura;
    observacoes_recrutador?: string;
}

@injectable()
class UpdateStatusCandidaturaUseCase {
    constructor(
        @inject("CandidaturaRepository")
        private candidaturaRepository: ICandidaturaRepository
    ) {}

    async execute({ id, status, observacoes_recrutador }: IRequest): Promise<Candidatura> {
        const candidatura = await this.candidaturaRepository.findById(id);

        if (!candidatura) {
            throw new AppError("Candidatura não encontrada!", 404);
        }

        const candidaturaAtualizada = await this.candidaturaRepository.updateStatus({
            id,
            status,
            observacoes_recrutador
        });

        return candidaturaAtualizada;
    }
}

export { UpdateStatusCandidaturaUseCase };
