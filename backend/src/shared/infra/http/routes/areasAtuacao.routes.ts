import { Router } from "express";
import { CreateAreaAtuacaoController } from "@modules/AreaAtuacao/useCases/CreateAreaAtuacao/CreateAreaAtuacaoController";
import { ListAreasAtuacaoController } from "@modules/AreaAtuacao/useCases/ListAreasAtuacao/ListAreasAtuacaoController";
import { UpdateAreaAtuacaoController } from "@modules/AreaAtuacao/useCases/UpdateAreaAtuacao/UpdateAreaAtuacaoController";
import { DeleteAreaAtuacaoController } from "@modules/AreaAtuacao/useCases/DeleteAreaAtuacao/DeleteAreaAtuacaoController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const areasAtuacaoRoutes = Router();

const createAreaAtuacaoController = new CreateAreaAtuacaoController();
const listAreasAtuacaoController = new ListAreasAtuacaoController();
const updateAreaAtuacaoController = new UpdateAreaAtuacaoController();
const deleteAreaAtuacaoController = new DeleteAreaAtuacaoController();

// Listar áreas (público)
areasAtuacaoRoutes.get("/", listAreasAtuacaoController.handle);

// Criar área (apenas admin)
areasAtuacaoRoutes.post("/", ensureAuthenticated, ensureAdmin, createAreaAtuacaoController.handle);

// Atualizar área (apenas admin)
areasAtuacaoRoutes.put("/:id", ensureAuthenticated, ensureAdmin, updateAreaAtuacaoController.handle);

// Deletar área (apenas admin)
areasAtuacaoRoutes.delete("/:id", ensureAuthenticated, ensureAdmin, deleteAreaAtuacaoController.handle);

export { areasAtuacaoRoutes };
