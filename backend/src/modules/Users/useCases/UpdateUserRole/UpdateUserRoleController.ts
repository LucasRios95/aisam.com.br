import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserRoleUseCase } from "./UpdateUserRoleUseCase";

class UpdateUserRoleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId } = request.params;
        const { role } = request.body;

        const updateUserRoleUseCase = container.resolve(UpdateUserRoleUseCase);

        await updateUserRoleUseCase.execute(userId, role);

        return response.status(200).json({
            message: "Role do usuário atualizado com sucesso"
        });
    }
}

export { UpdateUserRoleController };
