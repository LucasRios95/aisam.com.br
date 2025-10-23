import { inject, injectable } from "tsyringe";
import { IAreaAtuacaoRepository } from "../../repositories/IAreaAtuacaoRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class DeleteAreaAtuacaoUseCase {
    constructor(
        @inject("AreaAtuacaoRepository")
        private areaAtuacaoRepository: IAreaAtuacaoRepository
    ) {}

    async execute(id: string): Promise<void> {
        const area = await this.areaAtuacaoRepository.findById(id);

        if (!area) {
            throw new AppError("Área de atuação não encontrada", 404);
        }

        // Nota: Se houver vagas ou candidatos usando esta área,
        // o banco de dados pode retornar erro de constraint.
        // Considere fazer soft delete (ativo = false) em vez de hard delete.
        await this.areaAtuacaoRepository.delete(id);
    }
}
