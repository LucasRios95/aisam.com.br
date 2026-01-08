import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Vaga, StatusVaga } from "@modules/Vaga/infra/typeorm/entities/Vaga";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ArquivarVagaUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(id: string): Promise<Vaga> {
        const vaga = await this.vagaRepository.findById(id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        const vagaArquivada = await this.vagaRepository.update({
            id,
            status: StatusVaga.ARQUIVADA
        });

        return vagaArquivada;
    }
}

export { ArquivarVagaUseCase };
