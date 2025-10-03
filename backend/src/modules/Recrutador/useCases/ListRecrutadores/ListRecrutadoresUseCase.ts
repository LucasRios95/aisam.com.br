import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "modules/Recrutador/repositories/IRecrutadorRepository";
import { Recrutador } from "modules/Recrutador/infra/typeorm/entities/Recrutador";

@injectable()
class ListRecrutadoresUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository
    ) {}

    async execute(): Promise<Recrutador[]> {
        const recrutadores = await this.recrutadorRepository.list();
        return recrutadores;
    }
}

export { ListRecrutadoresUseCase };
