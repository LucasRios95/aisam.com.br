import { Router } from "express";
import { CreateRecrutadorController } from "modules/Recrutador/useCases/CreateRecrutador/CreateRecrutadorController";
import { ListRecrutadoresController } from "modules/Recrutador/useCases/ListRecrutadores/ListRecrutadoresController";
import { FindRecrutadorByIdController } from "modules/Recrutador/useCases/FindRecrutadorById/FindRecrutadorByIdController";
import { UpdateRecrutadorController } from "modules/Recrutador/useCases/UpdateRecrutador/UpdateRecrutadorController";
import { DeleteRecrutadorController } from "modules/Recrutador/useCases/DeleteRecrutador/DeleteRecrutadorController";
import { EnviarConviteRecrutadorController } from "modules/Recrutador/useCases/EnviarConviteRecrutador/EnviarConviteRecrutadorController";
import { AceitarConviteRecrutadorController } from "modules/Recrutador/useCases/AceitarConviteRecrutador/AceitarConviteRecrutadorController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAdminOrRecrutadorOwner } from "../middlewares/ensureAdminOrRecrutadorOwner";

const recrutadoresRoutes = Router();

const createRecrutadorController = new CreateRecrutadorController();
const listRecrutadoresController = new ListRecrutadoresController();
const findRecrutadorByIdController = new FindRecrutadorByIdController();
const updateRecrutadorController = new UpdateRecrutadorController();
const deleteRecrutadorController = new DeleteRecrutadorController();
const enviarConviteRecrutadorController = new EnviarConviteRecrutadorController();
const aceitarConviteRecrutadorController = new AceitarConviteRecrutadorController();

recrutadoresRoutes.post("/", ensureAuthenticated, ensureAdmin, createRecrutadorController.handle);
recrutadoresRoutes.post("/convite", ensureAuthenticated, ensureAdmin, enviarConviteRecrutadorController.handle);
recrutadoresRoutes.post("/aceitar-convite", aceitarConviteRecrutadorController.handle); // Público
recrutadoresRoutes.get("/", ensureAuthenticated, ensureAdmin, listRecrutadoresController.handle);
recrutadoresRoutes.get("/:id", ensureAuthenticated, ensureAdmin, findRecrutadorByIdController.handle);
recrutadoresRoutes.put("/:id", ensureAuthenticated, ensureAdminOrRecrutadorOwner, updateRecrutadorController.handle);
recrutadoresRoutes.delete("/:id", ensureAuthenticated, ensureAdmin, deleteRecrutadorController.handle);

export { recrutadoresRoutes };
