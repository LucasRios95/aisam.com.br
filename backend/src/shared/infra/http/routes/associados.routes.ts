import { Router } from "express";
import { AprovarPedidoAssociacaoController } from "modules/Associado/useCases/AprovarPedidoAssociacao/AprovarPedidoAssociacaoController";
import { CreatePedidioAssociacaoController } from "modules/Associado/useCases/CreatePedidoAssociacao/CreatePedidoAssociacaoController.";
import { FindByCnpjController } from "modules/Associado/useCases/FindByCNPJ/FindByCnpjController";
import { ListAssociadosController } from "modules/Associado/useCases/ListAssociados/ListAssociadosController";
import { ListPedidosAssociacaoController } from "modules/Associado/useCases/ListPedidosAssociacao/ListPedidosAssociacaoController";

const associadoRoutes = Router();

const createPedidoAssociacaoController = new CreatePedidioAssociacaoController();
const listPedidosAssociacaoController = new ListPedidosAssociacaoController();
const findByCnpjController = new FindByCnpjController();
const aprovarPedidoAssociacaoController = new AprovarPedidoAssociacaoController();
const listAssociadosController = new ListAssociadosController();

associadoRoutes.post("/pedido-associacao", createPedidoAssociacaoController.handle);
associadoRoutes.get("/pedido-associacao", listPedidosAssociacaoController.handle);
associadoRoutes.get("/pedido-associacao/:cnpj", findByCnpjController.handle);
associadoRoutes.put("/aprovar-pedido", aprovarPedidoAssociacaoController.handle);

associadoRoutes.get("/", listAssociadosController.handle);

export { associadoRoutes };
