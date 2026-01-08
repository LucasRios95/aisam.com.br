import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Vaga, StatusVaga } from "@modules/Vaga/infra/typeorm/entities/Vaga";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ReabrirVagaUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(id: string): Promise<Vaga> {
        const vaga = await this.vagaRepository.findById(id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        if (vaga.status !== StatusVaga.PAUSADA && vaga.status !== StatusVaga.ARQUIVADA) {
            throw new AppError("Apenas vagas pausadas ou arquivadas podem ser reabertas!", 400);
        }

        const vagaReaberta = await this.vagaRepository.update({
            id,
            status: StatusVaga.ABERTA
        });

        return vagaReaberta;
    }
}

export { ReabrirVagaUseCase };
