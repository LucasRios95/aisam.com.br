import { Router } from "express";
import { CreatePedidioAssociacaoController } from "modules/Associado/useCases/CreatePedidoAssociacao/CreatePedidoAssociacaoController.";


const associadoRoutes = Router();
const createPedidoAssociacaoController = new CreatePedidioAssociacaoController();


associadoRoutes.post("/pedido-associacao", createPedidoAssociacaoController.handle);

export { associadoRoutes };
