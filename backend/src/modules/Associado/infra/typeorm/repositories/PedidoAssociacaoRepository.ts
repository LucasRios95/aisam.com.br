import { ICreatePedidoAssociacao } from "modules/Associado/dtos/ICreatePedidoAssociacaoDTO";
import { IPedidoAssociacaoRepository } from "modules/Associado/repositories/IPedidoAssociacaoRepository";
import { Repository, getRepository } from "typeorm";
import { Pedido_Associacao, Status } from "../entities/Pedido_Associado";
import { IUpdateStatusDTO } from "modules/Associado/dtos/IUpdateStatusDTO";

class PedidoAssociacaoRepository implements IPedidoAssociacaoRepository {
    private repository: Repository<Pedido_Associacao>;

    constructor() {
        this.repository = getRepository(Pedido_Associacao);
    }

    async create({
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
    }: ICreatePedidoAssociacao): Promise<Pedido_Associacao> {
        const pedidoAssociacao = this.repository.create({
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
        });

        await this.repository.save(pedidoAssociacao);

        return pedidoAssociacao;

    }

    async updateStatus({ id, status, Aprovado_Por }: IUpdateStatusDTO): Promise<Pedido_Associacao> {
        const pedidoUpdated = await this.repository.save({
            id,
            status: Status[status],
            Aprovado_Por
        });

        return pedidoUpdated;
    }

    async findByCnpj(cnpj: string): Promise<Pedido_Associacao> {
        const pedidoAssociacao = await this.repository.findOne({ cnpj })

        return pedidoAssociacao;
    }

    async findById(id: string): Promise<Pedido_Associacao> {
        const pedidoAssociacao = await this.repository.findOne(id);

        return pedidoAssociacao;
    }

    async list(): Promise<Pedido_Associacao[]> {
        const pedidos = await this.repository.find();

        return pedidos;
    }

    async delete(id: string): Promise<boolean> {
        const isDeleted = await this.repository.delete(id)

        if (!isDeleted) {
            throw new Error("Erro ao deletar pedido")
        }

        return true;
    }
}

export { PedidoAssociacaoRepository }