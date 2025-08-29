import { ICreatePedidoAssociacao } from "../dtos/ICreatePedidoAssociacaoDTO";
import { IUpdateStatusDTO } from "../dtos/IUpdateStatusDTO";
import { Pedido_Associacao } from "../infra/typeorm/entities/Pedido_Associado";

interface IPedidoAssociacaoRepository {
    create(data: ICreatePedidoAssociacao): Promise<Pedido_Associacao>;
    updateStatus(data: IUpdateStatusDTO): Promise<void>;
    findByCnpj(cnpj: string): Promise<Pedido_Associacao>;
    findById(id: string): Promise<Pedido_Associacao>;
    list(): Promise<Pedido_Associacao[]>;
    delete(id: string): Promise<boolean>;
}

export { IPedidoAssociacaoRepository };
