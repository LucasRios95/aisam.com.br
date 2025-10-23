import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "modules/Vaga/repositories/IVagaRepository";
import { AppError } from "shared/errors/AppError";

@injectable()
class DeleteVagaUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(id: string): Promise<void> {
        const vaga = await this.vagaRepository.findById(id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        await this.vagaRepository.delete(id);
    }
}

export { DeleteVagaUseCase };
