import { Router } from "express";
import multer from "multer";
import { CreateCandidatoController } from "@modules/Candidato/useCases/CreateCandidato/CreateCandidatoController";
import { ListCandidatosController } from "@modules/Candidato/useCases/ListCandidatos/ListCandidatosController";
import { FindCandidatoByIdController } from "@modules/Candidato/useCases/FindCandidatoById/FindCandidatoByIdController";
import { UpdateCandidatoController } from "@modules/Candidato/useCases/UpdateCandidato/UpdateCandidatoController";
import { DeleteCandidatoController } from "@modules/Candidato/useCases/DeleteCandidato/DeleteCandidatoController";
import { UploadCurriculoController } from "@modules/Candidato/useCases/UploadCurriculo/UploadCurriculoController";
import { GetCandidatoProfileController } from "@modules/Candidato/useCases/GetCandidatoProfile/GetCandidatoProfileController";
import { GetCandidatoResumeController } from "@modules/Candidato/useCases/GetCandidatoResume/GetCandidatoResumeController";
import { UpdateCandidatoResumeController } from "@modules/Candidato/useCases/UpdateCandidatoResume/UpdateCandidatoResumeController";
import uploadConfig from "@shared/infra/http/middlewares/uploadCurriculo";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRecrutador } from "../middlewares/ensureRecrutador";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { validateDTO } from "../middlewares/validateDTO";
import { CreateCandidatoDTO } from "@modules/Candidato/dtos/CreateCandidatoDTO";

const candidatosRoutes = Router();

const uploadCurriculo = multer(uploadConfig.upload("curriculos"));

const createCandidatoController = new CreateCandidatoController();
const listCandidatosController = new ListCandidatosController();
const findCandidatoByIdController = new FindCandidatoByIdController();
const updateCandidatoController = new UpdateCandidatoController();
const deleteCandidatoController = new DeleteCandidatoController();
const uploadCurriculoController = new UploadCurriculoController();
const getCandidatoProfileController = new GetCandidatoProfileController();
const getCandidatoResumeController = new GetCandidatoResumeController();
const updateCandidatoResumeController = new UpdateCandidatoResumeController();

// Rotas públicas
candidatosRoutes.post("/", validateDTO(CreateCandidatoDTO), createCandidatoController.handle);

// Rotas autenticadas - Candidato
candidatosRoutes.get("/profile", ensureAuthenticated, getCandidatoProfileController.handle);
candidatosRoutes.get("/resume/me", ensureAuthenticated, getCandidatoResumeController.handle);
candidatosRoutes.put("/resume", ensureAuthenticated, updateCandidatoResumeController.handle);
candidatosRoutes.patch("/:id/curriculo", ensureAuthenticated, uploadCurriculo.single("curriculo"), uploadCurriculoController.handle);

// Rotas de Admin/Recrutador - Gerenciamento de candidatos
candidatosRoutes.get("/", ensureAuthenticated, ensureRecrutador, listCandidatosController.handle);
candidatosRoutes.get("/:id", ensureAuthenticated, ensureRecrutador, findCandidatoByIdController.handle);

// Rotas exclusivas de Admin - CRUD completo
candidatosRoutes.post("/admin", ensureAuthenticated, ensureAdmin, validateDTO(CreateCandidatoDTO), createCandidatoController.handle);
candidatosRoutes.put("/:id", ensureAuthenticated, ensureAdmin, updateCandidatoController.handle);
candidatosRoutes.delete("/:id", ensureAuthenticated, ensureAdmin, deleteCandidatoController.handle);

export { candidatosRoutes };
