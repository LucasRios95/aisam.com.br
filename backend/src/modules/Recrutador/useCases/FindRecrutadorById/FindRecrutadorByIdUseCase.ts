import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { Recrutador } from "@modules/Recrutador/infra/typeorm/entities/Recrutador";
import { AppError } from "shared/errors/AppError";

@injectable()
class FindRecrutadorByIdUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository
    ) {}

    async execute(id: string): Promise<Recrutador> {
        const recrutador = await this.recrutadorRepository.findById(id);

        if (!recrutador) {
            throw new AppError("Recrutador não encontrado!", 404);
        }

        return recrutador;
    }
}

export { FindRecrutadorByIdUseCase };
