import { Router } from "express";
import { CreateAdminAisamController } from "@modules/AdminAisam/useCases/CreateUserAisam/CreateAdminAisamController";

const adminAisamRoutes = Router();

const createAdminAisamController = new CreateAdminAisamController();

adminAisamRoutes.post("/create", createAdminAisamController.handle);

export { adminAisamRoutes };