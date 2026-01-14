import { Router } from "express";
import { CreateAdminAisamController } from "@modules/AdminAisam/useCases/CreateUserAisam/CreateAdminAisamController";
import { ForgotPasswordController } from "@modules/AdminAisam/useCases/ForgotPassword/ForgotPasswordController";
import { ResetPasswordController } from "@modules/AdminAisam/useCases/ResetPassword/ResetPasswordController";
import { GetAdminProfileController } from "@modules/AdminAisam/useCases/GetAdminProfile/GetAdminProfileController";
import { UpdateAdminProfileController } from "@modules/AdminAisam/useCases/UpdateAdminProfile/UpdateAdminProfileController";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter";
import { validateDTO } from "../middlewares/validateDTO";
import { ForgotPasswordDTO } from "@modules/Recrutador/dtos/ForgotPasswordDTO";
import { ResetPasswordDTO } from "@modules/Recrutador/dtos/ResetPasswordDTO";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const adminAisamRoutes = Router();

const createAdminAisamController = new CreateAdminAisamController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();
const getAdminProfileController = new GetAdminProfileController();
const updateAdminProfileController = new UpdateAdminProfileController();

adminAisamRoutes.post("/create", createAdminAisamController.handle);
adminAisamRoutes.post("/forgot-password", rateLimiterMiddleware, validateDTO(ForgotPasswordDTO), forgotPasswordController.handle); // Público
adminAisamRoutes.post("/reset-password", rateLimiterMiddleware, validateDTO(ResetPasswordDTO), resetPasswordController.handle); // Público

// Rotas protegidas - Perfil do Admin
adminAisamRoutes.get("/profile", ensureAuthenticated, ensureAdmin, getAdminProfileController.handle);
adminAisamRoutes.put("/profile", ensureAuthenticated, ensureAdmin, updateAdminProfileController.handle);

export { adminAisamRoutes };