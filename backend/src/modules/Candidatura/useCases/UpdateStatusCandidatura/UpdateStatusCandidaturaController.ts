import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateStatusCandidaturaUseCase } from "./UpdateStatusCandidaturaUseCase";

class UpdateStatusCandidaturaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { status, observacoes_recrutador } = request.body;

        const updateStatusCandidaturaUseCase = container.resolve(UpdateStatusCandidaturaUseCase);

        const candidatura = await updateStatusCandidaturaUseCase.execute({
            id,
            status,
            observacoes_recrutador
        });

        return response.json(candidatura);
    }
}

export { UpdateStatusCandidaturaController };
