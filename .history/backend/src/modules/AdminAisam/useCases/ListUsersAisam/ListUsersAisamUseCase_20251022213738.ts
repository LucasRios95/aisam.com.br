import { inject, injectable } from "tsyringe";
import { IPedidoAssociacaoRepository } from "modules/Associado/repositories/IPedidoAssociacaoRepository";
import { Pedido_Associacao } from "modules/Associado/infra/typeorm/entities/Pedido_Associado";




@injectable()
class ListUsersAisamUseCase {
    constructor(
        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository
    ) { }

    async execute(): Promise<Pedido_Associacao[]> {
        const pedidos = await this.pedidoAssociacaoRepository.list();

        return pedidos;
    }
}

export { ListPedidosAssociacaoUseCase };