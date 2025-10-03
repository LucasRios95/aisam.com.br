import { Request, Response } from "express";
import { container } from "tsyringe";
import { UploadCurriculoUseCase } from "./UploadCurriculoUseCase";

class UploadCurriculoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const curriculo_filename = request.file?.filename;

        if (!curriculo_filename) {
            return response.status(400).json({ error: "Arquivo não enviado" });
        }

        const uploadCurriculoUseCase = container.resolve(UploadCurriculoUseCase);

        await uploadCurriculoUseCase.execute({
            candidato_id: id,
            curriculo_filename
        });

        return response.status(200).json({ message: "Currículo enviado com sucesso" });
    }
}

export { UploadCurriculoController };
