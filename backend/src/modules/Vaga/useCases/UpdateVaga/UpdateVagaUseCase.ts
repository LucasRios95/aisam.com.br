import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "modules/Vaga/repositories/IVagaRepository";
import { Vaga, RegimeTrabalho, Senioridade, StatusVaga } from "modules/Vaga/infra/typeorm/entities/Vaga";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    id: string;
    titulo?: string;
    descricao?: string;
    senioridade?: Senioridade;
    areas_atuacao?: string[];
    regime?: RegimeTrabalho;
    localidade?: string;
    email_contato?: string;
    empresa_anonima?: boolean;
    status?: StatusVaga;
}

@injectable()
class UpdateVagaUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository
    ) {}

    async execute(data: IRequest): Promise<Vaga> {
        const vaga = await this.vagaRepository.findById(data.id);

        if (!vaga) {
            throw new AppError("Vaga não encontrada!", 404);
        }

        const vagaUpdated = await this.vagaRepository.update(data);

        return vagaUpdated;
    }
}

export { UpdateVagaUseCase };
