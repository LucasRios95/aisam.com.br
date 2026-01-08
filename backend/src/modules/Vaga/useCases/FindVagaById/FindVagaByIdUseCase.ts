import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Vaga } from "@modules/Vaga/infra/typeorm/entities/Vaga";
import { AppError } from "@shared/errors/AppError";

@injectable()
class FindVagaByIdUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(id: string): Promise<Vaga> {
        const vaga = await this.vagaRepository.findById(id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        // Se a vaga é anônima, mascarar dados da empresa
        if (vaga.empresa_anonima) {
            vaga.associado = null;
        }

        return vaga;
    }
}

export { FindVagaByIdUseCase };
