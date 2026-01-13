import { Router } from "express";
import { CreateRecrutadorController } from "@modules/Recrutador/useCases/CreateRecrutador/CreateRecrutadorController";
import { ListRecrutadoresController } from "@modules/Recrutador/useCases/ListRecrutadores/ListRecrutadoresController";
import { FindRecrutadorByIdController } from "@modules/Recrutador/useCases/FindRecrutadorById/FindRecrutadorByIdController";
import { UpdateRecrutadorController } from "@modules/Recrutador/useCases/UpdateRecrutador/UpdateRecrutadorController";
import { DeleteRecrutadorController } from "@modules/Recrutador/useCases/DeleteRecrutador/DeleteRecrutadorController";
import { EnviarConviteRecrutadorController } from "@modules/Recrutador/useCases/EnviarConviteRecrutador/EnviarConviteRecrutadorController";
import { AceitarConviteRecrutadorController } from "@modules/Recrutador/useCases/AceitarConviteRecrutador/AceitarConviteRecrutadorController";
import { ForgotPasswordController } from "@modules/Recrutador/useCases/ForgotPassword/ForgotPasswordController";
import { ResetPasswordController } from "@modules/Recrutador/useCases/ResetPassword/ResetPasswordController";
import { AtivarRecrutadorController } from "@modules/Recrutador/useCases/AtivarRecrutador/AtivarRecrutadorController";
import { DesativarRecrutadorController } from "@modules/Recrutador/useCases/DesativarRecrutador/DesativarRecrutadorController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAdminOrRecrutadorOwner } from "../middlewares/ensureAdminOrRecrutadorOwner";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter";
import { validateDTO } from "../middlewares/validateDTO";
import { ForgotPasswordDTO } from "@modules/Recrutador/dtos/ForgotPasswordDTO";
import { ResetPasswordDTO } from "@modules/Recrutador/dtos/ResetPasswordDTO";

const recrutadoresRoutes = Router();

const createRecrutadorController = new CreateRecrutadorController();
const listRecrutadoresController = new ListRecrutadoresController();
const findRecrutadorByIdController = new FindRecrutadorByIdController();
const updateRecrutadorController = new UpdateRecrutadorController();
const deleteRecrutadorController = new DeleteRecrutadorController();
const enviarConviteRecrutadorController = new EnviarConviteRecrutadorController();
const aceitarConviteRecrutadorController = new AceitarConviteRecrutadorController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();
const ativarRecrutadorController = new AtivarRecrutadorController();
const desativarRecrutadorController = new DesativarRecrutadorController();

recrutadoresRoutes.post("/", ensureAuthenticated, ensureAdmin, createRecrutadorController.handle);
recrutadoresRoutes.post("/convite", ensureAuthenticated, ensureAdmin, enviarConviteRecrutadorController.handle);
recrutadoresRoutes.post("/aceitar-convite", aceitarConviteRecrutadorController.handle); // Público
recrutadoresRoutes.post("/forgot-password", rateLimiterMiddleware, validateDTO(ForgotPasswordDTO), forgotPasswordController.handle); // Público
recrutadoresRoutes.post("/reset-password", rateLimiterMiddleware, validateDTO(ResetPasswordDTO), resetPasswordController.handle); // Público
recrutadoresRoutes.get("/", ensureAuthenticated, ensureAdmin, listRecrutadoresController.handle);
recrutadoresRoutes.get("/:id", ensureAuthenticated, ensureAdmin, findRecrutadorByIdController.handle);
recrutadoresRoutes.put("/:id", ensureAuthenticated, ensureAdminOrRecrutadorOwner, updateRecrutadorController.handle);
recrutadoresRoutes.patch("/:id/ativar", ensureAuthenticated, ensureAdmin, ativarRecrutadorController.handle);
recrutadoresRoutes.patch("/:id/desativar", ensureAuthenticated, ensureAdmin, desativarRecrutadorController.handle);
recrutadoresRoutes.delete("/:id", ensureAuthenticated, ensureAdmin, deleteRecrutadorController.handle);

export { recrutadoresRoutes };
