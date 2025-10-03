import { Router } from "express";
import { AprovarPedidoAssociacaoController } from "modules/Associado/useCases/AprovarPedidoAssociacao/AprovarPedidoAssociacaoController";
import { CreatePedidioAssociacaoController } from "modules/Associado/useCases/CreatePedidoAssociacao/CreatePedidoAssociacaoController.";
import { FindByCnpjController } from "modules/Associado/useCases/FindByCNPJ/FindByCnpjController";
import { ListAssociadosController } from "modules/Associado/useCases/ListAssociados/ListAssociadosController";
import { ListPedidosAssociacaoController } from "modules/Associado/useCases/ListPedidosAssociacao/ListPedidosAssociacaoController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const associadoRoutes = Router();

const createPedidoAssociacaoController = new CreatePedidioAssociacaoController();
const listPedidosAssociacaoController = new ListPedidosAssociacaoController();
const findByCnpjController = new FindByCnpjController();
const aprovarPedidoAssociacaoController = new AprovarPedidoAssociacaoController();
const listAssociadosController = new ListAssociadosController();

associadoRoutes.post("/pedido-associacao", createPedidoAssociacaoController.handle); // Público
associadoRoutes.get("/pedido-associacao", ensureAuthenticated, ensureAdmin, listPedidosAssociacaoController.handle);
associadoRoutes.get("/pedido-associacao/:cnpj", ensureAuthenticated, ensureAdmin, findByCnpjController.handle);
associadoRoutes.put("/aprovar-pedido", ensureAuthenticated, ensureAdmin, aprovarPedidoAssociacaoController.handle);

associadoRoutes.get("/", ensureAuthenticated, listAssociadosController.handle);

export { associadoRoutes };
