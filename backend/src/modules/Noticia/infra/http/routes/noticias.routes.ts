import { Router } from "express";
import { CriarNoticiaController } from "@modules/Noticia/useCases/CriarNoticia/CriarNoticiaController";
import { ListarNoticiasController } from "@modules/Noticia/useCases/ListarNoticias/ListarNoticiasController";
import { BuscarNoticiaController } from "@modules/Noticia/useCases/BuscarNoticia/BuscarNoticiaController";
import { AtualizarNoticiaController } from "@modules/Noticia/useCases/AtualizarNoticia/AtualizarNoticiaController";
import { DeletarNoticiaController } from "@modules/Noticia/useCases/DeletarNoticia/DeletarNoticiaController";
import { WebhookNoticiaController } from "@modules/Noticia/useCases/WebhookNoticia/WebhookNoticiaController";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";

const noticiasRoutes = Router();

const criarNoticiaController = new CriarNoticiaController();
const listarNoticiasController = new ListarNoticiasController();
const buscarNoticiaController = new BuscarNoticiaController();
const atualizarNoticiaController = new AtualizarNoticiaController();
const deletarNoticiaController = new DeletarNoticiaController();
const webhookNoticiaController = new WebhookNoticiaController();

// ===== Rotas Públicas =====
// Listar notícias (com filtro de publicadas)
noticiasRoutes.get("/", listarNoticiasController.handle);

// Buscar notícia por ID ou Slug
noticiasRoutes.get("/:identificador", buscarNoticiaController.handle);

// ===== Webhook N8N (SEM AUTENTICAÇÃO - usar token no query) =====
// Endpoint para receber notícias do N8N
// Uso: POST /noticias/webhook?token=SEU_TOKEN_SECRETO
noticiasRoutes.post("/webhook/n8n", webhookNoticiaController.handle);

// ===== Rotas Protegidas (Admin) =====
// Criar notícia manualmente
noticiasRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  criarNoticiaController.handle
);

// Atualizar notícia
noticiasRoutes.patch(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  atualizarNoticiaController.handle
);

// Deletar notícia
noticiasRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  deletarNoticiaController.handle
);

export { noticiasRoutes };
