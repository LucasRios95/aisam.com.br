import { Associado } from "@modules/Associado/infra/typeorm/entities/Associado";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";
import { AppError } from "shared/errors/AppError";
import { inject, injectable } from "tsyringe";


@injectable()
class ListAssociadosUseCase {
    constructor(
        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository
    ) { }

    async execute(): Promise<Associado[]> {
        const associados = await this.associadoRepository.list();

        if (!associados) {
            throw new AppError("Nenhum associado encontrado!", 404);
        }

        return associados;
    }
}

export { ListAssociadosUseCase }