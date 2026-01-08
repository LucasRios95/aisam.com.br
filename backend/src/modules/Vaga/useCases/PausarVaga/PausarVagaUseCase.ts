import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Vaga, StatusVaga } from "@modules/Vaga/infra/typeorm/entities/Vaga";
import { AppError } from "@shared/errors/AppError";

@injectable()
class PausarVagaUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(id: string): Promise<Vaga> {
        const vaga = await this.vagaRepository.findById(id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        if (vaga.status !== StatusVaga.ABERTA) {
            throw new AppError("Apenas vagas abertas podem ser pausadas!", 400);
        }

        const vagaPausada = await this.vagaRepository.update({
            id,
            status: StatusVaga.PAUSADA
        });

        return vagaPausada;
    }
}

export { PausarVagaUseCase };
