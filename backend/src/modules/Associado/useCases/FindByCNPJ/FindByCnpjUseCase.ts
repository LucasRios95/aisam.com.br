import { Pedido_Associacao } from "@modules/Associado/infra/typeorm/entities/Pedido_Associado";
import { IPedidoAssociacaoRepository } from "@modules/Associado/repositories/IPedidoAssociacaoRepository";
import { injectable, inject } from "tsyringe";



@injectable()
class FindByCnpjUseCase {
    constructor(
        @inject("PedidoAssociacaoRepository")
        private pedidoAssociacaoRepository: IPedidoAssociacaoRepository) { }

    async execute(cnpj: string): Promise<Pedido_Associacao> {
        const pedidoAssociacao = await this.pedidoAssociacaoRepository.findByCnpj(cnpj);

        if (!pedidoAssociacao) {
            throw new Error("Associado não encontrado!");
        }

        return pedidoAssociacao;
    }
}

export { FindByCnpjUseCase };