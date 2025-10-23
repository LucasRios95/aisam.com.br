import { Router } from "express";
import { AprovarPedidoAssociacaoController } from "modules/Associado/useCases/AprovarPedidoAssociacao/AprovarPedidoAssociacaoController";
import { CreatePedidioAssociacaoController } from "modules/Associado/useCases/CreatePedidoAssociacao/CreatePedidoAssociacaoController.";
import { FindByCnpjController } from "modules/Associado/useCases/FindByCNPJ/FindByCnpjController";
import { ListAssociadosController } from "modules/Associado/useCases/ListAssociados/ListAssociadosController";
import { ListPedidosAssociacaoController } from "modules/Associado/useCases/ListPedidosAssociacao/ListPedidosAssociacaoController";
import { CreateAssociadoController } from "modules/Associado/useCases/CreateAssociado/CreateAssociadoController";
import { UpdateAssociadoController } from "modules/Associado/useCases/UpdateAssociado/UpdateAssociadoController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { validateDTO } from "../middlewares/validateDTO";
import { CreateAssociadoDTO } from "modules/Associado/dtos/CreateAssociadoDTO";

const associadoRoutes = Router();

const createPedidoAssociacaoController = new CreatePedidioAssociacaoController();
const listPedidosAssociacaoController = new ListPedidosAssociacaoController();
const findByCnpjController = new FindByCnpjController();
const aprovarPedidoAssociacaoController = new AprovarPedidoAssociacaoController();
const listAssociadosController = new ListAssociadosController();
const createAssociadoController = new CreateAssociadoController();
const updateAssociadoController = new UpdateAssociadoController();

associadoRoutes.post("/pedido-associacao", validateDTO(CreateAssociadoDTO), createPedidoAssociacaoController.handle); // Público
associadoRoutes.get("/pedido-associacao", ensureAuthenticated, ensureAdmin, listPedidosAssociacaoController.handle);
associadoRoutes.get("/pedido-associacao/:cnpj", ensureAuthenticated, ensureAdmin, findByCnpjController.handle);
associadoRoutes.put("/aprovar-pedido", ensureAuthenticated, ensureAdmin, aprovarPedidoAssociacaoController.handle);

associadoRoutes.get("/", ensureAuthenticated, listAssociadosController.handle);
associadoRoutes.post("/", ensureAuthenticated, ensureAdmin, validateDTO(CreateAssociadoDTO), createAssociadoController.handle);
associadoRoutes.patch("/:id", ensureAuthenticated, ensureAdmin, updateAssociadoController.handle);

export { associadoRoutes };
