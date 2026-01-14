import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetRecrutadorProfileUseCase } from "./GetRecrutadorProfileUseCase";

class GetRecrutadorProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: recrutadorId } = request.user;

        const getRecrutadorProfileUseCase = container.resolve(GetRecrutadorProfileUseCase);

        const recrutador = await getRecrutadorProfileUseCase.execute(recrutadorId);

        return response.json(recrutador);
    }
}

export { GetRecrutadorProfileController };
