import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "modules/Recrutador/repositories/IRecrutadorRepository";
import { Recrutador, PerfilRecrutador, StatusRecrutador } from "modules/Recrutador/infra/typeorm/entities/Recrutador";
import { AppError } from "shared/errors/AppError";
import { IAssociadoRepository } from "modules/Associado/repositories/IAssociadoRepository";
import { IHashProvider } from "shared/container/providers/HashProvider/IHashProvider";

interface IRequest {
    nome: string;
    email: string;
    senha: string;
    perfil?: PerfilRecrutador;
    status?: StatusRecrutador;
    associado_id?: string;
}

@injectable()
class CreateRecrutadorUseCase {
    constructor(
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,

        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) {}

    async execute({
        nome,
        email,
        senha,
        perfil,
        status,
        associado_id
    }: IRequest): Promise<Recrutador> {
        const recrutadorAlreadyExists = await this.recrutadorRepository.findByEmail(email);

        if (recrutadorAlreadyExists) {
            throw new AppError("Recrutador já existe com este email!", 400);
        }

        if (associado_id) {
            const associado = await this.associadoRepository.findById(associado_id);
            if (!associado) {
                throw new AppError("Associado não encontrado!", 404);
            }
        }

        const senhaHash = await this.hashProvider.generateHash(senha);

        const recrutador = await this.recrutadorRepository.create({
            nome,
            email,
            senha: senhaHash,
            perfil: perfil || PerfilRecrutador.RECRUTADOR,
            status: status || StatusRecrutador.ATIVO,
            associado_id
        });

        return recrutador;
    }
}

export { CreateRecrutadorUseCase };
