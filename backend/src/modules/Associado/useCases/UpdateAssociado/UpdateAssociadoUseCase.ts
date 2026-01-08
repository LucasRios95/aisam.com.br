import { inject, injectable } from "tsyringe";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";
import { Associado, StatusAssociado } from "@modules/Associado/infra/typeorm/entities/Associado";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    id: string;
    razao_social?: string;
    nome_fantasia?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    status?: StatusAssociado;
}

@injectable()
class UpdateAssociadoUseCase {
    constructor(
        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository
    ) {}

    async execute({
        id,
        razao_social,
        nome_fantasia,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        status,
    }: IRequest): Promise<Associado> {
        const associado = await this.associadoRepository.findById(id);

        if (!associado) {
            throw new AppError("Associado não encontrado", 404);
        }

        const associadoAtualizado = await this.associadoRepository.update({
            id,
            razao_social,
            nome_fantasia,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            status,
        });

        return associadoAtualizado;
    }
}

export { UpdateAssociadoUseCase };
