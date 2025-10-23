import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetCandidatoResumeUseCase } from "./GetCandidatoResumeUseCase";

class GetCandidatoResumeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { user_id } = request;

        const getCandidatoResumeUseCase = container.resolve(GetCandidatoResumeUseCase);

        const resume = await getCandidatoResumeUseCase.execute(user_id);

        return response.status(200).json(resume);
    }
}

export { GetCandidatoResumeController };
