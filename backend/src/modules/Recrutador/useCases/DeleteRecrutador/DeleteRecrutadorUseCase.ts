import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class DeleteRecrutadorUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository
    ) {}

    async execute(id: string): Promise<void> {
        const recrutador = await this.recrutadorRepository.findById(id);

        if (!recrutador) {
            throw new AppError("Recrutador não encontrado!", 404);
        }

        await this.recrutadorRepository.delete(id);
    }
}

export { DeleteRecrutadorUseCase };
