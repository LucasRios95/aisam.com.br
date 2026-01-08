import { Router } from "express";
import { CreateVagaController } from "@modules/Vaga/useCases/CreateVaga/CreateVagaController";
import { ListVagasController } from "@modules/Vaga/useCases/ListVagas/ListVagasController";
import { ListMinhasVagasController } from "@modules/Vaga/useCases/ListMinhasVagas/ListMinhasVagasController";
import { FindVagaByIdController } from "@modules/Vaga/useCases/FindVagaById/FindVagaByIdController";
import { UpdateVagaController } from "@modules/Vaga/useCases/UpdateVaga/UpdateVagaController";
import { ArquivarVagaController } from "@modules/Vaga/useCases/ArquivarVaga/ArquivarVagaController";
import { EncerrarVagaController } from "@modules/Vaga/useCases/EncerrarVaga/EncerrarVagaController";
import { DeleteVagaController } from "@modules/Vaga/useCases/DeleteVaga/DeleteVagaController";
import { PausarVagaController } from "@modules/Vaga/useCases/PausarVaga/PausarVagaController";
import { ReabrirVagaController } from "@modules/Vaga/useCases/ReabrirVaga/ReabrirVagaController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRecrutador } from "../middlewares/ensureRecrutador";

const vagasRoutes = Router();

const createVagaController = new CreateVagaController();
const listVagasController = new ListVagasController();
const listMinhasVagasController = new ListMinhasVagasController();
const findVagaByIdController = new FindVagaByIdController();
const updateVagaController = new UpdateVagaController();
const arquivarVagaController = new ArquivarVagaController();
const encerrarVagaController = new EncerrarVagaController();
const deleteVagaController = new DeleteVagaController();
const pausarVagaController = new PausarVagaController();
const reabrirVagaController = new ReabrirVagaController();

vagasRoutes.get("/minhas", ensureAuthenticated, ensureRecrutador, listMinhasVagasController.handle); // Vagas do recrutador logado
vagasRoutes.post("/", ensureAuthenticated, ensureRecrutador, createVagaController.handle);
vagasRoutes.get("/", listVagasController.handle); // Público para candidatos
vagasRoutes.get("/:id", findVagaByIdController.handle); // Público para candidatos
vagasRoutes.put("/:id", ensureAuthenticated, ensureRecrutador, updateVagaController.handle);
vagasRoutes.delete("/:id", ensureAuthenticated, ensureRecrutador, deleteVagaController.handle);
vagasRoutes.patch("/:id/arquivar", ensureAuthenticated, ensureRecrutador, arquivarVagaController.handle);
vagasRoutes.patch("/:id/encerrar", ensureAuthenticated, ensureRecrutador, encerrarVagaController.handle);
vagasRoutes.patch("/:id/pausar", ensureAuthenticated, ensureRecrutador, pausarVagaController.handle);
vagasRoutes.patch("/:id/reabrir", ensureAuthenticated, ensureRecrutador, reabrirVagaController.handle);

export { vagasRoutes };
