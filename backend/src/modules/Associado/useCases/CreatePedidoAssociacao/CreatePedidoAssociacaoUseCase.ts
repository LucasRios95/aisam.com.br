import { inject, injectable } from "tsyringe";
import { IPedidoAssociacaoRepository } from "@modules/Associado/repositories/IPedidoAssociacaoRepository";
import { Pedido_Associacao, Status } from "@modules/Associado/infra/typeorm/entities/Pedido_Associado";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    razao_social: string;
    cnpj: string;
    email_corporativo: string;
    setor?: string;
    numero_funcionarios?: number;
    representante: string;
    email_representante?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    descricao?: string;
    observacao: string;
    status: Status;
    created_at: Date;
}


@injectable()
class CreatePedidioAssociacaoUseCase {
    constructor(
        @inject("PedidoAssociacaoRepository")
        private pedidoAssociacaoRepository: IPedidoAssociacaoRepository
    ) { }

    async execute({
        razao_social,
        cnpj,
        email_corporativo,
        setor,
        numero_funcionarios,
        representante,
        email_representante,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        descricao,
        observacao,
        status,
        created_at,
    }: IRequest): Promise<Pedido_Associacao> {
        const pedidoAssociacaoAlreadyExists = await this.pedidoAssociacaoRepository.findByCnpj(cnpj);

        if (pedidoAssociacaoAlreadyExists) {
            throw new AppError("Pedido de associação já existe!", 400);
        }

        const pedidoAssociacao = await this.pedidoAssociacaoRepository.create({
            razao_social,
            cnpj,
            email_corporativo,
            setor,
            numero_funcionarios,
            representante,
            email_representante,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            descricao,
            observacao,
            status: Status.PENDENTE,
            created_at,
        });

        return pedidoAssociacao;
    }
}

export { CreatePedidioAssociacaoUseCase };