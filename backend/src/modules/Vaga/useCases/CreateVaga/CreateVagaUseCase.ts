import { inject, injectable } from "tsyringe";
import { IVagaRepository } from "modules/Vaga/repositories/IVagaRepository";
import { Vaga, RegimeTrabalho, Senioridade, StatusVaga } from "modules/Vaga/infra/typeorm/entities/Vaga";
import { AppError } from "shared/errors/AppError";
import { IRecrutadorRepository } from "modules/Recrutador/repositories/IRecrutadorRepository";
import { IAssociadoRepository } from "modules/Associado/repositories/IAssociadoRepository";

interface IRequest {
    titulo: string;
    descricao: string;
    senioridade: Senioridade;
    areas_atuacao: string[];
    regime: RegimeTrabalho;
    localidade?: string;
    email_contato: string;
    empresa_anonima?: boolean;
    recrutador_id: string;
    associado_id: string;
}

@injectable()
class CreateVagaUseCase {
    constructor(
        @inject("VagaRepository")
        private vagaRepository: IVagaRepository,
        @inject("RecrutadorRepository")
        private recrutadorRepository: IRecrutadorRepository,
        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository
    ) {}

    async execute({
        titulo,
        descricao,
        senioridade,
        areas_atuacao,
        regime,
        localidade,
        email_contato,
        empresa_anonima,
        recrutador_id,
        associado_id
    }: IRequest): Promise<Vaga> {
        const recrutador = await this.recrutadorRepository.findById(recrutador_id);
        if (!recrutador) {
            throw new AppError("Recrutador não encontrado!", 404);
        }

        const associado = await this.associadoRepository.findById(associado_id);
        if (!associado) {
            throw new AppError("Associado não encontrado!", 404);
        }

        const vaga = await this.vagaRepository.create({
            titulo,
            descricao,
            senioridade,
            areas_atuacao,
            regime,
            localidade,
            email_contato,
            empresa_anonima: empresa_anonima || false,
            status: StatusVaga.ABERTA,
            recrutador_id,
            associado_id
        });

        return vaga;
    }
}

export { CreateVagaUseCase };
