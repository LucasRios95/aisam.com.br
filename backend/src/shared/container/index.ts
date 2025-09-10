import { container } from "tsyringe";
import "./providers/DateProvider";
import { IPedidoAssociacaoRepository } from "modules/Associado/repositories/IPedidoAssociacaoRepository";
import { PedidoAssociacaoRepository } from "modules/Associado/infra/typeorm/repositories/PedidoAssociacaoRepository";
import { IAdminAisamRepository } from "modules/AdminAisam/repositories/IAdminAisamRepository";
import { AdminAisamRepository } from "modules/AdminAisam/infra/typeorm/repositories/AdminAisamRepository";

container.registerSingleton<IPedidoAssociacaoRepository>(
    "PedidoAssociacaoRepository",
    PedidoAssociacaoRepository
);

container.registerSingleton<IAdminAisamRepository>(
    "AdminAisamRepository",
    AdminAisamRepository
);

