import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Vaga } from "@modules/Vaga/infra/typeorm/entities/Vaga";

@injectable()
class ListMinhasVagasUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(recrutador_id: string): Promise<Vaga[]> {
        const vagas = await this.vagaRepository.findByRecrutadorId(recrutador_id);
        return vagas;
    }
}

export { ListMinhasVagasUseCase };
