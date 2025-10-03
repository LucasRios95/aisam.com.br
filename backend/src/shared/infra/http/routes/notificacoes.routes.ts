import { Router } from "express";
import { CreateNotificacaoController } from "modules/Notificacao/useCases/CreateNotificacao/CreateNotificacaoController";
import { ListNotificacoesController } from "modules/Notificacao/useCases/ListNotificacoes/ListNotificacoesController";
import { MarcarComoLidaController } from "modules/Notificacao/useCases/MarcarComoLida/MarcarComoLidaController";
import { SendEmailController } from "modules/Notificacao/useCases/SendEmail/SendEmailController";

const notificacoesRoutes = Router();

const createNotificacaoController = new CreateNotificacaoController();
const listNotificacoesController = new ListNotificacoesController();
const marcarComoLidaController = new MarcarComoLidaController();
const sendEmailController = new SendEmailController();

notificacoesRoutes.post("/", createNotificacaoController.handle);
notificacoesRoutes.get("/", listNotificacoesController.handle);
notificacoesRoutes.patch("/:id/lida", marcarComoLidaController.handle);
notificacoesRoutes.post("/email", sendEmailController.handle);

export { notificacoesRoutes };
