import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetCandidatoProfileUseCase } from "./GetCandidatoProfileUseCase";

class GetCandidatoProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const getCandidatoProfileUseCase = container.resolve(GetCandidatoProfileUseCase);

        const result = await getCandidatoProfileUseCase.execute({
            candidato_id: id
        });

        return response.json(result);
    }
}

export { GetCandidatoProfileController };
