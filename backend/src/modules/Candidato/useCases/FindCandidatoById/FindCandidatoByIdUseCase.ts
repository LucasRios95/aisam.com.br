import { inject, injectable } from "tsyringe";
import { ICandidatoRepository } from "modules/Candidato/repositories/ICandidatoRepository";
import { Candidato } from "modules/Candidato/infra/typeorm/entities/Candidato";
import { AppError } from "shared/errors/AppError";

@injectable()
class FindCandidatoByIdUseCase {
    constructor(
        @inject("CandidatoRepository")
        private candidatoRepository: ICandidatoRepository
    ) {}

    async execute(id: string): Promise<Candidato> {
        const candidato = await this.candidatoRepository.findById(id);

        if (!candidato) {
            throw new AppError("Candidato não encontrado!", 404);
        }

        return candidato;
    }
}

export { FindCandidatoByIdUseCase };
