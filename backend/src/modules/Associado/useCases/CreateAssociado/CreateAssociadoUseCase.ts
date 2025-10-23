import { inject, injectable } from "tsyringe";
import { IAssociadoRepository } from "modules/Associado/repositories/IAssociadoRepository";
import { Associado, StatusAssociado } from "modules/Associado/infra/typeorm/entities/Associado";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    razao_social: string;
    nome_fantasia?: string;
    cnpj: string;
    email: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
}

@injectable()
class CreateAssociadoUseCase {
    constructor(
        @inject("AssociadoRepository")
        private associadoRepository: IAssociadoRepository
    ) {}

    async execute({
        razao_social,
        nome_fantasia,
        cnpj,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
    }: IRequest): Promise<Associado> {
        // Verificar se já existe associado com este CNPJ
        const associadoExists = await this.associadoRepository.findByCnpj(cnpj);

        if (associadoExists) {
            throw new AppError("Já existe um associado com este CNPJ", 400);
        }

        const associado = await this.associadoRepository.create({
            razao_social,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            status: StatusAssociado.ATIVO,
            created_at: new Date(),
        });

        return associado;
    }
}

export { CreateAssociadoUseCase };
