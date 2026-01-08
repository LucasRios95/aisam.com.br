import { Router } from "express";
import { ListAuditLogsController } from "@modules/Auditoria/useCases/ListAuditLogs/ListAuditLogsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const auditoriaRoutes = Router();

const listAuditLogsController = new ListAuditLogsController();

auditoriaRoutes.get("/", ensureAuthenticated, ensureAdmin, listAuditLogsController.handle);

export { auditoriaRoutes };
