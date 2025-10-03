import { Router } from "express";
import { associadoRoutes } from "./associados.routes";
import { adminAisamRoutes } from "./adminAisam.routes";
import { recrutadoresRoutes } from "./recrutadores.routes";
import { candidatosRoutes } from "./candidatos.routes";
import { vagasRoutes } from "./vagas.routes";
import { candidaturasRoutes } from "./candidaturas.routes";
import { notificacoesRoutes } from "./notificacoes.routes";
import { authRoutes } from "./auth.routes";
import { auditoriaRoutes } from "./auditoria.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/associados", associadoRoutes);
router.use("/user", adminAisamRoutes);
router.use("/recrutadores", recrutadoresRoutes);
router.use("/candidatos", candidatosRoutes);
router.use("/vagas", vagasRoutes);
router.use("/candidaturas", candidaturasRoutes);
router.use("/notificacoes", notificacoesRoutes);
router.use("/auditoria", auditoriaRoutes);

export { router };
