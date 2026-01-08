import { Router } from "express";
import { ListAllUsersController } from "@modules/Users/useCases/ListAllUsers/ListAllUsersController";
import { UpdateUserRoleController } from "@modules/Users/useCases/UpdateUserRole/UpdateUserRoleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const usersRoutes = Router();

const listAllUsersController = new ListAllUsersController();
const updateUserRoleController = new UpdateUserRoleController();

// Todas as rotas de usuários exigem autenticação de admin
usersRoutes.use(ensureAuthenticated);
usersRoutes.use(ensureAdmin);

usersRoutes.get("/", listAllUsersController.handle);
usersRoutes.put("/:userId/role", updateUserRoleController.handle);

export { usersRoutes };
