import { Router } from "express";
import { CreatePedidioAssociacaoController } from "modules/Associado/useCases/CreatePedidoAssociacao/CreatePedidoAssociacaoController.";
import { FindByCnpjController } from "modules/Associado/useCases/FindByCNPJ/FindByCnpjController";
import { ListPedidosAssociacaoController } from "modules/Associado/useCases/ListPedidosAssociacao/ListPedidosAssociacaoController";


const associadoRoutes = Router();
const createPedidoAssociacaoController = new CreatePedidioAssociacaoController();
const listPedidosAssociacaoController = new ListPedidosAssociacaoController();
const findByCnpjController = new FindByCnpjController();

associadoRoutes.post("/pedido-associacao", createPedidoAssociacaoController.handle);
associadoRoutes.get("/pedido-associacao", listPedidosAssociacaoController.handle);
associadoRoutes.get("/pedido-associacao/:cnpj", findByCnpjController.handle);


export { associadoRoutes };
