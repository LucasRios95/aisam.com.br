import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class DeleteCandidatoUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) {}

    async execute(id: string): Promise<void> {
        const candidato = await this.candidatoRepository.findById(id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado", 404);
        }

        await this.candidatoRepository.delete(id);
    }
}

export { DeleteCandidatoUseCase };
