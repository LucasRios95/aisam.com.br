import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetAdminProfileUseCase } from "./GetAdminProfileUseCase";

class GetAdminProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: adminId } = request.user;

        const getAdminProfileUseCase = container.resolve(GetAdminProfileUseCase);

        const admin = await getAdminProfileUseCase.execute(adminId);

        return response.json(admin);
    }
}

export { GetAdminProfileController };
