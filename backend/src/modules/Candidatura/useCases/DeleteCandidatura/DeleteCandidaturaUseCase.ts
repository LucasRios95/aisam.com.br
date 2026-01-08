import { inject, injectable } from "tsyringe";
import { ICandidaturaRepository } from "@modules/Candidatura/repositories/ICandidaturaRepository";
import { AppError } from "shared/errors/AppError";

@injectable()
class DeleteCandidaturaUseCase {
    constructor(
        @inject("CandidaturaRepository")
        private candidaturaRepository: ICandidaturaRepository
    ) {}

    async execute(id: string): Promise<void> {
        const candidatura = await this.candidaturaRepository.findById(id);

        if (!candidatura) {
            throw new AppError("Candidatura não encontrada!", 404);
        }

        await this.candidaturaRepository.delete(id);
    }
}

export { DeleteCandidaturaUseCase };
