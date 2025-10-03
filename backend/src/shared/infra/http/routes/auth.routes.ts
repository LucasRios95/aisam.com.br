import { Router } from "express";
import { AuthenticateAdminController } from "modules/AdminAisam/useCases/AuthenticateAdmin/AuthenticateAdminController";
import { AuthenticateRecrutadorController } from "modules/Recrutador/useCases/AuthenticateRecrutador/AuthenticateRecrutadorController";
import { GenerateMagicLinkController } from "modules/Candidato/useCases/GenerateMagicLink/GenerateMagicLinkController";

const authRoutes = Router();

const authenticateAdminController = new AuthenticateAdminController();
const authenticateRecrutadorController = new AuthenticateRecrutadorController();
const generateMagicLinkController = new GenerateMagicLinkController();

authRoutes.post("/admin", authenticateAdminController.handle);
authRoutes.post("/recrutador", authenticateRecrutadorController.handle);
authRoutes.post("/candidato/magic-link", generateMagicLinkController.handle);

export { authRoutes };
