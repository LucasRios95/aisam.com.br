import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { AppError } from "@shared/errors/AppError";

interface IResponse {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    status: string;
    associado: {
        id: string;
        razao_social: string;
    } | null;
    created_at: Date;
}

@injectable()
class GetRecrutadorProfileUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository
    ) {}

    async execute(recrutadorId: string): Promise<IResponse> {
        const recrutador = await this.recrutadorRepository.findById(recrutadorId);

        if (!recrutador) {
            throw new AppError("Recrutador não encontrado!", 404);
        }

        return {
            id: recrutador.id,
            nome: recrutador.nome,
            email: recrutador.email,
            perfil: recrutador.perfil,
            status: recrutador.status,
            associado: recrutador.associado ? {
                id: recrutador.associado.id,
                razao_social: recrutador.associado.razao_social
            } : null,
            created_at: recrutador.created_at
        };
    }
}

export { GetRecrutadorProfileUseCase };
