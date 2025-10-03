import { Router } from "express";
import { CreateVagaController } from "modules/Vaga/useCases/CreateVaga/CreateVagaController";
import { ListVagasController } from "modules/Vaga/useCases/ListVagas/ListVagasController";
import { FindVagaByIdController } from "modules/Vaga/useCases/FindVagaById/FindVagaByIdController";
import { UpdateVagaController } from "modules/Vaga/useCases/UpdateVaga/UpdateVagaController";
import { ArquivarVagaController } from "modules/Vaga/useCases/ArquivarVaga/ArquivarVagaController";
import { EncerrarVagaController } from "modules/Vaga/useCases/EncerrarVaga/EncerrarVagaController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRecrutador } from "../middlewares/ensureRecrutador";

const vagasRoutes = Router();

const createVagaController = new CreateVagaController();
const listVagasController = new ListVagasController();
const findVagaByIdController = new FindVagaByIdController();
const updateVagaController = new UpdateVagaController();
const arquivarVagaController = new ArquivarVagaController();
const encerrarVagaController = new EncerrarVagaController();

vagasRoutes.post("/", ensureAuthenticated, ensureRecrutador, createVagaController.handle);
vagasRoutes.get("/", listVagasController.handle); // Público para candidatos
vagasRoutes.get("/:id", findVagaByIdController.handle); // Público para candidatos
vagasRoutes.put("/:id", ensureAuthenticated, ensureRecrutador, updateVagaController.handle);
vagasRoutes.patch("/:id/arquivar", ensureAuthenticated, ensureRecrutador, arquivarVagaController.handle);
vagasRoutes.patch("/:id/encerrar", ensureAuthenticated, ensureRecrutador, encerrarVagaController.handle);

export { vagasRoutes };
