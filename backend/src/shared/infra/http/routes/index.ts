import { Router } from "express";
import { associadoRoutes } from "./associados.routes";
import { adminAisamRoutes } from "./adminAisam.routes";

const router = Router();

router.use("/associados", associadoRoutes);
router.use("/user", adminAisamRoutes);

export { router };