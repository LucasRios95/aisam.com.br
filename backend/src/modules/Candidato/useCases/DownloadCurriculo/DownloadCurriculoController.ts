import { Request, Response } from "express";
import { container } from "tsyringe";
import { DownloadCurriculoUseCase } from "./DownloadCurriculoUseCase";

class DownloadCurriculoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { id: user_id, role } = request.user;

        const downloadCurriculoUseCase = container.resolve(DownloadCurriculoUseCase);

        const { filePath, originalName } = await downloadCurriculoUseCase.execute({
            candidato_id: id,
            user_id,
            role
        });

        // Define headers para download
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${originalName}"`);

        return response.sendFile(filePath);
    }
}

export { DownloadCurriculoController };
