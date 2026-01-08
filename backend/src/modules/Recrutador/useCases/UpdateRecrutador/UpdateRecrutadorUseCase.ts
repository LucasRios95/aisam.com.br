import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { Recrutador, PerfilRecrutador, StatusRecrutador } from "@modules/Recrutador/infra/typeorm/entities/Recrutador";
import { AppError } from "shared/errors/AppError";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";

interface IRequest {
    id: string;
    nome?: string;
    email?: string;
    perfil?: PerfilRecrutador;
    status?: StatusRecrutador;
    associado_id?: string;
}

@injectable()
class UpdateRecrutadorUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,
        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository
    ) {}

    async execute({
        id,
        nome,
        email,
        perfil,
        status,
        associado_id
    }: IRequest): Promise<Recrutador> {
        const recrutador = await this.recrutadorRepository.findById(id);

        if (!recrutador) {
            throw new AppError("Recrutador não encontrado!", 404);
        }

        if (email && email !== recrutador.email) {
            const recrutadorWithEmail = await this.recrutadorRepository.findByEmail(email);
            if (recrutadorWithEmail) {
                throw new AppError("Já existe um recrutador com este email!", 400);
            }
        }

        if (associado_id && associado_id !== recrutador.associado_id) {
            const associado = await this.associadoRepository.findById(associado_id);
            if (!associado) {
                throw new AppError("Associado não encontrado!", 404);
            }
        }

        const recrutadorUpdated = await this.recrutadorRepository.update({
            id,
            nome,
            email,
            perfil,
            status,
            associado_id
        });

        return recrutadorUpdated;
    }
}

export { UpdateRecrutadorUseCase };
