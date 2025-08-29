import { Router } from "express";
import { associadoRoutes } from "./associados.routes";

const router = Router();

router.use("/associados", associadoRoutes);

export { router };