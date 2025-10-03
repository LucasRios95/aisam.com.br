import { Router } from "express";
import { CreateCandidaturaController } from "modules/Candidatura/useCases/CreateCandidatura/CreateCandidaturaController";
import { ListCandidaturasController } from "modules/Candidatura/useCases/ListCandidaturas/ListCandidaturasController";
import { FindCandidaturaByIdController } from "modules/Candidatura/useCases/FindCandidaturaById/FindCandidaturaByIdController";
import { UpdateStatusCandidaturaController } from "modules/Candidatura/useCases/UpdateStatusCandidatura/UpdateStatusCandidaturaController";
import { DeleteCandidaturaController } from "modules/Candidatura/useCases/DeleteCandidatura/DeleteCandidaturaController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRecrutador } from "../middlewares/ensureRecrutador";

const candidaturasRoutes = Router();

const createCandidaturaController = new CreateCandidaturaController();
const listCandidaturasController = new ListCandidaturasController();
const findCandidaturaByIdController = new FindCandidaturaByIdController();
const updateStatusCandidaturaController = new UpdateStatusCandidaturaController();
const deleteCandidaturaController = new DeleteCandidaturaController();

candidaturasRoutes.post("/", createCandidaturaController.handle); // Público/Candidato
candidaturasRoutes.get("/", ensureAuthenticated, listCandidaturasController.handle);
candidaturasRoutes.get("/:id", ensureAuthenticated, findCandidaturaByIdController.handle);
candidaturasRoutes.patch("/:id/status", ensureAuthenticated, ensureRecrutador, updateStatusCandidaturaController.handle);
candidaturasRoutes.delete("/:id", ensureAuthenticated, deleteCandidaturaController.handle);

export { candidaturasRoutes };
