import { inject, injectable } from "tsyringe";
import { ICandidaturaRepository } from "modules/Candidatura/repositories/ICandidaturaRepository";
import { Candidatura } from "modules/Candidatura/infra/typeorm/entities/Candidatura";
import { AppError } from "shared/errors/AppError";

@injectable()
class FindCandidaturaByIdUseCase {
    constructor(
        @inject("CandidaturaRepository")
        private candidaturaRepository: ICandidaturaRepository
    ) {}

    async execute(id: string): Promise<Candidatura> {
        const candidatura = await this.candidaturaRepository.findById(id);

        if (!candidatura) {
            throw new AppError("Candidatura não encontrada!", 404);
        }

        return candidatura;
    }
}

export { FindCandidaturaByIdUseCase };
