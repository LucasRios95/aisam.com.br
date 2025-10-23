import { inject, injectable } from "tsyringe";
import { IPedidoAssociacaoRepository } from "modules/Associado/repositories/IPedidoAssociacaoRepository";
import { Pedido_Associacao } from "modules/Associado/infra/typeorm/entities/Pedido_Associado";
import { IAdminAisamRepository } from "@modules/AdminAisam/repositories/IAdminAisamRepository";
import { AdminAisam } from "@modules/AdminAisam/infra/typeorm/entities/AdminAisam";




@injectable()
class ListUsersAisamUseCase {
    constructor(
        @inject("AdminAisamRepository")
        private adminAisamRepository: IAdminAisamRepository
    ) { }

    async execute(): Promise<AdminAisam[]> {
        const users = await this.adminAisamRepository.list();

        return users;
    }
}

export { ListUsersAisamUseCase };