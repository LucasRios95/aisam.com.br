import { container } from "tsyringe";
import "./providers/DateProvider";
import { IPedidoAssociacaoRepository } from "modules/Associado/repositories/IPedidoAssociacaoRepository";
import { PedidoAssociacaoRepository } from "modules/Associado/infra/typeorm/repositories/PedidoAssociacaoRepository";

container.registerSingleton<IPedidoAssociacaoRepository>(
    "PedidoAssociacaoRepository",
    PedidoAssociacaoRepository
);