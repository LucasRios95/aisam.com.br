import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { Vaga } from "@modules/Vaga/infra/typeorm/entities/Vaga";
import { IFilterVagasDTO } from "@modules/Vaga/dtos/IFilterVagasDTO";

@injectable()
class ListVagasUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(filters?: IFilterVagasDTO): Promise<Vaga[]> {
        const vagas = await this.vagaRepository.list(filters);
        return vagas;
    }
}

export { ListVagasUseCase };
