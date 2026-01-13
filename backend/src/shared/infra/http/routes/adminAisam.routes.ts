import { Router } from "express";
import { CreateAdminAisamController } from "@modules/AdminAisam/useCases/CreateUserAisam/CreateAdminAisamController";
import { ForgotPasswordController } from "@modules/AdminAisam/useCases/ForgotPassword/ForgotPasswordController";
import { ResetPasswordController } from "@modules/AdminAisam/useCases/ResetPassword/ResetPasswordController";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter";
import { validateDTO } from "../middlewares/validateDTO";
import { ForgotPasswordDTO } from "@modules/Recrutador/dtos/ForgotPasswordDTO";
import { ResetPasswordDTO } from "@modules/Recrutador/dtos/ResetPasswordDTO";

const adminAisamRoutes = Router();

const createAdminAisamController = new CreateAdminAisamController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

adminAisamRoutes.post("/create", createAdminAisamController.handle);
adminAisamRoutes.post("/forgot-password", rateLimiterMiddleware, validateDTO(ForgotPasswordDTO), forgotPasswordController.handle); // Público
adminAisamRoutes.post("/reset-password", rateLimiterMiddleware, validateDTO(ResetPasswordDTO), resetPasswordController.handle); // Público

export { adminAisamRoutes };